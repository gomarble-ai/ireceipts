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
  ZoomOut,
  Wallet,
  QrCode,
  MapPin,
  Star,
  Clock,
  ArrowLeft,
  CheckCircle,
  RefreshCw
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

// Dummy Google Passes data
const googlePasses = [
  {
    id: 'pass001',
    type: 'boarding_pass',
    title: 'United Airlines',
    subtitle: 'Flight UA1234',
    description: 'SFO → LAX',
    date: '2024-01-15',
    time: '14:30',
    status: 'active',
    color: 'bg-blue-600',
    icon: '✈️',
    details: {
      passengerName: 'John Doe',
      seat: '12A',
      gate: 'B15',
      terminal: 'Terminal 3'
    }
  },
  {
    id: 'pass002',
    type: 'event_ticket',
    title: 'Concert at Madison Square Garden',
    subtitle: 'The Weeknd - After Hours Tour',
    description: 'Section 101, Row 5, Seat 12',
    date: '2024-01-20',
    time: '20:00',
    status: 'active',
    color: 'bg-purple-600',
    icon: '🎵',
    details: {
      venue: 'Madison Square Garden',
      section: '101',
      row: '5',
      seat: '12'
    }
  },
  {
    id: 'pass003',
    type: 'coupon',
    title: 'Starbucks',
    subtitle: '20% Off Any Drink',
    description: 'Valid until Jan 31, 2024',
    date: '2024-01-31',
    time: '23:59',
    status: 'active',
    color: 'bg-green-600',
    icon: '☕',
    details: {
      discount: '20%',
      validUntil: '2024-01-31',
      storeLocation: 'Any Starbucks location'
    }
  },
  {
    id: 'pass004',
    type: 'loyalty_card',
    title: 'Subway Rewards',
    subtitle: 'Gold Member',
    description: '1,250 points available',
    date: '2024-12-31',
    time: '23:59',
    status: 'active',
    color: 'bg-yellow-600',
    icon: '🥪',
    details: {
      points: '1,250',
      tier: 'Gold',
      nextReward: '500 points to next reward'
    }
  },
  {
    id: 'pass005',
    type: 'boarding_pass',
    title: 'American Airlines',
    subtitle: 'Flight AA5678',
    description: 'LAX → JFK',
    date: '2024-01-10',
    time: '09:15',
    status: 'expired',
    color: 'bg-gray-500',
    icon: '✈️',
    details: {
      passengerName: 'John Doe',
      seat: '8C',
      gate: 'A12',
      terminal: 'Terminal 1'
    }
  }
];

type PassesStep = 'list' | 'camera' | 'processing' | 'success';

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

  // New state for Google Passes
  const [showPassesModal, setShowPassesModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState<any>(null);
  const [showPassDetails, setShowPassDetails] = useState(false);
  const [passesStep, setPassesStep] = useState<PassesStep>('list');
  const [processingProgress, setProcessingProgress] = useState(0);

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
      case 'passes':
        setShowPassesModal(true);
        break;
      case 'add':
        onNavigate('scan-upload');
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
      default:
        console.log(`Tab ${tab} clicked`);
    }
  };

  const handleTransactionClick = (transactionId: string) => {
    console.log(`Transaction ${transactionId} clicked`);
  };

  const handleInsightAction = (action: string, actionType: string) => {
    if (actionType === 'external') {
      // Handle external actions like canceling subscriptions
      if (action === 'Cancel Now') {
        setActionModalContent({
          title: 'Cancel Subscription',
          message: 'Are you sure you want to cancel your Spotify Premium subscription? This action cannot be undone.',
          actionType: 'cancel',
          onConfirm: () => {
            console.log('Subscription cancelled');
            setShowActionModal(false);
            setActionModalContent(null);
          }
        });
      } else if (action === 'Manage') {
        setActionModalContent({
          title: 'Manage Subscription',
          message: 'You will be redirected to Adobe\'s website to manage your Creative Cloud subscription.',
          actionType: 'manage',
          onConfirm: () => {
            console.log('Redirect to Adobe website');
            setShowActionModal(false);
            setActionModalContent(null);
          }
        });
      }
      setShowActionModal(true);
    } else {
      // Handle navigation actions
      switch (action) {
        case 'View Budget':
          onNavigate('insights-dashboard');
          break;
        case 'Adjust Budget':
          onNavigate('insights-dashboard');
          break;
        default:
          console.log(`Action ${action} clicked`);
      }
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
    console.log('Download receipt');
  };

  const handleShareReceipt = () => {
    console.log('Share receipt');
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setActionModalContent(null);
  };

  // New Google Passes handlers
  const handlePassClick = (pass: any) => {
    setSelectedPass(pass);
    setShowPassDetails(true);
  };

  const handleClosePassesModal = () => {
    setShowPassesModal(false);
    setSelectedPass(null);
    setShowPassDetails(false);
    setPassesStep('list');
  };

  const handleAddPass = () => {
    setPassesStep('camera');
  };

  const handleCapturePass = () => {
    setPassesStep('processing');
    setProcessingProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPassesStep('success');
          return 100;
        }
        return prev + 4;
      });
    }, 100);
  };

  const handleProcessingComplete = () => {
    setPassesStep('list');
    setProcessingProgress(0);
  };

  const renderPassesContent = () => {
    switch (passesStep) {
      case 'camera':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                onClick={() => setPassesStep('list')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">Scan Pass</h3>
              <div className="w-9" />
            </div>
            
            <div className="flex-1 bg-black relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-48 border-2 border-white rounded-lg opacity-50"></div>
              </div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleCapturePass}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-8 h-8 text-gray-900" />
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600 text-center">
                Position the pass or QR code within the frame and tap to capture
              </p>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="flex flex-col h-full items-center justify-center p-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6">
              <RefreshCw className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Pass</h3>
            <p className="text-gray-600 text-center mb-6">
              Analyzing the pass and extracting details...
            </p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{processingProgress}%</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col h-full items-center justify-center p-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pass Added!</h3>
            <p className="text-gray-600 text-center mb-6">
              Your concert ticket has been successfully added to your wallet.
            </p>
            <button
              onClick={handleProcessingComplete}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Passes
            </button>
          </div>
        );

      default:
        return (
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {googlePasses.map((pass) => (
                <button
                  key={pass.id}
                  onClick={() => handlePassClick(pass)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    pass.status === 'active'
                      ? 'border-gray-200 hover:border-blue-300 bg-white'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 ${pass.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                        {pass.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{pass.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{pass.subtitle}</p>
                        <p className="text-xs text-gray-500">{pass.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(pass.date).toLocaleDateString()} at {pass.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pass.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pass.status === 'active' ? 'Active' : 'Expired'}
                      </span>
                      <QrCode className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
    }
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
              onClick={() => handleQuickAction('passes')}
              className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
            >
              <Wallet className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">Google Passes</span>
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
              <div
                role="button"
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
              </div>
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

      {/* Google Passes Modal (Fullscreen) */}
      {showPassesModal && (
        <div className="fixed inset-0 bg-white flex flex-col z-50">
          {/* Outer Header with title, add and close */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Google Passes</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleAddPass}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Add Pass"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={handleClosePassesModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close Passes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-auto">
            {renderPassesContent()}
          </div>
        </div>
      )}

      {/* Pass Details Modal */}
      {showPassDetails && selectedPass && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pass Details</h3>
              <button
                onClick={() => setShowPassDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className={`w-full ${selectedPass.color} rounded-lg p-4 text-white text-center mb-4`}>
                <div className="text-3xl mb-2">{selectedPass.icon}</div>
                <h4 className="font-bold text-lg">{selectedPass.title}</h4>
                <p className="text-sm opacity-90">{selectedPass.subtitle}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Description:</span>
                  <span className="text-sm text-gray-600">{selectedPass.description}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Date:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(selectedPass.date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Time:</span>
                  <span className="text-sm text-gray-600">{selectedPass.time}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    selectedPass.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedPass.status === 'active' ? 'Active' : 'Expired'}
                  </span>
                </div>
                
                                 {Object.entries(selectedPass.details).map(([key, value]) => (
                   <div key={key} className="flex items-center justify-between">
                     <span className="text-sm font-medium text-gray-700 capitalize">
                       {key.replace(/([A-Z])/g, ' $1').trim()}:
                     </span>
                     <span className="text-sm text-gray-600">{String(value)}</span>
                   </div>
                 ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Show this QR code at the venue
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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