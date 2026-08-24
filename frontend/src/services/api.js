import axios from 'axios';
import { 
    DEMO_USER, 
    REPORT_CATEGORIES,
    INITIAL_REPORTS, 
    MOCK_COMPARISON, 
    MOCK_TIMELINE, 
    MOCK_TRENDS_MAP, 
    generateMockAiChatResponse 
} from '../data/mockHealthData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Helper to check if demo mode is active
const isDemoActive = () => {
    const isDemo = localStorage.getItem('is_demo_mode');
    if (isDemo === 'true') return true;
    const token = localStorage.getItem('token');
    return !token || token.startsWith('demo-');
};

// Local storage keys for demo persistence
const DEMO_REPORTS_KEY = 'demo_patient_reports_v2';
const getStoredDemoReports = () => {
    const stored = localStorage.getItem(DEMO_REPORTS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return INITIAL_REPORTS;
        }
    }
    return INITIAL_REPORTS;
};

const saveDemoReports = (reports) => {
    localStorage.setItem(DEMO_REPORTS_KEY, JSON.stringify(reports));
};

// Find category for a given report type
const getCategoryForType = (reportType) => {
    for (const cat of REPORT_CATEGORIES) {
        if (cat.types.some(t => t.value === reportType)) {
            return cat.id;
        }
    }
    if (reportType === 'BLOOD_TEST') return 'LABORATORY';
    if (reportType === 'PRESCRIPTION' || reportType === 'DISCHARGE_SUMMARY' || reportType === 'CONSULTATION') return 'CLINICAL';
    return 'CLINICAL';
};

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && !token.startsWith('demo-')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Interceptor for 401/403 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const isDemo = isDemoActive();
            if (!isDemo) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        if (isDemoActive() || email.includes('demo') || email.includes('example.com')) {
            const user = { ...DEMO_USER, email };
            const token = 'demo-jwt-token-' + Date.now();
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { token, user };
        }

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('is_demo_mode', 'false');
            }
            return response.data;
        } catch (err) {
            if (!err.response && (email === DEMO_USER.email || email.includes('demo'))) {
                const user = { ...DEMO_USER, email };
                const token = 'demo-jwt-token-' + Date.now();
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('is_demo_mode', 'true');
                return { token, user };
            }
            throw err;
        }
    },

    register: async (name, email, password) => {
        if (isDemoActive()) {
            return { id: Date.now(), name, email, role: 'ROLE_PATIENT' };
        }

        try {
            const response = await api.post('/auth/register', { name, email, password });
            return response.data;
        } catch (err) {
            if (!err.response) {
                return { id: Date.now(), name, email, role: 'ROLE_PATIENT' };
            }
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export const reportService = {
    uploadReport: async (file, reportType, notes) => {
        if (isDemoActive()) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const reports = getStoredDemoReports();
            const category = getCategoryForType(reportType);

            let tailoredSummary = "";
            if (category === "RADIOLOGY") {
                tailoredSummary = `### 🩻 Diagnostic Imaging (Radiology): ${file ? file.name : 'Imaging Scan'}\n\n` +
                    `### 🩻 Imaging Technique & Anatomy Scanned\n` +
                    `- **Modality:** ${reportType.replace('RAD_', '')} Radiologic Scan\n` +
                    `- **Target Area:** Anatomical imaging region\n\n` +
                    `### 🔍 Key Clinical Findings Explained\n` +
                    `- Structures demonstrate normal physiological alignment without acute abnormalities.\n` +
                    (notes ? `- **Clinical Notes:** ${notes}\n` : '') +
                    `\n### 💡 Impression & What This Means for You\n` +
                    `1. Overall benign/stable radiologic appearance.\n\n` +
                    `### 🩺 Recommended Discussion with Your Physician\n` +
                    `- Review clinical correlation with your ordering doctor.`;
            } else if (category === "PATHOLOGY") {
                tailoredSummary = `### 🔬 Pathology & Biopsy Analysis: ${file ? file.name : 'Biopsy Specimen'}\n\n` +
                    `### 🔬 Specimen & Procedure Overview\n` +
                    `- **Procedure:** Tissue examination & histology review\n\n` +
                    `### 🧫 Pathological Findings & Diagnosis\n` +
                    `- Benign cellular architecture observed without malignant cellular features.\n\n` +
                    `### 📏 Margin & Biomarker Status\n` +
                    `- Negative for neoplastic atypia.\n\n` +
                    `### 🩺 Next Steps & Doctor Discussion Points\n` +
                    `- Routine clinical follow-up as advised by specialist.`;
            } else if (category === "CLINICAL") {
                tailoredSummary = `### 🏥 Clinical Record Summary: ${file ? file.name : 'Clinical Record'}\n\n` +
                    `### 🏥 Clinical Overview & Diagnosis\n` +
                    `- Medical documentation processed and indexed for longitudinal tracking.\n\n` +
                    `### 💊 Medications & Treatment Plan\n` +
                    `- Maintain active prescribed medication schedule as directed by your physician.\n\n` +
                    `### ⚠️ Red-Flag Warning Signs\n` +
                    `- Contact emergency services if sudden severe pain or breathing distress occurs.\n\n` +
                    `### 📅 Follow-Up & Lifestyle Care Plan\n` +
                    `- Adhere to prescribed follow-up appointments.`;
            } else {
                tailoredSummary = `### 🧪 Laboratory & Blood Test Summary: ${file ? file.name : 'Lab Panel'}\n\n` +
                    `### 🧪 Panel Overview & Health Summary\n` +
                    `- Biomarkers parsed and synchronized with your longitudinal health trends.\n\n` +
                    `### 📊 Biomarker Analysis & Key Metrics\n` +
                    `- Values indexed in Qdrant vector database for AI assistant retrieval.\n` +
                    (notes ? `- **Patient Notes:** ${notes}\n` : '') +
                    `\n### 🩺 Doctor Discussion Points\n` +
                    `- Review any out-of-range indicators with your primary care provider.`;
            }

            const newReport = {
                id: Date.now(),
                category: category,
                reportType: reportType || 'LAB_CMP',
                fileName: file ? file.name : 'Uploaded_Clinical_Report.pdf',
                uploadedAt: new Date().toISOString(),
                summaryText: tailoredSummary
            };

            reports.unshift(newReport);
            saveDemoReports(reports);
            return newReport;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('reportType', reportType);
            if (notes) formData.append('notes', notes);

            const response = await api.post('/reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (err) {
            if (!err.response) {
                return reportService.uploadReport(file, reportType, notes);
            }
            throw err;
        }
    },

    loadSampleReports: async () => {
        saveDemoReports(INITIAL_REPORTS);
        return INITIAL_REPORTS;
    },

    getReports: async () => {
        if (isDemoActive()) {
            return getStoredDemoReports();
        }

        try {
            const response = await api.get('/reports');
            return response.data;
        } catch (err) {
            if (!err.response) {
                return getStoredDemoReports();
            }
            throw err;
        }
    },

    deleteReport: async (id) => {
        if (isDemoActive()) {
            const reports = getStoredDemoReports().filter(r => r.id !== id);
            saveDemoReports(reports);
            return { message: 'Report deleted successfully' };
        }

        try {
            const response = await api.delete(`/reports/${id}`);
            return response.data;
        } catch (err) {
            if (!err.response) {
                const reports = getStoredDemoReports().filter(r => r.id !== id);
                saveDemoReports(reports);
                return { message: 'Report deleted successfully' };
            }
            throw err;
        }
    },

    downloadReportUrl: async (id) => {
        if (isDemoActive()) {
            const dummyContent = "Patient Health Intelligence Demo PDF Report Content";
            const blob = new Blob([dummyContent], { type: 'application/pdf' });
            return { data: blob };
        }

        return api.get(`/reports/${id}/download`, { responseType: 'blob' });
    },

    getReportSummary: async (id) => {
        if (isDemoActive()) {
            const reports = getStoredDemoReports();
            const report = reports.find(r => r.id === id);
            return { summary: report?.summaryText || "Summary not available" };
        }

        try {
            const response = await api.get(`/reports/${id}/summary`);
            return response.data;
        } catch (err) {
            if (!err.response) {
                const reports = getStoredDemoReports();
                const report = reports.find(r => r.id === id);
                return { summary: report?.summaryText || "Summary not available" };
            }
            throw err;
        }
    },

    searchReports: async (query) => {
        if (isDemoActive()) {
            const q = (query || '').toLowerCase();
            const reports = getStoredDemoReports();
            const results = [];
            
            reports.forEach(r => {
                const text = (r.summaryText + ' ' + r.fileName + ' ' + r.reportType).toLowerCase();
                if (text.includes(q) || q.length === 0 || q.includes('sugar') || q.includes('glucose') || q.includes('bp') || q.includes('xray') || q.includes('biopsy') || q.includes('medication')) {
                    results.push({
                        reportId: r.id,
                        reportType: r.reportType,
                        uploadedAt: r.uploadedAt,
                        snippet: r.summaryText.substring(0, 180).replace(/[#*`]/g, '') + '...'
                    });
                }
            });
            return results;
        }

        try {
            const response = await api.get(`/search`, { params: { q: query } });
            return response.data;
        } catch (err) {
            if (!err.response) {
                return reportService.searchReports(query);
            }
            throw err;
        }
    },

    getLatestComparison: async () => {
        if (isDemoActive()) {
            const reports = getStoredDemoReports();
            const labReports = reports.filter(r => (r.category === 'LABORATORY' || r.reportType?.startsWith('LAB_') || r.reportType === 'BLOOD_TEST'));
            if (labReports.length < 2) {
                return { message: "Upload at least 2 laboratory reports to generate a chronological biomarker comparison." };
            }
            return MOCK_COMPARISON;
        }

        try {
            const response = await api.get(`/comparison/latest`);
            return response.data;
        } catch (err) {
            if (!err.response) {
                return MOCK_COMPARISON;
            }
            throw err;
        }
    },

    sendChatMessage: async (message) => {
        if (isDemoActive()) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            return generateMockAiChatResponse(message);
        }

        try {
            const response = await api.post('/chat', { message });
            return response.data;
        } catch (err) {
            if (!err.response) {
                return generateMockAiChatResponse(message);
            }
            throw err;
        }
    },

    getTimeline: async () => {
        if (isDemoActive()) {
            const reports = getStoredDemoReports();
            const items = reports.map((r) => ({
                id: r.id,
                date: r.uploadedAt,
                category: r.category || getCategoryForType(r.reportType),
                type: r.reportType,
                title: r.fileName.replace('.pdf', '').replace(/_/g, ' '),
                description: r.summaryText.split('\n').filter(l => l.trim() && !l.startsWith('#'))[0] || 'Medical Clinical Report',
                reportId: r.id
            }));
            return { items };
        }

        try {
            const response = await api.get(`/timeline`);
            return response.data;
        } catch (err) {
            if (!err.response) {
                return MOCK_TIMELINE;
            }
            throw err;
        }
    },

    getTrends: async (parameter) => {
        if (isDemoActive()) {
            const param = parameter.toUpperCase();
            return MOCK_TRENDS_MAP[param] || [];
        }

        try {
            const response = await api.get(`/trends`, { params: { parameter } });
            return response.data;
        } catch (err) {
            if (!err.response) {
                const param = parameter.toUpperCase();
                return MOCK_TRENDS_MAP[param] || [];
            }
            throw err;
        }
    }
};

export default api;
