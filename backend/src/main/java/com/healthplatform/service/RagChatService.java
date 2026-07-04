package com.healthplatform.service;

import com.healthplatform.dto.ChatResponse;
import com.healthplatform.dto.SourceReference;
import com.healthplatform.model.ReportEmbedding;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RagChatService {

    private final VectorStoreService vectorStoreService;
    private final ChatClient chatClient;
    private final ComparisonService comparisonService;

    public ChatResponse chat(String message, Long patientId) {
        // Detect intent for comparison questions (simple keyword rules)
        String lowerQuery = message.toLowerCase();
        boolean comparisonIntent = lowerQuery.contains("compare") ||
                lowerQuery.contains("changed") ||
                lowerQuery.contains("increased") ||
                lowerQuery.contains("decreased") ||
                lowerQuery.contains("vs last") ||
                lowerQuery.contains("compared to last");

        String comparisonContext = "";
        if (comparisonIntent) {
            try {
                var compRes = comparisonService.compareLatestWithPrevious(patientId);
                comparisonContext = "\n\nUse this structured comparison to answer the user's question clearly and simply:\n" +
                        compRes.getComparisons().stream()
                                .map(c -> String.format("- %s: Current value is %.1f %s, previous value was %.1f %s. Difference: %.1f %s. Trend: %s. Interpretation: %s",
                                        c.getParameterName(), c.getCurrentValue(), c.getUnit(), c.getPreviousValue(), c.getUnit(),
                                        c.getDifference(), c.getUnit(), c.getTrend(), c.getInterpretation()))
                                .collect(Collectors.joining("\n"));
            } catch (Exception e) {
                // Ignore if not enough reports to compare
            }
        }

        // 1. Retrieve similar chunks from Qdrant
        List<ReportEmbedding> matches = vectorStoreService.searchSimilar(message, 5, patientId);

        if (matches.isEmpty() && comparisonContext.isEmpty()) {
            return new ChatResponse(
                    "I don't have enough information from your uploaded medical reports to answer this question.",
                    new ArrayList<>()
            );
        }

        // 2. Build system context
        String context = matches.stream()
                .map(m -> String.format("Report ID: %d, Type: %s, Content: %s",
                        m.getReport().getId(),
                        m.getReport().getReportType().name(),
                        m.getChunkText()))
                .collect(Collectors.joining("\n---\n"));

        String systemPrompt = "You are a helpful medical AI assistant. Answer the user's medical question using only the provided medical report excerpts and comparison details. " +
                "If the information is not present or if you do not have enough context, state clearly that you don't have enough information. " +
                "Do not make up facts or use external training data for details not in the report excerpts.\n\n" +
                "Report Excerpts:\n" + context +
                (comparisonContext.isEmpty() ? "" : "\n\nStructured Comparison Context:\n" + comparisonContext);

        // 3. Query Gemini ChatClient
        String answer = chatClient.prompt()
                .system(systemPrompt)
                .user(message)
                .call()
                .content();

        // 4. Build source references
        List<SourceReference> sources = matches.stream()
                .map(m -> new SourceReference(
                        m.getReport().getId(),
                        m.getReport().getReportType().name(),
                        m.getReport().getUploadedAt(),
                        m.getChunkText()
                ))
                .collect(Collectors.toList());

        return new ChatResponse(answer, sources);
    }
}
