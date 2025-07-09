'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  Edit3, 
  Camera, 
  Check, 
  X, 
  ChevronRight, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Download, 
  Upload, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2,
  ExternalLink,
  Info,
  AlertTriangle,
  Receipt
} from 'lucide-react';

interface ProfileManagementProps {
  onBack: () => void;
  user: any;
  onUpdateUser: (userData: any) => void;
  onLogout: () => void;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
}

interface PreferencesData {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
    analytics: boolean;
  };
  security: {
    twoFactor: boolean;
    biometric: boolean;
    sessionTimeout: number;
  };
}

export default function ProfileManagement({ onBack, user, onUpdateUser, onLogout }: ProfileManagementProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security' | 'about'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '+1 (555) 123-4567',
    avatar: user.avatar || '',
    bio: user.bio || 'Smart spender, budget tracker, and receipt organizer.'
  });

  const [preferences, setPreferences] = useState<PreferencesData>({
    currency: user.preferences?.currency || 'USD',
    language: 'English',
    theme: 'system',
    notifications: {
      push: user.preferences?.notifications || true,
      email: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      dataSharing: true,
      analytics: true
    },
    security: {
      twoFactor: false,
      biometric: true,
      sessionTimeout: 30
    }
  });

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      ...profileData,
      preferences: {
        ...user.preferences,
        currency: preferences.currency,
        notifications: preferences.notifications.push
      }
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '+1 (555) 123-4567',
      avatar: user.avatar || '',
      bio: user.bio || 'Smart spender, budget tracker, and receipt organizer.'
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    console.log('Account deletion requested');
    setShowDeleteConfirm(false);
    // Could redirect to a deletion confirmation screen
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 text-center">
          <div className="relative inline-block">
            <img 
              src={profileData.avatar} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-bold text-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Name"
              />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself"
                rows={2}
              />
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
              <p className="text-gray-600 mb-2">{profileData.email}</p>
              <p className="text-sm text-gray-500 mb-4">{profileData.bio}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">142</p>
          <p className="text-sm text-gray-600">Transactions</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-600">$2,340</p>
          <p className="text-sm text-gray-600">Total Tracked</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-purple-600">45</p>
          <p className="text-sm text-gray-600">Days Active</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-4 space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Export Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Import Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Share2 className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Share Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">General Settings</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Currency</p>
                <p className="text-sm text-gray-600">Your preferred currency</p>
              </div>
            </div>
            <select
              value={preferences.currency}
              onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Language</p>
                <p className="text-sm text-gray-600">App language</p>
              </div>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">Theme</p>
                <p className="text-sm text-gray-600">App appearance</p>
              </div>
            </div>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="p-4 space-y-4">
          {[
            { key: 'push', label: 'Push Notifications', desc: 'Get notified about important updates', icon: Smartphone },
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
            { key: 'sms', label: 'SMS Notifications', desc: 'Get text message alerts', icon: MessageCircle },
            { key: 'marketing', label: 'Marketing Emails', desc: 'Promotional content and tips', icon: Star }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    [item.key]: !prev.notifications[item.key as keyof typeof prev.notifications]
                  }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.notifications[item.key as keyof typeof preferences.notifications]
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.notifications[item.key as keyof typeof preferences.notifications]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Privacy</h3>
        </div>
        <div className="p-4 space-y-4">
          {[
            { key: 'profileVisible', label: 'Profile Visibility', desc: 'Make your profile visible to others' },
            { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for improvements' },
            { key: 'analytics', label: 'Analytics', desc: 'Help us improve with usage analytics' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({
                  ...prev,
                  privacy: {
                    ...prev.privacy,
                    [item.key]: !prev.privacy[item.key as keyof typeof prev.privacy]
                  }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.privacy[item.key as keyof typeof preferences.privacy]
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.privacy[item.key as keyof typeof preferences.privacy]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Security Settings</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
            </div>
            <button
              onClick={() => setPreferences(prev => ({
                ...prev,
                security: { ...prev.security, twoFactor: !prev.security.twoFactor }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.security.twoFactor ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Biometric Login</p>
                <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
              </div>
            </div>
            <button
              onClick={() => setPreferences(prev => ({
                ...prev,
                security: { ...prev.security, biometric: !prev.security.biometric }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.security.biometric ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.security.biometric ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
              </div>
            </div>
            <select
              value={preferences.security.sessionTimeout}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                security: { ...prev.security, sessionTimeout: Number(e.target.value) }
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Account Actions</h3>
        </div>
        <div className="p-4 space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Download My Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-900">Delete Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-6">
      {/* App Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">About iReceipts</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900">iReceipts</h4>
            <p className="text-sm text-gray-600">Version 1.0.0</p>
          </div>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">What's New</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Privacy Policy</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Terms of Service</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Support</h3>
        </div>
        <div className="p-4 space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Help Center</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Contact Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-900">Rate App</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-3 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
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
              <h1 className="text-xl font-bold text-gray-900">Profile</h1>
              <p className="text-sm text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 px-4">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'about', label: 'About', icon: Info }
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
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'settings' && renderSettingsTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'about' && renderAboutTab()}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 