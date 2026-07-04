package com.healthplatform.controller;

import com.healthplatform.dto.ReportDTO;
import com.healthplatform.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportDTO> uploadReport(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam("reportType") String reportType,
            @RequestParam(value = "notes", required = false) String notes) {
        
        ReportDTO uploaded = reportService.uploadReport(authentication.getName(), file, reportType, notes);
        return ResponseEntity.ok(uploaded);
    }

    @GetMapping
    public ResponseEntity<List<ReportDTO>> getReports(Authentication authentication) {
        return ResponseEntity.ok(reportService.getReports(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportDTO> getReportMetadata(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportMetadata(authentication.getName(), id));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadReport(
            Authentication authentication,
            @PathVariable Long id) {
        Resource resource = reportService.getReportFileAsResource(authentication.getName(), id);
        
        // We use application/pdf directly since we enforce it, or you can dynamically detect it.
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReport(
            Authentication authentication,
            @PathVariable Long id) {
        reportService.deleteReport(authentication.getName(), id);
        return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<Map<String, String>> getReportSummary(
            Authentication authentication,
            @PathVariable Long id) {
        String summary = reportService.getReportSummary(authentication.getName(), id);
        return ResponseEntity.ok(Map.of("summary", summary != null ? summary : "No summary available."));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchReports(
            Authentication authentication,
            @RequestParam("query") String query,
            @RequestParam(value = "topK", defaultValue = "3") int topK) {
        return ResponseEntity.ok(reportService.searchReports(authentication.getName(), query, topK));
    }
}
