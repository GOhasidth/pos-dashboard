// src/frames/PatternAnalysisFrame.js
import React from 'react';
import { ShoppingCart, TrendingUp, Users, DollarSign } from 'lucide-react';

const PatternAnalysisFrame = ({
  currentTime,
  setCurrentPage,
  marketBasketRules,
  sequentialPatterns,
  customerJourney,
  aiRecommendations
}) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frequent Pattern Analysis</h1>
          <p className="text-gray-600">Market Basket Analysis • Sequential Patterns • Customer Journey Insights</p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-green-500">
          <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-600">High-Impact Rules</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-500">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">73.2%</p>
          <p className="text-sm text-gray-600">Best Confidence Rate</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-purple-500">
          <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">4.1x</p>
          <p className="text-sm text-gray-600">Highest Lift Score</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-orange-500">
          <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">+$1,247</p>
          <p className="text-sm text-gray-600">Daily Revenue Opportunity</p>
        </div>
      </div>

      {/* Market Basket Analysis Rules */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Basket Analysis Rules</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rule (A → B)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Support</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Confidence</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Lift</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Transactions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {marketBasketRules.map((rule, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{rule.rule}</td>
                  <td className="py-3 px-4">
                    <span className="text-gray-600">{rule.support}%</span>
                    <div className="text-xs text-gray-500">how often pattern appears</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${rule.confidence >= 80 ? 'text-green-600' : rule.confidence >= 70 ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {rule.confidence}%
                    </span>
                    <div className="text-xs text-gray-500">how reliably B follows A</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${rule.lift >= 3 ? 'text-green-600' : rule.lift >= 2 ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {rule.lift}x
                    </span>
                    <div className="text-xs text-gray-500">how much A increases chance of B</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{rule.transactions.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="text-xs text-gray-900 font-medium">{rule.actionable}</div>
                    <div className="text-xs text-green-600">{rule.impact}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sequential Patterns & Customer Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sequential Patterns */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequential Pattern Mining</h3>
          <div className="space-y-4">
            {sequentialPatterns.map((pattern, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-1">{pattern.sequence}</div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{pattern.frequency} customers</span> • {pattern.dayPattern}
                </div>
                <div className="text-xs text-gray-600 mb-1">Target: {pattern.customerType}</div>
                <div className="text-xs text-blue-700 font-medium">{pattern.opportunity}</div>
                <div className="text-xs text-green-600">{pattern.revenue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Journey Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Journey Drop-offs</h3>
          <div className="space-y-3">
            {customerJourney.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                    step.dropoff >= 20 ? 'bg-red-500' : step.dropoff >= 10 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{step.step}</div>
                    <div className="text-sm text-gray-600">{step.users} users ({step.conversion}%)</div>
                  </div>
                </div>
                <div className="text-right">
                  {step.dropoff > 0 && (
                    <div className={`text-sm font-medium ${step.dropoff >= 20 ? 'text-red-600' : step.dropoff >= 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      -{step.dropoff}% drop-off
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiRecommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} Priority
                </div>
                <div className="text-xs text-gray-500">{rec.category}</div>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{rec.action}</h4>
              <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
              <div className="space-y-1">
                <div className="text-sm font-medium text-green-600">{rec.expectedImpact}</div>
                <div className="text-xs text-gray-500">Timeline: {rec.timeline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatternAnalysisFrame;