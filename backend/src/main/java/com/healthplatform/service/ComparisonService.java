package com.healthplatform.service;

import com.healthplatform.dto.ParameterComparison;
import com.healthplatform.dto.ReportComparisonResponse;
import com.healthplatform.model.LabParameter;
import com.healthplatform.model.MedicalReport;
import com.healthplatform.repository.LabParameterRepository;
import com.healthplatform.repository.MedicalReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComparisonService {

    private final MedicalReportRepository reportRepository;
    private final LabParameterRepository labParameterRepository;

    public ReportComparisonResponse compareLatestWithPrevious(Long patientId) {
        // 1. Get all patient reports, sorted by uploaded_at descending
        List<MedicalReport> reports = reportRepository.findByPatientUserId(patientId).stream()
                .sorted(Comparator.comparing(MedicalReport::getUploadedAt).reversed())
                .collect(Collectors.toList());

        if (reports.isEmpty()) {
            throw new IllegalArgumentException("No reports found for patient.");
        }
        if (reports.size() < 2) {
            throw new IllegalArgumentException("Only one report exists. Cannot compare.");
        }

        MedicalReport currentReport = reports.get(0);
        MedicalReport previousReport = reports.get(1);

        // 2. Fetch parameters for both reports
        List<LabParameter> currentParams = labParameterRepository.findByReportId(currentReport.getId());
        List<LabParameter> previousParams = labParameterRepository.findByReportId(previousReport.getId());

        if (currentParams.isEmpty()) {
            throw new IllegalArgumentException("No lab parameters found in the current report.");
        }

        // Map previous parameters by ParameterName for fast lookup
        Map<String, LabParameter> prevMap = previousParams.stream()
                .collect(Collectors.toMap(p -> p.getParameterName().name(), p -> p, (p1, p2) -> p1));

        List<ParameterComparison> comparisons = new ArrayList<>();

        for (LabParameter cur : currentParams) {
            String paramName = cur.getParameterName().name();
            LabParameter prev = prevMap.get(paramName);

            if (prev != null) {
                double diff = cur.getValue() - prev.getValue();
                double pct = prev.getValue() == 0 ? 0 : (diff / prev.getValue()) * 100;
                String trendVal = "STABLE";
                if (Math.abs(pct) >= 5.0) {
                    trendVal = diff > 0 ? "INCREASED" : "DECREASED";
                }

                String displayParamName = formatParamName(paramName);
                String interpretation = generateInterpretation(displayParamName, cur.getValue(), prev.getValue(), diff, trendVal, cur.getUnit());

                comparisons.add(new ParameterComparison(
                        paramName,
                        cur.getValue(),
                        prev.getValue(),
                        diff,
                        pct,
                        trendVal,
                        cur.getUnit(),
                        interpretation
                ));
            }
        }

        if (comparisons.isEmpty()) {
            throw new IllegalArgumentException("No overlapping lab parameters found between the reports to compare.");
        }

        return new ReportComparisonResponse(
                currentReport.getId(),
                previousReport.getId(),
                comparisons
        );
    }

    private String formatParamName(String paramName) {
        if (paramName.equals("BP_SYSTOLIC")) return "systolic blood pressure";
        if (paramName.equals("BP_DIASTOLIC")) return "diastolic blood pressure";
        if (paramName.equals("GLUCOSE_FASTING")) return "fasting glucose";
        if (paramName.equals("HBA1C")) return "HbA1c";
        if (paramName.equals("HEMOGLOBIN")) return "hemoglobin";
        if (paramName.equals("CHOLESTEROL_TOTAL")) return "total cholesterol";
        if (paramName.equals("LDL")) return "LDL cholesterol";
        if (paramName.equals("HDL")) return "HDL cholesterol";
        if (paramName.equals("CREATININE")) return "creatinine";
        return paramName.toLowerCase().replace("_", " ");
    }

    private String generateInterpretation(String name, double curVal, double prevVal, double diff, String trend, String unit) {
        if (trend.equals("STABLE")) {
            return String.format("Your %s is stable compared to your last test.", name);
        }
        String direction = trend.equals("INCREASED") ? "increased" : "decreased";
        return String.format("Your %s has %s by %.1f %s compared to your last test.", name, direction, Math.abs(diff), unit);
    }
}
