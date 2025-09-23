// src/services/apiService.js
import axios from "axios";



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getSalesSummary = (period = "today", ttl = 2) =>
  api.get("/sales/summary", { params: { period, ttl } }).then(r => r.data);

export const getSalesTimeseries = (period = "yearly", ttl = 2) =>
  api.get("/sales/timeseries", { params: { period, ttl } }).then(r => r.data);



export default {
  getSalesSummary,
  getSalesTimeseries,
  getTransactions,
  getPatternAnalysis,
};
