package com.healthplatform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthplatform.model.MedicalReport;
import com.healthplatform.model.ReportEmbedding;
import com.healthplatform.repository.ReportEmbeddingRepository;
import com.healthplatform.util.ChunkingUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmbeddingService {

    private static final Logger logger = LoggerFactory.getLogger(EmbeddingService.class);

    private final EmbeddingModel embeddingModel;
    private final ChunkingUtil chunkingUtil;
    private final ReportEmbeddingRepository embeddingRepository;
    private final ObjectMapper objectMapper;
    private final VectorStoreService vectorStoreService;

    @Transactional
    public void generateAndStoreEmbeddings(MedicalReport report) {
        String text = report.getOriginalText();
        if (text == null || text.trim().isEmpty()) {
            logger.warn("No text available for embedding generation on report ID: {}", report.getId());
            return;
        }

        // Clean up any existing embeddings for this report
        embeddingRepository.deleteByReportId(report.getId());

        List<String> chunks = chunkingUtil.chunkText(text);
        logger.info("Splitting report ID: {} into {} chunks for embedding generation", report.getId(), chunks.size());

        for (int i = 0; i < chunks.size(); i++) {
            String chunk = chunks.get(i);
            try {
                // Generate embedding using Spring AI EmbeddingModel
                float[] vector = embeddingModel.embed(chunk);
                
                // Convert list to JSON string
                String jsonVector = objectMapper.writeValueAsString(vector);

                ReportEmbedding reportEmbedding = new ReportEmbedding();
                reportEmbedding.setReport(report);
                reportEmbedding.setChunkIndex(i);
                reportEmbedding.setChunkText(chunk);
                reportEmbedding.setEmbedding(jsonVector);

                embeddingRepository.save(reportEmbedding);
                logger.debug("Successfully saved chunk {}/{} for report ID: {}", i + 1, chunks.size(), report.getId());
            } catch (Exception e) {
                logger.error("Failed to generate embedding for chunk index: {} on report ID: {}", i, report.getId(), e);
                throw new RuntimeException("Failed to generate/store embedding for chunk " + i, e);
            }
        }
        logger.info("Finished embedding generation for report ID: {}", report.getId());

        // Upsert to Qdrant Vector Database
        List<ReportEmbedding> savedEmbeddings = embeddingRepository.findByReportId(report.getId());
        vectorStoreService.storeEmbeddings(report.getPatientUser().getId(), savedEmbeddings);
    }
}
