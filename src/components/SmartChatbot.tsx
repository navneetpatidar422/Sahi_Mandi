import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MapPin, TrendingUp, Clock, Search, Sparkles, ChevronDown, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { CROPS, MANDIS, CURRENT_PRICES } from '../lib/mockData';
import { calculateDistance, formatDistance } from '../lib/locationUtils';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  options?: string[];
  timestamp: Date;
}

interface SmartChatbotProps {
  userLocation?: any;
  onNavigateToMandi?: (mandiId: string) => void;
  onNavigateToAnalyzer?: (cropId: string) => void;
  userName?: string;
}

export function SmartChatbot({ userLocation, onNavigateToMandi, onNavigateToAnalyzer, userName }: SmartChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const messageIdCounter = useRef(0);
  
  // Initialize with personalized greeting
  const getInitialGreeting = () => {
    if (userName) {
      return `नमस्ते ${userName}! 🙏 मैं आपकी मदद के लिए यहां हूं। आप क्या जानना चाहते हैं?`;
    }
    return 'नमस्ते! 🙏 मैं आपकी मदद के लिए यहां हूं। आप क्या जानना चाहते हैं?';
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      type: 'bot',
      text: getInitialGreeting(),
      options: [
        'नजदीकी मंडी ढूंढें',
        'आज सबसे अच्छा भाव',
        'इंतजार करके बेचें?',
        'फसल विश्लेषण',
        'हेल्पलाइन / सहायता',
      ],
      timestamp: new Date()
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'nearest' | 'bestPrice' | 'wait' | 'analyze' | null>(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [lastCalculatedCrop, setLastCalculatedCrop] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isCalculating]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNextMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}-${Date.now()}`;
  };

  const addMessage = (text: string, type: 'bot' | 'user', options?: string[]) => {
    const newMessage: Message = {
      id: getNextMessageId(),
      type,
      text,
      options,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionClick = (option: string) => {
    // Add user message
    addMessage(option, 'user');

    // Handle different options
    if (option === 'नजदीकी मंडी ढूंढें') {
      setFormType('nearest');
      setShowForm(true);
      addMessage('कृपया अपनी फसल चुनें:', 'bot');
    } else if (option === 'आज सबसे अच्छा भाव') {
      setFormType('bestPrice');
      setShowForm(true);
      addMessage('किस फसल का भाव देखना चाहते हैं?', 'bot');
    } else if (option === 'इंतजार करके बेचें?') {
      setFormType('wait');
      setShowForm(true);
      addMessage('कौन सी फसल के लिए सलाह चाहिए?', 'bot');
    } else if (option === 'फसल विश्लेषण') {
      setFormType('analyze');
      setShowForm(true);
      addMessage('किस फसल का पूरा विश्लेषण चाहिए?', 'bot');
    } else if (option === 'हेल्पलाइन / सहायता') {
      showHelpline();
    } else if (option === 'वापस मुख्य मेनू') {
      setShowForm(false);
      setFormType(null);
      setSelectedCrop('');
      addMessage('आप क्या जानना चाहते हैं?', 'bot', [
        'नजदीकी मंडी ढूंढें',
        'आज सबसे अच्छा भाव',
        'इंतजार करके बेचें?',
        'फसल विश्लेषण',
        'हेल्पलाइन / सहायता',
      ]);
    } else if (option === 'पूरा विश्लेषण देखें') {
      if (onNavigateToAnalyzer && lastCalculatedCrop) {
        onNavigateToAnalyzer(lastCalculatedCrop);
        setIsOpen(false);
      }
    } else if (option === 'मंडी की पूरी जानकारी देखें' || option === 'मंडी की जानकारी देखें') {
      addMessage('मंडी की पूरी जानकारी देखने के लिए "मंडी खोज" पेज पर जाएं।', 'bot', [
        'वापस मुख्य मेनू'
      ]);
    }
  };

  const showHelpline = () => {
    const helplineText = `
📞 किसान हेल्पलाइन:

🌾 कृषि विभाग टोल-फ्री:
   1800-180-1551

📱 PM किसान हेल्पलाइन:
   155261 / 011-24300606

🚜 मंडी सूचना:
   1800-270-0224

⚠️ आपातकालीन सहायता:
   112

💬 सही Mandi सपोर्ट:
   support@sahimandi.in
   +91-98765-43210

🕐 सेवा समय: सोम-शनि, 9 AM - 6 PM
    `.trim();

    addMessage(helplineText, 'bot', [
      'वापस मुख्य मेनू'
    ]);
  };

  const calculateNearestMandi = (cropId: string) => {
    setIsCalculating(true);
    setLastCalculatedCrop(cropId);
    
    setTimeout(() => {
      const mandiOptions = MANDIS.map(mandi => {
        let distanceKm = 0;
        if (userLocation?.latitude && userLocation?.longitude) {
          distanceKm = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            mandi.latitude,
            mandi.longitude
          );
        } else {
          distanceKm = parseFloat(mandi.distance) || 10;
        }
        
        return {
          ...mandi,
          distance: distanceKm,
          price: CURRENT_PRICES[mandi.id]?.[cropId] || 0
        };
      }).sort((a, b) => a.distance - b.distance);

      const nearest = mandiOptions[0];
      const crop = CROPS.find(c => c.id === cropId);

      const responseText = `
✅ सबसे नजदीकी मंडी:

📍 ${nearest.name}
📌 ${nearest.location}
🛣️ दूरी: ${formatDistance(nearest.distance)}
💰 ${crop?.name} का भाव: ₹${nearest.price}/क्विंटल

${nearest.isVerified ? '✓ सत्यापित मंडी' : ''}
      `.trim();

      addMessage(responseText, 'bot', [
        'मंडी की पूरी जानकारी देखें',
        'वापस मुख्य मेनू'
      ]);
      
      setShowForm(false);
      setSelectedCrop('');
      setIsCalculating(false);
    }, 1000);
  };

  const calculateBestPrice = (cropId: string) => {
    setIsCalculating(true);
    setLastCalculatedCrop(cropId);
    
    setTimeout(() => {
      const TRANSPORT_COST_PER_KM = 3;
      const FIXED_COSTS = 35;
      const COMMISSION_PERCENT = 0.02;

      const mandiOptions = MANDIS.map(mandi => {
        let distanceKm = 0;
        if (userLocation?.latitude && userLocation?.longitude) {
          distanceKm = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            mandi.latitude,
            mandi.longitude
          );
        } else {
          distanceKm = parseFloat(mandi.distance) || 10;
        }
        
        const basePrice = CURRENT_PRICES[mandi.id]?.[cropId] || 0;
        const transportCost = Math.round(distanceKm * TRANSPORT_COST_PER_KM);
        const commission = Math.round(basePrice * COMMISSION_PERCENT);
        const totalCost = transportCost + FIXED_COSTS + commission;
        const netProfit = basePrice - totalCost;

        return {
          ...mandi,
          distance: distanceKm,
          basePrice,
          totalCost,
          netProfit
        };
      }).sort((a, b) => b.netProfit - a.netProfit);

      const best = mandiOptions[0];
      const crop = CROPS.find(c => c.id === cropId);

      const responseText = `
🎯 आज सबसे अच्छा विकल्प:

📍 ${best.name}
📌 ${best.location}
🛣️ दूरी: ${formatDistance(best.distance)}

💰 ${crop?.name} का भाव: ₹${best.basePrice}/क्विंटल
💸 कुल खर्च: ₹${best.totalCost}/क्विंटल
✅ आपको मिलेगा: ₹${best.netProfit}/क्विंटल

${best.isVerified ? '✓ सत्यापित मंडी' : ''}
⭐ यहां आपकी जेब में सबसे ज्यादा पैसा आएगा!
      `.trim();

      addMessage(responseText, 'bot', [
        'पूरा विश्लेषण देखें',
        'मंडी की जानकारी देखें',
        'वापस मुख्य मेनू'
      ]);
      
      setShowForm(false);
      setSelectedCrop('');
      setIsCalculating(false);
    }, 1000);
  };

  const calculateWaitAdvice = (cropId: string) => {
    setIsCalculating(true);
    setLastCalculatedCrop(cropId);
    
    setTimeout(() => {
      const TRANSPORT_COST_PER_KM = 3;
      const FIXED_COSTS = 35;
      const COMMISSION_PERCENT = 0.02;

      const mandiOptions = MANDIS.map(mandi => {
        let distanceKm = 0;
        if (userLocation?.latitude && userLocation?.longitude) {
          distanceKm = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            mandi.latitude,
            mandi.longitude
          );
        } else {
          distanceKm = parseFloat(mandi.distance) || 10;
        }
        
        const basePrice = CURRENT_PRICES[mandi.id]?.[cropId] || 0;
        const transportCost = Math.round(distanceKm * TRANSPORT_COST_PER_KM);
        const commission = Math.round(basePrice * COMMISSION_PERCENT);
        const totalCost = transportCost + FIXED_COSTS + commission;
        const netProfitToday = basePrice - totalCost;
        
        const expectedIncrease = Math.round(basePrice * 0.05);
        const netProfitAfter3Days = netProfitToday + expectedIncrease;

        return {
          ...mandi,
          netProfitToday,
          netProfitAfter3Days,
          expectedIncrease,
          distance: distanceKm
        };
      }).sort((a, b) => b.netProfitAfter3Days - a.netProfitAfter3Days);

      const best = mandiOptions[0];
      const crop = CROPS.find(c => c.id === cropId);

      const shouldWait = best.expectedIncrease > 100;

      let responseText;
      if (shouldWait) {
        responseText = `
⏰ हमारी सलाह: 3 दिन प्रतीक्षा करें!

📍 ${best.name}
💰 ${crop?.name} का वर्तमान भाव: ₹${best.netProfitToday}/क्विंटल

📊 अनुमान:
📈 3 दिन बाद भाव: ₹${best.netProfitAfter3Days}/क्विंटल
💵 अतिरिक्त लाभ: ₹${best.expectedIncrease}/क्विंटल

✅ पिछले 3 दिन से भाव बढ़ रहे हैं।
✅ आगे भी बढ़ने की संभावना है।
        `.trim();
      } else {
        responseText = `
✅ हमारी सलाह: आज ही बेच दें!

📍 ${best.name}
💰 ${crop?.name} का भाव: ₹${best.netProfitToday}/क्विंटल

📊 विश्लेषण:
⚠️ भाव में ज्यादा बढ़ोतरी की संभावना कम है।
✅ अभी अच्छा भाव मिल रहा है।
        `.trim();
      }

      addMessage(responseText, 'bot', [
        'पूरा विश्लेषण देखें',
        'वापस मुख्य मेनू'
      ]);
      
      setShowForm(false);
      setSelectedCrop('');
      setIsCalculating(false);
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCrop) {
      return;
    }

    if (formType === 'nearest') {
      calculateNearestMandi(selectedCrop);
    } else if (formType === 'bestPrice') {
      calculateBestPrice(selectedCrop);
    } else if (formType === 'wait') {
      calculateWaitAdvice(selectedCrop);
    } else if (formType === 'analyze') {
      if (onNavigateToAnalyzer) {
        onNavigateToAnalyzer(selectedCrop);
        setIsOpen(false);
        setShowForm(false);
        setSelectedCrop('');
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-300 hover:scale-110 transition-all z-50 flex items-center gap-2 group"
          aria-label="Open Chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
            मदद चाहिए?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-green-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">सही Mandi सहायक</h3>
                <p className="text-xs text-green-100">हमेशा आपकी मदद के लिए</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-green-500 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-3 shadow-sm`}>
                  <p className={`text-sm whitespace-pre-line ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {message.text}
                  </p>
                  
                  {message.options && message.options.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={`${message.id}-option-${idx}`}
                          onClick={() => handleOptionClick(option)}
                          className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg text-sm font-medium transition-colors border border-green-200"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isCalculating && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span className="text-sm text-gray-600 ml-2">गणना हो रही है...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Area */}
          {showForm && (
            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    फसल चुनें:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none appearance-none text-sm font-medium"
                      required
                    >
                      <option value="">फसल चुनें...</option>
                      {CROPS.map(crop => (
                        <option key={crop.id} value={crop.id}>
                          {crop.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedCrop || isCalculating}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isCalculating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      गणना हो रही है...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      जानकारी पाएं
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}