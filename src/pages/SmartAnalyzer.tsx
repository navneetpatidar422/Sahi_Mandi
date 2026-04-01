import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CROPS, MANDIS, CURRENT_PRICES } from '../lib/mockData';
import { TrendingUp, MapPin, Volume2, ChevronDown, ChevronUp, ArrowRight, Info, Truck, IndianRupee, Calculator, Navigation, Sparkles } from 'lucide-react';
import { calculateDistance, formatDistance } from '../lib/locationUtils';

interface SmartAnalyzerProps {
  onMandiSelect?: (mandiId: string) => void;
  initialCropId?: string | null;
  userLocation?: any;
}

export function SmartAnalyzer({ onMandiSelect, initialCropId, userLocation }: SmartAnalyzerProps) {
  const [selectedCrop, setSelectedCrop] = useState(initialCropId || CROPS[0].id);
  const [selectedMode, setSelectedMode] = useState<'today' | 'wait'>('today');
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [showAllMandis, setShowAllMandis] = useState(false);
  
  const cropRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cropRef.current && !cropRef.current.contains(event.target as Node)) {
        setIsCropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Transportation cost calculation constants
  const TRANSPORT_COST_PER_KM = 3; // ₹3 per km per quintal (realistic rate)
  const LABOR_CHARGES = 20; // Fixed labor charges
  const LOADING_UNLOADING = 15; // Loading/Unloading charges
  const COMMISSION_PERCENT = 0.02; // 2% mandi commission

  // Calculate all mandi options with REAL GPS distances and final profits
  const mandiOptions = useMemo(() => {
    return MANDIS.map(mandi => {
      const basePrice = CURRENT_PRICES[mandi.id]?.[selectedCrop] || 2200;
      
      // Calculate real distance using GPS coordinates
      let distanceKm = 0;
      if (userLocation?.latitude && userLocation?.longitude) {
        distanceKm = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          mandi.latitude,
          mandi.longitude
        );
      } else {
        // Fallback to mock distance
        distanceKm = parseFloat(mandi.distance) || 10;
      }
      
      // Calculate all costs
      const transportCost = Math.round(distanceKm * TRANSPORT_COST_PER_KM);
      const laborCharges = LABOR_CHARGES;
      const loadingUnloading = LOADING_UNLOADING;
      const commission = Math.round(basePrice * COMMISSION_PERCENT);
      const totalCost = transportCost + laborCharges + loadingUnloading + commission;
      
      // NET PROFIT = Base Price - All Costs
      const finalProfit = basePrice - totalCost;
      
      return {
        id: mandi.id,
        name: mandi.name,
        location: mandi.location,
        latitude: mandi.latitude,
        longitude: mandi.longitude,
        basePrice,
        distance: distanceKm,
        transportCost,
        laborCharges,
        loadingUnloading,
        commission,
        totalCost,
        finalProfit,
        profitPercentage: ((finalProfit / basePrice) * 100).toFixed(1)
      };
    }).sort((a, b) => b.finalProfit - a.finalProfit); // Sort by NET profit (highest first)
  }, [selectedCrop, userLocation]);

  // Best profit option (highest net profit after all costs)
  const bestOption = mandiOptions[0];
  
  // Nearby option (shortest distance)
  const nearbyOption = [...mandiOptions].sort((a, b) => a.distance - b.distance)[0];
  
  // Highest price option (may not be best due to transport costs)
  const highestPriceOption = [...mandiOptions].sort((a, b) => b.basePrice - a.basePrice)[0];
  
  // Wait option with predicted price increase
  const waitOption = {
    ...bestOption,
    daysToWait: 3,
    expectedIncrease: Math.round(bestOption.basePrice * 0.05), // 5% increase
    expectedProfit: bestOption.finalProfit + Math.round(bestOption.basePrice * 0.05),
    trend: 'पिछले 3 दिन से भाव बढ़ रहे हैं, आगे भी बढ़ने की संभावना'
  };

  const currentCrop = CROPS.find(c => c.id === selectedCrop);

  // Voice playback handler
  const handleVoicePlayback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Determine which options to show based on mode
  const primaryOption = selectedMode === 'today' ? bestOption : waitOption;
  const isPrimaryWait = selectedMode === 'wait';

  // Display mandis
  const displayedMandis = showAllMandis ? mandiOptions : mandiOptions.slice(0, 10);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with crop selector */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">स्मार्ट फसल विश्लेषक</h1>
              <p className="text-gray-500">अधिकतम मुनाफा कहाँ मिलेगा? (Maximum profit calculator)</p>
            </div>
          </div>
          
          {/* Crop Dropdown */}
          <div className="relative" ref={cropRef}>
            <button 
              onClick={() => setIsCropOpen(!isCropOpen)}
              className="w-full md:w-64 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:border-green-500 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img src={currentCrop?.image} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                <span className="font-bold text-gray-900">{currentCrop?.name}</span>
              </div>
              {isCropOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {isCropOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-[400px] overflow-y-auto p-2">
                {CROPS.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => {
                      setSelectedCrop(crop.id);
                      setIsCropOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-3 mb-1 ${
                      selectedCrop === crop.id 
                        ? 'bg-green-50 text-green-800' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <img src={crop.image} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                    <span className="truncate">{crop.name}</span>
                    {selectedCrop === crop.id && <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Info Banner */}
      {userLocation?.latitude && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center gap-3">
          <Navigation className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-900">आपका स्थान: {userLocation.village || userLocation.city || 'पंजीकृत'}</p>
            <p className="text-xs text-blue-700">सभी दूरी और परिवहन लागत आपके वास्तविक GPS स्थान के आधार पर गणना की गई है</p>
          </div>
        </div>
      )}

      {/* Main Question */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">आज कहाँ बेचें?</h2>
        <p className="text-gray-600">परिवहन खर्च घटाकर सबसे अधिक पैसा कहाँ मिलेगा?</p>
        
        {/* Toggle */}
        <div className="inline-flex bg-gray-100 rounded-full p-1 mt-4">
          <button
            onClick={() => setSelectedMode('today')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedMode === 'today'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            आज बेचें
          </button>
          <button
            onClick={() => setSelectedMode('wait')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedMode === 'wait'
                ? 'bg-white text-yellow-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            प्रतीक्षा करके बेचें
          </button>
        </div>
      </div>

      {/* Primary Recommendation Card */}
      <div className={`relative p-8 rounded-3xl shadow-lg border-4 ${
        isPrimaryWait 
          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400' 
          : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500'
      }`}>
        <div className="absolute top-4 right-4">
          <button
            onClick={() => handleVoicePlayback(
              isPrimaryWait 
                ? `${waitOption.daysToWait} दिन प्रतीक्षा करें। ${waitOption.expectedProfit} रुपये मिलेंगे।`
                : `${primaryOption.name} पर बेचें। ${primaryOption.finalProfit} रुपये मिलेंगे।`
            )}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            aria-label="सुनें"
          >
            <Volume2 className={`w-5 h-5 ${isPrimaryWait ? 'text-yellow-600' : 'text-green-600'}`} />
          </button>
        </div>

        <div className="mb-6">
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
            isPrimaryWait ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
          }`}>
            {isPrimaryWait ? '⏳ सर्वश्रेष्ठ समय विकल्प' : '✓ अधिकतम लाभ विकल्प'}
          </span>
        </div>

        {isPrimaryWait ? (
          <>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {waitOption.daysToWait} दिन बाद {waitOption.name} पर बेचें
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-6xl font-bold text-yellow-700">₹{waitOption.expectedProfit}</span>
              <span className="text-xl text-gray-600">/क्विंटल</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-700 font-medium text-lg mb-6">
              <TrendingUp className="w-6 h-6" />
              <span>+₹{waitOption.expectedIncrease} अतिरिक्त लाभ</span>
            </div>
            <p className="text-gray-700 text-lg font-medium mb-6">{waitOption.trend}</p>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{primaryOption.name}</h3>
            <div className="flex items-center gap-3 text-gray-600 mb-6">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{primaryOption.location}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Navigation className="w-5 h-5 text-gray-500" />
              <span className="text-lg text-gray-700 font-medium">{formatDistance(primaryOption.distance)}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-6xl font-bold text-green-700">₹{primaryOption.finalProfit}</span>
              <span className="text-xl text-gray-600">/क्विंटल</span>
            </div>
            <div className="bg-green-100 rounded-lg px-4 py-2 inline-block mb-6">
              <p className="text-green-800 text-lg font-bold">✓ यहाँ आपकी जेब में सबसे अधिक पैसा आएगा!</p>
            </div>
          </>
        )}

        {/* Transparent breakdown */}
        <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-gray-700" />
            <p className="text-sm font-bold text-gray-700">पूरा हिसाब-किताब:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-700 font-bold mb-1 uppercase">मंडी भाव</p>
              <p className="text-3xl font-bold text-blue-900">₹{isPrimaryWait ? waitOption.basePrice + waitOption.expectedIncrease : primaryOption.basePrice}</p>
              <p className="text-xs text-blue-600 mt-1">/क्विंटल</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-xs text-red-700 font-bold mb-1 uppercase">कुल खर्च</p>
              <p className="text-3xl font-bold text-red-900">-₹{isPrimaryWait ? waitOption.totalCost : primaryOption.totalCost}</p>
              <p className="text-xs text-red-600 mt-1">/क्विंटल</p>
            </div>
            <div className={`${isPrimaryWait ? 'bg-yellow-100' : 'bg-green-100'} rounded-lg p-4 border-2 ${isPrimaryWait ? 'border-yellow-300' : 'border-green-300'}`}>
              <p className={`text-xs font-bold mb-1 uppercase ${isPrimaryWait ? 'text-yellow-800' : 'text-green-800'}`}>आपकी जेब में</p>
              <p className={`text-3xl font-bold ${isPrimaryWait ? 'text-yellow-700' : 'text-green-700'}`}>
                ₹{isPrimaryWait ? waitOption.expectedProfit : primaryOption.finalProfit}
              </p>
              <p className={`text-xs mt-1 font-bold ${isPrimaryWait ? 'text-yellow-600' : 'text-green-600'}`}>
                {isPrimaryWait ? waitOption.profitPercentage : primaryOption.profitPercentage}% शुद्ध लाभ
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t-2 border-gray-200">
            <p className="text-xs font-bold text-gray-600 mb-3 uppercase">खर्च विवरण:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-gray-600 font-medium">परिवहन</span>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{isPrimaryWait ? waitOption.transportCost : primaryOption.transportCost}</p>
                <p className="text-xs text-gray-500">{(isPrimaryWait ? waitOption.distance : primaryOption.distance).toFixed(1)} km × ₹{TRANSPORT_COST_PER_KM}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-gray-600 font-medium">मजदूरी</span>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{isPrimaryWait ? waitOption.laborCharges : primaryOption.laborCharges}</p>
                <p className="text-xs text-gray-500">फिक्स</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600 font-medium">लोडिंग</span>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{isPrimaryWait ? waitOption.loadingUnloading : primaryOption.loadingUnloading}</p>
                <p className="text-xs text-gray-500">फिक्स</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="w-4 h-4 text-pink-600" />
                  <span className="text-xs text-gray-600 font-medium">कमीशन</span>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{isPrimaryWait ? waitOption.commission : primaryOption.commission}</p>
                <p className="text-xs text-gray-500">2% मंडी</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {!isPrimaryWait && onMandiSelect && (
          <button
            onClick={() => onMandiSelect(primaryOption.id)}
            className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            इस मंडी के बारे में और जानें
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Smart Comparison Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Best Net Profit (Already shown above) */}
        <div className={`p-6 rounded-2xl border-2 ${selectedMode === 'today' ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">अधिकतम मुनाफा</h4>
              <p className="text-xs text-gray-600">खर्च घटाकर सबसे ज्यादा</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Calculator className="w-5 h-5 text-green-700" />
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-700 font-medium truncate">{bestOption.name}</p>
            <p className="text-xs text-gray-500">{formatDistance(bestOption.distance)}</p>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-green-700">₹{bestOption.finalProfit}</span>
            <span className="text-sm text-gray-600">/क्विंटल</span>
          </div>
          
          <div className="bg-white rounded-lg p-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">मंडी भाव:</span>
              <span className="font-bold text-gray-900">₹{bestOption.basePrice}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>खर्च:</span>
              <span className="font-bold">-₹{bestOption.totalCost}</span>
            </div>
          </div>
        </div>

        {/* Nearest Mandi */}
        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">सबसे नजदीक</h4>
              <p className="text-xs text-gray-600">कम दूरी, कम खर्च</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <MapPin className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-700 font-medium truncate">{nearbyOption.name}</p>
            <p className="text-xs text-blue-700 font-bold">{formatDistance(nearbyOption.distance)} - सबसे कम दूरी</p>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-blue-700">₹{nearbyOption.finalProfit}</span>
            <span className="text-sm text-gray-600">/क्विंटल</span>
          </div>
          
          <div className="bg-white rounded-lg p-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">परिवहन खर्च:</span>
              <span className="font-bold text-green-600">₹{nearbyOption.transportCost} (कम)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">शुद्ध लाभ:</span>
              <span className="font-bold text-gray-900">{nearbyOption.profitPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Highest Price (may not be best) */}
        <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">सबसे ऊँचा भाव</h4>
              <p className="text-xs text-gray-600">अधिक खर्च हो सकता है</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-purple-700" />
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-700 font-medium truncate">{highestPriceOption.name}</p>
            <p className="text-xs text-gray-500">{formatDistance(highestPriceOption.distance)}</p>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-purple-700">₹{highestPriceOption.finalProfit}</span>
            <span className="text-sm text-gray-600">/क्विंटल</span>
          </div>
          
          <div className="bg-white rounded-lg p-2 text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">मंडी भाव:</span>
              <span className="font-bold text-purple-700">₹{highestPriceOption.basePrice} (सबसे ज्यादा)</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>परिवहन:</span>
              <span className="font-bold">₹{highestPriceOption.transportCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wait for Better Price Option */}
      <div className={`p-6 rounded-2xl border-2 ${selectedMode === 'wait' ? 'bg-yellow-50 border-yellow-400' : 'bg-yellow-50 border-yellow-300'} cursor-pointer hover:shadow-lg transition-all`}
           onClick={() => setSelectedMode('wait')}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-1">बेहतर भाव के लिए प्रतीक्षा करें</h4>
            <p className="text-sm text-gray-600">अधिक मुनाफे की संभावना</p>
          </div>
          <div className="bg-yellow-200 p-2 rounded-full">
            <TrendingUp className="w-6 h-6 text-yellow-700" />
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-bold text-yellow-700">₹{waitOption.expectedProfit}</span>
          <span className="text-lg text-gray-600">/क्विंटल</span>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-3">
          <p className="text-sm text-gray-700 font-medium">{waitOption.trend}</p>
          <p className="text-xs text-gray-500 mt-1">{waitOption.daysToWait} दिन में +₹{waitOption.expectedIncrease} अधिक मिलने की उम्मीद</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">स्थान: {waitOption.name}</span>
          <span className="text-yellow-700 font-bold">+₹{waitOption.expectedIncrease} अतिरिक्त</span>
        </div>
      </div>

      {/* All Mandis Comparison Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">सभी मंडियों की तुलना</h3>
          <p className="text-gray-600">आपकी जेब में कहाँ सबसे ज्यादा पैसा आएगा? (सॉर्ट: अधिकतम शुद्ध लाभ)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">रैंक</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">मंडी का नाम</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">स्थान</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">दूरी</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">मंडी भाव</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">परिवहन</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">कुल खर्च</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-green-700 uppercase tracking-wider">आपको मिलेगा ₹</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {displayedMandis.map((mandi, index) => (
                <tr 
                  key={mandi.id} 
                  className={`hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-green-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-green-500 text-white' :
                      index === 1 ? 'bg-blue-500 text-white' :
                      index === 2 ? 'bg-purple-500 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{mandi.name}</div>
                    {index === 0 && (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">
                        सर्वोत्तम विकल्प
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mandi.location}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-gray-900">{formatDistance(mandi.distance)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-blue-700">₹{mandi.basePrice}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-orange-600">₹{mandi.transportCost}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-red-600">₹{mandi.totalCost}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-lg font-bold ${index === 0 ? 'text-green-700' : 'text-gray-900'}`}>
                        ₹{mandi.finalProfit}
                      </span>
                      <span className="text-xs text-gray-500">{mandi.profitPercentage}% लाभ</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {onMandiSelect && (
                      <button
                        onClick={() => onMandiSelect(mandi.id)}
                        className="text-green-600 hover:text-green-700 font-bold text-sm hover:underline"
                      >
                        विवरण देखें
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!showAllMandis && mandiOptions.length > 10 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => setShowAllMandis(true)}
              className="text-green-600 hover:text-green-700 font-bold flex items-center justify-center gap-2 mx-auto"
            >
              और {mandiOptions.length - 10} मंडियाँ देखें
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {showAllMandis && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => setShowAllMandis(false)}
              className="text-gray-600 hover:text-gray-700 font-bold flex items-center justify-center gap-2 mx-auto"
            >
              कम दिखाएं
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Info className="w-6 h-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 mb-2">यह गणना कैसे की गई?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>दूरी:</strong> आपके वास्तविक GPS स्थान से गणना (Haversine formula)</li>
              <li>• <strong>परिवहन खर्च:</strong> ₹{TRANSPORT_COST_PER_KM}/km/quintal (बाजार दर)</li>
              <li>• <strong>अन्य खर्च:</strong> मजदूरी (₹{LABOR_CHARGES}), लोडिंग (₹{LOADING_UNLOADING}), कमीशन ({COMMISSION_PERCENT * 100}%)</li>
              <li>• <strong>शुद्ध लाभ:</strong> मंडी भाव - सभी खर्च = आपकी जेब में पैसा</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}