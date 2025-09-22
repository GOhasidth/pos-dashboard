const express = require('express');
const router = express.Router();
const salesCtrl = require('../controllers/salesController');

// Your SQL-powered endpoints:
router.get('/summary', salesCtrl.getSummary);         // period=today | month
router.get('/timeseries', salesCtrl.getTimeseries);   // period=yearly | quarter

module.exports = router;
