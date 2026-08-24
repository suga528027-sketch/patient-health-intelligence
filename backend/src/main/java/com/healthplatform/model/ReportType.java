package com.healthplatform.model;

public enum ReportType {
    // 1. Laboratory and Blood Test Reports
    LAB_CBC("Complete Blood Count (CBC)", "LABORATORY", "🩸"),
    LAB_BMP("Basic Metabolic Panel (BMP)", "LABORATORY", "🧪"),
    LAB_CMP("Comprehensive Metabolic Panel (CMP)", "LABORATORY", "🧪"),
    LAB_LIPID("Lipid Profile (Cholesterol)", "LABORATORY", "🫀"),
    LAB_THYROID("Thyroid Hormone Panel", "LABORATORY", "🦋"),
    LAB_URINALYSIS("Urinalysis", "LABORATORY", "🔬"),
    LAB_COAGULATION("Coagulation / Clotting Profile", "LABORATORY", "🩸"),

    // 2. Diagnostic Imaging (Radiology) Reports
    RAD_XRAY("X-Ray Radiograph", "RADIOLOGY", "🩻"),
    RAD_MRI("Magnetic Resonance Imaging (MRI)", "RADIOLOGY", "🧠"),
    RAD_CT("Computed Tomography (CT Scan)", "RADIOLOGY", "🩻"),
    RAD_ULTRASOUND("Ultrasound (Sonography)", "RADIOLOGY", "🔊"),
    RAD_PET("Positron Emission Tomography (PET Scan)", "RADIOLOGY", "☢️"),
    RAD_ECG("Electrocardiogram (ECG / EKG)", "RADIOLOGY", "📈"),

    // 3. Pathology and Biopsy Reports
    PATH_SURGICAL("Surgical Pathology / Biopsy", "PATHOLOGY", "🔬"),
    PATH_CYTOLOGY("Cytology (Pap / FNA)", "PATHOLOGY", "🧫"),
    PATH_MOLECULAR("Molecular / DNA Pathology", "PATHOLOGY", "🧬"),

    // 4. Clinical and Summary Reports
    CLINICAL_DISCHARGE("Hospital Discharge Summary", "CLINICAL", "🏥"),
    CLINICAL_CONSULTATION("Specialist Consultation Note", "CLINICAL", "🩺"),
    CLINICAL_OPERATIVE("Operative / Surgical Report", "CLINICAL", "✂️"),
    CLINICAL_PRESCRIPTION("Prescription & Medication Record", "CLINICAL", "💊"),

    // Backward compatibility aliases for legacy records
    BLOOD_TEST("Blood Test Panel", "LABORATORY", "🩸"),
    PRESCRIPTION("Prescription Record", "CLINICAL", "💊"),
    DISCHARGE_SUMMARY("Discharge Summary", "CLINICAL", "🏥"),
    CONSULTATION("Consultation Note", "CLINICAL", "🩺"),
    OTHER("Other Medical Document", "CLINICAL", "📄");

    private final String displayName;
    private final String category;
    private final String icon;

    ReportType(String displayName, String category, String icon) {
        this.displayName = displayName;
        this.category = category;
        this.icon = icon;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getCategory() {
        return category;
    }

    public String getIcon() {
        return icon;
    }
}
