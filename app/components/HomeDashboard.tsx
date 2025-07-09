'use client';

import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Camera, 
  Upload, 
  Plus, 
  Mic, 
  Home, 
  Scan, 
  MessageSquare, 
  BarChart3, 
  User,
  ArrowRight,
  Receipt,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Calendar,
  ExternalLink,
  HelpCircle,
  Eye,
  X,
  Download,
  Share2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface HomeDashboardProps {
  user: any;
  onNavigate: (screen: string) => void;
}

// Dummy transaction data
const recentTransactions = [
  {
    id: 'txn001',
    merchant: 'Starbucks',
    amount: 5.47,
    currency: 'USD',
    date: '2024-01-08T09:30:00Z',
    category: 'Food & Drink',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    logo: '☕'
  },
  {
    id: 'txn002',
    merchant: 'Amazon',
    amount: 89.99,
    currency: 'USD',
    date: '2024-01-07T14:22:00Z',
    category: 'Shopping',
    hasReceipt: false,
    receiptUrl: null,
    logo: '📦'
  },
  {
    id: 'txn003',
    merchant: 'Shell Gas Station',
    amount: 45.30,
    currency: 'USD',
    date: '2024-01-06T16:45:00Z',
    category: 'Transportation',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    logo: '⛽'
  },
  {
    id: 'txn004',
    merchant: 'Whole Foods',
    amount: 127.65,
    currency: 'USD',
    date: '2024-01-05T11:15:00Z',
    category: 'Groceries',
    hasReceipt: true,
    receiptUrl: 'https://images.unsplash.com/photo-1572715376701-98568319fd0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    logo: '🥕'
  },
  {
    id: 'txn005',
    merchant: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    date: '2024-01-04T08:00:00Z',
    category: 'Entertainment',
    hasReceipt: false,
    receiptUrl: null,
    logo: '🎬'
  }
];

// Dummy insights data
const insights = [
  {
    id: 'insight001',
    type: 'spending_trend',
    title: 'Food spending up 15%',
    description: 'You\'ve spent $240 on food vs $208 last month',
    action: 'View Budget',
    actionType: 'navigate',
    priority: 'medium',
    icon: TrendingUp,
    color: 'bg-amber-500'
  },
  {
    id: 'insight002',
    type: 'budget_alert',
    title: 'Monthly budget: 78% used',
    description: 'You have $440 left for the rest of January',
    action: 'Adjust Budget',
    actionType: 'navigate',
    priority: 'high',
    icon: AlertCircle,
    color: 'bg-red-500'
  },
  {
    id: 'insight003',
    type: 'savings_opportunity',
    title: 'Save $12/month',
    description: 'Cancel unused Spotify Premium subscription',
    action: 'Cancel Now',
    actionType: 'external',
    priority: 'low',
    icon: CreditCard,
    color: 'bg-green-500'
  },
  {
    id: 'insight004',
    type: 'subscription_reminder',
    title: 'Adobe Creative renews soon',
    description: 'Auto-renewal on Jan 15th ($52.99/month)',
    action: 'Manage',
    actionType: 'external',
    priority: 'medium',
    icon: Calendar,
    color: 'bg-blue-500'
  }
];

export default function HomeDashboard({ user, onNavigate }: HomeDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<{
    transaction: any;
    receiptUrl: string;
  } | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalContent, setActionModalContent] = useState<{
    title: string;
    message: string;
    actionType: 'cancel' | 'manage';
    onConfirm?: () => void;
  } | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'scan':
        onNavigate('scan-upload');
        break;
      case 'upload':
        onNavigate('scan-upload');
        break;
      case 'add':
        onNavigate('scan-upload'); // Navigate to scan-upload which has manual entry options
        break;
      case 'voice':
        onNavigate('chat-query');
        break;
      default:
        console.log(`${action} clicked`);
    }
  };

  const handleBottomNavigation = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        // Already on home
        break;
      case 'scan':
        onNavigate('scan-upload');
        break;
      case 'chat':
        onNavigate('chat-query');
        break;
      case 'insights':
        onNavigate('insights-dashboard');
        break;
      case 'profile':
        onNavigate('profile-management');
        break;
    }
  };

  const handleTransactionClick = (transactionId: string) => {
    // Navigate to transactions advanced view
    onNavigate('transactions-advanced');
  };

  const handleInsightAction = (action: string, actionType: string) => {
    switch (action) {
      case 'View Budget':
      case 'Adjust Budget':
        onNavigate('insights-dashboard');
        break;
      case 'Cancel Now':
        setActionModalContent({
          title: 'Cancel Spotify Premium',
          message: 'Are you sure you want to cancel your Spotify Premium subscription? You\'ll lose access to premium features immediately.',
          actionType: 'cancel',
          onConfirm: () => {
            // In a real app, this would call the cancellation API
            console.log('Spotify subscription cancelled');
            setShowActionModal(false);
            // Show success feedback
            setTimeout(() => {
              setActionModalContent({
                title: 'Subscription Cancelled',
                message: 'Your Spotify Premium subscription has been successfully cancelled. You\'ll save $12/month starting next billing cycle.',
                actionType: 'cancel'
              });
              setShowActionModal(true);
            }, 500);
          }
        });
        setShowActionModal(true);
        break;
      case 'Manage':
        setActionModalContent({
          title: 'Manage Adobe Creative Suite',
          message: 'You\'ll be redirected to Adobe\'s website to manage your subscription, billing, and renewal settings.',
          actionType: 'manage',
          onConfirm: () => {
            // In a real app, this would open external link
            console.log('Redirecting to Adobe management page');
            setShowActionModal(false);
            // Simulate external redirect
            setTimeout(() => {
              setActionModalContent({
                title: 'Redirected Successfully',
                message: 'You\'ve been redirected to Adobe\'s subscription management page. Manage your billing and auto-renewal settings there.',
                actionType: 'manage'
              });
              setShowActionModal(true);
            }, 500);
          }
        });
        setShowActionModal(true);
        break;
      default:
        onNavigate('insights-dashboard');
    }
  };

  const handleViewReceipt = (transaction: any, receiptUrl: string) => {
    setSelectedReceipt({ transaction, receiptUrl });
    setShowReceiptModal(true);
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  const handleDownloadReceipt = () => {
    if (selectedReceipt?.receiptUrl) {
      // In a real app, this would download the receipt
      console.log('Downloading receipt:', selectedReceipt.receiptUrl);
    }
  };

  const handleShareReceipt = () => {
    if (selectedReceipt?.receiptUrl) {
      // In a real app, this would share the receipt
      console.log('Sharing receipt:', selectedReceipt.receiptUrl);
    }
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setActionModalContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate('profile-management')}
                className="w-10 h-10 rounded-full overflow-hidden"
              >
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">iReceipts</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name.split(' ')[0]}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onNavigate('help-center')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Help Center"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => onNavigate('notifications-center')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ask me anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onFocus={() => onNavigate('chat-query')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Quick Actions */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickAction('scan')}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <Camera className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Scan Receipt</span>
            </button>
            <button
              onClick={() => handleQuickAction('upload')}
              className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
            >
              <Upload className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">Upload Doc</span>
            </button>
            <button
              onClick={() => handleQuickAction('add')}
              className="flex flex-col items-center space-y-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              <Plus className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Add Transaction</span>
            </button>
            <button
              onClick={() => handleQuickAction('voice')}
              className="flex flex-col items-center space-y-2 p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
            >
              <Mic className="w-6 h-6 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">Voice Search</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <button
              onClick={() => onNavigate('transactions-advanced')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <button
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm">
                    {transaction.logo}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{transaction.merchant}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </p>
                    <div className="flex items-center justify-end space-x-1">
                      <Receipt className="w-3 h-3 text-gray-400" />
                      <span className={`text-xs ${
                        transaction.hasReceipt ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {transaction.hasReceipt ? 'Linked' : 'Missing'}
                      </span>
                    </div>
                  </div>
                  {transaction.hasReceipt && transaction.receiptUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewReceipt(transaction, transaction.receiptUrl);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      aria-label="View receipt"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-white px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
            <button
              onClick={() => onNavigate('insights-dashboard')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                onClick={() => onNavigate('insights-dashboard')}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${insight.color} rounded-lg flex items-center justify-center text-white`}>
                      <insight.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsightAction(insight.action, insight.actionType);
                        }}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <span>{insight.action}</span>
                        {insight.actionType === 'external' ? (
                          <ExternalLink className="w-3 h-3 ml-1" />
                        ) : (
                          <ArrowRight className="w-3 h-3 ml-1" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'scan', icon: Scan, label: 'Scan' },
            { id: 'chat', icon: MessageSquare, label: 'Chat' },
            { id: 'insights', icon: BarChart3, label: 'Insights' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleBottomNavigation(tab.id)}
              className={`flex flex-col items-center space-y-1 p-2 min-w-12 ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Receipt</h3>
                <p className="text-sm text-gray-600">
                  {selectedReceipt.transaction.merchant} • {formatDate(selectedReceipt.transaction.date)}
                </p>
              </div>
              <button
                onClick={handleCloseReceiptModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center">
                <img
                  src={selectedReceipt.receiptUrl}
                  alt="Receipt"
                  className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatAmount(selectedReceipt.transaction.amount, selectedReceipt.transaction.currency)}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-sm text-gray-600">
                    {selectedReceipt.transaction.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Download receipt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShareReceipt}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Share receipt"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && actionModalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            {/* Modal Header */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {actionModalContent.title}
                </h3>
                <button
                  onClick={handleCloseActionModal}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                {actionModalContent.message}
              </p>
              
              <div className="flex space-x-3">
                {actionModalContent.onConfirm ? (
                  <>
                    <button
                      onClick={handleCloseActionModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={actionModalContent.onConfirm}
                      className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                        actionModalContent.actionType === 'cancel' 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {actionModalContent.actionType === 'cancel' ? 'Cancel Subscription' : 'Continue'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCloseActionModal}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Got it
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 