// Mock data for interactive demo mode & fallback on Vercel deployment

export const DEMO_USER = {
    id: 1,
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "ROLE_PATIENT"
};

export const INITIAL_REPORTS = [
    {
        id: 101,
        reportType: "BLOOD_TEST",
        fileName: "Blood_Test_Panel_Jan2026.pdf",
        uploadedAt: "2026-01-15T09:30:00",
        summaryText: `### 📋 Comprehensive Metabolic & Lipid Summary (Jan 15, 2026)

**Overview:**
Your routine blood work from January 2026 indicates overall good health with baseline biomarker levels within acceptable clinical ranges.

**Key Findings:**
- **Blood Pressure:** 122/78 mmHg (Optimal / Normal range).
- **Fasting Glucose:** 94 mg/dL (Normal fasting blood sugar, reference range: 70–100 mg/dL).
- **HbA1c:** 5.4% (Normal, indicates good glucose regulation over the prior 3 months).
- **Lipid Profile:** Total Cholesterol is 182 mg/dL with LDL at 98 mg/dL and HDL at 52 mg/dL.
- **Kidney Function:** Serum Creatinine is 0.88 mg/dL (Healthy renal filtration).
- **Hematology:** Hemoglobin is 14.2 g/dL (Normal oxygen-carrying capacity).

**Physician Discussion Points:**
Continue standard balanced dietary habits and regular moderate physical activity. Baseline established for future longitudinal comparisons.`,
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
    {
        id: 102,
        reportType: "BLOOD_TEST",
        fileName: "FollowUp_Blood_Panel_Feb2026.pdf",
        uploadedAt: "2026-02-20T10:15:00",
        summaryText: `### 📋 Follow-Up Metabolic & Lipid Summary (Feb 20, 2026)

**Overview:**
Your follow-up test shows notable elevation in blood pressure and fasting glucose compared to your January baseline.

**Key Findings:**
- ⚠️ **Blood Pressure:** 138/88 mmHg (Elevated / Stage 1 Hypertension threshold. Increased by +16/+10 mmHg).
- ⚠️ **Fasting Glucose:** 114 mg/dL (Pre-diabetes range, up from 94 mg/dL by +20 mg/dL).
- ⚠️ **HbA1c:** 5.9% (Pre-diabetes indicator, slightly elevated from 5.4%).
- **Total Cholesterol:** 208 mg/dL (Borderline high, increased from 182 mg/dL).
- **LDL Cholesterol:** 122 mg/dL (Elevated, up from 98 mg/dL).
- **HDL Cholesterol:** 48 mg/dL (Acceptable, slightly lower).
- **Serum Creatinine:** 0.92 mg/dL (Stable renal function).
- **Hemoglobin:** 14.0 g/dL (Stable).

**Layperson Guidance & Action Plan:**
1. **Dietary Adjustments:** Reduce sodium intake and refined carbohydrates.
2. **Exercise:** Aim for 30 minutes of aerobic activity 5 days a week.
3. **Follow-Up:** Schedule an appointment with your primary healthcare provider to review BP and fasting sugar trends.`,
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
            interpretation: "Your systolic blood pressure has increased by 16.0 mmHg compared to your last test. This moves into the elevated/Stage 1 hypertension category."
        },
        {
            parameterName: "BP_DIASTOLIC",
            currentValue: 88.0,
            previousValue: 78.0,
            difference: 10.0,
            percentChange: 12.8,
            trend: "INCREASED",
            unit: "mmHg",
            interpretation: "Your diastolic blood pressure has increased by 10.0 mmHg. Consider monitoring at home and reducing sodium intake."
        },
        {
            parameterName: "GLUCOSE_FASTING",
            currentValue: 114.0,
            previousValue: 94.0,
            difference: 20.0,
            percentChange: 21.3,
            trend: "INCREASED",
            unit: "mg/dL",
            interpretation: "Your fasting glucose has increased by 20.0 mg/dL into the pre-diabetes range (100–125 mg/dL)."
        },
        {
            parameterName: "HBA1C",
            currentValue: 5.9,
            previousValue: 5.4,
            difference: 0.5,
            percentChange: 9.3,
            trend: "INCREASED",
            unit: "%",
            interpretation: "Your HbA1c increased by 0.5%, reflecting a slight upward trend in average blood glucose."
        },
        {
            parameterName: "CHOLESTEROL_TOTAL",
            currentValue: 208.0,
            previousValue: 182.0,
            difference: 26.0,
            percentChange: 14.3,
            trend: "INCREASED",
            unit: "mg/dL",
            interpretation: "Total cholesterol has increased into the borderline high range (>200 mg/dL)."
        },
        {
            parameterName: "LDL",
            currentValue: 122.0,
            previousValue: 98.0,
            difference: 24.0,
            percentChange: 24.5,
            trend: "INCREASED",
            unit: "mg/dL",
            interpretation: "Your LDL ('bad') cholesterol increased by 24.0 mg/dL. Discuss lipid management strategies with your doctor."
        },
        {
            parameterName: "HEMOGLOBIN",
            currentValue: 14.0,
            previousValue: 14.2,
            difference: -0.2,
            percentChange: -1.4,
            trend: "STABLE",
            unit: "g/dL",
            interpretation: "Your hemoglobin is stable and healthy at 14.0 g/dL."
        },
        {
            parameterName: "CREATININE",
            currentValue: 0.92,
            previousValue: 0.88,
            difference: 0.04,
            percentChange: 4.5,
            trend: "STABLE",
            unit: "mg/dL",
            interpretation: "Your kidney filtration marker (creatinine) remains stable within normal parameters."
        }
    ]
};

export const MOCK_TIMELINE = {
    items: [
        {
            id: 2,
            date: "2026-02-20T10:15:00",
            type: "REPORT",
            title: "Follow-Up Blood Test Report",
            description: "Follow-up lab panel measuring BP (138/88), Fasting Glucose (114 mg/dL), HbA1c (5.9%), and Lipid panel.",
            reportId: 102
        },
        {
            id: 1,
            date: "2026-01-15T09:30:00",
            type: "REPORT",
            title: "Baseline Blood Test Report",
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

    if (q.includes("blood pressure") || q.includes("bp") || q.includes("systolic") || q.includes("diastolic")) {
        return {
            answer: `### 🩺 Blood Pressure Analysis & Comparison

Based on your uploaded records:

1. **January 15, 2026:** Your blood pressure was **122/78 mmHg** (Normal range).
2. **February 20, 2026:** Your blood pressure measured **138/88 mmHg** (Elevated / Stage 1 Hypertension threshold).

| Metric | Jan 15, 2026 | Feb 20, 2026 | Change | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Systolic BP** | 122 mmHg | 138 mmHg | **+16 mmHg (+13.1%)** | ⚠️ Elevated |
| **Diastolic BP** | 78 mmHg | 88 mmHg | **+10 mmHg (+12.8%)** | ⚠️ Elevated |

**Key Takeaways:**
- Your blood pressure has shifted upward into the elevated range.
- *Recommended Discussion with Doctor:* Discuss dietary sodium reduction, stress management, regular physical activity, and home BP logging before your next visit.`,
            sources: [
                {
                    reportId: 102,
                    reportType: "BLOOD_TEST",
                    uploadedAt: "2026-02-20T10:15:00",
                    snippet: "BP: 138/88 mmHg, Fasting Glucose: 114 mg/dL, HbA1c: 5.9%"
                },
                {
                    reportId: 101,
                    reportType: "BLOOD_TEST",
                    uploadedAt: "2026-01-15T09:30:00",
                    snippet: "BP: 122/78 mmHg, Fasting Glucose: 94 mg/dL, Total Cholesterol: 182 mg/dL"
                }
            ]
        };
    }

    if (q.includes("glucose") || q.includes("sugar") || q.includes("diabetes") || q.includes("hba1c")) {
        return {
            answer: `### 🩸 Fasting Glucose & Glycemic Health Summary

Here is the breakdown of your glucose metrics across your reports:

- **Fasting Glucose:** Increased from **94 mg/dL** (Jan 2026) to **114 mg/dL** (Feb 2026) — an increase of **+20 mg/dL (+21.3%)**.
  - Normal range: 70–100 mg/dL.
  - Pre-diabetes threshold: 100–125 mg/dL.
- **HbA1c:** Increased slightly from **5.4%** to **5.9%** (Pre-diabetes range: 5.7%–6.4%).

**What this means:**
Your body is showing early signs of increased insulin resistance. Lifestyle modifications like cutting sugary beverages, eating high-fiber meals, and daily 30-min walking can often restore these metrics to normal.`,
            sources: [
                {
                    reportId: 102,
                    reportType: "BLOOD_TEST",
                    uploadedAt: "2026-02-20T10:15:00",
                    snippet: "Fasting Glucose: 114 mg/dL, HbA1c: 5.9%, Lipid Panel: Total Cholesterol 208 mg/dL"
                }
            ]
        };
    }

    if (q.includes("cholesterol") || q.includes("lipid") || q.includes("ldl") || q.includes("hdl")) {
        return {
            answer: `### 🫀 Lipid & Cholesterol Profile Comparison

Your lipid numbers showed changes between your two panels:

- **Total Cholesterol:** Went from **182 mg/dL** (Desirable) to **208 mg/dL** (Borderline High, >200).
- **LDL ("Bad") Cholesterol:** Increased from **98 mg/dL** (Optimal) to **122 mg/dL** (Borderline Elevated).
- **HDL ("Good") Cholesterol:** 52 mg/dL ➔ 48 mg/dL (Still above the minimum 40 mg/dL threshold).

**Actionable Insight:**
Consider increasing soluble fiber intake (oats, legumes) and replacing saturated fats with healthy unsaturated fats (olive oil, avocados, nuts).`,
            sources: [
                {
                    reportId: 102,
                    reportType: "BLOOD_TEST",
                    uploadedAt: "2026-02-20T10:15:00",
                    snippet: "Total Cholesterol: 208 mg/dL, LDL: 122 mg/dL, HDL: 48 mg/dL"
                }
            ]
        };
    }

    if (q.includes("compare") || q.includes("difference") || q.includes("overall") || q.includes("summary")) {
        return {
            answer: `### 📊 Full Trajectory Comparison (Jan 2026 vs. Feb 2026)

Here is a side-by-side comparison of your biomarkers:

| Biomarker | Jan 2026 | Feb 2026 | Delta | Health Trend |
| :--- | :--- | :--- | :--- | :--- |
| **Systolic BP** | 122 mmHg | 138 mmHg | **+16 mmHg** | ⚠️ Higher Risk |
| **Diastolic BP** | 78 mmHg | 88 mmHg | **+10 mmHg** | ⚠️ Higher Risk |
| **Fasting Glucose**| 94 mg/dL | 114 mg/dL | **+20 mg/dL**| ⚠️ Pre-diabetes |
| **HbA1c** | 5.4% | 5.9% | **+0.5%** | ⚠️ Elevated |
| **Total Cholesterol**| 182 mg/dL| 208 mg/dL | **+26 mg/dL**| ⚠️ Borderline |
| **LDL Cholesterol** | 98 mg/dL | 122 mg/dL | **+24 mg/dL**| ⚠️ Elevated |
| **HDL Cholesterol** | 52 mg/dL | 48 mg/dL | **-4 mg/dL** | ℹ️ Mild Dip |
| **Hemoglobin** | 14.2 g/dL| 14.0 g/dL | **-0.2 g/dL**|  Stable |
| **Creatinine** | 0.88 mg/dL| 0.92 mg/dL| **+0.04 mg/dL**|  Stable |

**Primary Advice:**
Both metabolic (glucose) and cardiovascular (blood pressure/lipids) markers increased together. We recommend reviewing these findings with your physician.`,
            sources: [
                {
                    reportId: 102,
                    reportType: "BLOOD_TEST",
                    uploadedAt: "2026-02-20T10:15:00",
                    snippet: "Comprehensive metabolic panel and lipid profile follow-up"
                },
                {
                    reportId: 101,
                    reportType: "BLOOD_TEST",
                    uploadedAt: "2026-01-15T09:30:00",
                    snippet: "Baseline annual metabolic panel"
                }
            ]
        };
    }

    // Default intelligent response
    return {
        answer: `### 🩺 AI Health Assistant Response

Regarding your question **"${query}"**:

Reviewing your uploaded records, here are the relevant details:
- **Latest Record (Feb 20, 2026):** Blood Pressure: 138/88 mmHg, Fasting Glucose: 114 mg/dL, HbA1c: 5.9%, Total Cholesterol: 208 mg/dL.
- **Previous Record (Jan 15, 2026):** Blood Pressure: 122/78 mmHg, Fasting Glucose: 94 mg/dL, Total Cholesterol: 182 mg/dL.

Your kidney markers (Creatinine 0.92 mg/dL) and Hemoglobin (14.0 g/dL) are completely stable. However, your cardiovascular and metabolic markers show an upward trend that is best addressed through diet, exercise, and consultation with your healthcare provider.`,
        sources: [
            {
                reportId: 102,
                reportType: "BLOOD_TEST",
                uploadedAt: "2026-02-20T10:15:00",
                snippet: "Comprehensive blood test panel analysis with Gemini 2.5 Flash"
            }
        ]
    };
};
