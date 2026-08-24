// Comprehensive Multi-Category Mock Health Data & RAG Simulator

export const DEMO_USER = {
    id: 1,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "ROLE_PATIENT"
};

// 4 Major Clinical Categories and their 18 Specialized Report Types
export const REPORT_CATEGORIES = [
    {
        id: "LABORATORY",
        name: "Laboratory & Blood Tests",
        icon: "🧪",
        description: "CBC, Metabolic, Lipid, Thyroid, Urinalysis & Coagulation",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        types: [
            { value: "LAB_CBC", label: "Complete Blood Count (CBC)", icon: "🩸" },
            { value: "LAB_BMP", label: "Basic Metabolic Panel (BMP)", icon: "🧪" },
            { value: "LAB_CMP", label: "Comprehensive Metabolic Panel (CMP)", icon: "🧪" },
            { value: "LAB_LIPID", label: "Lipid Profile (Cholesterol & TG)", icon: "🫀" },
            { value: "LAB_THYROID", label: "Thyroid Panel (TSH, T3, T4)", icon: "🦋" },
            { value: "LAB_URINALYSIS", label: "Urinalysis", icon: "🔬" },
            { value: "LAB_COAGULATION", label: "Coagulation (PT/INR, aPTT)", icon: "🩸" }
        ]
    },
    {
        id: "RADIOLOGY",
        name: "Diagnostic Imaging (Radiology)",
        icon: "🩻",
        description: "X-Ray, MRI, CT Scans, Ultrasound, PET & ECG",
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        types: [
            { value: "RAD_XRAY", label: "X-Ray (Chest / Bone / Spine)", icon: "🩻" },
            { value: "RAD_MRI", label: "MRI Scan (Brain / Joint / Spine)", icon: "🧠" },
            { value: "RAD_CT", label: "CT Scan (Chest / Abdomen / Head)", icon: "🩻" },
            { value: "RAD_ULTRASOUND", label: "Ultrasound / Sonography", icon: "🔊" },
            { value: "RAD_PET", label: "PET Scan (Metabolic / Nuclear)", icon: "☢️" },
            { value: "RAD_ECG", label: "Electrocardiogram (ECG / EKG)", icon: "📈" }
        ]
    },
    {
        id: "PATHOLOGY",
        name: "Pathology & Biopsy",
        icon: "🔬",
        description: "Surgical Biopsies, Cytology, Pap Smears & Molecular DNA",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        types: [
            { value: "PATH_SURGICAL", label: "Surgical Pathology / Tissue Biopsy", icon: "🔬" },
            { value: "PATH_CYTOLOGY", label: "Cytology (Pap Smear / FNA)", icon: "🧫" },
            { value: "PATH_MOLECULAR", label: "Molecular & Genetic Biomarkers", icon: "🧬" }
        ]
    },
    {
        id: "CLINICAL",
        name: "Clinical & Summary Records",
        icon: "📋",
        description: "Hospital Discharge, Consultations, Operative & Prescriptions",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        types: [
            { value: "CLINICAL_DISCHARGE", label: "Hospital Discharge Summary", icon: "🏥" },
            { value: "CLINICAL_CONSULTATION", label: "Specialist Consultation Note", icon: "🩺" },
            { value: "CLINICAL_OPERATIVE", label: "Operative / Surgical Report", icon: "✂️" },
            { value: "CLINICAL_PRESCRIPTION", label: "Prescription & Medication Record", icon: "💊" }
        ]
    }
];

export const INITIAL_REPORTS = [
    // 1. Comprehensive Metabolic & Lipid Panel (Lab Test)
    {
        id: 101,
        category: "LABORATORY",
        reportType: "LAB_CMP",
        fileName: "Metabolic_Lipid_Panel_Jan2026.pdf",
        uploadedAt: "2026-01-15T09:30:00",
        summaryText: `### 🧪 Comprehensive Metabolic & Lipid Panel (Jan 15, 2026)

**Overview:**
Your baseline comprehensive blood chemistry and lipid profile from January 2026 shows optimal baseline metrics with normal kidney, glycemic, and hematological health.

**Biomarker Analysis:**
- **Blood Pressure:** 122/78 mmHg (Normal / Optimal).
- **Fasting Glucose:** 94 mg/dL (Normal fasting glycemic control, range: 70–100 mg/dL).
- **HbA1c:** 5.4% (Normal non-diabetic range).
- **Lipid Profile:** Total Cholesterol 182 mg/dL, LDL 98 mg/dL, HDL 52 mg/dL, Triglycerides 135 mg/dL.
- **Liver Enzymes:** ALT 24 U/L, AST 22 U/L (Healthy hepatic function).
- **Kidney Function:** Serum Creatinine 0.88 mg/dL, BUN 14 mg/dL (Normal renal filtration).
- **Hematology:** Hemoglobin 14.2 g/dL, WBC 6.4 K/uL, Platelets 240 K/uL.

**Doctor Discussion Points:**
1. Baseline metabolic profile established. Continue standard balanced dietary habits.`,
        parameters: [
            { parameterName: "BP_SYSTOLIC", value: 122, unit: "mmHg", referenceRange: "90-120", testDate: "2026-01-15T09:30:00" },
            { parameterName: "BP_DIASTOLIC", value: 78, unit: "mmHg", referenceRange: "60-80", testDate: "2026-01-15T09:30:00" },
            { parameterName: "GLUCOSE_FASTING", value: 94, unit: "mg/dL", referenceRange: "70-100", testDate: "2026-01-15T09:30:00" },
            { parameterName: "HBA1C", value: 5.4, unit: "%", referenceRange: "<5.7", testDate: "2026-01-15T09:30:00" },
            { parameterName: "HEMOGLOBIN", value: 14.2, unit: "g/dL", referenceRange: "12.0-16.0", testDate: "2026-01-15T09:30:00" },
            { parameterName: "CHOLESTEROL_TOTAL", value: 182, unit: "mg/dL", referenceRange: "<200", testDate: "2026-01-15T09:30:00" },
            { parameterName: "LDL", value: 98, unit: "mg/dL", referenceRange: "<100", testDate: "2026-01-15T09:30:00" },
            { parameterName: "HDL", value: 52, unit: "mg/dL", referenceRange: ">40", testDate: "2026-01-15T09:30:00" },
            { parameterName: "CREATININE", value: 0.88, unit: "mg/dL", referenceRange: "0.6-1.2", testDate: "2026-01-15T09:30:00" }
        ]
    },

    // 2. Follow-Up Metabolic Panel (Lab Test)
    {
        id: 102,
        category: "LABORATORY",
        reportType: "LAB_CMP",
        fileName: "FollowUp_Metabolic_Panel_Feb2026.pdf",
        uploadedAt: "2026-02-20T10:15:00",
        summaryText: `### 🧪 Follow-Up Metabolic & Lipid Panel (Feb 20, 2026)

**Overview:**
Follow-up blood panel demonstrating upward shifts in blood pressure, fasting glucose, and LDL cholesterol requiring lifestyle attention.

**Biomarker Analysis:**
- ⚠️ **Blood Pressure:** 138/88 mmHg (Elevated / Stage 1 Hypertension threshold, +16/+10 mmHg shift).
- ⚠️ **Fasting Glucose:** 114 mg/dL (Pre-diabetes range, +20 mg/dL elevation).
- ⚠️ **HbA1c:** 5.9% (Elevated into pre-diabetes range, up from 5.4%).
- ⚠️ **Lipid Profile:** Total Cholesterol 208 mg/dL (Borderline High), LDL 122 mg/dL (Elevated), HDL 48 mg/dL.
- **Liver & Kidney:** ALT 28 U/L, AST 26 U/L, Creatinine 0.92 mg/dL (Stable).
- **Hematology:** Hemoglobin 14.0 g/dL, Platelets 235 K/uL.

**Action Plan:**
1. Reduce dietary refined sugars and sodium.
2. Schedule cardiovascular and glycemic follow-up review with your doctor.`,
        parameters: [
            { parameterName: "BP_SYSTOLIC", value: 138, unit: "mmHg", referenceRange: "90-120", testDate: "2026-02-20T10:15:00" },
            { parameterName: "BP_DIASTOLIC", value: 88, unit: "mmHg", referenceRange: "60-80", testDate: "2026-02-20T10:15:00" },
            { parameterName: "GLUCOSE_FASTING", value: 114, unit: "mg/dL", referenceRange: "70-100", testDate: "2026-02-20T10:15:00" },
            { parameterName: "HBA1C", value: 5.9, unit: "%", referenceRange: "<5.7", testDate: "2026-02-20T10:15:00" },
            { parameterName: "HEMOGLOBIN", value: 14.0, unit: "g/dL", referenceRange: "12.0-16.0", testDate: "2026-02-20T10:15:00" },
            { parameterName: "CHOLESTEROL_TOTAL", value: 208, unit: "mg/dL", referenceRange: "<200", testDate: "2026-02-20T10:15:00" },
            { parameterName: "LDL", value: 122, unit: "mg/dL", referenceRange: "<100", testDate: "2026-02-20T10:15:00" },
            { parameterName: "HDL", value: 48, unit: "mg/dL", referenceRange: ">40", testDate: "2026-02-20T10:15:00" },
            { parameterName: "CREATININE", value: 0.92, unit: "mg/dL", referenceRange: "0.6-1.2", testDate: "2026-02-20T10:15:00" }
        ]
    },

    // 3. Digital Chest X-Ray (Radiology)
    {
        id: 103,
        category: "RADIOLOGY",
        reportType: "RAD_XRAY",
        fileName: "Chest_XRay_PA_Lateral_Feb2026.pdf",
        uploadedAt: "2026-02-22T14:30:00",
        summaryText: `### 🩻 Diagnostic Imaging (Radiology): Chest Radiograph (PA & Lateral)

### 🩻 Imaging Technique & Anatomy Scanned
- **Modality:** 2-View Digital Chest Radiograph (PA and Lateral views).
- **Indication:** Routine evaluation of mild persistent cough and cardiovascular assessment.

### 🔍 Key Clinical Findings Explained
- **Lungs:** Clear lung fields bilaterally without focal consolidation, pneumothorax, or pleural effusion.
- **Heart & Mediastinum:** Cardiothoracic ratio is within normal limits (<0.50). Mediastinal contours and hila are normal.
- **Bones & Soft Tissue:** Bony thorax and visualized ribs are intact with no acute fracture or suspicious osteolytic lesions.

### 💡 Impression & What This Means for You
1. **Normal Chest Radiograph:** No evidence of active cardiopulmonary disease, infection, or pneumonia.
2. Heart size is normal with no signs of cardiomegaly or pulmonary congestion.

### 🩺 Recommended Discussion with Your Physician
- Confirm that cough symptoms are likely benign/upper-respiratory given clear lung findings.`,
        parameters: []
    },

    // 4. Thyroid Biopsy / Cytology (Pathology)
    {
        id: 104,
        category: "PATHOLOGY",
        reportType: "PATH_CYTOLOGY",
        fileName: "Thyroid_FNA_Cytology_Report.pdf",
        uploadedAt: "2026-02-24T11:00:00",
        summaryText: `### 🔬 Pathology & Biopsy Report: Thyroid Ultrasound-Guided FNA

### 🔬 Specimen & Procedure Overview
- **Specimen:** Right thyroid lobe nodule (1.4 cm) fine-needle aspiration (FNA).
- **Method:** 25-gauge ultrasound-guided aspiration; ThinPrep and direct smears evaluated.

### 🧫 Pathological Findings & Diagnosis
- **Bethesda Classification:** **Category II: Benign** (Benign Follicular Nodule).
- **Cellular Features:** Abundant colloid with monolayered sheets of benign follicular cells. No nuclear grooves, pseudo-inclusions, or papillary features.

### 📏 Margin & Biomarker Status
- Benign colloid nodule without atypia. Risk of malignancy is clinically estimated at <3%.

### 🩺 Next Steps & Doctor Discussion Points
1. Routine annual ultrasound follow-up to monitor nodule size stability. No surgical intervention required at this stage.`,
        parameters: []
    },

    // 5. Hospital Discharge Summary (Clinical)
    {
        id: 105,
        category: "CLINICAL",
        reportType: "CLINICAL_DISCHARGE",
        fileName: "Cardiology_Hospital_Discharge_Summary.pdf",
        uploadedAt: "2026-02-25T16:45:00",
        summaryText: `### 🏥 Clinical Record: Hospital Discharge Summary & Care Plan

### 🏥 Clinical Overview & Primary Diagnosis
- **Admission Diagnosis:** Acute symptomatic Stage 1 hypertension and palpitations.
- **Hospital Course:** Patient monitored in cardiology observation unit. Serial ECGs confirmed normal sinus rhythm. Blood pressure controlled on medication.

### 💊 Medications & Treatment Plan
1. **Amlodipine (Norvasc):** 5 mg orally once daily in the morning for blood pressure control.
2. **Metformin:** 500 mg orally twice daily with meals for glycemic regulation.
3. **Atorvastatin (Lipitor):** 20 mg orally once daily at bedtime for cholesterol optimization.

### ⚠️ Red-Flag Warning Signs
Seek immediate emergency medical attention if you experience:
- Severe crushing chest pain radiating to the left arm or jaw.
- Sudden severe shortness of breath or fainting (syncope).
- Systolic BP readings persistently above 180 mmHg or diastolic above 110 mmHg.

### 📅 Follow-Up & Lifestyle Care Plan
- **Primary Care Follow-Up:** Appointment in 2 weeks for repeat blood pressure and kidney function check.
- **Dietary Sodium:** Restrict sodium to under 2,000 mg/day (DASH diet principles).`,
        parameters: []
    }
];

export const MOCK_COMPARISON = {
    currentReportId: 102,
    previousReportId: 101,
    comparisons: [
        {
            parameterName: "BP_SYSTOLIC",
            currentValue: 138.0,
            previousValue: 122.0,
            difference: 16.0,
            percentChange: 13.1,
            trend: "INCREASED",
            unit: "mmHg",
            interpretation: "Your systolic blood pressure increased by 16.0 mmHg into Stage 1 hypertension range. Monitor daily at home."
        },
        {
            parameterName: "BP_DIASTOLIC",
            currentValue: 88.0,
            previousValue: 78.0,
            difference: 10.0,
            percentChange: 12.8,
            trend: "INCREASED",
            unit: "mmHg",
            interpretation: "Your diastolic blood pressure increased by 10.0 mmHg. Reduce sodium and engage in daily aerobic exercise."
        },
        {
            parameterName: "GLUCOSE_FASTING",
            currentValue: 114.0,
            previousValue: 94.0,
            difference: 20.0,
            percentChange: 21.3,
            trend: "INCREASED",
            unit: "mg/dL",
            interpretation: "Fasting glucose increased by 20.0 mg/dL into the pre-diabetes bracket (100–125 mg/dL)."
        },
        {
            parameterName: "HBA1C",
            currentValue: 5.9,
            previousValue: 5.4,
            difference: 0.5,
            percentChange: 9.3,
            trend: "INCREASED",
            unit: "%",
            interpretation: "Your 3-month HbA1c increased from 5.4% to 5.9% reflecting higher average blood glucose."
        },
        {
            parameterName: "CHOLESTEROL_TOTAL",
            currentValue: 208.0,
            previousValue: 182.0,
            difference: 26.0,
            percentChange: 14.3,
            trend: "INCREASED",
            unit: "mg/dL",
            interpretation: "Total cholesterol increased above the 200 mg/dL guideline limit."
        },
        {
            parameterName: "LDL",
            currentValue: 122.0,
            previousValue: 98.0,
            difference: 24.0,
            percentChange: 24.5,
            trend: "INCREASED",
            unit: "mg/dL",
            interpretation: "LDL ('bad') cholesterol rose to 122 mg/dL. Consider dietary modifications."
        },
        {
            parameterName: "HEMOGLOBIN",
            currentValue: 14.0,
            previousValue: 14.2,
            difference: -0.2,
            percentChange: -1.4,
            trend: "STABLE",
            unit: "g/dL",
            interpretation: "Your hemoglobin remains completely stable and healthy at 14.0 g/dL."
        },
        {
            parameterName: "CREATININE",
            currentValue: 0.92,
            previousValue: 0.88,
            difference: 0.04,
            percentChange: 4.5,
            trend: "STABLE",
            unit: "mg/dL",
            interpretation: "Kidney filtration rate (creatinine) is stable and well within normal reference ranges."
        }
    ]
};

export const MOCK_TIMELINE = {
    items: [
        {
            id: 5,
            date: "2026-02-25T16:45:00",
            category: "CLINICAL",
            type: "CLINICAL_DISCHARGE",
            title: "Hospital Discharge Summary & Care Plan",
            description: "Cardiology observation course. Prescribed Amlodipine 5mg, Metformin 500mg, Atorvastatin 20mg.",
            reportId: 105
        },
        {
            id: 4,
            date: "2026-02-24T11:00:00",
            category: "PATHOLOGY",
            type: "PATH_CYTOLOGY",
            title: "Thyroid Nodule FNA Cytology",
            description: "Ultrasound-guided biopsy confirmed Bethesda Category II (Benign Colloid Nodule).",
            reportId: 104
        },
        {
            id: 3,
            date: "2026-02-22T14:30:00",
            category: "RADIOLOGY",
            type: "RAD_XRAY",
            title: "Digital Chest X-Ray PA & Lateral",
            description: "Clear lungs bilaterally without consolidation or effusion. Normal heart size.",
            reportId: 103
        },
        {
            id: 2,
            date: "2026-02-20T10:15:00",
            category: "LABORATORY",
            type: "LAB_CMP",
            title: "Follow-Up Metabolic & Lipid Panel",
            description: "Follow-up blood test showing elevated BP (138/88), Fasting Glucose (114 mg/dL), and HbA1c (5.9%).",
            reportId: 102
        },
        {
            id: 1,
            date: "2026-01-15T09:30:00",
            category: "LABORATORY",
            type: "LAB_CMP",
            title: "Baseline Comprehensive Metabolic Panel",
            description: "Routine annual checkup panel. BP (122/78), Fasting Glucose (94 mg/dL), Total Cholesterol (182 mg/dL).",
            reportId: 101
        }
    ]
};

export const MOCK_TRENDS_MAP = {
    BP_SYSTOLIC: [
        { date: "2025-10-10T09:00:00", value: 120, unit: "mmHg", reportId: 99 },
        { date: "2025-11-22T10:00:00", value: 124, unit: "mmHg", reportId: 100 },
        { date: "2026-01-15T09:30:00", value: 122, unit: "mmHg", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 138, unit: "mmHg", reportId: 102 }
    ],
    BP_DIASTOLIC: [
        { date: "2025-10-10T09:00:00", value: 76, unit: "mmHg", reportId: 99 },
        { date: "2025-11-22T10:00:00", value: 80, unit: "mmHg", reportId: 100 },
        { date: "2026-01-15T09:30:00", value: 78, unit: "mmHg", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 88, unit: "mmHg", reportId: 102 }
    ],
    GLUCOSE_FASTING: [
        { date: "2025-10-10T09:00:00", value: 91, unit: "mg/dL", reportId: 99 },
        { date: "2025-11-22T10:00:00", value: 95, unit: "mg/dL", reportId: 100 },
        { date: "2026-01-15T09:30:00", value: 94, unit: "mg/dL", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 114, unit: "mg/dL", reportId: 102 }
    ],
    HBA1C: [
        { date: "2025-10-10T09:00:00", value: 5.3, unit: "%", reportId: 99 },
        { date: "2026-01-15T09:30:00", value: 5.4, unit: "%", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 5.9, unit: "%", reportId: 102 }
    ],
    HEMOGLOBIN: [
        { date: "2025-10-10T09:00:00", value: 14.4, unit: "g/dL", reportId: 99 },
        { date: "2026-01-15T09:30:00", value: 14.2, unit: "g/dL", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 14.0, unit: "g/dL", reportId: 102 }
    ],
    CHOLESTEROL_TOTAL: [
        { date: "2025-10-10T09:00:00", value: 178, unit: "mg/dL", reportId: 99 },
        { date: "2026-01-15T09:30:00", value: 182, unit: "mg/dL", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 208, unit: "mg/dL", reportId: 102 }
    ],
    LDL: [
        { date: "2025-10-10T09:00:00", value: 95, unit: "mg/dL", reportId: 99 },
        { date: "2026-01-15T09:30:00", value: 98, unit: "mg/dL", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 122, unit: "mg/dL", reportId: 102 }
    ],
    HDL: [
        { date: "2025-10-10T09:00:00", value: 54, unit: "mg/dL", reportId: 99 },
        { date: "2026-01-15T09:30:00", value: 52, unit: "mg/dL", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 48, unit: "mg/dL", reportId: 102 }
    ],
    CREATININE: [
        { date: "2025-10-10T09:00:00", value: 0.85, unit: "mg/dL", reportId: 99 },
        { date: "2026-01-15T09:30:00", value: 0.88, unit: "mg/dL", reportId: 101 },
        { date: "2026-02-20T10:15:00", value: 0.92, unit: "mg/dL", reportId: 102 }
    ]
};

export const generateMockAiChatResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Radiology / X-Ray questions
    if (q.includes("x-ray") || q.includes("xray") || q.includes("chest") || q.includes("lungs") || q.includes("radiology")) {
        return {
            answer: `### 🩻 Chest Radiograph (X-Ray) Review & Explanation

Based on your **February 22, 2026 Chest X-Ray (PA & Lateral)**:

- **Lungs:** Completely clear bilaterally. There are no signs of consolidation (pneumonia), pleural fluid/effusion, or pneumothorax.
- **Heart:** Normal size (cardiothoracic ratio < 0.50), with normal mediastinal contours.
- **Bones:** Intact ribs and spine without acute fractures.

**Summary in Plain English:**
Your chest X-ray is **normal**. There is no lung infection or heart enlargement. Your mild cough symptoms are consistent with benign upper-airway irritation rather than lung disease.`,
            sources: [
                {
                    reportId: 103,
                    reportType: "RAD_XRAY",
                    uploadedAt: "2026-02-22T14:30:00",
                    snippet: "2-View Chest Radiograph: Clear lungs bilaterally, normal cardiothoracic ratio <0.50, no focal consolidation."
                }
            ]
        };
    }

    // 2. Pathology / Biopsy questions
    if (q.includes("biopsy") || q.includes("thyroid") || q.includes("nodule") || q.includes("pathology") || q.includes("fna") || q.includes("cancer")) {
        return {
            answer: `### 🔬 Thyroid Nodule Biopsy (FNA) Findings

Reviewing your **February 24, 2026 Thyroid Fine-Needle Aspiration Report**:

- **Biopsy Site:** Right thyroid lobe nodule (1.4 cm).
- **Classification:** **Bethesda Category II — Benign** (Benign Colloid Nodule).
- **Cellular Analysis:** The sample showed benign follicular cells and normal colloid with **no cancerous or atypical cells**.

**What this means for you:**
Your thyroid nodule is **benign (non-cancerous)**. The estimated risk of malignancy is extremely low (<3%). The standard care plan is routine ultrasound monitoring in 12 months without any surgery required.`,
            sources: [
                {
                    reportId: 104,
                    reportType: "PATH_CYTOLOGY",
                    uploadedAt: "2026-02-24T11:00:00",
                    snippet: "Thyroid FNA: Bethesda Category II Benign Follicular Colloid Nodule. No nuclear grooves or atypical features."
                }
            ]
        };
    }

    // 3. Discharge & Prescriptions questions
    if (q.includes("discharge") || q.includes("medication") || q.includes("medicine") || q.includes("prescription") || q.includes("amlodipine") || q.includes("metformin") || q.includes("lipitor")) {
        return {
            answer: `### 🏥 Hospital Discharge & Medication Summary

From your **February 25, 2026 Cardiology Discharge Record**:

**Active Prescription Regimen:**
1. **Amlodipine 5 mg:** Once daily in the morning (Controls Blood Pressure).
2. **Metformin 500 mg:** Twice daily with meals (Regulates Fasting Blood Sugar).
3. **Atorvastatin (Lipitor) 20 mg:** Once daily at bedtime (Optimizes Cholesterol & Lipids).

**Important Red-Flag Symptoms (Seek Immediate Care if experienced):**
- Severe crushing chest pressure or pain radiating to the left arm.
- Sudden shortness of breath or dizziness.
- Systolic blood pressure exceeding 180 mmHg.

**Follow-Up:** Primary physician visit scheduled in 2 weeks for repeat blood pressure check.`,
            sources: [
                {
                    reportId: 105,
                    reportType: "CLINICAL_DISCHARGE",
                    uploadedAt: "2026-02-25T16:45:00",
                    snippet: "Cardiology Discharge: Amlodipine 5mg QD, Metformin 500mg BID, Atorvastatin 20mg QHS. Follow-up in 2 weeks."
                }
            ]
        };
    }

    // 4. Blood Pressure questions
    if (q.includes("blood pressure") || q.includes("bp") || q.includes("systolic") || q.includes("diastolic")) {
        return {
            answer: `### 🩺 Blood Pressure Longitudinal Trajectory

Comparing your **January 2026** and **February 2026** blood panels:

| Metric | Jan 15, 2026 | Feb 20, 2026 | Shift | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Systolic BP** | 122 mmHg | 138 mmHg | **+16 mmHg (+13.1%)** | ⚠️ Stage 1 High |
| **Diastolic BP** | 78 mmHg | 88 mmHg | **+10 mmHg (+12.8%)** | ⚠️ Stage 1 High |

**Clinical Context:**
Your blood pressure shifted upward into Stage 1 hypertension. In response, your physician initiated Amlodipine 5mg on your February 25 discharge plan. Maintain a low-sodium diet and log your home BP readings twice daily.`,
            sources: [
                {
                    reportId: 102,
                    reportType: "LAB_CMP",
                    uploadedAt: "2026-02-20T10:15:00",
                    snippet: "BP: 138/88 mmHg, Fasting Glucose: 114 mg/dL, HbA1c: 5.9%"
                },
                {
                    reportId: 101,
                    reportType: "LAB_CMP",
                    uploadedAt: "2026-01-15T09:30:00",
                    snippet: "BP: 122/78 mmHg, Fasting Glucose: 94 mg/dL, Total Cholesterol: 182 mg/dL"
                }
            ]
        };
    }

    // 5. Glucose & Diabetes questions
    if (q.includes("glucose") || q.includes("sugar") || q.includes("diabetes") || q.includes("hba1c")) {
        return {
            answer: `### 🩸 Glycemic Health & Diabetes Screening

Your laboratory panels indicate:
- **Fasting Blood Glucose:** Rose from **94 mg/dL** (Normal) to **114 mg/dL** (Pre-diabetes bracket: 100–125 mg/dL).
- **HbA1c:** Increased from **5.4%** to **5.9%** (Pre-diabetes indicator: 5.7%–6.4%).

**Actionable Insight:**
Your glycemic markers show early insulin resistance. Metformin 500mg BID was initiated to help restore glycemic balance alongside dietary carbohydrate moderation.`,
            sources: [
                {
                    reportId: 102,
                    reportType: "LAB_CMP",
                    uploadedAt: "2026-02-20T10:15:00",
                    snippet: "Fasting Glucose: 114 mg/dL, HbA1c: 5.9%, Lipid Panel: Total Cholesterol 208 mg/dL"
                }
            ]
        };
    }

    // Default intelligent multi-domain summary
    return {
        answer: `### 🩺 Comprehensive Clinical Summary across all Domains

Regarding your inquiry **"${query}"**:

Here is your health snapshot across all 4 uploaded domains:
1. **🧪 Lab Chemistry (Feb 20):** BP was 138/88 mmHg, Fasting Glucose 114 mg/dL, Total Cholesterol 208 mg/dL.
2. **🩻 Imaging (Feb 22):** Chest X-Ray was completely **normal** with clear lungs.
3. **🔬 Pathology (Feb 24):** Thyroid Nodule FNA was confirmed **benign** (Bethesda II).
4. **📋 Clinical (Feb 25):** Active medications are Amlodipine 5mg, Metformin 500mg, and Atorvastatin 20mg.`,
        sources: [
            {
                reportId: 105,
                reportType: "CLINICAL_DISCHARGE",
                uploadedAt: "2026-02-25T16:45:00",
                snippet: "Cardiology Discharge Care Plan"
            },
            {
                reportId: 104,
                reportType: "PATH_CYTOLOGY",
                uploadedAt: "2026-02-24T11:00:00",
                snippet: "Thyroid FNA Cytology: Benign"
            },
            {
                reportId: 103,
                reportType: "RAD_XRAY",
                uploadedAt: "2026-02-22T14:30:00",
                snippet: "Chest X-Ray: Normal"
            }
        ]
    };
};
