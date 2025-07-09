'use client';

import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  X, 
  Trash2, 
  Archive, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Receipt, 
  CreditCard, 
  TrendingUp, 
  Target, 
  Calendar, 
  Clock, 
  Mail, 
  Smartphone, 
  MessageCircle, 
  Star, 
  Shield, 
  Heart, 
  Lightbulb,
  Zap,
  Gift,
  Users,
  Globe,
  ChevronRight,
  CheckSquare,
  Square,
  SortAsc,
  SortDesc,
  RefreshCw,
  Plus,
  Minus,
  Download
} from 'lucide-react';

interface NotificationsCenterProps {
  onBack: () => void;
  user: any;
}

interface Notification {
  id: string;
  type: 'alert' | 'reminder' | 'system' | 'achievement' | 'security' | 'marketing';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  urgent: boolean;
  actionRequired: boolean;
  category: string;
  relatedData?: any;
}

interface NotificationSettings {
  categories: {
    [key: string]: {
      push: boolean;
      email: boolean;
      sms: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  preview: boolean;
}

const notificationTypes = {
  alert: { icon: AlertCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-600' },
  reminder: { icon: Clock, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
  system: { icon: Info, color: 'gray', bg: 'bg-gray-50', text: 'text-gray-600' },
  achievement: { icon: Star, color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-600' },
  security: { icon: Shield, color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
  marketing: { icon: Gift, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600' }
};

const dummyNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'alert',
    title: 'Budget Alert',
    message: 'You\'ve exceeded your monthly shopping budget by $45.23',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    urgent: true,
    actionRequired: true,
    category: 'Budget',
    relatedData: { amount: 45.23, category: 'Shopping' }
  },
  {
    id: 'n2',
    type: 'reminder',
    title: 'Receipt Pending',
    message: 'You have 3 transactions waiting for receipt upload',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    urgent: false,
    actionRequired: true,
    category: 'Receipts',
    relatedData: { count: 3 }
  },
  {
    id: 'n3',
    type: 'achievement',
    title: 'Goal Achieved!',
    message: 'Congratulations! You\'ve successfully tracked 100 transactions',
    timestamp: '2024-01-15T08:45:00Z',
    read: true,
    urgent: false,
    actionRequired: false,
    category: 'Achievements',
    relatedData: { milestone: 100 }
  },
  {
    id: 'n4',
    type: 'security',
    title: 'New Login Detected',
    message: 'Your account was accessed from a new device in San Francisco',
    timestamp: '2024-01-14T22:30:00Z',
    read: false,
    urgent: true,
    actionRequired: true,
    category: 'Security',
    relatedData: { location: 'San Francisco', device: 'iPhone' }
  },
  {
    id: 'n5',
    type: 'system',
    title: 'App Update Available',
    message: 'Version 1.2.0 is now available with new features and improvements',
    timestamp: '2024-01-14T16:00:00Z',
    read: true,
    urgent: false,
    actionRequired: false,
    category: 'Updates',
    relatedData: { version: '1.2.0' }
  },
  {
    id: 'n6',
    type: 'reminder',
    title: 'Weekly Review',
    message: 'Time for your weekly spending review. Check your insights!',
    timestamp: '2024-01-14T12:00:00Z',
    read: false,
    urgent: false,
    actionRequired: false,
    category: 'Reviews',
    relatedData: { period: 'weekly' }
  },
  {
    id: 'n7',
    type: 'marketing',
    title: 'Premium Features',
    message: 'Unlock advanced analytics and reporting with Premium',
    timestamp: '2024-01-13T14:30:00Z',
    read: true,
    urgent: false,
    actionRequired: false,
    category: 'Promotions',
    relatedData: { feature: 'Premium' }
  },
  {
    id: 'n8',
    type: 'alert',
    title: 'Subscription Reminder',
    message: 'Your Netflix subscription ($15.99) will renew tomorrow',
    timestamp: '2024-01-13T11:00:00Z',
    read: false,
    urgent: false,
    actionRequired: false,
    category: 'Subscriptions',
    relatedData: { amount: 15.99, service: 'Netflix' }
  }
];

export default function NotificationsCenter({ onBack, user }: NotificationsCenterProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'unread'>('newest');
  
  const [settings, setSettings] = useState<NotificationSettings>({
    categories: {
      Budget: { push: true, email: true, sms: false },
      Receipts: { push: true, email: false, sms: false },
      Security: { push: true, email: true, sms: true },
      Achievements: { push: true, email: false, sms: false },
      Updates: { push: false, email: true, sms: false },
      Reviews: { push: true, email: false, sms: false },
      Promotions: { push: false, email: true, sms: false },
      Subscriptions: { push: true, email: true, sms: false }
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'real-time',
    preview: true
  });

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply tab filter
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      if (filterType === 'urgent') {
        filtered = filtered.filter(n => n.urgent);
      } else if (filterType === 'action-required') {
        filtered = filtered.filter(n => n.actionRequired);
      } else {
        filtered = filtered.filter(n => n.type === filterType);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'unread':
          return Number(a.read) - Number(b.read);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notifications, activeTab, searchQuery, filterType, sortBy]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.urgent && !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: false } : n)
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkAction = (action: 'read' | 'unread' | 'delete' | 'archive') => {
    switch (action) {
      case 'read':
        setNotifications(prev => 
          prev.map(n => selectedNotifications.includes(n.id) ? { ...n, read: true } : n)
        );
        break;
      case 'unread':
        setNotifications(prev => 
          prev.map(n => selectedNotifications.includes(n.id) ? { ...n, read: false } : n)
        );
        break;
      case 'delete':
        setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
        break;
      case 'archive':
        // In a real app, this would move to archived notifications
        console.log('Archiving notifications:', selectedNotifications);
        break;
    }
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  const renderNotificationItem = (notification: Notification) => {
    const typeConfig = notificationTypes[notification.type];
    const IconComponent = typeConfig.icon;
    const isSelected = selectedNotifications.includes(notification.id);

    return (
      <div 
        key={notification.id} 
        className={`flex items-start space-x-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
          !notification.read ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        {/* Selection Checkbox */}
        <button
          onClick={() => handleSelectNotification(notification.id)}
          className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-blue-600" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>

        {/* Notification Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${typeConfig.bg}`}>
          <IconComponent className={`w-5 h-5 ${typeConfig.text}`} />
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                {notification.title}
              </h3>
              {notification.urgent && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Urgent
                </span>
              )}
              {notification.actionRequired && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Action Required
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {notification.category}
            </span>
            
            <div className="flex items-center space-x-2">
              {!notification.read ? (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Mark as read
                </button>
              ) : (
                <button
                  onClick={() => handleMarkAsUnread(notification.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Mark as unread
                </button>
              )}
              
              <button
                onClick={() => handleDeleteNotification(notification.id)}
                className="text-xs text-red-600 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Read Status Indicator */}
        {!notification.read && (
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
        )}
      </div>
    );
  };

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-4 space-y-3">
          <button 
            onClick={handleMarkAllAsRead}
            className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Mark All as Read</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Export Notifications</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Clear All Notifications</span>
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Frequency</p>
              <p className="text-sm text-gray-600">How often to receive notifications</p>
            </div>
            <select
              value={settings.frequency}
              onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="real-time">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Show Preview</p>
              <p className="text-sm text-gray-600">Show notification content in preview</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, preview: !prev.preview }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.preview ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.preview ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Category Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Category Settings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(settings.categories).map(([category, prefs]) => (
            <div key={category} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{category}</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['push', 'email', 'sms'].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={prefs[method as keyof typeof prefs]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        categories: {
                          ...prev.categories,
                          [category]: {
                            ...prev.categories[category],
                            [method]: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 capitalize">{method}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Quiet Hours</h3>
            <button
              onClick={() => setSettings(prev => ({ 
                ...prev, 
                quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.quietHours.enabled ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {settings.quietHours.enabled && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
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
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">
                {unreadCount} unread{urgentCount > 0 && `, ${urgentCount} urgent`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 px-4">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'settings', label: 'Settings', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      {showFilters && activeTab !== 'settings' && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="urgent">Urgent</option>
              <option value="action-required">Action Required</option>
              <option value="alert">Alerts</option>
              <option value="reminder">Reminders</option>
              <option value="system">System</option>
              <option value="achievement">Achievements</option>
              <option value="security">Security</option>
              <option value="marketing">Marketing</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="unread">Unread First</option>
            </select>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && activeTab !== 'settings' && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {selectedNotifications.length === filteredNotifications.length ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <span className="text-sm font-medium text-blue-800">
                {selectedNotifications.length} selected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('read')}
                className="flex items-center space-x-1 px-3 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Mark Read</span>
              </button>
              <button
                onClick={() => handleBulkAction('unread')}
                className="flex items-center space-x-1 px-3 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Mark Unread</span>
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center space-x-1 px-3 py-1 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'settings' ? (
          <div className="p-4">
            {renderSettingsTab()}
          </div>
        ) : (
          <div>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications found</p>
                <p className="text-sm text-gray-400">
                  {activeTab === 'unread' ? 'All caught up!' : 'Try adjusting your filters'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map(notification => renderNotificationItem(notification))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 