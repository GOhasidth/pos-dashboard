const productService = require('../services/productService');
async function getTopProducts(req, res){
  try {
    const period = (req.query.period || 'today').toLowerCase();
    const ttl = Number(req.query.ttl) || 2;
    const limit = Math.min(Number(req.query.limit)||10, 50);
    res.json(await productService.top({ period, ttl, limit }));
  } catch (e) { res.status(500).json({ error: e.message }); }
}
module.exports = { getTopProducts };
