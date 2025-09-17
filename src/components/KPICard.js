// src/components/KPICard.js
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className={`flex items-center mt-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
      <Icon className="h-8 w-8 text-blue-500" />
    </div>
  </div>
);

export default KPICard;