// src/services/apiService.js
import axios from "axios";


// If you added CRA proxy ("proxy": "http://localhost:5000"),
// you can set baseURL to '/api'. Otherwise, keep the full URL.
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "/api"; // CRA proxy -> '/api'

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
