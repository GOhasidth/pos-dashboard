// returns { startDate: Date, endDate: Date } with end exclusive
function bounds(period, ref = new Date()) {
  const d = new Date(ref); d.setHours(0,0,0,0);

  if (period === 'today') return { startDate: d, endDate: new Date(d.getTime() + 86400000) };

  if (period === 'week') {
    const day = d.getDay(); const delta = (day === 0 ? -6 : 1 - day); // Mon start
    const start = new Date(d); start.setDate(d.getDate() + delta - 7);  // previous full week
    const end = new Date(start); end.setDate(start.getDate() + 7);
    return { startDate: start, endDate: end };
  }

  if (period === 'month') {
    const m0 = new Date(d.getFullYear(), d.getMonth()-1, 1);
    const m1 = new Date(d.getFullYear(), d.getMonth(), 1);
    return { startDate: m0, endDate: m1 };
  }

  if (period === 'quarter') {
    const qStart = new Date(d.getFullYear(), Math.floor(d.getMonth()/3)*3, 1);
    const start = new Date(qStart.getFullYear(), qStart.getMonth()-3, 1);
    const end   = new Date(qStart); // current q start
    return { startDate: start, endDate: end };
  }

  // yearly = previous calendar year
  return {
    startDate: new Date(d.getFullYear()-1, 0, 1),
    endDate:   new Date(d.getFullYear(),   0, 1)
  };
}
module.exports = { bounds };
