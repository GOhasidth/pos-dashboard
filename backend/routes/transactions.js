// server/routes/transactions.js
const express = require('express');
const router = express.Router();
const { connectToDatabase, sql } = require('../config/database');

// --- JS date helpers (UTC-safe enough for day ranges if we zero time) ---
function startOfToday() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}
function addDays(d, n) {
  const x = new Date(d); x.setDate(x.getDate() + n); return x;
}
function startOfWeekMonday() {
  const d = startOfToday();
  const day = d.getDay();                 // 0..6 (Sun..Sat)
  const delta = (day === 0 ? -6 : 1 - day);
  return addDays(d, delta);
}
function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfNextMonth() {
  const d = startOfMonth();
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}
function getRange(period) {
  switch ((period || 'today').toLowerCase()) {
    case 'week': {
      const start = startOfWeekMonday();
      return { start, end: addDays(start, 7) }; // [Mon .. next Mon)
    }
    case 'month': {
      const start = startOfMonth();
      return { start, end: startOfNextMonth() }; // [1st .. 1st next)
    }
    case 'today':
    default: {
      const start = startOfToday();
      return { start, end: addDays(start, 1) };  // [00:00 .. +1d)
    }
  }
}

// ----- /api/transactions -----
// Params:
//   period=today|week|month (default today)
//   ttl=2   -> filters F1034
//   storeId -> optional exact match on F1034 (alias of ttl if you prefer)
//   deptId  -> optional filter on F1056
router.get('/', async (req, res) => {
  const period = (req.query.period || 'today').toLowerCase();
  let { start, end } = getRange(period);

  const ttl = req.query.ttl ? Number(req.query.ttl) : undefined;
  const storeId = req.query.storeId ? Number(req.query.storeId) : undefined;
  const deptId = req.query.deptId ? Number(req.query.deptId) : undefined;

  try {
    const pool = await connectToDatabase();

    // If period=today and no daily rows for today (respecting ttl if given), fall back to latest business day
    if (period === 'today') {
      const chkReq = pool.request()
        .input('d', sql.Date, start);
      if (ttl !== undefined) chkReq.input('ttl', sql.Int, ttl);

      const chk = await chkReq.query(`
        SELECT COUNT(*) AS c
        FROM STORESQL.dbo.RPT_FIN
        WHERE F1031='D'
          AND F254=@d
          ${ttl !== undefined ? 'AND F1034=@ttl' : ''}
      `);

      if ((chk.recordset[0]?.c || 0) === 0) {
        const lastReq = pool.request();
        if (ttl !== undefined) lastReq.input('ttl', sql.Int, ttl);
        const latest = await lastReq.query(`
          SELECT CAST(MAX(F254) AS date) AS d
          FROM STORESQL.dbo.RPT_FIN
          WHERE F1031='D'
          ${ttl !== undefined ? 'AND F1034=@ttl' : ''}
        `);
        const d = latest.recordset[0]?.d;
        if (d) { start = d; end = addDays(d, 1); }
      }
    }

    // Build WHERE dynamically but safely
    const reqSql = pool.request()
      .input('start', sql.DateTime, start)
      .input('end',   sql.DateTime, end);

    let where = `
      F1031='D'
      AND F254 >= @start
      AND F254 <  @end
    `;
    if (ttl !== undefined) {
      reqSql.input('ttl', sql.Int, ttl);
      where += ' AND F1034=@ttl';
    }
    if (storeId !== undefined) {
      reqSql.input('storeId', sql.Int, storeId);
      where += ' AND F1034=@storeId';
    }
    if (deptId !== undefined) {
      reqSql.input('deptId', sql.Int, deptId);
      where += ' AND F1056=@deptId';
    }

    // If F253 is varchar in your schema, CAST to datetime2 for ordering
    const q = `
      SELECT
        CAST(F253 AS datetime2(0)) AS ts,   -- event timestamp (best effort)
        CAST(F254 AS date)          AS biz_date,
        F1034                       AS store_id,
        F1056                       AS dept_id,
        F1057                       AS terminal_id,
        CAST(F64 AS decimal(18,2))  AS units,
        CAST(F65 AS decimal(18,2))  AS amount,
        -- TODO: confirm F67 meaning (refund flag). If it’s not, remove it.
        F67                         AS is_refund
      FROM STORESQL.dbo.RPT_FIN
      WHERE ${where}
      ORDER BY CAST(F253 AS datetime2(0)) ASC;
    `;

    const r = await reqSql.query(q);

    res.json({
      ok: true,
      period,
      start,
      end,
      filters: { ttl, storeId, deptId },
      rowCount: r.recordset.length,
      transactions: r.recordset
    });
  } catch (err) {
    console.error('transactions error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
