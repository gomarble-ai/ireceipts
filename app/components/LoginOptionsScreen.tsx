'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Check, ExternalLink } from 'lucide-react';

interface LoginOptionsScreenProps {
  onBack: () => void;
  onLoginSuccess: (method: 'gmail' | 'phone' | 'skip') => void;
}

export default function LoginOptionsScreen({ onBack, onLoginSuccess }: LoginOptionsScreenProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGmailLogin = async () => {
    setIsLoading('gmail');
    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      onLoginSuccess('gmail');
    }, 1500);
  };

  const handlePhoneLogin = async () => {
    setIsLoading('phone');
    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      onLoginSuccess('phone');
    }, 1500);
  };

  const handleSkip = () => {
    onLoginSuccess('skip');
  };

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
        <h1 className="text-lg font-semibold text-gray-900">Sign In</h1>
        <div className="w-9" /> {/* Spacer for center alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          {/* App Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">
              Sign in to sync your transactions and receipts
            </p>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            {/* Gmail Login */}
            <button
              onClick={handleGmailLogin}
              disabled={isLoading !== null}
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-4 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              {isLoading === 'gmail' ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {/* Google Logo */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </>
              )}
            </button>

            {/* Phone Number Login */}
            <button
              onClick={handlePhoneLogin}
              disabled={isLoading !== null}
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-4 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'phone' ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Continue with Phone</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            {/* Skip Option */}
            <button
              onClick={handleSkip}
              disabled={isLoading !== null}
              className="w-full bg-gray-100 border border-gray-200 rounded-xl py-4 px-4 flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-gray-700 font-medium">Skip for now</span>
            </button>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-4">
              By continuing, you agree to our
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => console.log('Terms of Service clicked')}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Terms of Service</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </button>
              <button
                onClick={() => console.log('Privacy Policy clicked')}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>Privacy Policy</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Secure & Private</p>
                <p className="text-xs text-blue-700 mt-1">
                  We use bank-level encryption to protect your data. Your information is never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 