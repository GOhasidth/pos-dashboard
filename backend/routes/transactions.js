// server/routes/transactions.js
const express = require('express');
const router = express.Router();
const { connectToDatabase, sql } = require('../config/database');

// ----- helpers -----
function startOfToday() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}
function addDays(d, n) {
  const x = new Date(d); x.setDate(x.getDate() + n); return x;
}
function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfWeekMonday() {
  const d = startOfToday();
  const day = d.getDay();                 // Sun=0..Sat=6
  const delta = (day === 0 ? -6 : 1 - day); // move to Monday
  return addDays(d, delta);
}
function getRange(period) {
  if (period === 'week') {
    const start = startOfWeekMonday();
    return { start, end: addDays(start, 7) };
  }
  if (period === 'month') {
    const start = startOfMonth();
    return { start, end: addDays(start, 32) /* overshoot */ };
  }
  // default: today
  const start = startOfToday();
  return { start, end: addDays(start, 1) };
}

// ----- /api/transactions -----
router.get('/', async (req, res) => {
  const period = (req.query.period || 'today').toLowerCase();
  let { start, end } = getRange(period);

  try {
    const pool = await connectToDatabase();

    // If period=today and there are no daily rows for today,
    // fall back to the latest available daily business date.
    if (period === 'today') {
      const chk = await pool.request()
        .input('d', sql.Date, start)
        .query(`
          SELECT COUNT(*) AS c
          FROM [STORESQL].[dbo].[RPT_FIN]
          WHERE F1031='D' AND F254=@d
        `);

      if (chk.recordset[0].c === 0) {
        const latest = await pool.request().query(`
          SELECT CAST(MAX(F254) AS date) AS d
          FROM [STORESQL].[dbo].[RPT_FIN]
          WHERE F1031='D'
        `);
        const d = latest.recordset[0].d;
        if (d) { start = d; end = addDays(d, 1); }
      }
    }

    // Pull RAW daily-grain rows for the range
    const q = `
      SELECT
        F253        AS ts,            -- timestamp
        F254        AS biz_date,      -- business date @ 00:00
        F1034       AS store_id,
        F1056       AS dept_id,       -- or lane/whatever
        F1057       AS terminal_id,   -- cashier/terminal
        F64         AS units,
        CAST(F65 AS decimal(18,2)) AS amount,
        F67         AS is_refund      -- guessing from your fields
        -- add Product/UPC fields here if they live in this table
      FROM [STORESQL].[dbo].[RPT_FIN]
      WHERE F1031='D'
        AND F254 >= @start
        AND F254 <  @end
      ORDER BY F253 ASC;
    `;

    const r = await pool.request()
      .input('start', sql.DateTime, start)
      .input('end',   sql.DateTime, end)
      .query(q);

    res.json({
      ok: true,
      period,
      start,
      end,
      rowCount: r.recordset.length,
      transactions: r.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
// server/routes/transactions.js