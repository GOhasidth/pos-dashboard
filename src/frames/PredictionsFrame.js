// src/frames/PredictionsFrame.js
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';

const PredictionCard = ({ title, predicted, confidence, factors, onViewProducts }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">${predicted.toLocaleString()}</p>
        <div className="flex items-center mt-1">
          <div className={`w-2 h-2 rounded-full mr-2 ${confidence >= 80 ? 'bg-green-500' : confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">{confidence}% confidence</span>
        </div>
      </div>
    </div>
    <div className="space-y-1 mb-3">
      <p className="text-xs font-medium text-gray-700">Key Factors:</p>
      {factors.slice(0, 2).map((factor, index) => (
        <p key={index} className="text-xs text-gray-600">• {factor}</p>
      ))}
    </div>
    <button
      onClick={onViewProducts}
      className="w-full px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
    >
      📈 View Product Predictions
    </button>
  </div>
);

const PredictionsFrame = ({
  currentTime,
  setCurrentPage,
  predictions,
  predictionTrends,
  hourlyPrediction
}) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Predictions</h1>
          <p className="text-gray-600">AI-Powered Forecasting • Updated {currentTime.toLocaleString()}</p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PredictionCard
          title="Next Day"
          predicted={predictions.nextDay.sales}
          confidence={predictions.nextDay.confidence}
          factors={predictions.nextDay.factors}
          onViewProducts={() => alert('Product predictions coming soon!')}
        />
        <PredictionCard
          title="Next Week" 
          predicted={predictions.nextWeek.sales}
          confidence={predictions.nextWeek.confidence}
          factors={predictions.nextWeek.factors}
          onViewProducts={() => alert('Product predictions coming soon!')}
        />
        <PredictionCard
          title="Next Month"
          predicted={predictions.nextMonth.sales}
          confidence={predictions.nextMonth.confidence}
          factors={predictions.nextMonth.factors}
          onViewProducts={() => alert('Product predictions coming soon!')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PredictionCard
          title="Next Quarter"
          predicted={predictions.nextQuarter.sales}
          confidence={predictions.nextQuarter.confidence}
          factors={predictions.nextQuarter.factors}
          onViewProducts={() => alert('Product predictions coming soon!')}
        />
        <PredictionCard
          title="Next Year"
          predicted={predictions.nextYear.sales}
          confidence={predictions.nextYear.confidence}
          factors={predictions.nextYear.factors}
          onViewProducts={() => alert('Product predictions coming soon!')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Accuracy History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={predictionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'actual' ? 'Actual' : 'Predicted']} />
              <Bar dataKey="predicted" fill="#8884d8" name="predicted" />
              <Bar dataKey="actual" fill="#82ca9d" name="actual" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-2">Average accuracy: 92.3% across all periods</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tomorrow's Hourly Forecast</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyPrediction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value}`, name === 'predicted' ? 'Predicted' : 'Historical Avg']} />
              <Line type="monotone" dataKey="predicted" stroke="#8884d8" strokeWidth={2} name="predicted" />
              <Line type="monotone" dataKey="historical" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" name="historical" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">High Risk</p>
                <p className="text-xs text-red-700">Weather forecast shows rain next Tuesday - could reduce foot traffic by 15-20%</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Medium Risk</p>
                <p className="text-xs text-yellow-700">Local construction starting next week may impact accessibility</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-4 w-4 mt-0.5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-800">Opportunity</p>
                <p className="text-xs text-blue-700">Back-to-school season typically increases morning sales by 25%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">Inventory Planning</h4>
              <p className="text-sm text-gray-600">Increase coffee bean orders by 15% for next week due to expected uptick in demand</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">Staffing</h4>
              <p className="text-sm text-gray-600">Schedule 1 additional staff member during 11 AM - 1 PM peak hours tomorrow</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900">Promotions</h4>
              <p className="text-sm text-gray-600">Consider rainy day discount for indoor seating to offset weather impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsFrame;