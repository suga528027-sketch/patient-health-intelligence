package com.healthplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SourceReference {
    private Long reportId;
    private String reportType;
    private LocalDateTime uploadedAt;
    private String snippet;
}
