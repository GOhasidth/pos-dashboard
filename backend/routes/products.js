// routes/products.js
const express = require('express');
const router = express.Router();
const { sql, connectToDatabase } = require('../config/database');

// GET /api/products/top?period=today|week|month|quarter|yearly&ttl=2&limit=10
const getBoundsSql = `
-- returns @s (start) and @e (end) for the chosen period
SELECT
  CASE
    WHEN @period='today'   THEN CAST(GETDATE() AS date)
    WHEN @period='week'    THEN DATEADD(DAY,-7, DATEADD(DAY, 1 - DATEPART(WEEKDAY, CAST(GETDATE() AS date))
                                    + CASE WHEN @@DATEFIRST=7 AND DATEPART(WEEKDAY, GETDATE())=1 THEN -6 ELSE 0 END,
                                    CAST(GETDATE() AS date)))
    WHEN @period='month'   THEN DATEFROMPARTS(YEAR(EOMONTH(GETDATE(),-1)), MONTH(EOMONTH(GETDATE(),-1)), 1)
    WHEN @period='quarter' THEN DATEADD(QUARTER,-1, DATEADD(QUARTER, DATEDIFF(QUARTER,0,GETDATE()), 0))
    WHEN @period='yearly'  THEN DATEFROMPARTS(YEAR(GETDATE())-1,1,1)
  END AS s,
  CASE
    WHEN @period='today'   THEN DATEADD(DAY,1,CAST(GETDATE() AS date))
    WHEN @period='week'    THEN DATEADD(DAY,-1, DATEADD(DAY, 1 - DATEPART(WEEKDAY, CAST(GETDATE() AS date))
                                    + CASE WHEN @@DATEFIRST=7 AND DATEPART(WEEKDAY, GETDATE())=1 THEN -6 ELSE 0 END,
                                    CAST(GETDATE() AS date)))
    WHEN @period='month'   THEN EOMONTH(GETDATE(),-1)
    WHEN @period='quarter' THEN DATEADD(DAY,-1, DATEADD(QUARTER, DATEDIFF(QUARTER,0,GETDATE()), 0))
    WHEN @period='yearly'  THEN DATEFROMPARTS(YEAR(GETDATE())-1,12,31)
  END AS e;
`;

router.get('/top', async (req, res) => {
  try {
    const period = (req.query.period || 'today').toLowerCase();
    const ttl = Number(req.query.ttl) || 2;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const pool = await connectToDatabase();

    // bounds
    const b = await pool.request()
      .input('period', sql.VarChar(12), period)
      .query(getBoundsSql);
    const { s, e } = b.recordset[0];

    // top products by sales (join to OBJ_TAB for name)
    const q = await pool.request()
      .input('ttl', sql.Int, ttl)
      .input('s', sql.Date, s)
      .input('e', sql.Date, e)
      .input('n', sql.Int, limit)
      .query(`
        WITH agg AS (
          SELECT r.F01 AS upc,
                 SUM(CAST(r.F64 AS decimal(18,2))) AS units,
                 SUM(CAST(r.F65 AS decimal(18,2))) AS sales
          FROM dbo.SAL_REG r
          WHERE r.F1034=@ttl AND CAST(r.F254 AS date) BETWEEN @s AND @e
          GROUP BY r.F01
        )
        SELECT TOP (@n)
          a.upc,
          ISNULL(o.F255,'') AS name,
          a.units,
          a.sales
        FROM agg a
        LEFT JOIN dbo.OBJ_TAB o ON o.F01 = a.upc
        ORDER BY a.sales DESC, a.units DESC;
      `);

    res.json({
      success: true,
      period,
      startDate: s, endDate: e,
      items: q.recordset.map(r => ({
        upc: r.upc,
        name: r.name || r.upc,
        units: Number(r.units||0),
        sales: Number(r.sales||0)
      }))
    });
  } catch (e) {
    res.status(500).json({ success:false, error: e.message });
  }
});

module.exports = router;
