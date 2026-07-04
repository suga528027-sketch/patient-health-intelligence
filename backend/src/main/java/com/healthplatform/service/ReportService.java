package com.healthplatform.service;

import com.healthplatform.dto.ReportDTO;
import com.healthplatform.exception.ResourceNotFoundException;
import com.healthplatform.exception.UnauthorizedAccessException;
import com.healthplatform.model.MedicalReport;
import com.healthplatform.model.ReportType;
import com.healthplatform.model.User;
import com.healthplatform.repository.MedicalReportRepository;
import com.healthplatform.repository.UserRepository;
import com.healthplatform.util.FileStorageUtil;
import com.healthplatform.util.PdfTextExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import com.healthplatform.model.ReportEmbedding;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final MedicalReportRepository reportRepository;
    private final UserRepository userRepository;
    private final FileStorageUtil fileStorageUtil;
    private final PdfTextExtractor pdfTextExtractor;
    private final AiService aiService;
    private final EmbeddingService embeddingService;
    private final VectorStoreService vectorStoreService;
    private final LabParameterExtractionService labParameterExtractionService;

    @Transactional
    public ReportDTO uploadReport(String email, MultipartFile file, String reportTypeStr, String notes) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ReportType reportType;
        try {
            reportType = ReportType.valueOf(reportTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid report type");
        }

        String storedFileName = fileStorageUtil.storeFile(file);

        MedicalReport report = new MedicalReport();
        report.setPatientUser(user);
        report.setReportType(reportType);
        report.setFileName(file.getOriginalFilename());
        report.setFilePath(storedFileName);
        String extractedText = pdfTextExtractor.extractText(file);
        report.setOriginalText(extractedText);
        
        String aiSummary = aiService.summarizeMedicalReport(extractedText, reportType.name());
        report.setSummaryText(aiSummary);
        
        MedicalReport saved = reportRepository.save(report);
        
        // Generate and store embeddings for search
        embeddingService.generateAndStoreEmbeddings(saved);

        // Extract and save structured lab parameters from PDF text
        labParameterExtractionService.extractAndSaveFromReport(
                saved.getId(),
                extractedText,
                user.getId(),
                saved.getUploadedAt()
        );
        
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getReports(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return reportRepository.findByPatientUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReportDTO getReportMetadata(String email, Long reportId) {
        MedicalReport report = getReportIfAuthorized(email, reportId);
        return mapToDTO(report);
    }

    @Transactional(readOnly = true)
    public Resource getReportFileAsResource(String email, Long reportId) {
        MedicalReport report = getReportIfAuthorized(email, reportId);
        try {
            Path filePath = fileStorageUtil.getFilePath(report.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found");
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found");
        }
    }

    @Transactional
    public void deleteReport(String email, Long reportId) {
        MedicalReport report = getReportIfAuthorized(email, reportId);
        fileStorageUtil.deleteFile(report.getFilePath());
        reportRepository.delete(report);
    }

    @Transactional(readOnly = true)
    public String getReportSummary(String email, Long reportId) {
        MedicalReport report = getReportIfAuthorized(email, reportId);
        return report.getSummaryText();
    }

    private MedicalReport getReportIfAuthorized(String email, Long reportId) {
        MedicalReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        
        if (!report.getPatientUser().getEmail().equals(email)) {
            throw new UnauthorizedAccessException("You don't have permission to access this report");
        }
        return report;
    }

    private ReportDTO mapToDTO(MedicalReport report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setReportType(report.getReportType().name());
        dto.setFileName(report.getFileName());
        dto.setUploadedAt(report.getUploadedAt());
        dto.setSummaryText(report.getSummaryText());
        return dto;
    }

    public List<Map<String, Object>> searchReports(String email, String query, int topK) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        
        List<ReportEmbedding> matches = vectorStoreService.searchSimilar(query, topK, user.getId());
        
        List<Map<String, Object>> results = new ArrayList<>();
        for (ReportEmbedding match : matches) {
            Map<String, Object> item = new HashMap<>();
            item.put("reportId", match.getReport().getId());
            item.put("fileName", match.getReport().getFileName());
            item.put("reportType", match.getReport().getReportType().name());
            item.put("chunkText", match.getChunkText());
            item.put("chunkIndex", match.getChunkIndex());
            results.add(item);
        }
        return results;
    }
}
