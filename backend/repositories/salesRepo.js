const { connectToDatabase, sql } = require('../config/database');

async function kpiTotals({ ttl, startDate, endDate }) {
  const pool = await connectToDatabase();
  const r = await pool.request()
    .input('ttl', sql.Int, ttl)
    .input('s', sql.Date, startDate)
    .input('e', sql.Date, endDate)
    .query(`
      SELECT
        SUM(CAST(F64 AS decimal(18,2))) AS units,
        SUM(CAST(F65 AS decimal(18,2))) AS sales,
        COUNT(*)                         AS txn_rows
      FROM STORESQL.dbo.RPT_FIN
      WHERE F1031='D' AND F1034=@ttl
        AND CAST(F254 AS date) >= @s AND CAST(F254 AS date) < @e
    `);
  return r.recordset[0] || { units:0, sales:0, txn_rows:0 };
}

async function paymentMix({ ttl, startDate, endDate }) {
  const pool = await connectToDatabase();
  const q = await pool.request()
    .input('ttl', sql.Int, ttl)
    .input('s', sql.Date, startDate)
    .input('e', sql.Date, endDate)
    .query(`
      SELECT
        CASE
          WHEN F136 IN ('CA','CASH') THEN 'Cash'
          WHEN F136 IN ('CC','CRD','VISA','MC','AMEX','DISC') THEN 'Card'
          WHEN F136 IN ('UPI','WALLET','PAYTM','GPAY') THEN 'Wallet'
          WHEN F136 IN ('COUPON','GV') THEN 'Coupon'
          ELSE ISNULL(F136,'Other') END AS method,
        SUM(CAST(F65 AS decimal(18,2))) AS sales_amount
      FROM dbo.SAL_TTL
      WHERE F1034=@ttl AND CAST(F254 AS date) >= @s AND CAST(F254 AS date) < @e
      GROUP BY CASE
        WHEN F136 IN ('CA','CASH') THEN 'Cash'
        WHEN F136 IN ('CC','CRD','VISA','MC','AMEX','DISC') THEN 'Card'
        WHEN F136 IN ('UPI','WALLET','PAYTM','GPAY') THEN 'Wallet'
        WHEN F136 IN ('COUPON','GV') THEN 'Coupon'
        ELSE ISNULL(F136,'Other') END
      ORDER BY sales_amount DESC
    `);
  return q.recordset;
}

module.exports = { kpiTotals, paymentMix };
