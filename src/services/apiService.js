// src/services/apiService.js
import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getSalesSummary = (period = "today", ttl = 2) =>
  api.get("/sales/summary", { params: { period, ttl } }).then(r => r.data);

export const getSalesTimeseries = (period = "yearly", ttl = 2) =>
  api.get("/sales/timeseries", { params: { period, ttl } }).then(r => r.data);

export const getTopProducts = (period = "today", ttl = 2, limit = 10) =>
  api.get("/products/top", { params: { period, ttl, limit } }).then(r => r.data);

export const getTransactions = (period = "today", ttl = 2) =>
  api.get("/transactions", { params: { period, ttl } }).then(r => r.data);

export default {
  getSalesSummary,
  getSalesTimeseries,
  getTopProducts,
  getTransactions,
};