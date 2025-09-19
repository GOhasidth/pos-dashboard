const express = require('express');
const cors = require('cors');
const { connectToDatabase, sql } = require('./config/database');   // ✅ not ./backend/...
const transactionsRouter = require('./routes/transactions');       // ✅ not ./backend/...


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ⬇️ PASTE THESE TWO LINES HERE
app.use('/api/transactions', transactionsRouter);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend API is working!' });
});

// TODAY (latest business day)
app.get('/api/sales-summary/today', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const ttl = Number(req.query.ttl) || 2; // 2 = Total Sales, 3 = Net Sales

    const request = pool.request();
    request.input('ttl', sql.Int, ttl);

    const result = await request.query(`
      ;WITH latest_day AS (
        SELECT MAX(CAST(F254 AS date)) AS d
        FROM dbo.RPT_FIN
        WHERE F1031='D' AND F1034=@ttl
      )
      SELECT
        ld.d AS business_date,
        ISNULL(s.total_units,0)  AS total_units,
        ISNULL(s.total_sales,0)  AS total_sales,
        ISNULL(t.transactions,0) AS transactions,
        CASE WHEN ISNULL(t.transactions,0)=0
             THEN 0
             ELSE CAST(ROUND(ISNULL(s.total_sales,0)/NULLIF(t.transactions,0),2) AS decimal(18,2))
        END                      AS avg_order
      FROM latest_day ld
      OUTER APPLY (
        SELECT SUM(CAST(F64 AS decimal(18,2))) AS total_units,
               SUM(CAST(F65 AS decimal(18,2))) AS total_sales
        FROM dbo.RPT_FIN
        WHERE F1031='D' AND F1034=@ttl AND CAST(F254 AS date)=ld.d
      ) s
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1032) AS transactions
        FROM (
          SELECT F1032 FROM dbo.SAL_HDR WHERE CAST(F254 AS date)=ld.d
          UNION ALL
          SELECT F1032 FROM dbo.SAL_REG WHERE CAST(F254 AS date)=ld.d
        ) q
      ) t;
    `);

    const r = result.recordset[0] || {};
    res.json({
      success: true,
      period: 'today',
      businessDate: r.business_date,
      data: {
        totalSales: Number(r.total_sales) || 0,
        totalUnits: Number(r.total_units) || 0,
        transactions: Number(r.transactions) || 0,
        avgOrder: Number(r.avg_order) || 0,
        activeCustomers: 0 // fill from RPT_CLT_D if you want, like in the /all endpoint
      }
    });
  } catch (error) {
    console.error('Today sales error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// WEEK (last 7 days)
app.get('/api/sales-summary/week', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const ttl = Number(req.query.ttl) || 2;
    const request = pool.request();
    request.input('ttl', sql.Int, ttl);

    const result = await request.query(`
      ;WITH prev_week AS (
        -- previous full week, Sunday..Saturday
        SELECT
          CAST(DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()) - 1, 0) AS date)               AS start_date,
          CAST(DATEADD(DAY, 6, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()) - 1, 0)) AS date) AS end_date
      )
      SELECT
        pw.start_date,
        pw.end_date,
        ISNULL(s.total_units,0)      AS total_units,
        ISNULL(s.total_sales,0)      AS total_sales,
        ISNULL(t.transactions,0)     AS transactions,
        CASE WHEN ISNULL(t.transactions,0)=0
             THEN 0
             ELSE CAST(ROUND(ISNULL(s.total_sales,0)/NULLIF(t.transactions,0),2) AS decimal(18,2))
        END                          AS avg_order,
        ISNULL(c.active_customers,0) AS active_customers
      FROM prev_week pw
      OUTER APPLY (
        SELECT SUM(CAST(F64 AS decimal(18,2))) AS total_units,
               SUM(CAST(F65 AS decimal(18,2))) AS total_sales
        FROM dbo.RPT_FIN
        WHERE F1031='D' AND F1034=@ttl
          AND CAST(F254 AS date) BETWEEN pw.start_date AND pw.end_date
      ) s
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1032) AS transactions
        FROM (
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_HDR
          UNION ALL
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_REG
        ) q
        WHERE q.d BETWEEN pw.start_date AND pw.end_date
      ) t
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1148) AS active_customers
        FROM dbo.RPT_CLT_D
        WHERE F1148 IS NOT NULL
          AND CAST(F254 AS date) BETWEEN pw.start_date AND pw.end_date
      ) c;
    `);

    const r = result.recordset[0] || {};
    res.json({
      success: true,
      period: 'week',
      startDate: r.start_date, endDate: r.end_date,
      data: {
        totalSales: Number(r.total_sales)||0,
        totalUnits: Number(r.total_units)||0,
        transactions: Number(r.transactions)||0,
        avgOrder: Number(r.avg_order)||0,
        activeCustomers: Number(r.active_customers)||0
      }
    });
  } catch (e) {
    console.error('Week sales error:', e);
    res.status(500).json({ success:false, error: e.message });
  }
});


// MONTH (last 30 days)
app.get('/api/sales-summary/month', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const ttl = Number(req.query.ttl) || 2;
    const request = pool.request();
    request.input('ttl', sql.Int, ttl);

    const result = await request.query(`
      ;WITH pm AS (
        SELECT
          CONVERT(date, DATEFROMPARTS(YEAR(EOMONTH(GETDATE(),-1)), MONTH(EOMONTH(GETDATE(),-1)), 1)) AS start_date,
          CONVERT(date, EOMONTH(GETDATE(),-1))                                                         AS end_date
      )
      SELECT
        pm.start_date, pm.end_date,
        ISNULL(s.total_units,0)      AS total_units,
        ISNULL(s.total_sales,0)      AS total_sales,
        ISNULL(t.transactions,0)     AS transactions,
        CASE WHEN ISNULL(t.transactions,0)=0
             THEN 0
             ELSE CAST(ROUND(ISNULL(s.total_sales,0)/NULLIF(t.transactions,0),2) AS decimal(18,2))
        END                          AS avg_order,
        ISNULL(c.active_customers,0) AS active_customers
      FROM pm
      OUTER APPLY (
        SELECT SUM(CAST(F64 AS decimal(18,2))) AS total_units,
               SUM(CAST(F65 AS decimal(18,2))) AS total_sales
        FROM dbo.RPT_FIN
        WHERE F1031='D' AND F1034=@ttl
          AND CAST(F254 AS date) BETWEEN pm.start_date AND pm.end_date
      ) s
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1032) AS transactions
        FROM (
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_HDR
          UNION ALL
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_REG
        ) q
        WHERE q.d BETWEEN pm.start_date AND pm.end_date
      ) t
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1148) AS active_customers
        FROM dbo.RPT_CLT_D
        WHERE F1148 IS NOT NULL
          AND CAST(F254 AS date) BETWEEN pm.start_date AND pm.end_date
      ) c;
    `);

    const r = result.recordset[0] || {};
    res.json({
      success: true,
      period: 'month',
      startDate: r.start_date, endDate: r.end_date,
      data: {
        totalSales: Number(r.total_sales)||0,
        totalUnits: Number(r.total_units)||0,
        transactions: Number(r.transactions)||0,
        avgOrder: Number(r.avg_order)||0,
        activeCustomers: Number(r.active_customers)||0
      }
    });
  } catch (e) {
    console.error('Month sales error:', e);
    res.status(500).json({ success:false, error: e.message });
  }
});


// QUARTER (last 90 days)
app.get('/api/sales-summary/quarter', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const ttl = Number(req.query.ttl) || 2;
    const request = pool.request();
    request.input('ttl', sql.Int, ttl);

    const result = await request.query(`
      ;WITH cur_q_start AS (
        SELECT DATEADD(QUARTER, DATEDIFF(QUARTER, 0, GETDATE()), 0) AS s
      ),
      pq AS (
        SELECT
          CONVERT(date, DATEADD(QUARTER, -1, s)) AS start_date,
          CONVERT(date, DATEADD(DAY, -1, s))     AS end_date
        FROM cur_q_start
      )
      SELECT
        pq.start_date, pq.end_date,
        ISNULL(s.total_units,0)      AS total_units,
        ISNULL(s.total_sales,0)      AS total_sales,
        ISNULL(t.transactions,0)     AS transactions,
        CASE WHEN ISNULL(t.transactions,0)=0
             THEN 0
             ELSE CAST(ROUND(ISNULL(s.total_sales,0)/NULLIF(t.transactions,0),2) AS decimal(18,2))
        END                          AS avg_order,
        ISNULL(c.active_customers,0) AS active_customers
      FROM pq
      OUTER APPLY (
        SELECT SUM(CAST(F64 AS decimal(18,2))) AS total_units,
               SUM(CAST(F65 AS decimal(18,2))) AS total_sales
        FROM dbo.RPT_FIN
        WHERE F1031='D' AND F1034=@ttl
          AND CAST(F254 AS date) BETWEEN pq.start_date AND pq.end_date
      ) s
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1032) AS transactions
        FROM (
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_HDR
          UNION ALL
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_REG
        ) q
        WHERE q.d BETWEEN pq.start_date AND pq.end_date
      ) t
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1148) AS active_customers
        FROM dbo.RPT_CLT_D
        WHERE F1148 IS NOT NULL
          AND CAST(F254 AS date) BETWEEN pq.start_date AND pq.end_date
      ) c;
    `);

    const r = result.recordset[0] || {};
    res.json({
      success: true,
      period: 'quarter',
      startDate: r.start_date, endDate: r.end_date,
      data: {
        totalSales: Number(r.total_sales)||0,
        totalUnits: Number(r.total_units)||0,
        transactions: Number(r.transactions)||0,
        avgOrder: Number(r.avg_order)||0,
        activeCustomers: Number(r.active_customers)||0
      }
    });
  } catch (e) {
    console.error('Quarter sales error:', e);
    res.status(500).json({ success:false, error: e.message });
  }
});


// YEARLY (last 365 days)
app.get('/api/sales-summary/yearly', async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const ttl = Number(req.query.ttl) || 2;
    const request = pool.request();
    request.input('ttl', sql.Int, ttl);

    const result = await request.query(`
      ;WITH py AS (
        SELECT
          CONVERT(date, DATEFROMPARTS(YEAR(GETDATE())-1, 1, 1))  AS start_date,
          CONVERT(date, DATEFROMPARTS(YEAR(GETDATE())-1,12,31))  AS end_date
      )
      SELECT
        py.start_date, py.end_date,
        ISNULL(s.total_units,0)      AS total_units,
        ISNULL(s.total_sales,0)      AS total_sales,
        ISNULL(t.transactions,0)     AS transactions,
        CASE WHEN ISNULL(t.transactions,0)=0
             THEN 0
             ELSE CAST(ROUND(ISNULL(s.total_sales,0)/NULLIF(t.transactions,0),2) AS decimal(18,2))
        END                          AS avg_order,
        ISNULL(c.active_customers,0) AS active_customers
      FROM py
      OUTER APPLY (
        SELECT SUM(CAST(F64 AS decimal(18,2))) AS total_units,
               SUM(CAST(F65 AS decimal(18,2))) AS total_sales
        FROM dbo.RPT_FIN
        WHERE F1031='D' AND F1034=@ttl
          AND CAST(F254 AS date) BETWEEN py.start_date AND py.end_date
      ) s
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1032) AS transactions
        FROM (
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_HDR
          UNION ALL
          SELECT F1032, CAST(F254 AS date) d FROM dbo.SAL_REG
        ) q
        WHERE q.d BETWEEN py.start_date AND py.end_date
      ) t
      OUTER APPLY (
        SELECT COUNT(DISTINCT F1148) AS active_customers
        FROM dbo.RPT_CLT_D
        WHERE F1148 IS NOT NULL
          AND CAST(F254 AS date) BETWEEN py.start_date AND py.end_date
      ) c;
    `);

    const r = result.recordset[0] || {};
    res.json({
      success: true,
      period: 'yearly',
      startDate: r.start_date, endDate: r.end_date,
      data: {
        totalSales: Number(r.total_sales)||0,
        totalUnits: Number(r.total_units)||0,
        transactions: Number(r.transactions)||0,
        avgOrder: Number(r.avg_order)||0,
        activeCustomers: Number(r.active_customers)||0
      }
    });
  } catch (e) {
    console.error('Yearly sales error:', e);
    res.status(500).json({ success:false, error: e.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- /api/test');
  console.log('- /api/transactions?period=today');
  console.log('- /api/sales-summary/today');
  console.log('- /api/sales-summary/week');
  console.log('- /api/sales-summary/month');
  console.log('- /api/sales-summary/quarter');
  console.log('- /api/sales-summary/yearly');
});