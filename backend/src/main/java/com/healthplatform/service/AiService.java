package com.healthplatform.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String summarizeMedicalReport(String reportText, String reportType) {
        if (reportText == null || reportText.trim().isEmpty()) {
            return "No text could be extracted from this report to summarize.";
        }

        String systemPrompt = """
            You are a helpful and compassionate medical AI assistant. Your task is to summarize the provided medical report for the patient.
            The summary should be patient-friendly, easy to understand, and written in layman's terms.
            - Provide a summary of around 150-250 words.
            - Highlight any abnormal values, out-of-range metrics, or key concerns if present, but advise the patient to consult their doctor.
            - Explain key medical terms used in the report in simple, layman's language.
            - Maintain an encouraging and reassuring tone.
            """;

        String userPrompt = String.format("""
            Report Type: %s
            
            Report Text:
            %s
            """, reportType, reportText);

        try {
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();
        } catch (Exception e) {
            return "Error generating summary: " + e.getMessage();
        }
    }
}
