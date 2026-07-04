package com.healthplatform.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LabParameterDTO {
    private Long id;
    private Long patientId;
    private Long reportId;
    private String parameterName;
    private Double value;
    private String unit;
    private String referenceRange;
    private LocalDateTime testDate;
}
