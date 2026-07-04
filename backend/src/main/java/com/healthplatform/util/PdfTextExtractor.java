package com.healthplatform.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class PdfTextExtractor {
    
    private static final Logger logger = LoggerFactory.getLogger(PdfTextExtractor.class);

    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            logger.warn("Provided file is null or empty. Skipping text extraction.");
            return null;
        }
        
        if (file.getContentType() != null && !file.getContentType().equalsIgnoreCase("application/pdf")) {
            logger.warn("File is not a PDF. Skipping text extraction.");
            return null;
        }

        try (InputStream inputStream = file.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {
             
            if (document.isEncrypted()) {
                logger.warn("PDF document is encrypted. Cannot extract text.");
                return null;
            }

            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);
            
            if (text != null && !text.trim().isEmpty()) {
                logger.info("Successfully extracted {} characters from PDF.", text.length());
                return text;
            } else {
                logger.warn("Extracted text is empty.");
                return null;
            }

        } catch (IOException e) {
            logger.error("Error occurred while extracting text from PDF: {}", e.getMessage(), e);
            return null;
        } catch (Exception e) {
            logger.error("Unexpected error during PDF text extraction: {}", e.getMessage(), e);
            return null;
        }
    }
}
