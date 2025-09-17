// src/frames/DashboardFrame.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Users, ShoppingCart, DollarSign, Package, Clock, AlertCircle } from 'lucide-react';
import KPICard from '../components/KPICard';

const DashboardFrame = ({
  salesData,
  trendData,
  topProductsByPeriod,
  paymentDataByPeriod,
  employeeData,
  alerts,
  selectedPeriod
}) => {
  const currentData = salesData[selectedPeriod];
  const currentTopProducts = topProductsByPeriod[selectedPeriod];
  const currentPaymentData = paymentDataByPeriod[selectedPeriod];

  return (
    <div className="p-6">
      {/* Alert Banner */}
      {alerts.filter(a => a.priority === 'high').length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">
              {alerts.filter(a => a.priority === 'high')[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Sales"
          value={`$${currentData.total.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
        />
        <KPICard
          title="Transactions"
          value={currentData.transactions.toLocaleString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="+8.2%"
        />
        <KPICard
          title="Average Order"
          value={`$${currentData.avgOrder.toFixed(2)}`}
          icon={TrendingUp}
          trend="up"
          trendValue="+3.8%"
        />
        <KPICard
          title="Active Customers"
          value="324"
          icon={Users}
          trend="up"
          trendValue="+15.3%"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Today)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods ({selectedPeriod === 'quarterly' ? 'Quarter' : selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={currentPaymentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, value}) => `${name}: ${value}%`}
              >
                {currentPaymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {currentPaymentData.map((method, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2`} style={{backgroundColor: method.color}}></div>
                <span className="text-gray-600">{method.name}: {method.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products ({selectedPeriod === 'quarterly' ? 'Quarter' : selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})
          </h3>
          <div className="space-y-3">
            {currentTopProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-block w-6 h-6 rounded-full text-xs text-white font-bold flex items-center justify-center mr-3 ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">${product.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{product.sales.toLocaleString()} sold</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance</h3>
          <div className="space-y-3">
            {employeeData.map((employee, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                  <div className="text-xs text-gray-500">{employee.transactions} transactions</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">${employee.sales.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Avg: ${employee.avg.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.priority === 'high' ? 'bg-red-50' : 
                alert.priority === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
              }`}>
                <AlertCircle className={`h-4 w-4 mt-0.5 ${
                  alert.priority === 'high' ? 'text-red-500' : 
                  alert.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <p className={`text-sm ${
                  alert.priority === 'high' ? 'text-red-800' : 
                  alert.priority === 'medium' ? 'text-yellow-800' : 'text-blue-800'
                }`}>
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Package className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">23</p>
          <p className="text-sm text-gray-600">Low Stock Items</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">2.3 min</p>
          <p className="text-sm text-gray-600">Avg Order Time</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">68%</p>
          <p className="text-sm text-gray-600">Returning Customers</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <TrendingUp className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">$248</p>
          <p className="text-sm text-gray-600">Customer Lifetime Value</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardFrame;