const { bounds } = require('../utils/periods');
const productsRepo = require('../repositories/productsRepo');

async function top({ period, ttl, limit }) {
  const { startDate, endDate } = bounds(period);
  const items = await productsRepo.topProducts({ ttl, startDate, endDate, limit });
  return { period, startDate, endDate,
    items: items.map(r => ({ upc: r.upc, name: r.name || r.upc, units: Number(r.units||0), sales: Number(r.sales||0) }))
  };
}
module.exports = { top };
