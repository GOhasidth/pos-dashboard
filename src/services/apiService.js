// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

export const apiService = {
    getSalesSummary: async (period = 'today') => {
        const response = await api.get(`/sales-summary/${period}`);
        return response.data;
    },

    getPatternAnalysis: async () => {
        const response = await api.get('/pattern-analysis');
        return response.data;
    },

    getTransactions: async () => {
        const response = await api.get('/transactions');
        return response.data;
    }
};

export default apiService;