// src/components/NavigationHeader.js
import React from 'react';

const NavigationHeader = ({
  currentPage,
  setCurrentPage,
  selectedPeriod,
  setSelectedPeriod,
  currentTime
}) => (
  <div className="bg-white shadow-sm border-b border-gray-200 p-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">POS Dashboard</h1>
        <p className="text-gray-600">Live Business Intelligence • {currentTime.toLocaleString()}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage('predictions')}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage === 'predictions' 
              ? 'bg-purple-600 text-white' 
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          📊 Predictions
        </button>
        <button
          onClick={() => setCurrentPage('patterns')}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage === 'patterns'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          🔍 Pattern Analysis
        </button>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          🏠 Dashboard
        </button>
      </div>
    </div>
    
    {/* Period Selector - only show on dashboard */}
    {currentPage === 'dashboard' && (
      <div className="flex gap-2 mt-4">
        {['today', 'week', 'month', 'quarterly', 'yearly'].map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPeriod === period 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {period === 'quarterly' ? 'Quarter' : period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default NavigationHeader;