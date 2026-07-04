package com.healthplatform.service;

import com.healthplatform.dto.SearchResponseDTO;
import com.healthplatform.model.ReportEmbedding;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final VectorStoreService vectorStoreService;

    public List<SearchResponseDTO> search(String query, Long patientId) {
        // Retrieve top 10 relevant chunks for that patient from Qdrant
        List<ReportEmbedding> matches = vectorStoreService.searchSimilar(query, 10, patientId);

        // Group by report_id to satisfy "Group by report_id and limit to 10 reports"
        // LinkedHashMap keeps the relevance/score order intact
        Map<Long, ReportEmbedding> uniqueReports = new LinkedHashMap<>();
        for (ReportEmbedding match : matches) {
            Long reportId = match.getReport().getId();
            if (!uniqueReports.containsKey(reportId)) {
                uniqueReports.put(reportId, match);
            }
        }

        return uniqueReports.values().stream()
                .limit(10)
                .map(m -> new SearchResponseDTO(
                        m.getReport().getId(),
                        m.getReport().getReportType().name(),
                        m.getReport().getUploadedAt(),
                        m.getChunkText(),
                        null // Score is optional
                ))
                .collect(Collectors.toList());
    }
}
