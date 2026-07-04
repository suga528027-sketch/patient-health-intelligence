package com.healthplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParameterComparison {
    private String parameterName;
    private Double currentValue;
    private Double previousValue;
    private Double difference;
    private Double percentChange;
    private String trend; // "INCREASED", "DECREASED", "STABLE"
    private String unit;
    private String interpretation;
}
