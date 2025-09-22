const { connectToDatabase, sql } = require('../config/database');

async function topProducts({ ttl, startDate, endDate, limit = 10 }) {
  const pool = await connectToDatabase();
  const r = await pool.request()
    .input('ttl', sql.Int, ttl)
    .input('s', sql.Date, startDate)
    .input('e', sql.Date, endDate)
    .input('n', sql.Int, limit)
    .query(`
      WITH agg AS (
        SELECT r.F01 AS upc,
               SUM(CAST(r.F64 AS decimal(18,2))) AS units,
               SUM(CAST(r.F65 AS decimal(18,2))) AS sales
        FROM dbo.SAL_REG r
        WHERE r.F1034=@ttl AND CAST(r.F254 AS date) >= @s AND CAST(r.F254 AS date) < @e
        GROUP BY r.F01
      )
      SELECT TOP (@n) a.upc, a.units, a.sales, ISNULL(o.F255,'') AS name
      FROM agg a LEFT JOIN dbo.OBJ_TAB o ON o.F01=a.upc
      ORDER BY a.sales DESC, a.units DESC
    `);
  return r.recordset;
}

module.exports = { topProducts };
