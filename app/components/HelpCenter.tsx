'use client';

import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Bot, 
  Send, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  Video, 
  Users, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Share2, 
  Download, 
  Play, 
  Headphones, 
  Globe, 
  Shield, 
  CreditCard, 
  Receipt, 
  Camera, 
  Smartphone, 
  Zap, 
  Target, 
  TrendingUp, 
  Settings, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Lightbulb,
  Calendar,
  Clock,
  Filter,
  Bookmark,
  Archive
} from 'lucide-react';

interface HelpCenterProps {
  onBack: () => void;
  user: any;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  views: number;
  rating: number;
  lastUpdated: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  helpful?: boolean;
}

const helpCategories = [
  { id: 'getting-started', name: 'Getting Started', icon: Zap, color: 'blue' },
  { id: 'scanning', name: 'Scanning & Receipts', icon: Camera, color: 'green' },
  { id: 'transactions', name: 'Transactions', icon: Receipt, color: 'purple' },
  { id: 'insights', name: 'Insights & Analytics', icon: TrendingUp, color: 'orange' },
  { id: 'account', name: 'Account & Security', icon: Shield, color: 'red' },
  { id: 'billing', name: 'Billing & Payments', icon: CreditCard, color: 'indigo' },
  { id: 'mobile', name: 'Mobile App', icon: Smartphone, color: 'pink' },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: Settings, color: 'gray' }
];

const faqData: FAQItem[] = [
  {
    id: 'faq1',
    question: 'How do I scan a receipt?',
    answer: 'Open the app, tap the "Scan Receipt" button, position your receipt in the camera frame, and tap the capture button. The app will automatically extract the transaction details.',
    category: 'scanning',
    helpful: 45,
    notHelpful: 3,
    tags: ['scanning', 'receipts', 'camera']
  },
  {
    id: 'faq2',
    question: 'Can I edit transaction details after scanning?',
    answer: 'Yes! After scanning, you\'ll see a review screen where you can edit the merchant name, amount, date, category, and items before saving the transaction.',
    category: 'transactions',
    helpful: 38,
    notHelpful: 2,
    tags: ['editing', 'transactions', 'scanning']
  },
  {
    id: 'faq3',
    question: 'How do I set up budget alerts?',
    answer: 'Go to Insights > Budget Settings. Create a new budget for a category, set your spending limit, and enable notifications. You\'ll get alerts when you approach or exceed your budget.',
    category: 'insights',
    helpful: 52,
    notHelpful: 1,
    tags: ['budgets', 'alerts', 'insights']
  },
  {
    id: 'faq4',
    question: 'Is my financial data secure?',
    answer: 'Absolutely! We use bank-level encryption, secure cloud storage, and never share your personal financial information. All data is encrypted both in transit and at rest.',
    category: 'account',
    helpful: 67,
    notHelpful: 0,
    tags: ['security', 'privacy', 'data']
  },
  {
    id: 'faq5',
    question: 'How do I export my transaction data?',
    answer: 'Go to Profile > Export Data or Transactions > Advanced View > Select transactions > Export. You can download your data as CSV or PDF format.',
    category: 'transactions',
    helpful: 29,
    notHelpful: 4,
    tags: ['export', 'data', 'csv', 'pdf']
  },
  {
    id: 'faq6',
    question: 'Can I use the app offline?',
    answer: 'You can scan receipts and add transactions offline. Data will sync automatically when you reconnect to the internet. Some features like AI insights require an internet connection.',
    category: 'mobile',
    helpful: 33,
    notHelpful: 2,
    tags: ['offline', 'sync', 'mobile']
  }
];

const helpArticles: HelpArticle[] = [
  {
    id: 'art1',
    title: 'Complete Guide to Receipt Scanning',
    summary: 'Learn how to get the best results when scanning receipts, including tips for lighting, positioning, and handling damaged receipts.',
    category: 'scanning',
    readTime: 5,
    difficulty: 'Beginner',
    views: 1245,
    rating: 4.8,
    lastUpdated: '2024-01-10'
  },
  {
    id: 'art2',
    title: 'Advanced Transaction Management',
    summary: 'Master bulk operations, custom categories, and transaction rules to streamline your expense tracking workflow.',
    category: 'transactions',
    readTime: 8,
    difficulty: 'Intermediate',
    views: 892,
    rating: 4.6,
    lastUpdated: '2024-01-08'
  },
  {
    id: 'art3',
    title: 'Setting Up Automated Insights',
    summary: 'Configure AI-powered insights, budget tracking, and personalized recommendations to optimize your spending.',
    category: 'insights',
    readTime: 12,
    difficulty: 'Advanced',
    views: 567,
    rating: 4.9,
    lastUpdated: '2024-01-05'
  },
  {
    id: 'art4',
    title: 'Account Security Best Practices',
    summary: 'Secure your account with two-factor authentication, strong passwords, and privacy settings.',
    category: 'account',
    readTime: 6,
    difficulty: 'Beginner',
    views: 1034,
    rating: 4.7,
    lastUpdated: '2024-01-12'
  }
];

export default function HelpCenter({ onBack, user }: HelpCenterProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'faq' | 'articles' | 'chat' | 'contact'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: `Hi ${user.name.split(' ')[0]}! I'm your AI assistant powered by Gemini. I can help you with any questions about iReceipts, from basic features to advanced tips. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => b.helpful - a.helpful);
  }, [searchQuery, selectedCategory]);

  const filteredArticles = useMemo(() => {
    let filtered = helpArticles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => b.rating - a.rating);
  }, [searchQuery, selectedCategory]);

  const handleFAQVote = (faqId: string, helpful: boolean) => {
    // In a real app, this would update the FAQ helpfulness via API
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('scan') || lowerQuery.includes('receipt')) {
      return "To scan a receipt, tap the 'Scan Receipt' button on your home screen. Make sure the receipt is well-lit and flat, then position it within the camera frame. The app will automatically detect and extract the transaction details. You can then review and edit the information before saving.";
    }
    
    if (lowerQuery.includes('budget') || lowerQuery.includes('alert')) {
      return "Setting up budget alerts is easy! Go to the Insights tab, then tap 'Budget Settings'. Create a new budget by selecting a category and setting your monthly limit. Enable notifications to get alerts when you're approaching or exceeding your budget. You can customize alert thresholds in the settings.";
    }
    
    if (lowerQuery.includes('export') || lowerQuery.includes('data')) {
      return "You can export your transaction data in several ways: 1) Go to Profile > Export Data for a full export, 2) Use Transactions > Advanced View to select specific transactions, or 3) Use the bulk actions in the transaction list. Data can be exported as CSV or PDF format.";
    }
    
    if (lowerQuery.includes('security') || lowerQuery.includes('safe')) {
      return "Your financial data is completely secure with iReceipts. We use bank-level 256-bit encryption, secure cloud storage with AWS, and never share your personal information. You can enable two-factor authentication in Profile > Security Settings for additional protection.";
    }
    
    if (lowerQuery.includes('offline') || lowerQuery.includes('internet')) {
      return "Yes, you can use many features offline! You can scan receipts, add manual transactions, and view your existing data without an internet connection. Your data will automatically sync when you reconnect. AI-powered features like insights and chat require an internet connection.";
    }
    
    if (lowerQuery.includes('delete') || lowerQuery.includes('remove')) {
      return "To delete transactions: 1) Go to the transaction list, 2) Tap on a transaction to expand it, 3) Tap the delete button, or 4) Use bulk actions to delete multiple transactions at once. You can also archive transactions instead of deleting them permanently.";
    }
    
    return "I'm here to help with any questions about iReceipts! You can ask me about scanning receipts, managing transactions, setting up budgets, exporting data, security features, or troubleshooting. Feel free to be specific about what you'd like to know!";
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'assistant',
        content: generateAIResponse(chatInput),
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleMarkMessageHelpful = (messageId: string, helpful: boolean) => {
    setChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('chat')}
          className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors"
        >
          <Bot className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Ask AI Assistant</h3>
          <p className="text-sm text-gray-600">Get instant help powered by Gemini</p>
        </button>
        
        <button
          onClick={() => setActiveTab('contact')}
          className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 transition-colors"
        >
          <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Contact Support</h3>
          <p className="text-sm text-gray-600">Get help from our team</p>
        </button>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Browse by Category</h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {helpCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setActiveTab('faq');
              }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                <category.icon className={`w-4 h-4 text-${category.color}-600`} />
              </div>
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Popular Articles</h3>
            <button
              onClick={() => setActiveTab('articles')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {helpArticles.slice(0, 3).map((article) => (
            <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{article.readTime} min read</span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{article.rating}</span>
                    </span>
                    <span>{article.views} views</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{faqData.length}</p>
          <p className="text-sm text-gray-600">FAQ Articles</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-600">{helpArticles.length}</p>
          <p className="text-sm text-gray-600">Help Guides</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-purple-600">24/7</p>
          <p className="text-sm text-gray-600">AI Support</p>
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="space-y-4">
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No FAQ found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        filteredFAQs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            
            {expandedFAQ === faq.id && (
              <div className="px-4 pb-4">
                <p className="text-gray-600 mb-4">{faq.answer}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    {faq.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Was this helpful?</span>
                    <button
                      onClick={() => handleFAQVote(faq.id, true)}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{faq.helpful}</span>
                    </button>
                    <button
                      onClick={() => handleFAQVote(faq.id, false)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">{faq.notHelpful}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderArticles = () => (
    <div className="space-y-4">
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No articles found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{article.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    article.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {article.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{article.summary}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} min read</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{article.rating}</span>
                  </span>
                  <span>{article.views} views</span>
                  <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-96">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-lg">
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-gray-200'
            } rounded-2xl p-4`}>
              {message.type === 'assistant' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                </div>
              )}
              
              <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>
                {message.content}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMarkMessageHelpful(message.id, true)}
                      className={`p-1 rounded transition-colors ${
                        message.helpful === true ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMarkMessageHelpful(message.id, false)}
                      className={`p-1 rounded transition-colors ${
                        message.helpful === false ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-gray-500 ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about iReceipts..."
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      {/* Contact Methods */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-gray-600">Available 24/7 for immediate assistance</p>
              <p className="text-sm text-green-600 mt-1">● Online now</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Start Chat
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Email Support</h3>
              <p className="text-gray-600">support@ireceipts.com</p>
              <p className="text-sm text-gray-500 mt-1">Response within 2 hours</p>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Send Email
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Phone Support</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri 9AM-6PM PST</p>
            </div>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Community & Resources</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Community Forum</p>
                <p className="text-sm text-gray-600">Connect with other users</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Video className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Video Tutorials</p>
                <p className="text-sm text-gray-600">Step-by-step guides</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Knowledge Base</p>
                <p className="text-sm text-gray-600">Comprehensive documentation</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Send us a Message</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>General Question</option>
              <option>Technical Issue</option>
              <option>Billing Question</option>
              <option>Feature Request</option>
              <option>Bug Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your question or issue..."
            />
          </div>

          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Send Message
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
              <h1 className="text-xl font-bold text-gray-900">Help Center</h1>
              <p className="text-sm text-gray-600">Get help and support for iReceipts</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        {(activeTab === 'faq' || activeTab === 'articles' || showFilters) && (
          <div className="px-4 pb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search help articles and FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-6 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: HelpCircle },
            { id: 'faq', label: 'FAQ', icon: MessageCircle },
            { id: 'articles', label: 'Articles', icon: Book },
            { id: 'chat', label: 'AI Chat', icon: Bot },
            { id: 'contact', label: 'Contact', icon: Mail }
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'faq' && renderFAQ()}
        {activeTab === 'articles' && renderArticles()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'contact' && renderContact()}
      </div>
    </div>
  );
} 