// src/frames/DashboardFrame.js
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, Clock, AlertTriangle } from 'lucide-react';
import KPICard from '../components/KPICard';
import { getSalesSummary, getSalesTimeseries, getTopProducts, getTransactions } from '../services/apiService';

const DashboardFrame = ({ 
  selectedPeriod = 'today',
  currentTime,
  setCurrentPage,
  setSelectedPeriod
}) => {
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const ttl = 2; // your store id

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // SUMMARY: use your existing summary endpoint (today or month)
        const summaryPeriod = ['today','month'].includes(selectedPeriod) ? selectedPeriod : 'today';
        const summaryData = await getSalesSummary(summaryPeriod, ttl);
        if (!ignore) setSummary(summaryData);

        // TIMESERIES: month | quarter | yearly
        if (['month','quarter','yearly'].includes(selectedPeriod)) {
          const timeseriesData = await getSalesTimeseries(selectedPeriod, ttl);
          if (!ignore) setSeries(timeseriesData.series || []);
        } else {
          if (!ignore) setSeries([]);
        }

        // TOP PRODUCTS
        const productsData = await getTopProducts(selectedPeriod, ttl, 5);
        if (!ignore) setTopProducts(productsData.items || []);

        // TRANSACTIONS (for recent activity)
        const transactionsData = await getTransactions('today', ttl);
        if (!ignore) setTransactions(transactionsData.transactions?.slice(0, 10) || []);

      } catch (err) {
        console.error('Dashboard data loading error:', err);
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [selectedPeriod, ttl]);

  const chartData = useMemo(() => {
    return (series || []).map(p => ({
      label: p.label,
      sales: Number(p.sales || 0),
      units: Number(p.units || 0),
    }));
  }, [series]);

  const paymentData = [
    { name: 'Card', value: 65, color: '#8884d8' },
    { name: 'Cash', value: 25, color: '#82ca9d' },
    { name: 'Mobile', value: 8, color: '#ffc658' },
    { name: 'Online', value: 2, color: '#ff7300' }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Sales" 
          value={fmt(summary?.totalSales)} 
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
          color="blue"
        />
        <KPICard 
          title="Transactions" 
          value={fmt(summary?.transactions)} 
          icon={ShoppingCart}
          trend="up"
          trendValue="+8.3%"
          color="green"
        />
        <KPICard 
          title="Average Order" 
          value={`$${fmt(summary?.avgOrder)}`} 
          icon={TrendingUp}
          trend="up"
          trendValue="+3.7%"
          color="purple"
        />
        <KPICard 
          title="Total Units" 
          value={fmt(summary?.totalUnits)} 
          icon={Package}
          trend="up"
          trendValue="+15.2%"
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'sales' ? 'Sales' : 'Units']} />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="sales" />
                <Line type="monotone" dataKey="units" stroke="#82ca9d" strokeWidth={2} name="units" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No trend data available for {selectedPeriod}</p>
                <p className="text-sm">Try selecting a different period</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products ({selectedPeriod})</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.units} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${product.sales.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No product data available</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">Store {transaction.store_id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.ts).toLocaleTimeString()} • {transaction.units} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${transaction.amount}</p>
                    <p className="text-sm text-gray-600">Terminal {transaction.terminal_id}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">Inventory Alert</p>
              <p className="text-sm text-yellow-700">Coffee beans running low - reorder recommended</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-800">Sales Update</p>
              <p className="text-sm text-blue-700">Today's sales are 15% above average</p>
            </div>
          </div>
        </div>
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