'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  Paperclip, 
  MoreVertical,
  Bot,
  User,
  TrendingUp,
  Receipt,
  CreditCard,
  Calendar,
  DollarSign,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface ChatQueryPageProps {
  onBack: () => void;
  user: any;
  transactions: any[];
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  richContent?: RichContent;
}

interface RichContent {
  type: 'transactions' | 'chart' | 'summary' | 'suggestions';
  data: any;
}

const querySuggestions = [
  {
    text: "How much did I spend on food last month?",
    category: "spending",
    icon: Coffee
  },
  {
    text: "Show me all receipts from Target",
    category: "receipts",
    icon: Receipt
  },
  {
    text: "What are my recurring subscriptions?",
    category: "subscriptions", 
    icon: CreditCard
  },
  {
    text: "Find my highest expense this week",
    category: "analysis",
    icon: TrendingUp
  },
  {
    text: "How much do I spend on transportation?",
    category: "categories",
    icon: Car
  },
  {
    text: "Show me grocery spending trends",
    category: "trends",
    icon: ShoppingBag
  }
];

export default function ChatQueryPage({ onBack, user, transactions }: ChatQueryPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: `Hi ${user.name.split(' ')[0]}! I'm your AI financial assistant. Ask me anything about your spending, transactions, or financial insights. I can help you analyze patterns, find specific purchases, and give you personalized recommendations.`,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userQuery: string): { content: string; richContent?: RichContent } => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('food') || query.includes('restaurant') || query.includes('coffee')) {
      const foodTransactions = transactions.filter(t => 
        t.category === 'Food & Drink' || t.category === 'Groceries'
      );
      const totalSpent = foodTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        content: `You've spent $${totalSpent.toFixed(2)} on food and dining. Here are your recent food-related transactions:`,
        richContent: {
          type: 'transactions',
          data: foodTransactions.slice(0, 5)
        }
      };
    }
    
    if (query.includes('target') || query.includes('receipt')) {
      const targetTransactions = transactions.filter(t => 
        t.merchant.toLowerCase().includes('target') || t.hasReceipt
      );
      
      return {
        content: `I found ${targetTransactions.length} transactions with receipts. Here they are:`,
        richContent: {
          type: 'transactions',
          data: targetTransactions
        }
      };
    }
    
    if (query.includes('subscription') || query.includes('recurring')) {
      const subscriptions = transactions.filter(t => 
        ['Netflix', 'Spotify', 'Adobe', 'Microsoft'].some(service => 
          t.merchant.includes(service)
        )
      );
      
      return {
        content: `Here are your recurring subscriptions:`,
        richContent: {
          type: 'transactions',
          data: subscriptions
        }
      };
    }
    
    if (query.includes('highest') || query.includes('expensive') || query.includes('most')) {
      const sortedTransactions = [...transactions].sort((a, b) => b.amount - a.amount);
      const highest = sortedTransactions[0];
      
      return {
        content: `Your highest expense was $${highest.amount.toFixed(2)} at ${highest.merchant}. Here are your top expenses:`,
        richContent: {
          type: 'transactions',
          data: sortedTransactions.slice(0, 5)
        }
      };
    }
    
    if (query.includes('transportation') || query.includes('uber') || query.includes('gas')) {
      const transportTransactions = transactions.filter(t => 
        t.category === 'Transportation'
      );
      const totalSpent = transportTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        content: `You've spent $${totalSpent.toFixed(2)} on transportation this month. This includes gas, rideshares, and public transit.`,
        richContent: {
          type: 'transactions',
          data: transportTransactions
        }
      };
    }
    
    if (query.includes('trends') || query.includes('pattern') || query.includes('analysis')) {
      const categoryTotals = transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        content: `Here's your spending breakdown by category:`,
        richContent: {
          type: 'summary',
          data: categoryTotals
        }
      };
    }
    
    if (query.includes('total') || query.includes('spent') || query.includes('month')) {
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const avgTransaction = totalSpent / transactions.length;
      
      return {
        content: `This month you've spent $${totalSpent.toFixed(2)} across ${transactions.length} transactions. Your average transaction is $${avgTransaction.toFixed(2)}.`,
        richContent: {
          type: 'summary',
          data: {
            total: totalSpent,
            count: transactions.length,
            average: avgTransaction
          }
        }
      };
    }
    
    // Default response
    return {
      content: `I can help you analyze your spending patterns, find specific transactions, track your budgets, and provide financial insights. Try asking me about your spending by category, merchant, or time period!`,
      richContent: {
        type: 'suggestions',
        data: querySuggestions.slice(0, 4)
      }
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        richContent: aiResponse.richContent
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("How much did I spend on food last week?");
      }, 2000);
    }
  };

  const handleClearConversation = () => {
    setMessages([{
      id: 'welcome',
      type: 'ai',
      content: `Hi ${user.name.split(' ')[0]}! I'm your AI financial assistant. Ask me anything about your spending, transactions, or financial insights.`,
      timestamp: new Date(),
    }]);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const renderRichContent = (richContent: RichContent) => {
    switch (richContent.type) {
      case 'transactions':
        return (
          <div className="mt-3 space-y-2">
            {richContent.data.map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm">
                    {transaction.merchant.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{transaction.merchant}</p>
                    <p className="text-xs text-gray-600">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatAmount(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-600">{transaction.category}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'summary':
        if (typeof richContent.data === 'object' && richContent.data.total !== undefined) {
          return (
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-600">{formatAmount(richContent.data.total)}</p>
                <p className="text-xs text-gray-600">Total Spent</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-lg font-bold text-green-600">{richContent.data.count}</p>
                <p className="text-xs text-gray-600">Transactions</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className="text-lg font-bold text-purple-600">{formatAmount(richContent.data.average)}</p>
                <p className="text-xs text-gray-600">Average</p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="mt-3 space-y-2">
              {Object.entries(richContent.data).map(([category, amount]: [string, any]) => (
                <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm font-bold text-blue-600">{formatAmount(amount)}</span>
                </div>
              ))}
            </div>
          );
        }

      case 'suggestions':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {richContent.data.map((suggestion: any, index: number) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <suggestion.icon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 uppercase">{suggestion.category}</span>
                </div>
                <p className="text-sm text-gray-700">{suggestion.text}</p>
              </button>
            ))}
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
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
        </div>
        <button
          onClick={handleClearConversation}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Clear conversation"
        >
          <Trash2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-gray-200'
            } rounded-2xl p-4`}>
              {message.type === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                </div>
              )}
              
              <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>
                {message.content}
              </p>
              
              {message.richContent && renderRichContent(message.richContent)}
              
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
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
                <span className="text-sm text-gray-500 ml-2">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Try asking:</h3>
          <div className="flex flex-wrap gap-2">
            {querySuggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="inline-flex items-center space-x-1 px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <suggestion.icon className="w-3 h-3" />
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => console.log('Attachment clicked')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your spending..."
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 