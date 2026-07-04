package com.healthplatform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthplatform.model.ReportEmbedding;
import com.healthplatform.repository.ReportEmbeddingRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
public class VectorStoreService {

    private static final Logger logger = LoggerFactory.getLogger(VectorStoreService.class);

    private final RestClient restClient;
    private final EmbeddingModel embeddingModel;
    private final ReportEmbeddingRepository embeddingRepository;
    private final ObjectMapper objectMapper;

    @Value("${qdrant.collection-name:patient_reports}")
    private String collectionName;

    public VectorStoreService(RestClient qdrantRestClient, 
                              EmbeddingModel embeddingModel,
                              ReportEmbeddingRepository embeddingRepository,
                              ObjectMapper objectMapper) {
        this.restClient = qdrantRestClient;
        this.embeddingModel = embeddingModel;
        this.embeddingRepository = embeddingRepository;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void initCollection() {
        try {
            logger.info("Initializing Qdrant collection: {}", collectionName);
            // Create collection with Cosine distance and 3072 dimensions (Gemini standard)
            Map<String, Object> vectorsConfig = new HashMap<>();
            vectorsConfig.put("size", 3072);
            vectorsConfig.put("distance", "Cosine");

            Map<String, Object> body = new HashMap<>();
            body.put("vectors", vectorsConfig);

            restClient.put()
                    .uri("/collections/" + collectionName)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            logger.info("Successfully verified or created Qdrant collection: {}", collectionName);
        } catch (Exception e) {
            logger.warn("Qdrant collection check log (it may already exist): {}", e.getMessage());
        }
    }

    public void storeEmbeddings(Long patientId, List<ReportEmbedding> embeddings) {
        if (embeddings == null || embeddings.isEmpty()) {
            return;
        }

        List<Map<String, Object>> points = new ArrayList<>();
        for (ReportEmbedding emb : embeddings) {
            try {
                // Parse embedding JSON back to float array
                float[] vector = objectMapper.readValue(emb.getEmbedding(), float[].class);

                Map<String, Object> point = new HashMap<>();
                point.put("id", emb.getId()); // Use database id as Qdrant point ID
                point.put("vector", vector);
                
                Map<String, Object> payload = new HashMap<>();
                payload.put("report_id", emb.getReport().getId());
                payload.put("patient_id", patientId);
                payload.put("report_type", emb.getReport().getReportType().name());
                payload.put("uploaded_at", emb.getReport().getUploadedAt().toString());
                payload.put("chunk_text", emb.getChunkText());
                point.put("payload", payload);

                points.add(point);
            } catch (Exception e) {
                logger.error("Error formatting embedding for Qdrant upsert", e);
            }
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("points", points);

        try {
            logger.info("Upserting {} vectors to Qdrant collection: {}", points.size(), collectionName);
            restClient.put()
                    .uri("/collections/" + collectionName + "/points?wait=true")
                    .body(requestBody)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            logger.error("Failed to upsert embeddings to Qdrant: {}", e.getMessage(), e);
        }
    }

    public List<ReportEmbedding> searchSimilar(String query, int topK, Long patientId) {
        try {
            // Generate query embedding
            float[] queryVector = embeddingModel.embed(query);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("vector", queryVector);
            requestBody.put("limit", topK);
            requestBody.put("with_payload", true);
            
            // Create Qdrant filter
            Map<String, Object> matchVal = new HashMap<>();
            matchVal.put("value", patientId);
            
            Map<String, Object> matchCond = new HashMap<>();
            matchCond.put("key", "patient_id");
            matchCond.put("match", matchVal);

            Map<String, Object> filter = new HashMap<>();
            filter.put("must", List.of(matchCond));
            
            requestBody.put("filter", filter);

            logger.info("Querying Qdrant for patient {} with topK: {}", patientId, topK);
            Map<?, ?> response = restClient.post()
                    .uri("/collections/" + collectionName + "/points/search")
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response == null || !response.containsKey("result")) {
                return Collections.emptyList();
            }

            List<?> results = (List<?>) response.get("result");
            List<ReportEmbedding> matchedEmbeddings = new ArrayList<>();

            for (Object res : results) {
                if (res instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) res;
                    Object idObj = map.get("id");
                    if (idObj instanceof Number) {
                        Long embId = ((Number) idObj).longValue();
                        embeddingRepository.findById(embId).ifPresent(matchedEmbeddings::add);
                    }
                }
            }

            return matchedEmbeddings;

        } catch (Exception e) {
            logger.error("Error querying similar vectors from Qdrant", e);
            return Collections.emptyList();
        }
    }
}
