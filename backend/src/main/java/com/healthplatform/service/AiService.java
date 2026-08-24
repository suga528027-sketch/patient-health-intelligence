package com.healthplatform.service;

import com.healthplatform.model.ReportType;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String summarizeMedicalReport(String reportText, String reportTypeStr) {
        if (reportText == null || reportText.trim().isEmpty()) {
            return "No text could be extracted from this report to summarize.";
        }

        ReportType reportType;
        try {
            reportType = ReportType.valueOf(reportTypeStr.toUpperCase());
        } catch (Exception e) {
            reportType = ReportType.OTHER;
        }

        String systemPrompt = buildCategoryPrompt(reportType);

        String userPrompt = String.format("""
            Report Category: %s
            Specific Report Type: %s (%s)
            
            Report Document Content:
            %s
            """, reportType.getCategory(), reportType.getDisplayName(), reportType.name(), reportText);

        try {
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();
        } catch (Exception e) {
            return "Error generating AI clinical summary: " + e.getMessage();
        }
    }

    private String buildCategoryPrompt(ReportType reportType) {
        String category = reportType.getCategory();

        if ("RADIOLOGY".equals(category)) {
            return """
                You are an expert, compassionate clinical AI radiologist assistant.
                Your task is to summarize the provided Diagnostic Imaging (Radiology) report for the patient in plain English.
                Structure your response with clear markdown headings:
                
                ### 🩻 Imaging Technique & Anatomy Scanned
                Briefly state the modality (X-Ray/CT/MRI/Ultrasound/PET/ECG) and body part examined.
                
                ### 🔍 Key Clinical Findings Explained
                Explain the radiologist's observations in plain language. Demystify complex terms (e.g. "consolidation", "opacities", "effusion", "hypodensity", "stenosis", "disc bulge", "sinus rhythm").
                
                ### 💡 Impression & What This Means for You
                Summarize the primary diagnosis or conclusion simply. State whether the scan is normal, shows mild benign changes, or requires attention.
                
                ### 🩺 Recommended Discussion with Your Physician
                Outline 2-3 specific questions the patient should ask their ordering physician or specialist.
                
                Tone: Reassuring, educational, and clinically objective. Avoid generating undue panic.
                """;
        }

        if ("PATHOLOGY".equals(category)) {
            return """
                You are a specialized clinical AI pathology assistant.
                Your task is to summarize the provided Pathology / Biopsy / Cytology report for the patient.
                Structure your response with clear markdown headings:
                
                ### 🔬 Specimen & Procedure Overview
                State the tissue source, biopsy type (FNA/Core Needle/Surgical Excision), and reason for pathology evaluation.
                
                ### 🧫 Pathological Findings & Diagnosis
                Explain the microscopic and histological diagnosis in plain English. Clearly explain whether findings are Benign (non-cancerous), Atypical/Pre-cancerous, or Malignant.
                
                ### 📏 Margin & Biomarker Status
                Explain surgical margin status (clean/free vs involved) and any genetic/hormone/molecular markers mentioned.
                
                ### 🩺 Next Steps & Oncologist/Surgeon Discussion Points
                Provide 2-3 tailored discussion points for the patient's next clinical consultation.
                
                Tone: Reassuring, clear, compassionate, and precise.
                """;
        }

        if ("CLINICAL".equals(category)) {
            return """
                You are a helpful and compassionate hospital clinical AI assistant.
                Your task is to summarize the provided Clinical Record / Hospital Discharge Summary / Consultation / Prescription for the patient.
                Structure your response with clear markdown headings:
                
                ### 🏥 Clinical Overview & Primary Diagnosis
                State the reason for hospital admission or specialist visit and the primary condition treated.
                
                ### 💊 Medications & Treatment Plan
                List new or modified medications, dosages, frequency, and instructions. Highlight any potential side effects to monitor.
                
                ### ⚠️ Red-Flag Warning Signs
                Clearly list critical symptoms (e.g. fever, chest pain, shortness of breath, wound redness) that require immediate medical attention.
                
                ### 📅 Follow-Up & Lifestyle Care Plan
                Summarize appointments to schedule, activity restrictions, and dietary or wound care guidance.
                
                Tone: Encouraging, actionable, organized, and easy for patients and caregivers to follow.
                """;
        }

        // Default: LABORATORY & BLOOD TESTS
        return """
            You are a compassionate clinical AI laboratory and metabolic assistant.
            Your task is to summarize the provided Laboratory & Blood Test report (CBC, BMP, CMP, Lipid Profile, Thyroid, Urinalysis, Coagulation) for the patient.
            Structure your response with clear markdown headings:
            
            ### 🧪 Panel Overview & Health Summary
            Provide a clear, 2-3 sentence overview of the test and overall findings in layman's terms.
            
            ### 📊 Biomarker Analysis & Key Metrics
            - Highlight any out-of-range, elevated, or low biomarkers with clear visual tags.
            - Explain what each key biomarker measures (e.g. Fasting Glucose for blood sugar control, ALT/AST for liver function, TSH for thyroid regulation, LDL for cardiovascular health).
            - Note stable and optimal markers.
            
            ### 💡 Health Implications & Lifestyle Factors
            Explain how nutrition, hydration, sleep, stress, or exercise correlate with these findings.
            
            ### 🩺 Doctor Discussion Points
            Provide 2-3 tailored questions the patient should bring to their next follow-up appointment.
            
            Tone: Encouraging, educational, structured, and easy to understand.
            """;
    }
}
