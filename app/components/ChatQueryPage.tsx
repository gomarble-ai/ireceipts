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
  RefreshCw,
  Globe
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

type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ar';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt' as Language, name: 'Português', flag: '🇵🇹' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' }
];

const translations = {
  en: {
    title: 'AI Assistant',
    welcomeMessage: 'Hi {name}! I\'m your AI financial assistant. Ask me anything about your spending, transactions, or financial insights. I can help you analyze patterns, find specific purchases, and give you personalized recommendations.',
    placeholder: 'Ask me anything about your spending...',
    tryAsking: 'Try asking:',
    analyzing: 'Analyzing...',
    suggestions: [
      { text: "How much did I spend on food last month?", category: "spending", icon: Coffee },
      { text: "Show me all receipts from Target", category: "receipts", icon: Receipt },
      { text: "What are my recurring subscriptions?", category: "subscriptions", icon: CreditCard },
      { text: "Find my highest expense this week", category: "analysis", icon: TrendingUp },
      { text: "How much do I spend on transportation?", category: "categories", icon: Car },
      { text: "Show me grocery spending trends", category: "trends", icon: ShoppingBag }
    ]
  },
  es: {
    title: 'Asistente IA',
    welcomeMessage: '¡Hola {name}! Soy tu asistente financiero de IA. Pregúntame cualquier cosa sobre tus gastos, transacciones o perspectivas financieras. Puedo ayudarte a analizar patrones, encontrar compras específicas y darte recomendaciones personalizadas.',
    placeholder: 'Pregúntame cualquier cosa sobre tus gastos...',
    tryAsking: 'Intenta preguntar:',
    analyzing: 'Analizando...',
    suggestions: [
      { text: "¿Cuánto gasté en comida el mes pasado?", category: "gastos", icon: Coffee },
      { text: "Muéstrame todos los recibos de Target", category: "recibos", icon: Receipt },
      { text: "¿Cuáles son mis suscripciones recurrentes?", category: "suscripciones", icon: CreditCard },
      { text: "Encuentra mi gasto más alto esta semana", category: "análisis", icon: TrendingUp },
      { text: "¿Cuánto gasto en transporte?", category: "categorías", icon: Car },
      { text: "Muéstrame las tendencias de gasto en comestibles", category: "tendencias", icon: ShoppingBag }
    ]
  },
  fr: {
    title: 'Assistant IA',
    welcomeMessage: 'Salut {name}! Je suis votre assistant financier IA. Posez-moi n\'importe quelle question sur vos dépenses, transactions ou perspectives financières. Je peux vous aider à analyser les tendances, trouver des achats spécifiques et vous donner des recommandations personnalisées.',
    placeholder: 'Demandez-moi n\'importe quoi sur vos dépenses...',
    tryAsking: 'Essayez de demander:',
    analyzing: 'Analyse...',
    suggestions: [
      { text: "Combien ai-je dépensé en nourriture le mois dernier?", category: "dépenses", icon: Coffee },
      { text: "Montrez-moi tous les reçus de Target", category: "reçus", icon: Receipt },
      { text: "Quels sont mes abonnements récurrents?", category: "abonnements", icon: CreditCard },
      { text: "Trouvez ma dépense la plus élevée cette semaine", category: "analyse", icon: TrendingUp },
      { text: "Combien je dépense en transport?", category: "catégories", icon: Car },
      { text: "Montrez-moi les tendances d'épicerie", category: "tendances", icon: ShoppingBag }
    ]
  },
  de: {
    title: 'KI-Assistent',
    welcomeMessage: 'Hallo {name}! Ich bin dein KI-Finanzassistent. Frag mich alles über deine Ausgaben, Transaktionen oder finanziellen Einblicke. Ich kann dir helfen, Muster zu analysieren, spezifische Käufe zu finden und dir personalisierte Empfehlungen zu geben.',
    placeholder: 'Frag mich alles über deine Ausgaben...',
    tryAsking: 'Versuche zu fragen:',
    analyzing: 'Analysiere...',
    suggestions: [
      { text: "Wie viel habe ich letzten Monat für Essen ausgegeben?", category: "ausgaben", icon: Coffee },
      { text: "Zeig mir alle Belege von Target", category: "belege", icon: Receipt },
      { text: "Was sind meine wiederkehrenden Abonnements?", category: "abonnements", icon: CreditCard },
      { text: "Finde meine höchste Ausgabe diese Woche", category: "analyse", icon: TrendingUp },
      { text: "Wie viel gebe ich für Transport aus?", category: "kategorien", icon: Car },
      { text: "Zeig mir Lebensmittel-Ausgabentrends", category: "trends", icon: ShoppingBag }
    ]
  },
  it: {
    title: 'Assistente IA',
    welcomeMessage: 'Ciao {name}! Sono il tuo assistente finanziario IA. Chiedimi qualsiasi cosa sulle tue spese, transazioni o approfondimenti finanziari. Posso aiutarti ad analizzare i modelli, trovare acquisti specifici e darti raccomandazioni personalizzate.',
    placeholder: 'Chiedimi qualsiasi cosa sulle tue spese...',
    tryAsking: 'Prova a chiedere:',
    analyzing: 'Analizzando...',
    suggestions: [
      { text: "Quanto ho speso per il cibo il mese scorso?", category: "spese", icon: Coffee },
      { text: "Mostrami tutte le ricevute di Target", category: "ricevute", icon: Receipt },
      { text: "Quali sono i miei abbonamenti ricorrenti?", category: "abbonamenti", icon: CreditCard },
      { text: "Trova la mia spesa più alta questa settimana", category: "analisi", icon: TrendingUp },
      { text: "Quanto spendo per i trasporti?", category: "categorie", icon: Car },
      { text: "Mostrami le tendenze di spesa alimentare", category: "tendenze", icon: ShoppingBag }
    ]
  },
  pt: {
    title: 'Assistente IA',
    welcomeMessage: 'Olá {name}! Sou seu assistente financeiro de IA. Pergunte-me qualquer coisa sobre seus gastos, transações ou insights financeiros. Posso ajudá-lo a analisar padrões, encontrar compras específicas e dar recomendações personalizadas.',
    placeholder: 'Pergunte-me qualquer coisa sobre seus gastos...',
    tryAsking: 'Tente perguntar:',
    analyzing: 'Analisando...',
    suggestions: [
      { text: "Quanto gastei em comida no mês passado?", category: "gastos", icon: Coffee },
      { text: "Mostre-me todos os recibos da Target", category: "recibos", icon: Receipt },
      { text: "Quais são minhas assinaturas recorrentes?", category: "assinaturas", icon: CreditCard },
      { text: "Encontre meu maior gasto esta semana", category: "análise", icon: TrendingUp },
      { text: "Quanto gasto em transporte?", category: "categorias", icon: Car },
      { text: "Mostre-me tendências de gastos com comida", category: "tendências", icon: ShoppingBag }
    ]
  },
  zh: {
    title: 'AI 助手',
    welcomeMessage: '你好 {name}！我是您的AI财务助手。请问我关于您的支出、交易或财务见解的任何问题。我可以帮助您分析模式、找到特定购买并给您个性化建议。',
    placeholder: '问我关于您支出的任何问题...',
    tryAsking: '试着问：',
    analyzing: '分析中...',
    suggestions: [
      { text: "我上个月在食物上花了多少钱？", category: "支出", icon: Coffee },
      { text: "显示所有Target的收据", category: "收据", icon: Receipt },
      { text: "我的定期订阅有哪些？", category: "订阅", icon: CreditCard },
      { text: "找到我这周最高的支出", category: "分析", icon: TrendingUp },
      { text: "我在交通上花了多少钱？", category: "类别", icon: Car },
      { text: "显示杂货支出趋势", category: "趋势", icon: ShoppingBag }
    ]
  },
  ja: {
    title: 'AI アシスタント',
    welcomeMessage: 'こんにちは {name}！私はあなたのAI財務アシスタントです。支出、取引、または財務洞察について何でも質問してください。パターンの分析、特定の購入の検索、個人化された推奨事項の提供をお手伝いできます。',
    placeholder: '支出について何でも質問してください...',
    tryAsking: '試しに質問してみてください：',
    analyzing: '分析中...',
    suggestions: [
      { text: "先月食費にいくら使いましたか？", category: "支出", icon: Coffee },
      { text: "Targetのレシートをすべて表示", category: "レシート", icon: Receipt },
      { text: "定期購読は何がありますか？", category: "サブスクリプション", icon: CreditCard },
      { text: "今週の最高支出を見つけて", category: "分析", icon: TrendingUp },
      { text: "交通費にいくら使っていますか？", category: "カテゴリー", icon: Car },
      { text: "食料品支出の傾向を表示", category: "傾向", icon: ShoppingBag }
    ]
  },
  ko: {
    title: 'AI 어시스턴트',
    welcomeMessage: '안녕하세요 {name}! 저는 당신의 AI 재정 어시스턴트입니다. 지출, 거래 또는 재정 통찰력에 대해 무엇이든 물어보세요. 패턴 분석, 특정 구매 찾기, 개인화된 추천 제공을 도와드릴 수 있습니다.',
    placeholder: '지출에 대해 무엇이든 물어보세요...',
    tryAsking: '이렇게 물어보세요:',
    analyzing: '분석 중...',
    suggestions: [
      { text: "지난 달 음식에 얼마나 썼나요?", category: "지출", icon: Coffee },
      { text: "Target의 모든 영수증을 보여주세요", category: "영수증", icon: Receipt },
      { text: "정기 구독은 무엇이 있나요?", category: "구독", icon: CreditCard },
      { text: "이번 주 최고 지출을 찾아주세요", category: "분석", icon: TrendingUp },
      { text: "교통비에 얼마나 쓰나요?", category: "카테고리", icon: Car },
      { text: "식료품 지출 트렌드를 보여주세요", category: "트렌드", icon: ShoppingBag }
    ]
  },
  ar: {
    title: 'مساعد الذكاء الاصطناعي',
    welcomeMessage: 'مرحبا {name}! أنا مساعدك المالي بالذكاء الاصطناعي. اسألني أي شيء عن نفقاتك أو معاملاتك أو رؤاك المالية. يمكنني مساعدتك في تحليل الأنماط وإيجاد مشتريات محددة وتقديم توصيات مخصصة.',
    placeholder: 'اسألني أي شيء عن نفقاتك...',
    tryAsking: 'جرب أن تسأل:',
    analyzing: 'تحليل...',
    suggestions: [
      { text: "كم أنفقت على الطعام الشهر الماضي؟", category: "النفقات", icon: Coffee },
      { text: "أظهر لي جميع الفواتير من Target", category: "الفواتير", icon: Receipt },
      { text: "ما هي اشتراكاتي المتكررة؟", category: "الاشتراكات", icon: CreditCard },
      { text: "اعثر على أعلى نفقة هذا الأسبوع", category: "التحليل", icon: TrendingUp },
      { text: "كم أنفق على النقل؟", category: "الفئات", icon: Car },
      { text: "أظهر لي اتجاهات إنفاق البقالة", category: "الاتجاهات", icon: ShoppingBag }
    ]
  }
};

export default function ChatQueryPage({ onBack, user, transactions }: ChatQueryPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTranslation = translations[selectedLanguage];

  useEffect(() => {
    // Initialize with translated welcome message
    setMessages([{
      id: 'welcome',
      type: 'ai',
      content: currentTranslation.welcomeMessage.replace('{name}', user.name.split(' ')[0]),
      timestamp: new Date(),
    }]);
  }, [selectedLanguage, user.name, currentTranslation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userQuery: string): { content: string; richContent?: RichContent } => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('food') || query.includes('restaurant') || query.includes('coffee') || 
        query.includes('comida') || query.includes('restaurante') || query.includes('café') ||
        query.includes('nourriture') || query.includes('essen') || query.includes('cibo') ||
        query.includes('食物') || query.includes('食べ物') || query.includes('음식') || query.includes('طعام')) {
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
    
    if (query.includes('target') || query.includes('receipt') || query.includes('recibo') || 
        query.includes('reçu') || query.includes('beleg') || query.includes('ricevuta') ||
        query.includes('收据') || query.includes('レシート') || query.includes('영수증') || query.includes('فاتورة')) {
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
    
    if (query.includes('subscription') || query.includes('recurring') || query.includes('suscripción') ||
        query.includes('abonnement') || query.includes('abonnement') || query.includes('abbonamento') ||
        query.includes('订阅') || query.includes('サブスクリプション') || query.includes('구독') || query.includes('اشتراك')) {
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
    
    if (query.includes('highest') || query.includes('expensive') || query.includes('most') ||
        query.includes('más alto') || query.includes('plus élevé') || query.includes('höchste') ||
        query.includes('più alto') || query.includes('mais alto') || query.includes('最高') ||
        query.includes('最も高い') || query.includes('가장 높은') || query.includes('أعلى')) {
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
    
    if (query.includes('transportation') || query.includes('uber') || query.includes('gas') ||
        query.includes('transporte') || query.includes('transport') || query.includes('verkehr') ||
        query.includes('trasporto') || query.includes('交通') || query.includes('交通費') ||
        query.includes('교통') || query.includes('نقل')) {
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
    
    if (query.includes('trends') || query.includes('pattern') || query.includes('analysis') ||
        query.includes('tendencias') || query.includes('tendances') || query.includes('trends') ||
        query.includes('tendenze') || query.includes('tendências') || query.includes('趋势') ||
        query.includes('トレンド') || query.includes('트렌드') || query.includes('اتجاهات')) {
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
    
    if (query.includes('total') || query.includes('spent') || query.includes('month') ||
        query.includes('gastado') || query.includes('dépensé') || query.includes('ausgegeben') ||
        query.includes('speso') || query.includes('gasto') || query.includes('花费') ||
        query.includes('使った') || query.includes('썼') || query.includes('أنفق')) {
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
        data: currentTranslation.suggestions.slice(0, 4)
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
        setInputMessage(currentTranslation.suggestions[0].text);
      }, 2000);
    }
  };

  const handleClearConversation = () => {
    setMessages([{
      id: 'welcome',
      type: 'ai',
      content: currentTranslation.welcomeMessage.replace('{name}', user.name.split(' ')[0]),
      timestamp: new Date(),
    }]);
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
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
          <h1 className="text-lg font-semibold text-gray-900">{currentTranslation.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-1"
              aria-label="Select language"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
            </button>
            
            {showLanguageSelector && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                      selectedLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium">{language.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleClearConversation}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Clear conversation"
          >
            <Trash2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
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
                  <span className="text-xs font-medium text-blue-600">{currentTranslation.title}</span>
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
                <span className="text-xs font-medium text-blue-600">{currentTranslation.title}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-gray-500 ml-2">{currentTranslation.analyzing}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">{currentTranslation.tryAsking}</h3>
          <div className="flex flex-wrap gap-2">
            {currentTranslation.suggestions.slice(0, 4).map((suggestion, index) => (
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
              placeholder={currentTranslation.placeholder}
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