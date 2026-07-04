package com.healthplatform.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReportDTO {
    private Long id;
    private String reportType;
    private String fileName;
    private LocalDateTime uploadedAt;
    private String summaryText;
}
