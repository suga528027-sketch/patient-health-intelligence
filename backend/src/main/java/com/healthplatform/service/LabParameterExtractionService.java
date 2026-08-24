package com.healthplatform.service;

import com.healthplatform.model.*;
import com.healthplatform.repository.LabParameterRepository;
import com.healthplatform.repository.MedicalReportRepository;
import com.healthplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class LabParameterExtractionService {

    private static final Logger logger = LoggerFactory.getLogger(LabParameterExtractionService.class);

    private final LabParameterRepository labParameterRepository;
    private final UserRepository userRepository;
    private final MedicalReportRepository reportRepository;

    @Transactional
    public void extractAndSaveFromReport(Long reportId, String reportText, Long patientId, LocalDateTime testDate) {
        if (reportText == null || reportText.trim().isEmpty()) {
            logger.warn("Empty report text, skipping parameter extraction for report ID: {}", reportId);
            return;
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + patientId));
        MedicalReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + reportId));

        int count = 0;

        // 1. Blood Pressure: e.g. "BP 120/80", "BP: 120 / 80 mmHg", "Blood Pressure: 130/85 mmHg", "140/90 mmHg"
        Pattern bpPattern = Pattern.compile("(?i)(?:bp|blood\\s+pressure)[:\\s]*(\\d{2,3})\\s*/\\s*(\\d{2,3})\\s*(?:mmhg)?");
        Matcher bpMatcher = bpPattern.matcher(reportText);
        if (bpMatcher.find()) {
            double systolic = Double.parseDouble(bpMatcher.group(1));
            double diastolic = Double.parseDouble(bpMatcher.group(2));

            saveParameter(patient, report, ParameterName.BP_SYSTOLIC, systolic, "mmHg", "90-120", testDate);
            saveParameter(patient, report, ParameterName.BP_DIASTOLIC, diastolic, "mmHg", "60-80", testDate);
            count += 2;
        } else {
            // Backup pattern for standalone numbers like "120/80 mmHg" or "120 / 80"
            Pattern bpBackupPattern = Pattern.compile("(\\d{2,3})\\s*/\\s*(\\d{2,3})\\s*mmhg");
            Matcher bpBackupMatcher = bpBackupPattern.matcher(reportText);
            if (bpBackupMatcher.find()) {
                double systolic = Double.parseDouble(bpBackupMatcher.group(1));
                double diastolic = Double.parseDouble(bpBackupMatcher.group(2));

                saveParameter(patient, report, ParameterName.BP_SYSTOLIC, systolic, "mmHg", "90-120", testDate);
                saveParameter(patient, report, ParameterName.BP_DIASTOLIC, diastolic, "mmHg", "60-80", testDate);
                count += 2;
            }
        }

        // 2. Fasting Glucose: e.g. "Fasting Glucose: 110 mg/dL", "FBS = 98", "Fasting Blood Sugar: 105 mg/dl"
        Pattern glucosePattern = Pattern.compile("(?i)(?:fasting\\s+(?:blood\\s+)?(?:glucose|sugar)|fbs)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl|mg%)?");
        Matcher glucoseMatcher = glucosePattern.matcher(reportText);
        if (glucoseMatcher.find()) {
            double value = Double.parseDouble(glucoseMatcher.group(1));
            saveParameter(patient, report, ParameterName.GLUCOSE_FASTING, value, "mg/dL", "70-100", testDate);
            count++;
        }

        // 3. HbA1c: e.g. "HbA1c: 6.8%", "HbA1c = 5.7"
        Pattern hba1cPattern = Pattern.compile("(?i)(?:hba1c|glycated\\s+hemoglobin)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*%?");
        Matcher hba1cMatcher = hba1cPattern.matcher(reportText);
        if (hba1cMatcher.find()) {
            double value = Double.parseDouble(hba1cMatcher.group(1));
            saveParameter(patient, report, ParameterName.HBA1C, value, "%", "<5.7", testDate);
            count++;
        }

        // 4. Hemoglobin: e.g. "Hemoglobin: 13.2 g/dL", "Hb = 11.5", "Hemoglobin 14.5 g/dl"
        Pattern hbPattern = Pattern.compile("(?i)(?:hemoglobin|hb)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:g/dl|gm/dl)?");
        Matcher hbMatcher = hbPattern.matcher(reportText);
        if (hbMatcher.find()) {
            double value = Double.parseDouble(hbMatcher.group(1));
            saveParameter(patient, report, ParameterName.HEMOGLOBIN, value, "g/dL", "12.0-16.0", testDate);
            count++;
        }

        // 5. Cholesterol Total: e.g. "Cholesterol: 210 mg/dL", "Total Cholesterol = 185"
        Pattern cholPattern = Pattern.compile("(?i)(?:total\\s+cholesterol|serum\\s+cholesterol|cholesterol)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher cholMatcher = cholPattern.matcher(reportText);
        if (cholMatcher.find()) {
            double value = Double.parseDouble(cholMatcher.group(1));
            saveParameter(patient, report, ParameterName.CHOLESTEROL_TOTAL, value, "mg/dL", "<200", testDate);
            count++;
        }

        // 6. LDL: e.g. "LDL: 130 mg/dL", "LDL-C = 110"
        Pattern ldlPattern = Pattern.compile("(?i)(?:ldl|ldl-c|ldl\\s+cholesterol)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher ldlMatcher = ldlPattern.matcher(reportText);
        if (ldlMatcher.find()) {
            double value = Double.parseDouble(ldlMatcher.group(1));
            saveParameter(patient, report, ParameterName.LDL, value, "mg/dL", "<100", testDate);
            count++;
        }

        // 7. HDL: e.g. "HDL: 45 mg/dL", "HDL-C = 50"
        Pattern hdlPattern = Pattern.compile("(?i)(?:hdl|hdl-c|hdl\\s+cholesterol)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher hdlMatcher = hdlPattern.matcher(reportText);
        if (hdlMatcher.find()) {
            double value = Double.parseDouble(hdlMatcher.group(1));
            saveParameter(patient, report, ParameterName.HDL, value, "mg/dL", ">40", testDate);
            count++;
        }

        // 8. Creatinine: e.g. "Creatinine: 0.9 mg/dL", "Serum Creatinine = 1.1"
        Pattern creatPattern = Pattern.compile("(?i)(?:serum\\s+)?creatinine\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher creatMatcher = creatPattern.matcher(reportText);
        if (creatMatcher.find()) {
            double value = Double.parseDouble(creatMatcher.group(1));
            saveParameter(patient, report, ParameterName.CREATININE, value, "mg/dL", "0.6-1.2", testDate);
            count++;
        }

        logger.info("Successfully extracted {} structured lab parameters for report ID: {}", count, reportId);
    }

    private void saveParameter(User patient, MedicalReport report, ParameterName name, double value, String unit, String refRange, LocalDateTime testDate) {
        LabParameter lp = new LabParameter();
        lp.setPatient(patient);
        lp.setReport(report);
        lp.setParameterName(name);
        lp.setValue(value);
        lp.setUnit(unit);
        lp.setReferenceRange(refRange);
        lp.setTestDate(testDate);
        labParameterRepository.save(lp);
    }
}
