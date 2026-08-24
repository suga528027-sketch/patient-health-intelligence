import axios from 'axios';
import { 
    DEMO_USER, 
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

// Local storage storage keys for demo persistence
const DEMO_REPORTS_KEY = 'demo_patient_reports';
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
                window.location.href = '/login';
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
            // If connection refused (backend down) and user tries demo credentials, fallback gracefully
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
            const user = { id: Date.now(), name, email, role: 'ROLE_PATIENT' };
            return user;
        }

        try {
            const response = await api.post('/auth/register', { name, email, password });
            return response.data;
        } catch (err) {
            if (!err.response) {
                // Fallback for offline demo
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
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate processing delay
            const reports = getStoredDemoReports();
            const newReport = {
                id: Date.now(),
                reportType: reportType || 'BLOOD_TEST',
                fileName: file ? file.name : 'Uploaded_Lab_Report.pdf',
                uploadedAt: new Date().toISOString(),
                summaryText: `### 📋 AI Medical Summary: ${file ? file.name : 'Uploaded Report'}\n\n` +
                    `**Overview:** Analysis completed using Gemini 2.5 Flash.\n\n` +
                    `**Key Observations:**\n` +
                    `- Blood pressure and glucose values processed.\n` +
                    `- Biomarkers indexed in Qdrant vector database for semantic retrieval.\n` +
                    (notes ? `\n**Patient Notes:** ${notes}\n` : '') +
                    `\n**Advice:** Review flagged values with your primary physician.`
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
                // Fallback to local demo upload if network fails
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
                const text = (r.summaryText + ' ' + r.fileName).toLowerCase();
                if (text.includes(q) || q.length === 0 || q.includes('sugar') || q.includes('glucose') || q.includes('bp') || q.includes('cholesterol')) {
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
            if (reports.length < 2) {
                return { message: "Upload at least 2 reports to generate a chronological biomarker comparison." };
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
            const items = reports.map((r, idx) => ({
                id: r.id,
                date: r.uploadedAt,
                type: 'REPORT',
                title: r.fileName.replace('.pdf', '').replace(/_/g, ' '),
                description: r.summaryText.split('\n').filter(l => l.trim() && !l.startsWith('#'))[0] || 'Medical Lab Report',
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
