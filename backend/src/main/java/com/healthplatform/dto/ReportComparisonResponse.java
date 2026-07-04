package com.healthplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportComparisonResponse {
    private Long currentReportId;
    private Long previousReportId;
    private List<ParameterComparison> comparisons;
}
