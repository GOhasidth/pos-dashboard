// src/App.js
import React, { useState, useEffect } from 'react';
import NavigationHeader from './components/NavigationHeader';
import DashboardFrame from './frames/DashboardFrame';
import PredictionsFrame from './frames/PredictionsFrame';
import PatternAnalysisFrame from './frames/PatternAnalysisFrame';

// Import JSON data files
import salesDataJson from './data/salesData.json';
import predictionsDataJson from './data/predictionsData.json';
import patternAnalysisJson from './data/patternAnalysis.json';

const POSDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Data state
  const [dashboardData, setDashboardData] = useState(null);
  const [predictionsData, setPredictionsData] = useState(null);
  const [patternData, setPatternData] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data on component mount
  useEffect(() => {
    try {
      setDashboardData(salesDataJson);
      setPredictionsData(predictionsDataJson);
      setPatternData(patternAnalysisJson);
    } catch (error) {
      console.error('Error loading data:', error);
      // You can add fallback data here if needed
    }
  }, []);

  // Show loading if data hasn't loaded yet
  if (!dashboardData || !predictionsData || !patternData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Common props for all frames
  const commonProps = {
    currentTime,
    setCurrentPage,
    selectedPeriod,
    setSelectedPeriod
  };

  // Render current frame based on page state
  const renderCurrentFrame = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardFrame
            {...commonProps}
            salesData={dashboardData.salesData}
            trendData={dashboardData.trendData}
            topProductsByPeriod={dashboardData.topProductsByPeriod}
            paymentDataByPeriod={dashboardData.paymentDataByPeriod}
            employeeData={dashboardData.employeeData}
            alerts={dashboardData.alerts}
          />
        );
      
      case 'predictions':
        return (
          <PredictionsFrame
            {...commonProps}
            predictions={predictionsData.predictions}
            predictionTrends={predictionsData.predictionTrends}
            hourlyPrediction={predictionsData.hourlyPrediction}
          />
        );
      
      case 'patterns':
        return (
          <PatternAnalysisFrame
            {...commonProps}
            marketBasketRules={patternData.marketBasketRules}
            sequentialPatterns={patternData.sequentialPatterns}
            customerJourney={patternData.customerJourney}
            aiRecommendations={patternData.aiRecommendations}
          />
        );
      
      default:
        return (
          <DashboardFrame
            {...commonProps}
            salesData={dashboardData.salesData}
            trendData={dashboardData.trendData}
            topProductsByPeriod={dashboardData.topProductsByPeriod}
            paymentDataByPeriod={dashboardData.paymentDataByPeriod}
            employeeData={dashboardData.employeeData}
            alerts={dashboardData.alerts}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationHeader
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        currentTime={currentTime}
      />
      {renderCurrentFrame()}
    </div>
  );
};

export default POSDashboard;