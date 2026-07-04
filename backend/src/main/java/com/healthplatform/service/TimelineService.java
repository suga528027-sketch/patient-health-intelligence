package com.healthplatform.service;

import com.healthplatform.dto.TimelineItemDTO;
import com.healthplatform.dto.TimelineResponse;
import com.healthplatform.model.MedicalReport;
import com.healthplatform.repository.MedicalReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimelineService {

    private final MedicalReportRepository reportRepository;

    public TimelineResponse getTimeline(Long patientId) {
        // Fetch all medical reports for the patient
        List<MedicalReport> reports = reportRepository.findByPatientUserId(patientId);

        // Sort by uploaded date descending (chronological order)
        List<TimelineItemDTO> items = reports.stream()
                .sorted(Comparator.comparing(MedicalReport::getUploadedAt).reversed())
                .map(report -> {
                    String title = formatReportTitle(report.getReportType().name());
                    String description = getFirstFewLines(report.getSummaryText(), 2);
                    
                    return new TimelineItemDTO(
                            report.getId(),
                            report.getUploadedAt(),
                            "REPORT",
                            title,
                            description,
                            report.getId()
                    );
                })
                .collect(Collectors.toList());

        return new TimelineResponse(items);
    }

    private String formatReportTitle(String reportType) {
        // Format report type for user-friendly display, e.g. "BLOOD_TEST" -> "Blood Test Report"
        String[] parts = reportType.split("_");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            sb.append(part.substring(0, 1).toUpperCase()).append(part.substring(1).toLowerCase()).append(" ");
        }
        return sb.toString().trim() + " Report";
    }

    private String getFirstFewLines(String text, int maxLines) {
        if (text == null || text.trim().isEmpty()) {
            return "No summary available.";
        }
        String[] lines = text.split("\r?\n");
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (String line : lines) {
            if (!line.trim().isEmpty()) {
                sb.append(line.trim()).append(" ");
                count++;
                if (count >= maxLines) {
                    break;
                }
            }
        }
        return sb.toString().trim();
    }
}
