const { bounds } = require('../utils/periods');
const salesRepo = require('../repositories/salesRepo');

async function summary({ period, ttl }) {
  const { startDate, endDate } = bounds(period);
  const k = await salesRepo.kpiTotals({ ttl, startDate, endDate });
  const avgOrder = k.txn_rows ? Number((Number(k.sales||0)/Number(k.txn_rows)).toFixed(2)) : 0;
  return { period, startDate, endDate, totalSales: Number(k.sales||0), totalUnits: Number(k.units||0), transactions: Number(k.txn_rows||0), avgOrder };
}

async function mix({ period, ttl }) {
  const { startDate, endDate } = bounds(period);
  const rows = await salesRepo.paymentMix({ ttl, startDate, endDate });
  const total = rows.reduce((a, r) => a + Number(r.sales_amount||0), 0);
  return {
    period, startDate, endDate, totalSales: total,
    mix: rows.map(r => ({ method: r.method, sales: Number(r.sales_amount||0), share: total ? Number((r.sales_amount/total*100).toFixed(2)) : 0 }))
  };
}

module.exports = { summary, mix };
