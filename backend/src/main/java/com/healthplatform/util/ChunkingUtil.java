package com.healthplatform.util;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class ChunkingUtil {

    /**
     * Splits report text into chunks of approximately 500-800 tokens.
     * Roughly, 1 token = 4 characters.
     * We'll target chunks of ~2400 characters (600 tokens) with 200 characters overlap.
     */
    public List<String> chunkText(String text) {
        List<String> chunks = new ArrayList<>();
        if (text == null || text.trim().isEmpty()) {
            return chunks;
        }

        int chunkSize = 2400; // ~600 tokens
        int overlap = 200;    // ~50 tokens

        int start = 0;
        while (start < text.length()) {
            int end = Math.min(start + chunkSize, text.length());
            
            // Try to expand end to the nearest whitespace to avoid cutting words
            if (end < text.length()) {
                while (end < text.length() && !Character.isWhitespace(text.charAt(end)) && (end - start) < (chunkSize + 100)) {
                    end++;
                }
            }
            
            String chunk = text.substring(start, end).trim();
            if (!chunk.isEmpty()) {
                chunks.add(chunk);
            }
            
            start = end - overlap;
            if (start >= text.length() - overlap) {
                break;
            }
        }
        return chunks;
    }
}
