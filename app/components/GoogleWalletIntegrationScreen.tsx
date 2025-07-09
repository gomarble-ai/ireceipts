'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wallet, 
  Shield, 
  Zap, 
  BarChart3, 
  Check, 
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface GoogleWalletIntegrationScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

type IntegrationStep = 'permission' | 'connecting' | 'success';

const benefits = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Automatic Sync",
    description: "Your transactions sync automatically without manual input"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Secure & Private",
    description: "Bank-level encryption protects your financial data"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Smart Insights",
    description: "AI analyzes your spending patterns for better budgeting"
  }
];

const connectionSteps = [
  "Redirecting to Google Wallet...",
  "Authenticating your account...",
  "Requesting transaction permissions...",
  "Syncing your data...",
  "Setting up categories...",
  "Finalizing integration..."
];

export default function GoogleWalletIntegrationScreen({ 
  onBack, 
  onComplete 
}: GoogleWalletIntegrationScreenProps) {
  const [currentStep, setCurrentStep] = useState<IntegrationStep>('permission');
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [currentConnectionStep, setCurrentConnectionStep] = useState(0);

  // Simulate connection process
  useEffect(() => {
    if (currentStep === 'connecting') {
      const interval = setInterval(() => {
        setConnectionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setCurrentStep('success');
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      // Update connection step text
      const stepInterval = setInterval(() => {
        setCurrentConnectionStep(prev => {
          if (prev >= connectionSteps.length - 1) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(stepInterval);
      };
    }
  }, [currentStep]);

  const handleConnectWallet = () => {
    setCurrentStep('connecting');
    setConnectionProgress(0);
    setCurrentConnectionStep(0);
  };

  const handleSkipIntegration = () => {
    onComplete();
  };

  const handleTryAgain = () => {
    setCurrentStep('permission');
    setConnectionProgress(0);
    setCurrentConnectionStep(0);
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            All Set!
          </h1>
          <p className="text-gray-600 mb-8">
            Your Google Wallet has been successfully connected. We've synced your recent transactions and set up smart categories.
          </p>

          {/* Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">47</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onComplete}
            className="w-full bg-green-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue Setup</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'connecting') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          {/* Connecting Animation */}
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
            <RefreshCw className="w-10 h-10 text-white animate-spin" />
          </div>

          {/* Progress */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connecting to Google Wallet
          </h1>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${connectionProgress}%` }}
            />
          </div>
          
          {/* Current Step */}
          <p className="text-gray-600 mb-8">
            {connectionSteps[currentConnectionStep]}
          </p>

          {/* Connection Steps */}
          <div className="space-y-3">
            {connectionSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  index <= currentConnectionStep ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${
                  index <= currentConnectionStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Google Wallet</h1>
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          {/* App Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600">
              Link your Google Wallet to automatically track transactions and get personalized insights
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mt-0.5">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Permission Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">Permission Required</p>
                <p className="text-xs text-amber-700">
                  We'll request read-only access to your transaction history. We never store your payment methods or personal banking information.
                </p>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnectWallet}
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 mb-4"
          >
            <Wallet className="w-5 h-5" />
            <span>Connect Google Wallet</span>
          </button>

          {/* Skip Option */}
          <button
            onClick={handleSkipIntegration}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            Skip for now
          </button>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by 256-bit SSL encryption. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 