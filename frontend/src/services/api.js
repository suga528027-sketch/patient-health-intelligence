import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Add interceptor to handle expired/invalid tokens (401 or 403 response)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
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
        const formData = new FormData();
        formData.append('file', file);
        formData.append('reportType', reportType);
        if (notes) formData.append('notes', notes);
        
        const response = await api.post('/reports', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getReports: async () => {
        const response = await api.get('/reports');
        return response.data;
    },
    deleteReport: async (id) => {
        const response = await api.delete(`/reports/${id}`);
        return response.data;
    },
    downloadReportUrl: (id) => {
        return api.get(`/reports/${id}/download`, { responseType: 'blob' });
    },
    getReportSummary: async (id) => {
        const response = await api.get(`/reports/${id}/summary`);
        return response.data;
    },
    searchReports: async (query) => {
        const response = await api.get(`/search`, { params: { q: query } });
        return response.data;
    },
    getLatestComparison: async () => {
        const response = await api.get(`/comparison/latest`);
        return response.data;
    },
    sendChatMessage: async (message) => {
        const response = await api.post('/chat', { message });
        return response.data;
    },
    getTimeline: async () => {
        const response = await api.get(`/timeline`);
        return response.data;
    },
    getTrends: async (parameter) => {
        const response = await api.get(`/trends`, { params: { parameter } });
        return response.data;
    }
};

export default api;
