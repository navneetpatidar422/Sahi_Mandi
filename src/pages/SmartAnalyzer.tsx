import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CROPS, MANDIS, CURRENT_PRICES } from '../lib/mockData';
import { TrendingUp, MapPin, Volume2, ChevronDown, ChevronUp, ArrowRight, Info } from 'lucide-react';
import wheatImage from 'figma:asset/6094750efffb70a2ac9c316255c7211155844a50.png';

export function SmartAnalyzer({ onMandiSelect, initialCropId }: { onMandiSelect?: (mandiId: string) => void; initialCropId?: string | null }) {
  const [selectedCrop, setSelectedCrop] = useState(initialCropId || CROPS[0].id);
  const [selectedMode, setSelectedMode] = useState<'today' | 'wait'>('today');
  const [isCropOpen, setIsCropOpen] = useState(false);
  
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

  // Calculate all mandi options with final profits
  const mandiOptions = useMemo(() => {
    // Take first 5 mandis for analysis
    const selectedMandis = MANDIS.slice(0, 5);
    
    return selectedMandis.map(mandi => {
      const basePrice = CURRENT_PRICES[mandi.id]?.[selectedCrop] || 2200;
      const distanceKm = parseFloat(mandi.distance);
      const transportCost = Math.round(distanceKm * 2); // ₹2/km/quintal
      const laborCharges = 15;
      const loadingUnloading = 10;
      const totalCost = transportCost + laborCharges + loadingUnloading;
      const finalProfit = basePrice - totalCost;
      
      return {
        id: mandi.id,
        name: mandi.name,
        location: mandi.location,
        basePrice,
        distance: distanceKm,
        transportCost,
        laborCharges,
        loadingUnloading,
        totalCost,
        finalProfit
      };
    }).sort((a, b) => b.finalProfit - a.finalProfit);
  }, [selectedCrop]);

  // Best profit option
  const bestOption = mandiOptions[0];
  
  // Nearby option (shortest distance)
  const nearbyOption = [...mandiOptions].sort((a, b) => a.distance - b.distance)[0];
  
  // Wait option with predicted price increase
  const waitOption = {
    ...bestOption,
    daysToWait: 3,
    expectedIncrease: 150,
    expectedProfit: bestOption.finalProfit + 150,
    trend: 'पिछले 3 दिन से भाव बढ़ रहे हैं'
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with crop selector */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img src={wheatImage} alt="Crop" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">फसल विश्लेषण</h1>
              <p className="text-gray-500">आपकी फसल के लिए सबसे अच्छा विकल्प</p>
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

      {/* Main Question */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">आज कहाँ बेचें?</h2>
        
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
            {isPrimaryWait ? '⏳ सर्वश्रेष्ठ समय विकल्प' : '✓ सर्वोत्तम सिफारिश'}
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
              <span className="text-lg">{primaryOption.location} • {primaryOption.distance.toFixed(1)} किमी</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-6xl font-bold text-green-700">₹{primaryOption.finalProfit}</span>
              <span className="text-xl text-gray-600">/क्विंटल</span>
            </div>
            <p className="text-green-700 text-lg font-medium mb-6">✓ आज यहाँ सबसे अधिक लाभ मिलेगा</p>
          </>
        )}

        {/* Transparent breakdown */}
        <div className="bg-white/70 rounded-xl p-5 backdrop-blur-sm">
          <p className="text-sm font-bold text-gray-700 mb-3">आपकी जेब में कैसे आएगा:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">कुल भाव</p>
              <p className="text-2xl font-bold text-gray-900">₹{isPrimaryWait ? waitOption.basePrice + waitOption.expectedIncrease : primaryOption.basePrice}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">खर्च</p>
              <p className="text-2xl font-bold text-red-600">-₹{isPrimaryWait ? waitOption.totalCost : primaryOption.totalCost}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">आपकी जेब में</p>
              <p className={`text-2xl font-bold ${isPrimaryWait ? 'text-yellow-700' : 'text-green-700'}`}>
                ₹{isPrimaryWait ? waitOption.expectedProfit : primaryOption.finalProfit}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>परिवहन: ₹{isPrimaryWait ? waitOption.transportCost : primaryOption.transportCost}</span>
              <span>मजदूरी: ₹{isPrimaryWait ? waitOption.laborCharges : primaryOption.laborCharges}</span>
              <span>लोडिंग: ₹{isPrimaryWait ? waitOption.loadingUnloading : primaryOption.loadingUnloading}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Wait for better price option */}
        <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-300 hover:shadow-lg transition-all cursor-pointer"
             onClick={() => setSelectedMode('wait')}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">बेहतर भाव के लिए प्रतीक्षा</h4>
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
          
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 font-medium">{waitOption.trend}</p>
            <p className="text-xs text-gray-500 mt-1">{waitOption.daysToWait} दिन में +₹{waitOption.expectedIncrease} अधिक</p>
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">स्थान:</span> {waitOption.name}
          </div>
        </div>

        {/* Nearby quick sale option */}
        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300 hover:shadow-lg transition-all cursor-pointer"
             onClick={() => setSelectedMode('today')}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">नज़दीकी मंडी – तुरंत बिक्री</h4>
              <p className="text-sm text-gray-600">जल्दी और सुरक्षित</p>
            </div>
            <div className="bg-blue-200 p-2 rounded-full">
              <MapPin className="w-6 h-6 text-blue-700" />
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-blue-700">₹{nearbyOption.finalProfit}</span>
            <span className="text-lg text-gray-600">/क्विंटल</span>
          </div>
          
          <div className="bg-white rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 font-medium">कम दूरी, कम खर्च</p>
            <p className="text-xs text-gray-500 mt-1">केवल {nearbyOption.distance.toFixed(1)} किमी दूर</p>
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">स्थान:</span> {nearbyOption.name}, {nearbyOption.location}
          </div>
        </div>
      </div>

      {/* Quick comparison of all analyzed mandis */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 text-lg mb-4">अन्य विकल्प</h3>
        <div className="space-y-3">
          {mandiOptions.slice(1, 4).map((option, index) => (
            <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-bold text-gray-900">{option.name}</p>
                <p className="text-sm text-gray-500">{option.location} • {option.distance.toFixed(1)} किमी</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-700">₹{option.finalProfit}</p>
                  <p className="text-xs text-gray-500">/क्विंटल</p>
                </div>
                <button
                  onClick={() => onMandiSelect?.(option.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Info className="w-4 h-4" />
                  विवरण
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}