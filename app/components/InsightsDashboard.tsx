'use client';

import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  ChevronRight, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Coffee, 
  Car, 
  ShoppingBag, 
  Home, 
  CreditCard, 
  Zap, 
  Lightbulb,
  Star,
  Clock,
  Download,
  Share
} from 'lucide-react';

interface InsightsDashboardProps {
  onBack: () => void;
  user: any;
  transactions: any[];
}

interface FilterState {
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  categories: string[];
  minAmount: number;
  maxAmount: number;
}

const categoryIcons = {
  'Food & Drink': Coffee,
  'Transportation': Car,
  'Shopping': ShoppingBag,
  'Bills & Utilities': Home,
  'Entertainment': Star,
  'Groceries': ShoppingBag,
  'Health & Fitness': Target,
  'Subscriptions': CreditCard
};

const insights = [
  {
    id: 'spending_trend',
    type: 'trend',
    title: 'Spending Trend',
    description: 'Your spending decreased by 15% this month',
    change: -15,
    positive: true,
    icon: TrendingDown,
    color: 'green'
  },
  {
    id: 'top_category',
    type: 'category',
    title: 'Top Category',
    description: 'Food & Drink accounts for 32% of your spending',
    amount: 485.50,
    icon: Coffee,
    color: 'blue'
  },
  {
    id: 'budget_alert',
    type: 'alert',
    title: 'Budget Alert',
    description: 'You\'re 85% through your monthly shopping budget',
    progress: 85,
    icon: AlertCircle,
    color: 'orange'
  },
  {
    id: 'savings_opportunity',
    type: 'suggestion',
    title: 'Savings Opportunity',
    description: 'Cancel unused subscriptions to save $29/month',
    savings: 29,
    icon: Lightbulb,
    color: 'purple'
  }
];

const recommendations = [
  {
    id: 'rec_1',
    title: 'Set up automatic savings',
    description: 'Based on your spending pattern, you could save $150/month',
    impact: 'High',
    effort: 'Low',
    category: 'Savings',
    icon: Target,
    color: 'green'
  },
  {
    id: 'rec_2',
    title: 'Review subscription services',
    description: 'You have 6 active subscriptions totaling $89/month',
    impact: 'Medium',
    effort: 'Low',
    category: 'Optimization',
    icon: CreditCard,
    color: 'blue'
  },
  {
    id: 'rec_3',
    title: 'Optimize transportation costs',
    description: 'Consider a monthly transit pass to save $45/month',
    impact: 'Medium',
    effort: 'Medium',
    category: 'Transport',
    icon: Car,
    color: 'orange'
  },
  {
    id: 'rec_4',
    title: 'Meal planning',
    description: 'Plan weekly meals to reduce food waste and save $80/month',
    impact: 'High',
    effort: 'Medium',
    category: 'Food',
    icon: Coffee,
    color: 'purple'
  }
];

export default function InsightsDashboard({ onBack, user, transactions }: InsightsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'categories' | 'recommendations'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    timeRange: 'month',
    categories: [],
    minAmount: 0,
    maxAmount: 1000
  });

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(t => filters.categories.includes(t.category));
    }

    // Apply amount filter
    filtered = filtered.filter(t => t.amount >= filters.minAmount && t.amount <= filters.maxAmount);

    return filtered;
  }, [transactions, filters]);

  const spendingData = useMemo(() => {
    const categoryTotals = filteredTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const avgTransaction = totalSpent / filteredTransactions.length || 0;

    return {
      categoryTotals,
      totalSpent,
      avgTransaction,
      transactionCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const topCategories = useMemo(() => {
    return Object.entries(spendingData.categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / spendingData.totalSpent) * 100
      }));
  }, [spendingData]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || ShoppingBag;
    return IconComponent;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatAmount(spendingData.totalSpent)}</p>
          <p className="text-xs text-green-600">↓ 15% from last month</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Avg Transaction</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatAmount(spendingData.avgTransaction)}</p>
          <p className="text-xs text-blue-600">↑ 5% from last month</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Key Insights</h3>
        </div>
        <div className="p-4 space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg bg-${insight.color}-100`}>
                <insight.icon className={`w-4 h-4 text-${insight.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{insight.title}</p>
                <p className="text-xs text-gray-600">{insight.description}</p>
              </div>
              {insight.type === 'trend' && (
                <span className={`text-xs font-medium ${insight.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {insight.change > 0 ? '+' : ''}{insight.change}%
                </span>
              )}
              {insight.type === 'suggestion' && (
                <span className="text-xs font-medium text-purple-600">
                  ${insight.savings}/mo
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Top Categories</h3>
        </div>
        <div className="p-4 space-y-3">
          {topCategories.map((item, index) => {
            const IconComponent = getCategoryIcon(item.category);
            return (
              <div key={item.category} className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 flex-1">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatAmount(item.amount)}</p>
                  <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Spending Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Spending Trends</h3>
        </div>
        <div className="p-4">
          <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Interactive spending chart</p>
              <p className="text-xs text-gray-500">Shows daily/weekly/monthly trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Trend Analysis</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Spending Decreased</p>
                <p className="text-sm text-gray-600">Down 15% from last month</p>
              </div>
            </div>
            <span className="text-lg font-bold text-green-600">-$245</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Peak Spending Day</p>
                <p className="text-sm text-gray-600">Fridays average $89 more</p>
              </div>
            </div>
            <span className="text-lg font-bold text-blue-600">Fri</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Most Active Category</p>
                <p className="text-sm text-gray-600">Food & Drink, 23 transactions</p>
              </div>
            </div>
            <span className="text-lg font-bold text-purple-600">23</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      {/* Category Breakdown Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Category Breakdown</h3>
        </div>
        <div className="p-4">
          <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Category distribution chart</p>
              <p className="text-xs text-gray-500">Visual breakdown of spending by category</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Category Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Category Details</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {topCategories.map((item, index) => {
            const IconComponent = getCategoryIcon(item.category);
            return (
              <div key={item.category} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.category}</p>
                      <p className="text-sm text-gray-600">{item.percentage.toFixed(1)}% of total spending</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatAmount(item.amount)}</p>
                    <p className="text-xs text-gray-500">#{index + 1} category</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      {recommendations.map((rec) => (
        <div key={rec.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-${rec.color}-100`}>
                <rec.icon className={`w-5 h-5 text-${rec.color}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                    {rec.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">Effort: {rec.effort}</span>
                    <span className="text-xs text-gray-500">Category: {rec.category}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Insights</h1>
              <p className="text-sm text-gray-600">Financial analytics & recommendations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle filters"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 py-3">
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: Number(e.target.value) }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: Number(e.target.value) }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-6 px-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'trends', label: 'Trends' },
            { id: 'categories', label: 'Categories' },
            { id: 'recommendations', label: 'Recommendations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </div>
    </div>
  );
} 