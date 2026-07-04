package com.healthplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabTrendDTO {
    private LocalDateTime date;
    private Double value;
    private String unit;
    private Long reportId;
}
