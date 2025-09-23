// src/frames/DashboardFrame.js
import React from 'react';
import { apiService } from "../services/apiService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Users, ShoppingCart, DollarSign, Package, Clock, AlertCircle } from 'lucide-react';
import KPICard from '../components/KPICard';

const DashboardFrame = ({ selectedPeriod = 'today' }) => {
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]);
  const ttl = 2; // your store id

  useEffect(() => {
    let ignore = false;

    (async () => {
      // SUMMARY: use your existing summary endpoint (today or month)
      const summaryPeriod = ['today','month'].includes(selectedPeriod) ? selectedPeriod : 'today';
      const s = await getSalesSummary(summaryPeriod, ttl);
      if (!ignore) setSummary(s);

      // TIMESERIES: month | quarter | yearly
      if (['month','quarter','yearly'].includes(selectedPeriod)) {
        const t = await getSalesTimeseries(selectedPeriod, ttl);
        if (!ignore) setSeries(t.series || []);
      } else {
        if (!ignore) setSeries([]);
      }
    })().catch(console.error);

    return () => { ignore = true; };
  }, [selectedPeriod, ttl]);

  const chartData = useMemo(() => {
    // month: label is "1..31"; quarter/yearly: label is "Jan..Dec"
    return (series || []).map(p => ({
      label: p.label,
      sales: Number(p.sales || 0),
      units: Number(p.units || 0),
    }));
  }, [series]);

  return (
    <div className="p-6">
      {/* KPI cards (summary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Sales"   value={fmt(summary?.totalSales)} />
        <KPICard title="Transactions"  value={fmt(summary?.transactions)} />
        <KPICard title="Average Order" value={fmt(summary?.avgOrder)} />
        <KPICard title="Units"         value={fmt(summary?.totalUnits)} />
      </div>

      {/* Timeseries chart (month/quarter/yearly) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="units" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function fmt(n) {
  if (n == null) return '—';
  const v = Number(n);
  return Number.isFinite(v) ? v.toLocaleString() : '—';
}

export default DashboardFrame;