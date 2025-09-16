import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Clock, AlertCircle } from 'lucide-react';

const POSDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample data - in a real app this would come from your POS system
  const salesData = {
    today: { total: 12450, transactions: 87, avgOrder: 143.10 },
    week: { total: 89320, transactions: 645, avgOrder: 138.50 },
    month: { total: 387500, transactions: 2890, avgOrder: 134.10 },
    quarterly: { total: 1250000, transactions: 8750, avgOrder: 142.86 },
    yearly: { total: 4650000, transactions: 34500, avgOrder: 134.78 }
  };

  const trendData = [
    { time: '9 AM', sales: 850 },
    { time: '10 AM', sales: 1200 },
    { time: '11 AM', sales: 1850 },
    { time: '12 PM', sales: 2100 },
    { time: '1 PM', sales: 1950 },
    { time: '2 PM', sales: 1600 },
    { time: '3 PM', sales: 1400 },
    { time: '4 PM', sales: 1750 },
    { time: '5 PM', sales: 1300 }
  ];

  const topProductsByPeriod = {
    today: [
      { name: 'Premium Coffee', sales: 145, revenue: 725 },
      { name: 'Croissant', sales: 89, revenue: 267 },
      { name: 'Latte', sales: 78, revenue: 390 },
      { name: 'Bagel & Cream Cheese', sales: 67, revenue: 402 },
      { name: 'Espresso', sales: 56, revenue: 168 }
    ],
    week: [
      { name: 'Premium Coffee', sales: 987, revenue: 4935 },
      { name: 'Latte', sales: 654, revenue: 3270 },
      { name: 'Croissant', sales: 543, revenue: 1629 },
      { name: 'Iced Coffee', sales: 432, revenue: 1728 },
      { name: 'Muffin', sales: 398, revenue: 1194 }
    ],
    month: [
      { name: 'Premium Coffee', sales: 4250, revenue: 21250 },
      { name: 'Latte', sales: 3200, revenue: 16000 },
      { name: 'Sandwich Combo', sales: 2800, revenue: 25200 },
      { name: 'Iced Coffee', sales: 2100, revenue: 8400 },
      { name: 'Croissant', sales: 1950, revenue: 5850 }
    ],
    quarterly: [
      { name: 'Premium Coffee', sales: 12750, revenue: 63750 },
      { name: 'Sandwich Combo', sales: 8900, revenue: 80100 },
      { name: 'Latte', sales: 8200, revenue: 41000 },
      { name: 'Seasonal Specials', sales: 6500, revenue: 45500 },
      { name: 'Pastry Selection', sales: 5800, revenue: 20300 }
    ],
    yearly: [
      { name: 'Premium Coffee', sales: 52000, revenue: 260000 },
      { name: 'Sandwich Combo', sales: 38500, revenue: 346500 },
      { name: 'Latte', sales: 34200, revenue: 171000 },
      { name: 'Seasonal Specials', sales: 28900, revenue: 202300 },
      { name: 'Breakfast Items', sales: 24600, revenue: 147600 }
    ]
  };

  const paymentDataByPeriod = {
    today: [
      { name: 'Card', value: 65, color: '#8884d8' },
      { name: 'Cash', value: 25, color: '#82ca9d' },
      { name: 'Mobile', value: 8, color: '#ffc658' },
      { name: 'Online', value: 2, color: '#ff7300' }
    ],
    week: [
      { name: 'Card', value: 68, color: '#8884d8' },
      { name: 'Cash', value: 22, color: '#82ca9d' },
      { name: 'Mobile', value: 7, color: '#ffc658' },
      { name: 'Online', value: 3, color: '#ff7300' }
    ],
    month: [
      { name: 'Card', value: 72, color: '#8884d8' },
      { name: 'Cash', value: 18, color: '#82ca9d' },
      { name: 'Mobile', value: 6, color: '#ffc658' },
      { name: 'Online', value: 4, color: '#ff7300' }
    ],
    quarterly: [
      { name: 'Card', value: 75, color: '#8884d8' },
      { name: 'Cash', value: 15, color: '#82ca9d' },
      { name: 'Mobile', value: 5, color: '#ffc658' },
      { name: 'Online', value: 5, color: '#ff7300' }
    ],
    yearly: [
      { name: 'Card', value: 78, color: '#8884d8' },
      { name: 'Cash', value: 12, color: '#82ca9d' },
      { name: 'Mobile', value: 4, color: '#ffc658' },
      { name: 'Online', value: 6, color: '#ff7300' }
    ]
  };

  const paymentData = [
    { name: 'Card', value: 65, color: '#8884d8' },
    { name: 'Cash', value: 25, color: '#82ca9d' },
    { name: 'Mobile', value: 8, color: '#ffc658' },
    { name: 'Online', value: 2, color: '#ff7300' }
  ];

  const employeeData = [
    { name: 'Sarah M.', sales: 2850, transactions: 23, avg: 123.91 },
    { name: 'Mike R.', sales: 2650, transactions: 19, avg: 139.47 },
    { name: 'Emma L.', sales: 3100, transactions: 21, avg: 147.62 },
    { name: 'James K.', sales: 3850, transactions: 24, avg: 160.42 }
  ];

  const alerts = [
    { type: 'warning', message: 'Vanilla Syrup - Only 3 units left', priority: 'high' },
    { type: 'info', message: '5 new customers today', priority: 'low' },
    { type: 'warning', message: 'Unusual refund activity - $125 in last hour', priority: 'medium' }
  ];

  // Prediction data
  const predictions = {
    nextDay: {
      sales: 13200,
      transactions: 92,
      avgOrder: 143.50,
      confidence: 87,
      factors: ['Monday typically +6% vs Sunday', 'Weather forecast: sunny', 'No special events']
    },
    nextWeek: {
      sales: 94500,
      transactions: 680,
      avgOrder: 139.00,
      confidence: 82,
      factors: ['Holiday week expected', 'School back in session', 'New menu launch planned']
    },
    nextMonth: {
      sales: 410000,
      transactions: 3050,
      avgOrder: 134.40,
      confidence: 75,
      factors: ['Seasonal menu change', 'Historical October growth: +5.8%', 'Local events calendar']
    },
    nextQuarter: {
      sales: 1180000,
      transactions: 8800,
      avgOrder: 134.10,
      confidence: 68,
      factors: ['Holiday season boost', 'Winter menu introduction', 'Economic indicators stable']
    },
    nextYear: {
      sales: 4950000,
      transactions: 36800,
      avgOrder: 134.50,
      confidence: 60,
      factors: ['Market expansion planned', 'Competition analysis', 'Economic growth projections']
    }
  };

  // Product predictions for different periods
  const productPredictions = {
    nextDay: [
      { name: 'Premium Coffee', currentSales: 145, predictedSales: 165, growth: '+13.8%', confidence: 92, reason: 'Monday morning rush expected' },
      { name: 'Breakfast Sandwich', currentSales: 67, predictedSales: 85, growth: '+26.9%', confidence: 88, reason: 'Start of work week boost' },
      { name: 'Latte', currentSales: 78, predictedSales: 82, growth: '+5.1%', confidence: 85, reason: 'Consistent demand pattern' },
      { name: 'Croissant', currentSales: 89, predictedSales: 92, growth: '+3.4%', confidence: 80, reason: 'Slight increase expected' },
      { name: 'Energy Drink', currentSales: 23, predictedSales: 35, growth: '+52.2%', confidence: 75, reason: 'Monday energy boost trend' }
    ],
    nextWeek: [
      { name: 'Pumpkin Spice Latte', currentSales: 234, predictedSales: 420, growth: '+79.5%', confidence: 90, reason: 'Fall season launch this week' },
      { name: 'Premium Coffee', currentSales: 987, predictedSales: 1150, growth: '+16.5%', confidence: 87, reason: 'Back-to-school increased demand' },
      { name: 'Hot Chocolate', currentSales: 156, predictedSales: 245, growth: '+57.1%', confidence: 83, reason: 'Weather turning cooler' },
      { name: 'Soup & Bread', currentSales: 89, predictedSales: 140, growth: '+57.3%', confidence: 85, reason: 'Comfort food season begins' },
      { name: 'Iced Coffee', currentSales: 432, predictedSales: 380, growth: '-12.0%', confidence: 78, reason: 'Seasonal decline expected' }
    ],
    nextMonth: [
      { name: 'Holiday Blend Coffee', currentSales: 0, predictedSales: 850, growth: 'NEW', confidence: 85, reason: 'October holiday menu launch' },
      { name: 'Cinnamon Roll', currentSales: 234, predictedSales: 380, growth: '+62.4%', confidence: 88, reason: 'Fall comfort food trend' },
      { name: 'Seasonal Salads', currentSales: 145, predictedSales: 95, growth: '-34.5%', confidence: 82, reason: 'End of fresh produce season' },
      { name: 'Hot Tea Varieties', currentSales: 167, predictedSales: 285, growth: '+70.7%', confidence: 80, reason: 'Cool weather preference shift' },
      { name: 'Premium Coffee', currentSales: 4250, predictedSales: 4680, growth: '+10.1%', confidence: 90, reason: 'Consistent year-round demand' }
    ],
    nextQuarter: [
      { name: 'Holiday Cookie Box', currentSales: 0, predictedSales: 1200, growth: 'NEW', confidence: 92, reason: 'Christmas season specialty' },
      { name: 'Eggnog Latte', currentSales: 0, predictedSales: 890, growth: 'NEW', confidence: 89, reason: 'Holiday seasonal favorite' },
      { name: 'Winter Soup Menu', currentSales: 450, predictedSales: 1100, growth: '+144.4%', confidence: 87, reason: 'Cold weather comfort food' },
      { name: 'Gift Cards', currentSales: 234, predictedSales: 1850, growth: '+690.6%', confidence: 95, reason: 'Holiday gifting surge' },
      { name: 'Hot Beverages', currentSales: 2800, predictedSales: 4200, growth: '+50.0%', confidence: 93, reason: 'Winter season preference' }
    ],
    nextYear: [
      { name: 'Plant-Based Menu', currentSales: 1200, predictedSales: 3400, growth: '+183.3%', confidence: 78, reason: 'Growing health consciousness trend' },
      { name: 'Cold Brew Line', currentSales: 2800, predictedSales: 4100, growth: '+46.4%', confidence: 85, reason: 'Expanding cold coffee market' },
      { name: 'Breakfast Bowls', currentSales: 890, predictedSales: 1900, growth: '+113.5%', confidence: 80, reason: 'Health food trend continuation' },
      { name: 'Premium Coffee', currentSales: 52000, predictedSales: 58500, growth: '+12.5%', confidence: 92, reason: 'Core product steady growth' },
      { name: 'Digital-Only Items', currentSales: 0, predictedSales: 2200, growth: 'NEW', confidence: 70, reason: 'App-exclusive menu expansion' }
    ]
  };

  const predictionTrends = [
    { period: 'Yesterday', actual: 12450, predicted: 12300 },
    { period: 'Last Week', actual: 89320, predicted: 91200 },
    { period: 'Last Month', actual: 387500, predicted: 385000 },
    { period: 'Current Quarter', actual: 1250000, predicted: 1235000 },
    { period: 'Current Year', actual: 4650000, predicted: 4600000 }
  ];

  const hourlyPrediction = [
    { hour: '9 AM', predicted: 900, historical: 850, confidence: 92 },
    { hour: '10 AM', predicted: 1250, historical: 1200, confidence: 89 },
    { hour: '11 AM', predicted: 1900, historical: 1850, confidence: 85 },
    { hour: '12 PM', predicted: 2200, historical: 2100, confidence: 91 },
    { hour: '1 PM', predicted: 2050, historical: 1950, confidence: 88 },
    { hour: '2 PM', predicted: 1650, historical: 1600, confidence: 86 },
    { hour: '3 PM', predicted: 1450, historical: 1400, confidence: 83 },
    { hour: '4 PM', predicted: 1800, historical: 1750, confidence: 87 },
    { hour: '5 PM', predicted: 1350, historical: 1300, confidence: 84 }
  ];

  // Market Basket Analysis Data
  const marketBasketRules = [
    { 
      rule: 'Coffee → Croissant', 
      support: 8.5, 
      confidence: 73.2, 
      lift: 2.4, 
      transactions: 1247,
      actionable: 'Place croissants near coffee station',
      impact: '+15% cross-sell rate'
    },
    { 
      rule: 'Latte → Cookie', 
      support: 6.2, 
      confidence: 68.9, 
      lift: 2.1, 
      transactions: 891,
      actionable: 'Suggest cookies during latte orders',
      impact: '+12% average order value'
    },
    { 
      rule: 'Breakfast Sandwich → Orange Juice', 
      support: 4.8, 
      confidence: 82.1, 
      lift: 3.2, 
      transactions: 672,
      actionable: 'Bundle breakfast combos',
      impact: '+18% morning revenue'
    },
    { 
      rule: 'Salad → Water', 
      support: 7.1, 
      confidence: 91.3, 
      lift: 1.8, 
      transactions: 1034,
      actionable: 'Auto-suggest water with healthy items',
      impact: '+8% healthy category sales'
    },
    { 
      rule: 'Hot Chocolate → Marshmallows', 
      support: 3.2, 
      confidence: 89.4, 
      lift: 4.1, 
      transactions: 456,
      actionable: 'Create winter comfort bundles',
      impact: '+22% seasonal item sales'
    }
  ];

  const sequentialPatterns = [
    {
      sequence: 'Morning Coffee → Lunch Salad → Afternoon Tea',
      frequency: 234,
      dayPattern: 'Weekdays 9am → 12pm → 3pm',
      customerType: 'Office workers',
      opportunity: 'Create all-day meal plans',
      revenue: '$23.45 avg per sequence'
    },
    {
      sequence: 'Pastry → Coffee → Newspaper',
      frequency: 189,
      dayPattern: 'Weekend mornings 8-10am',
      customerType: 'Leisure customers',
      opportunity: 'Weekend relaxation packages',
      revenue: '$16.80 avg per sequence'
    },
    {
      sequence: 'Sandwich → Chips → Soda',
      frequency: 156,
      dayPattern: 'Lunch rush 11am-2pm',
      customerType: 'Quick lunch crowd',
      opportunity: 'Express lunch combos',
      revenue: '$14.95 avg per sequence'
    },
    {
      sequence: 'Study Group: Multiple Coffees → Shared Dessert',
      frequency: 98,
      dayPattern: 'Evenings & weekends',
      customerType: 'Students',
      opportunity: 'Group study packages',
      revenue: '$31.20 avg per group'
    }
  ];

  const customerJourney = [
    { step: 'Enter Store', dropoff: 0, users: 1000, conversion: 100 },
    { step: 'Browse Menu', dropoff: 8, users: 920, conversion: 92 },
    { step: 'Decide on Main Item', dropoff: 12, users: 809, conversion: 81 },
    { step: 'Consider Add-ons', dropoff: 25, users: 607, conversion: 61 },
    { step: 'Place Order', dropoff: 5, users: 577, conversion: 58 },
    { step: 'Complete Payment', dropoff: 3, users: 560, conversion: 56 },
    { step: 'Receive Order', dropoff: 1, users: 554, conversion: 55 }
  ];

  const aiRecommendations = [
    {
      category: 'Store Layout',
      priority: 'High',
      action: 'Move croissant display within 3 feet of coffee counter',
      reason: 'Coffee → Croissant rule shows 73.2% confidence, 2.4x lift',
      expectedImpact: '+15% croissant sales, +$234 daily revenue',
      timeline: '1 week implementation'
    },
    {
      category: 'Digital Menu',
      priority: 'High', 
      action: 'Auto-suggest orange juice when breakfast sandwich added to order',
      reason: '82.1% confidence rate, highest lift at 3.2x',
      expectedImpact: '+18% morning beverage attach rate',
      timeline: '2 days POS update'
    },
    {
      category: 'Inventory',
      priority: 'Medium',
      action: 'Stock marshmallows 4x higher during winter months',
      reason: 'Hot chocolate → marshmallow pattern shows 89.4% confidence',
      expectedImpact: '+22% seasonal sales, reduce stockouts',
      timeline: 'Next inventory cycle'
    },
    {
      category: 'Promotions',
      priority: 'Medium',
      action: 'Create "Study Group Special" - 4 coffees + shared dessert discount',
      reason: 'Sequential pattern shows $31.20 avg group orders',
      expectedImpact: '+25% evening revenue, student loyalty',
      timeline: '1 week marketing prep'
    },
    {
      category: 'Customer Experience',
      priority: 'Low',
      action: 'Reduce decision friction in add-on step (25% drop-off)',
      reason: 'Journey analysis shows highest drop-off at consideration phase',
      expectedImpact: '+15% conversion rate improvement',
      timeline: '2 weeks UX optimization'
    }
  ];

  const currentData = salesData[selectedPeriod];
  const currentTopProducts = topProductsByPeriod[selectedPeriod];
  const currentPaymentData = paymentDataByPeriod[selectedPeriod];

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

  // Product Predictions Page Component
  const ProductPredictionsPage = ({ title, data }) => (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Predictions - {title}</h1>
          <p className="text-gray-600">AI-Powered Product Forecasting • Updated {currentTime.toLocaleString()}</p>
        </div>
        <button
          onClick={() => setCurrentPage('predictions')}
          className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          ← Back to Predictions
        </button>
      </div>

      {/* Product Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data.map((product, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className={`inline-block w-8 h-8 rounded-full text-sm text-white font-bold flex items-center justify-center mr-3 ${
                  product.growth === 'NEW' || parseFloat(product.growth) > 50 ? 'bg-green-500' : 
                  parseFloat(product.growth) > 20 ? 'bg-blue-500' : 
                  parseFloat(product.growth) > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${product.confidence >= 90 ? 'bg-green-500' : product.confidence >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">{product.confidence}% confidence</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.growth === 'NEW' || parseFloat(product.growth) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.growth}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Sales:</span>
                <span className="font-semibold">{product.currentSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Predicted Sales:</span>
                <span className="font-semibold text-blue-600">{product.predictedSales.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Prediction Reason:</p>
                <p className="text-xs text-gray-600">{product.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{data.filter(p => p.growth === 'NEW' || parseFloat(p.growth) > 0).length}</p>
          <p className="text-sm text-gray-600">Products Growing</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{data.filter(p => parseFloat(p.growth) < 0).length}</p>
          <p className="text-sm text-gray-600">Products Declining</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{data.filter(p => p.growth === 'NEW').length}</p>
          <p className="text-sm text-gray-600">New Products</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{Math.round(data.reduce((acc, p) => acc + p.confidence, 0) / data.length)}%</p>
          <p className="text-sm text-gray-600">Avg Confidence</p>
        </div>
      </div>
    </div>
  );

  // Frequent Pattern Analysis Page
  if (currentPage === 'patterns') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
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
  }

  // Check for product prediction pages
  if (currentPage === 'products-nextday') {
    return <ProductPredictionsPage title="Next Day" data={productPredictions.nextDay} />;
  }
  if (currentPage === 'products-nextweek') {
    return <ProductPredictionsPage title="Next Week" data={productPredictions.nextWeek} />;
  }
  if (currentPage === 'products-nextmonth') {
    return <ProductPredictionsPage title="Next Month" data={productPredictions.nextMonth} />;
  }
  if (currentPage === 'products-nextquarter') {
    return <ProductPredictionsPage title="Next Quarter" data={productPredictions.nextQuarter} />;
  }
  if (currentPage === 'products-nextyear') {
    return <ProductPredictionsPage title="Next Year" data={productPredictions.nextYear} />;
  }

  // Predictions Page
  if (currentPage === 'predictions') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
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
            onViewProducts={() => setCurrentPage('products-nextday')}
          />
          <PredictionCard
            title="Next Week" 
            predicted={predictions.nextWeek.sales}
            confidence={predictions.nextWeek.confidence}
            factors={predictions.nextWeek.factors}
            onViewProducts={() => setCurrentPage('products-nextweek')}
          />
          <PredictionCard
            title="Next Month"
            predicted={predictions.nextMonth.sales}
            confidence={predictions.nextMonth.confidence}
            factors={predictions.nextMonth.factors}
            onViewProducts={() => setCurrentPage('products-nextmonth')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PredictionCard
            title="Next Quarter"
            predicted={predictions.nextQuarter.sales}
            confidence={predictions.nextQuarter.confidence}
            factors={predictions.nextQuarter.factors}
            onViewProducts={() => setCurrentPage('products-nextquarter')}
          />
          <PredictionCard
            title="Next Year"
            predicted={predictions.nextYear.sales}
            confidence={predictions.nextYear.confidence}
            factors={predictions.nextYear.factors}
            onViewProducts={() => setCurrentPage('products-nextyear')}
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
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">POS Dashboard</h1>
          <p className="text-gray-600">Live Business Intelligence • {currentTime.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage('predictions')}
            className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700"
          >
            📊 Predictions
          </button>
          <button
            onClick={() => setCurrentPage('patterns')}
            className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700"
          >
            🔍 Pattern Analysis
          </button>
          {['today', 'week', 'month', 'quarterly', 'yearly'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedPeriod === period 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {period === 'quarterly' ? 'Quarter' : period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

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
          value={`${currentData.total.toLocaleString()}`}
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
          value={`${currentData.avgOrder.toFixed(2)}`}
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
              <Tooltip formatter={(value) => [`${value}`, 'Sales']} />
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

export default POSDashboard;