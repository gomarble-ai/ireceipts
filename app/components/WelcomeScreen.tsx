'use client';

import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Receipt, 
  MessageSquare, 
  Brain, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight 
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Smart Tracking",
    description: "Automatically sync transactions from Google Wallet and categorize your spending",
    color: "bg-blue-500"
  },
  {
    icon: <Receipt className="w-8 h-8" />,
    title: "Receipt Scanner",
    description: "Scan receipts with your camera and extract data instantly using AI",
    color: "bg-green-500"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Chat Search",
    description: "Ask questions about your spending using natural language",
    color: "bg-amber-500"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Insights",
    description: "Get personalized recommendations and spending insights",
    color: "bg-purple-500"
  }
];

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [currentFeature, setCurrentFeature] = useState(0);

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* App Logo and Tagline */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
          <Receipt className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">iReceipts</h1>
        <p className="text-lg text-gray-600 max-w-xs">
          Smart Transaction & Receipt Tracker
        </p>
      </div>

      {/* Feature Highlights Carousel */}
      <div className="w-full max-w-sm mb-12">
        <div className="relative">
          {/* Feature Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 min-h-[200px]">
            <div className={`w-12 h-12 ${features[currentFeature].color} rounded-xl flex items-center justify-center mb-4 text-white`}>
              {features[currentFeature].icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {features[currentFeature].title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {features[currentFeature].description}
            </p>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevFeature}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextFeature}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Next feature"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFeature(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentFeature 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Get Started Button */}
      <button
        onClick={onGetStarted}
        className="w-full max-w-sm bg-blue-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 active:scale-95 transform transition-transform"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Skip Option */}
      <button
        onClick={onGetStarted}
        className="mt-4 text-gray-500 hover:text-gray-700 transition-colors text-sm"
      >
        Skip introduction
      </button>
    </div>
  );
} 