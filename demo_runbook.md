# AI Patient Health Intelligence Platform - MVP Demo Runbook

This document contains a step-by-step checklist and narration script to demonstrate the features of the patient-only health intelligence MVP.

---

## 📋 Step-by-Step Demo Checklist

- [ ] **1. Patient Registration**
  - Navigate to `http://localhost:5173/register`
  - Fill in Name, Email, and Password, then click Register.
- [ ] **2. Login**
  - Go to `http://localhost:5173/login`
  - Enter the registered credentials and login.
- [ ] **3. Upload First Blood Test Report**
  - Select "Blood Test" type.
  - Upload a PDF containing: `"BP: 126/82 mmHg, Fasting Glucose: 102 mg/dL"`.
  - Click "Upload Report" and wait for parsing and summarization.
- [ ] **4. Upload Second Blood Test Report**
  - Select "Blood Test" type.
  - Upload a PDF containing: `"BP: 140/90 mmHg, Fasting Glucose: 118 mg/dL"`.
  - Click "Upload Report".
- [ ] **5. View Latest Summary & Parameter Comparison**
  - Click "View Summary" on the latest report row.
  - Verify that the Gemini summary is displayed.
  - Scroll down to check the "Comparison with your previous report" section.
  - Confirm color-coded alerts (e.g., Red for increased blood pressure/glucose).
- [ ] **6. Chat with the AI Assistant**
  - Navigate to the **AI Assistant** tab.
  - Ask: `"Has my blood pressure increased compared to last time?"`
  - Ask: `"Compare my latest blood test with my previous one."`
  - Verify that the assistant responds with correct citations and references to the reports.
- [ ] **7. Chronological Timeline**
  - Go to the **Timeline** tab.
  - Review the chronological feed of reports and summaries.
- [ ] **8. Time-series Trends Chart**
  - Go to the **Trends** tab.
  - Select `Systolic Blood Pressure` or `Fasting Glucose` and review the line chart.

---

## 🎙️ Short Demo Narration Script

### Step 1: Registration & Login
> *"Welcome! I will now demonstrate the AI Patient Health Intelligence Platform. Let's start by registering a new patient profile and logging into our secure dashboard."*

### Step 2: Dashboard Overview & First Upload
> *"Now on the dashboard, let's upload our first blood test report. We select Blood Test and upload a PDF containing a blood pressure of 126/82 and fasting glucose of 102 mg/dL. The system automatically parses the text, computes chunks and embeddings for search, and invokes Gemini to generate a patient-friendly layperson summary."*

### Step 3: Second Upload (Triggering Trends)
> *"Next, we upload our second, more recent blood test report. This one contains a blood pressure of 140/90 and fasting glucose of 118 mg/dL. The platform processes this immediately, storing it chronologically."*

### Step 4: Comparison Section in Report Summary
> *"Let's click 'View Summary' on our latest report. Beyond the Gemini summary, you can see a dynamic comparison section comparing this report to our previous one. The system flags that our systolic blood pressure increased by 14 mmHg (highlighted in red for higher risk), and our fasting glucose increased by 16 mg/dL. It provides simple, layperson explanations for what these changes mean."*

### Step 5: AI Assistant RAG Q&A
> *"Let's navigate to the AI Assistant. I will ask: 'Has my blood pressure increased compared to last time?'. The RAG service automatically detects that I am asking about changes, queries the comparison backend, and feeds this structured context to Gemini. The assistant answers: 'Yes, your blood pressure increased compared to last time. Your systolic BP went from 126 to 140 mmHg (an increase of 14 mmHg) and your diastolic BP went from 82 to 90 mmHg.' It also includes clickable source citations at the bottom."*

### Step 6: Detailed Report Comparison Chat
> *"Let's ask the assistant to: 'Compare my latest blood test with my previous one.' The assistant utilizes the overlapping biomarkers to generate a clean summary table of our overall health trajectory, highlighting stable, improved, and worsening factors."*

### Step 7: Chronological Health Timeline
> *"If we navigate to the Timeline page, we see a clean, sorted feed of all our uploads. This gives us a birds-eye view of our entire medical history in chronological order."*

### Step 8: Time-series Trends Chart
> *"Finally, let's look at the Trends tab. Here, we can select Fasting Glucose or Blood Pressure to view a dynamic line chart of our values over time. This makes it easy to track long-term health changes visually. This completes the demo of the AI Patient Health Intelligence MVP!"*
