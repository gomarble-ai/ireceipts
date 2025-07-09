'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Globe, 
  RefreshCw, 
  Check, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface InitialSetupScreenProps {
  onBack: () => void;
  onComplete: (setupData: SetupData) => void;
}

interface SetupData {
  profile: {
    name: string;
    avatar: string;
  };
  preferences: {
    currency: string;
    region: string;
    notifications: {
      push: boolean;
      email: boolean;
      sms: boolean;
    };
    autoSync: boolean;
    syncFrequency: string;
  };
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

const regions = [
  'United States',
  'Canada',
  'United Kingdom',
  'European Union',
  'Australia',
  'Japan',
  'Other'
];

const syncFrequencies = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Every hour' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' }
];

export default function InitialSetupScreen({ onBack, onComplete }: InitialSetupScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    profile: {
      name: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    preferences: {
      currency: 'USD',
      region: 'United States',
      notifications: {
        push: true,
        email: true,
        sms: false
      },
      autoSync: true,
      syncFrequency: 'realtime'
    }
  });

  const steps = [
    { title: 'Profile', icon: User },
    { title: 'Preferences', icon: Globe },
    { title: 'Notifications', icon: Bell },
    { title: 'Data Sync', icon: RefreshCw }
  ];

  const updateSetupData = (section: keyof SetupData, data: any) => {
    setSetupData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(setupData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Profile
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Profile</h2>
              <p className="text-gray-600">Tell us a bit about yourself</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={setupData.profile.name}
                  onChange={(e) => updateSetupData('profile', { name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={setupData.profile.avatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Change Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Preferences
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Regional Settings</h2>
              <p className="text-gray-600">Choose your currency and region</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <div className="relative">
                  <select
                    value={setupData.preferences.currency}
                    onChange={(e) => updateSetupData('preferences', { currency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <div className="relative">
                  <select
                    value={setupData.preferences.region}
                    onChange={(e) => updateSetupData('preferences', { region: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Notifications
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2>
              <p className="text-gray-600">Choose how you want to be notified</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified about transactions and insights</p>
                </div>
                <button
                  onClick={() => updateSetupData('preferences', { 
                    notifications: { 
                      ...setupData.preferences.notifications, 
                      push: !setupData.preferences.notifications.push 
                    }
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setupData.preferences.notifications.push ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    setupData.preferences.notifications.push ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Weekly summaries and important updates</p>
                </div>
                <button
                  onClick={() => updateSetupData('preferences', { 
                    notifications: { 
                      ...setupData.preferences.notifications, 
                      email: !setupData.preferences.notifications.email 
                    }
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setupData.preferences.notifications.email ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    setupData.preferences.notifications.email ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Critical alerts and security updates</p>
                </div>
                <button
                  onClick={() => updateSetupData('preferences', { 
                    notifications: { 
                      ...setupData.preferences.notifications, 
                      sms: !setupData.preferences.notifications.sms 
                    }
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setupData.preferences.notifications.sms ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    setupData.preferences.notifications.sms ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 3: // Data Sync
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <RefreshCw className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Sync Settings</h2>
              <p className="text-gray-600">Configure how your data is synchronized</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Auto-Sync</h3>
                  <p className="text-sm text-gray-600">Automatically sync transactions and receipts</p>
                </div>
                <button
                  onClick={() => updateSetupData('preferences', { 
                    autoSync: !setupData.preferences.autoSync 
                  })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setupData.preferences.autoSync ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    setupData.preferences.autoSync ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {setupData.preferences.autoSync && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sync Frequency
                  </label>
                  <div className="relative">
                    <select
                      value={setupData.preferences.syncFrequency}
                      onChange={(e) => updateSetupData('preferences', { syncFrequency: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      {syncFrequencies.map(freq => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Privacy Protected</p>
                    <p className="text-xs text-blue-700 mt-1">
                      All data is encrypted and stored securely. You can change these settings anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={prevStep}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Setup</h1>
        <div className="w-9" />
      </div>

      {/* Progress Steps */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="max-w-sm mx-auto">
          <button
            onClick={nextStep}
            disabled={currentStep === 0 && !setupData.profile.name.trim()}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>{currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 