// controllers/salesController.js
const { connectToDatabase, sql } = require('../config/database');

// =============== SUMMARY (today, month) =================
async function getSummary(req, res) {
  try {
    const period = (req.query.period || 'today').toLowerCase();
    const ttl = Number(req.query.ttl) || 2;
    const pool = await connectToDatabase();

    if (period === 'today') {
      // Your "latest daily" — F1031='D' and F254 = MAX(F254) for this store
      const q = await pool.request()
        .input('ttl', sql.Int, ttl)
        .query(`
          WITH last_day AS (
            SELECT CAST(MAX(F254) AS date) AS d
            FROM STORESQL.dbo.RPT_FIN
            WHERE F1034 = @ttl AND F1031 = 'D'
          )
          SELECT
            d AS start_date,
            d AS end_date,
            SUM(CAST(F64 AS decimal(18,2)))    AS total_units,
            SUM(CAST(F65 AS decimal(18,2)))    AS total_sales,
            COUNT(*)                            AS transactions
          FROM STORESQL.dbo.RPT_FIN r
          CROSS JOIN last_day ld
          WHERE r.F1034 = @ttl
            AND r.F1031 = 'D'
            AND CAST(r.F254 AS date) = ld.d
        `);

      const x = q.recordset[0] || {};
      const avg = x.transactions ? Number((Number(x.total_sales||0)/Number(x.transactions)).toFixed(2)) : 0;
      return res.json({
        period: 'today',
        startDate: x.start_date, endDate: x.end_date,
        totalSales: Number(x.total_sales||0),
        totalUnits: Number(x.total_units||0),
        transactions: Number(x.transactions||0),
        avgOrder: avg
      });
    }

   

// =============== TIMESERIES (yearly, quarter) =================
    if (period === 'month') {
      const q = await pool.request()
        .input('ttl', sql.Int, ttl)
        .query(`
          WITH bm AS (
            SELECT
              DATEADD(DAY, 1, EOMONTH(GETDATE(), -2)) AS s,   -- first day of previous month
              DATEADD(DAY, 1, EOMONTH(GETDATE(), -1)) AS e    -- first day of current month
          )
          SELECT
            s AS start_date,
            DATEADD(DAY, -1, e) AS end_date,
            SUM(CAST(F64 AS decimal(18,2))) AS total_units,
            SUM(CAST(F65 AS decimal(18,2))) AS total_sales,
            COUNT(*)                        AS transactions
          FROM STORESQL.dbo.RPT_FIN r
          CROSS JOIN bm
          WHERE r.F254 >= s AND r.F254 < e
            AND r.F1034 = @ttl
            AND r.F1031 = 'D';
        `);

      const x = q.recordset[0] || {};
      const avg = x.transactions ? Number((Number(x.total_sales||0)/Number(x.transactions)).toFixed(2)) : 0;

      return res.json({
        period: 'month',
        startDate: x.start_date, endDate: x.end_date,
        totalSales: Number(x.total_sales||0),
        totalUnits: Number(x.total_units||0),
        transactions: Number(x.transactions||0),
        avgOrder: avg
      });
    }

    return res.status(400).json({ error: "period must be 'today' or 'month' on this endpoint." });
  } catch (e) {
    console.error('summary error:', e);
    res.status(500).json({ error: e.message });
  }
}

// =============== TIMESERIES (yearly, quarter) =================
async function getTimeseries(req, res) {
  try {
    const period = (req.query.period || 'yearly').toLowerCase();
    const ttl = Number(req.query.ttl) || 2;
    const pool = await connectToDatabase();

    if (period === 'yearly') {
      // Your "Business Year (last year)" using monthly grain F1031='M'
      const q = await pool.request()
        .input('ttl', sql.Int, ttl)
        .query(`
          SELECT
            DATEFROMPARTS(YEAR(CAST(F254 AS date)), MONTH(CAST(F254 AS date)), 1) AS month_start,
            SUM(CAST(F64 AS bigint))                    AS units_sold,
            SUM(CAST(F65 AS decimal(18,2)))             AS sales_amount
          FROM STORESQL.dbo.RPT_FIN
          WHERE F254 >= DATEFROMPARTS(YEAR(GETDATE()) - 1, 1, 1)
            AND F254 <  DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
            AND F1034 = @ttl
            AND F1031 = 'M'
          GROUP BY DATEFROMPARTS(YEAR(CAST(F254 AS date)), MONTH(CAST(F254 AS date)), 1)
          ORDER BY month_start;
        `);

      return res.json({
        period: 'yearly',
        series: q.recordset.map(r => ({
          month_start: r.month_start,
          units: Number(r.units_sold || 0),
          sales: Number(r.sales_amount || 0),
          label: new Date(r.month_start).toLocaleString('en-US', { month: 'short' }) // Jan..Dec
        }))
      });
    }

    if (period === 'quarter') {
      // Your "last quarter" timeseries (three months)
      const q = await pool.request()
        .input('ttl', sql.Int, ttl)
        .query(`
          ;WITH ymon AS (
            SELECT
                DATEFROMPARTS(YEAR(CAST(F254 AS date)), MONTH(CAST(F254 AS date)), 1) AS month_start,
                SUM(CAST(F64 AS bigint))                    AS units_sold,
                SUM(CAST(F65 AS decimal(18,2)))             AS sales_amount
            FROM STORESQL.dbo.RPT_FIN
            WHERE F1034 = @ttl
              AND F1031 IN ('M')
              AND YEAR(CAST(F254 AS date)) = YEAR(DATEADD(quarter, -1, GETDATE()))
            GROUP BY DATEFROMPARTS(YEAR(CAST(F254 AS date)), MONTH(CAST(F254 AS date)), 1)
          )
          SELECT month_start, units_sold, sales_amount
          FROM ymon
          WHERE DATEPART(quarter, month_start) = DATEPART(quarter, DATEADD(quarter, -1, GETDATE()))
          ORDER BY month_start;
        `);

      return res.json({
        period: 'quarter',
        series: q.recordset.map(r => ({
          month_start: r.month_start,
          units: Number(r.units_sold || 0),
          sales: Number(r.sales_amount || 0),
          label: new Date(r.month_start).toLocaleString('en-US', { month: 'short' }) // 3 months
        }))
      });
    }

    return res.status(400).json({ error: "period must be 'yearly' or 'quarter' on this endpoint." });
  } catch (e) {
    console.error('timeseries error:', e);
    res.status(500).json({ error: e.message });
  }
}

module.exports = { getSummary, getTimeseries };
