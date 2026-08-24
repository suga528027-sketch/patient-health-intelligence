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

        // 2. Heart Rate / Pulse: e.g. "Heart Rate: 72 bpm", "Pulse = 80 bpm", "HR: 68"
        Pattern hrPattern = Pattern.compile("(?i)(?:heart\\s+rate|pulse|hr)\\s*[:=]?\\s*(\\d{2,3})\\s*(?:bpm)?");
        Matcher hrMatcher = hrPattern.matcher(reportText);
        if (hrMatcher.find()) {
            double hr = Double.parseDouble(hrMatcher.group(1));
            if (hr >= 40 && hr <= 200) {
                saveParameter(patient, report, ParameterName.HEART_RATE, hr, "bpm", "60-100", testDate);
                count++;
            }
        }

        // 3. Fasting Glucose: e.g. "Fasting Glucose: 110 mg/dL", "FBS = 98", "Fasting Blood Sugar: 105 mg/dl"
        Pattern glucosePattern = Pattern.compile("(?i)(?:fasting\\s+(?:blood\\s+)?(?:glucose|sugar)|fbs)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl|mg%)?");
        Matcher glucoseMatcher = glucosePattern.matcher(reportText);
        if (glucoseMatcher.find()) {
            double value = Double.parseDouble(glucoseMatcher.group(1));
            saveParameter(patient, report, ParameterName.GLUCOSE_FASTING, value, "mg/dL", "70-100", testDate);
            count++;
        }

        // 4. HbA1c: e.g. "HbA1c: 6.8%", "HbA1c = 5.7"
        Pattern hba1cPattern = Pattern.compile("(?i)(?:hba1c|glycated\\s+hemoglobin)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*%?");
        Matcher hba1cMatcher = hba1cPattern.matcher(reportText);
        if (hba1cMatcher.find()) {
            double value = Double.parseDouble(hba1cMatcher.group(1));
            saveParameter(patient, report, ParameterName.HBA1C, value, "%", "<5.7", testDate);
            count++;
        }

        // 5. Hemoglobin: e.g. "Hemoglobin: 13.2 g/dL", "Hb = 11.5", "Hemoglobin 14.5 g/dl"
        Pattern hbPattern = Pattern.compile("(?i)(?:hemoglobin|hb)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:g/dl|gm/dl)?");
        Matcher hbMatcher = hbPattern.matcher(reportText);
        if (hbMatcher.find()) {
            double value = Double.parseDouble(hbMatcher.group(1));
            saveParameter(patient, report, ParameterName.HEMOGLOBIN, value, "g/dL", "12.0-16.0", testDate);
            count++;
        }

        // 6. Cholesterol Total: e.g. "Cholesterol: 210 mg/dL", "Total Cholesterol = 185"
        Pattern cholPattern = Pattern.compile("(?i)(?:total\\s+cholesterol|serum\\s+cholesterol|cholesterol)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher cholMatcher = cholPattern.matcher(reportText);
        if (cholMatcher.find()) {
            double value = Double.parseDouble(cholMatcher.group(1));
            saveParameter(patient, report, ParameterName.CHOLESTEROL_TOTAL, value, "mg/dL", "<200", testDate);
            count++;
        }

        // 7. LDL: e.g. "LDL: 130 mg/dL", "LDL-C = 110"
        Pattern ldlPattern = Pattern.compile("(?i)(?:ldl|ldl-c|ldl\\s+cholesterol)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher ldlMatcher = ldlPattern.matcher(reportText);
        if (ldlMatcher.find()) {
            double value = Double.parseDouble(ldlMatcher.group(1));
            saveParameter(patient, report, ParameterName.LDL, value, "mg/dL", "<100", testDate);
            count++;
        }

        // 8. HDL: e.g. "HDL: 45 mg/dL", "HDL-C = 50"
        Pattern hdlPattern = Pattern.compile("(?i)(?:hdl|hdl-c|hdl\\s+cholesterol)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher hdlMatcher = hdlPattern.matcher(reportText);
        if (hdlMatcher.find()) {
            double value = Double.parseDouble(hdlMatcher.group(1));
            saveParameter(patient, report, ParameterName.HDL, value, "mg/dL", ">40", testDate);
            count++;
        }

        // 9. Triglycerides: e.g. "Triglycerides: 145 mg/dL", "TG = 160"
        Pattern tgPattern = Pattern.compile("(?i)(?:triglycerides|tg)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher tgMatcher = tgPattern.matcher(reportText);
        if (tgMatcher.find()) {
            double value = Double.parseDouble(tgMatcher.group(1));
            saveParameter(patient, report, ParameterName.TRIGLYCERIDES, value, "mg/dL", "<150", testDate);
            count++;
        }

        // 10. Creatinine: e.g. "Creatinine: 0.9 mg/dL", "Serum Creatinine = 1.1"
        Pattern creatPattern = Pattern.compile("(?i)(?:serum\\s+)?creatinine\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:mg/dl)?");
        Matcher creatMatcher = creatPattern.matcher(reportText);
        if (creatMatcher.find()) {
            double value = Double.parseDouble(creatMatcher.group(1));
            saveParameter(patient, report, ParameterName.CREATININE, value, "mg/dL", "0.6-1.2", testDate);
            count++;
        }

        // 11. Liver Enzymes: ALT (SGPT) & AST (SGOT)
        Pattern altPattern = Pattern.compile("(?i)(?:alt|sgpt|alanine\\s+aminotransferase)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:u/l|iu/l)?");
        Matcher altMatcher = altPattern.matcher(reportText);
        if (altMatcher.find()) {
            double value = Double.parseDouble(altMatcher.group(1));
            saveParameter(patient, report, ParameterName.ALT, value, "U/L", "7-56", testDate);
            count++;
        }

        Pattern astPattern = Pattern.compile("(?i)(?:ast|sgot|aspartate\\s+aminotransferase)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:u/l|iu/l)?");
        Matcher astMatcher = astPattern.matcher(reportText);
        if (astMatcher.find()) {
            double value = Double.parseDouble(astMatcher.group(1));
            saveParameter(patient, report, ParameterName.AST, value, "U/L", "10-40", testDate);
            count++;
        }

        // 12. Thyroid TSH: e.g. "TSH: 2.45 uIU/mL"
        Pattern tshPattern = Pattern.compile("(?i)(?:tsh|thyroid\\s+stimulating\\s+hormone)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:uiu/ml|miu/l)?");
        Matcher tshMatcher = tshPattern.matcher(reportText);
        if (tshMatcher.find()) {
            double value = Double.parseDouble(tshMatcher.group(1));
            saveParameter(patient, report, ParameterName.TSH, value, "uIU/mL", "0.4-4.0", testDate);
            count++;
        }

        // 13. WBC (White Blood Cell Count): e.g. "WBC: 6.8 K/uL" or "WBC 7200"
        Pattern wbcPattern = Pattern.compile("(?i)(?:wbc|white\\s+blood\\s+cell(?:\\s+count)?)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:k/ul|thou/ul|/cumm|10\\^3/ul)?");
        Matcher wbcMatcher = wbcPattern.matcher(reportText);
        if (wbcMatcher.find()) {
            double value = Double.parseDouble(wbcMatcher.group(1));
            if (value > 100) value = value / 1000.0; // normalize 7200 -> 7.2
            saveParameter(patient, report, ParameterName.WBC, value, "K/uL", "4.5-11.0", testDate);
            count++;
        }

        // 14. Platelets: e.g. "Platelet Count: 240 K/uL"
        Pattern pltPattern = Pattern.compile("(?i)(?:platelets?|platelet\\s+count|plt)\\s*[:=]?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:k/ul|thou/ul|/cumm)?");
        Matcher pltMatcher = pltPattern.matcher(reportText);
        if (pltMatcher.find()) {
            double value = Double.parseDouble(pltMatcher.group(1));
            if (value > 1000) value = value / 1000.0; // normalize 250000 -> 250
            saveParameter(patient, report, ParameterName.PLATELETS, value, "K/uL", "150-450", testDate);
            count++;
        }

        logger.info("Successfully extracted {} structured clinical parameters for report ID: {}", count, reportId);
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
