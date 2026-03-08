import React, { useMemo, useState, useRef } from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowRight, TrendingUp, MapPin, Truck, Wallet, Calendar, X, BarChart2, Info, User, Settings, Camera, Save, LogOut, Phone, Languages, Type, Volume2, HelpCircle, ChevronRight, Sprout, Calculator, DollarSign, Users } from 'lucide-react';
import { CROPS, MANDIS, CURRENT_PRICES, PRICE_HISTORY } from '../lib/mockData';

interface FarmerDashboardProps {
  user: {
    name: string;
    location: string;
    crops: string[];
    age?: string;
    gender?: string;
    avatar?: string;
    farmSize?: string;
  };
  onLogout: () => void;
  onUpdateUser?: (user: any) => void;
  onNavigateToAnalyzer?: (cropId: string) => void;
}

export function FarmerDashboard({ user: initialUser, onLogout, onUpdateUser, onNavigateToAnalyzer }: FarmerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'settings'>('overview');
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [user, setUser] = useState(initialUser);
  
  // Settings State
  const [settings, setSettings] = useState({
    language: 'English',
    textSize: 'Normal', // 'Normal' | 'Large'
    voiceAssist: false,
    notifications: true
  });

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(initialUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Get User's Crops Data
  const myCrops = useMemo(() => {
    return CROPS.filter(c => user.crops.includes(c.id));
  }, [user.crops]);

  // 2. Calculate "Best Opportunities"
  const opportunities = useMemo(() => {
    return myCrops.map(crop => {
      let maxPrice = 0;
      let bestMandiId = '';
      
      MANDIS.forEach(mandi => {
        const price = CURRENT_PRICES[mandi.id]?.[crop.id] || 0;
        if (price > maxPrice) {
          maxPrice = price;
          bestMandiId = mandi.id;
        }
      });
      
      const bestMandi = MANDIS.find(m => m.id === bestMandiId);
      
      return {
        crop,
        price: maxPrice,
        mandi: bestMandi
      };
    });
  }, [myCrops]);

  // Mock data for profit calculation (General)
  const profitData = [
    { name: 'Azadpur', price: 2400, transport: 150, profit: 2250 },
    { name: 'Ghazipur', price: 2350, transport: 50, profit: 2300 },
    { name: 'Okhla', price: 2200, transport: 80, profit: 2120 },
  ];

  // Calculator State
  const [calcValues, setCalcValues] = useState({
    labor: 15,
    loading: 10
  });

  // Calculate Transport Cost based on distance (Fixed)
  const transportCost = useMemo(() => {
    if (!selectedOpp?.mandi?.distance) return 0;
    const dist = parseFloat(selectedOpp.mandi.distance); 
    return Math.round(dist * 2); // ₹2 per km per quintal
  }, [selectedOpp]);

  // Derived state for modal
  const modalData = useMemo(() => {
    if (!selectedOpp) return null;

    // 1. Safe Top 3 Mandis Selection (Unique)
    const otherMandis = MANDIS.filter(m => m.id !== selectedOpp.mandi.id);
    const topMandis = [selectedOpp.mandi, otherMandis[0], otherMandis[1]];

    // 2. Generate History Data based on specific crop price
    // We use the current price of the selected crop as a baseline for each mandi
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const history = days.map((day, dayIndex) => {
      const dayData: any = { day };
      
      topMandis.forEach(mandi => {
        const currentPrice = CURRENT_PRICES[mandi.id]?.[selectedOpp.crop.id] || 2000;
        
        // Generate a trend that leads up to the current price
        // dayIndex 6 (Sun) should match currentPrice approximately
        const volatility = currentPrice * 0.05; // 5% volatility
        const trendFactor = (dayIndex - 6) * (volatility * 0.5); // Trend upwards or downwards to today
        
        // Add randomness but keep it somewhat consistent
        const randomFluctuation = (Math.sin(dayIndex * 0.8 + parseInt(mandi.id.slice(1))) * volatility);
        
        let historicalPrice = Math.round(currentPrice + trendFactor + randomFluctuation);
        
        // Ensure price doesn't go negative or too low
        if (historicalPrice < 0) historicalPrice = currentPrice;
        
        dayData[mandi.name] = historicalPrice;
      });
      
      return dayData;
    });

    // 3. Calc Stats
    const prices = topMandis.map(m => CURRENT_PRICES[m.id]?.[selectedOpp.crop.id] || 0);
    const bestPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    return { topMandis, history, bestPrice, avgPrice };
  }, [selectedOpp]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(editForm);
    if (onUpdateUser) {
      onUpdateUser(editForm);
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setEditForm(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const containerClass = settings.textSize === 'Large' ? 'text-lg' : '';

  return (
    <div className={`min-h-screen bg-gray-50 pb-12 relative flex ${containerClass}`}>
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 hidden lg:block sticky top-20 h-[calc(100vh-80px)]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border-2 border-green-500 shrink-0">
               {user.avatar ? (
                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-xl font-bold text-green-700">{user.name.charAt(0)}</span>
               )}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 truncate">{user.name}</div>
              <div className="text-xs text-gray-500">Farmer</div>
            </div>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <BarChart2 className="w-5 h-5" /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <User className="w-5 h-5" /> My Profile
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Settings className="w-5 h-5" /> Settings
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-8"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile Tab Nav */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex gap-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            My Profile
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'settings' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Settings
          </button>
          <button 
            onClick={onLogout}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold bg-red-50 text-red-600 whitespace-nowrap"
          >
            Logout
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Welcome Header */}
            <div className="bg-green-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Namaste, {user.name}! 🙏</h1>
                <p className="text-green-100 text-lg">
                  Here is your personalized market summary for <span className="font-bold text-white">{user.location}</span>.
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 space-y-8">
              
              {/* 1. Best Price Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opp, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <img src={opp.crop.image} alt="" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{opp.crop.name}</h3>
                        <p className="text-sm text-gray-500">Best Market Price</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> High Demand
                      </span>
                    </div>

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-3xl font-bold text-green-700">₹{opp.price}</span>
                      <span className="text-sm text-gray-400 mb-1">/ quintal</span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> Recommended Mandi
                        </span>
                        <span className="font-bold text-gray-900">{opp.mandi?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-gray-500 flex items-center gap-1">
                          <Truck className="w-4 h-4" /> Distance
                        </span>
                        <span className="font-bold text-gray-900">{opp.mandi?.distance}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onNavigateToAnalyzer?.(opp.crop.id)}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === 'profile' ? (
          /* Profile Tab Content */
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {editForm.avatar ? (
                      <img src={editForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-green-600" />
                    )}
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>
                
                <div className="flex-1 space-y-2 pt-2">
                   {!isEditing ? (
                     <>
                        <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                        <p className="text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> {user.location}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {user.crops.map((crop, idx) => (
                            <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
                              {CROPS.find(c => c.id === crop)?.name || crop}
                            </span>
                          ))}
                        </div>
                     </>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={editForm.name}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input 
                            type="text" 
                            value={editForm.location}
                            onChange={e => setEditForm({...editForm, location: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                        </div>
                     </div>
                   )}
                </div>

                <div className="flex gap-3">
                  {!isEditing ? (
                    <button 
                      onClick={() => {
                        setEditForm(user);
                        setIsEditing(true);
                      }}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleProfileUpdate}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-200"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" /> Personal Information
                  </h4>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Age</label>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={editForm.age || ''}
                            onChange={e => setEditForm({...editForm, age: e.target.value})}
                            placeholder="Enter Age"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="font-medium text-gray-900">{user.age || 'Not set'}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Gender</label>
                        {isEditing ? (
                          <select 
                            value={editForm.gender || ''}
                            onChange={e => setEditForm({...editForm, gender: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <div className="font-medium text-gray-900">{user.gender || 'Not set'}</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Farm Size</label>
                      {isEditing ? (
                        <div className="relative">
                          <input 
                            type="text"
                            value={editForm.farmSize || ''}
                            onChange={e => setEditForm({...editForm, farmSize: e.target.value})}
                            placeholder="e.g. 2.5"
                            className="w-full p-2 border border-gray-300 rounded-lg pr-12"
                          />
                          <span className="absolute right-3 top-2 text-gray-400 text-sm">Acres</span>
                        </div>
                      ) : (
                        <div className="font-medium text-gray-900">{user.farmSize ? `${user.farmSize} Acres` : 'Not set'}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Membership ID</label>
                      <div className="font-medium text-gray-900 font-mono bg-gray-50 inline-block px-2 py-1 rounded text-sm">FMR-2024-8823</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-gray-500" /> Farming Details
                  </h4>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm text-gray-500 mb-2">Primary Crops</label>
                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-2">
                             {CROPS.map(c => (
                               <label key={c.id} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                                 <input 
                                   type="checkbox"
                                   checked={editForm.crops.includes(c.id)}
                                   onChange={e => {
                                     const newCrops = e.target.checked 
                                       ? [...editForm.crops, c.id]
                                       : editForm.crops.filter(id => id !== c.id);
                                     setEditForm({...editForm, crops: newCrops});
                                   }}
                                   className="rounded text-green-600 focus:ring-green-500"
                                 />
                                 <span className="text-sm">{c.name}</span>
                               </label>
                             ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {user.crops.map(crop => (
                              <div key={crop} className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg pr-4">
                                <img src={CROPS.find(c => c.id === crop)?.image} className="w-8 h-8 rounded-full object-cover" />
                                <span className="text-sm font-medium text-gray-700">{CROPS.find(c => c.id === crop)?.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Settings Tab Content */
          <div className="p-8 max-w-4xl mx-auto">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings & Preferences</h2>
             
             <div className="space-y-6">
                
                {/* Language Selection */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                     <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                       <Languages className="w-6 h-6" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-gray-900">Language (भाषा)</h3>
                       <p className="text-gray-500 text-sm">Choose the language you are most comfortable with.</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSettings(s => ({...s, language: 'English'}))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${settings.language === 'English' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="font-bold text-lg mb-1">English</div>
                      <div className="text-sm text-gray-500">Default</div>
                    </button>
                    <button 
                      onClick={() => setSettings(s => ({...s, language: 'Hindi'}))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${settings.language === 'Hindi' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="font-bold text-lg mb-1">हिंदी (Hindi)</div>
                      <div className="text-sm text-gray-500">नमस्ते, किसान भाई!</div>
                    </button>
                  </div>
                </div>

                {/* Text Size */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                     <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                       <Type className="w-6 h-6" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-gray-900">Text Size (अक्षर का आकार)</h3>
                       <p className="text-gray-500 text-sm">Make text larger for easier reading.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
                    <button 
                      onClick={() => setSettings(s => ({...s, textSize: 'Normal'}))}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${settings.textSize === 'Normal' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <span className="text-base">Normal (Aa)</span>
                    </button>
                    <button 
                      onClick={() => setSettings(s => ({...s, textSize: 'Large'}))}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${settings.textSize === 'Large' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <span className="text-xl">Large (Aa)</span>
                    </button>
                  </div>
                </div>

                {/* Voice & Accessibility */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                         <Volume2 className="w-6 h-6" />
                       </div>
                       <div>
                         <h3 className="text-lg font-bold text-gray-900">Voice Assistant</h3>
                         <p className="text-gray-500 text-sm">Read out market prices aloud.</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => setSettings(s => ({...s, voiceAssist: !s.voiceAssist}))}
                       className={`w-14 h-8 rounded-full transition-colors relative ${settings.voiceAssist ? 'bg-green-600' : 'bg-gray-200'}`}
                     >
                       <div className={`absolute top-1 bottom-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.voiceAssist ? 'left-7' : 'left-1'}`} />
                     </button>
                   </div>
                </div>

                {/* Help & Support */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                   <div className="flex items-start gap-4 mb-6">
                     <div className="p-3 bg-red-100 rounded-xl text-red-600">
                       <HelpCircle className="w-6 h-6" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-gray-900">Help & Support (मदद)</h3>
                       <p className="text-gray-500 text-sm">Need help using the app? Call our Kisan Helpline.</p>
                     </div>
                   </div>
                   
                   <button className="w-full bg-green-600 text-white p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-green-700 transition-colors shadow-lg shadow-green-100">
                     <Phone className="w-5 h-5" />
                     <span className="font-bold text-lg">Call Kisan Helpline (1800-123-456)</span>
                   </button>
                   
                   <button className="w-full mt-3 bg-white border border-gray-200 text-gray-700 p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                     <span className="font-medium">Watch Video Tutorials</span>
                     <ChevronRight className="w-4 h-4" />
                   </button>
                </div>

             </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOpp && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOpp(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-200 shadow-2xl">
            <button 
              onClick={() => setSelectedOpp(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Modal Header */}
            <div className="bg-green-900 text-white p-8 pb-12">
              <div className="flex items-center gap-4">
                <img src={selectedOpp.crop.image} alt="" className="w-16 h-16 rounded-full border-2 border-white/30" />
                <div>
                  <h2 className="text-2xl font-bold">{selectedOpp.crop.name} Analysis</h2>
                  <p className="text-green-200">Comparative analysis & profit calculation</p>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 -mt-8 pb-8 space-y-8">
              {/* Summary Statistics */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Best Price</p>
                  <div className="text-3xl font-bold text-green-600">₹{modalData.bestPrice}<span className="text-sm font-medium text-gray-400">/q</span></div>
                  <div className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> at {modalData.topMandis[0].name}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Market Price</p>
                  <div className="text-3xl font-bold text-gray-700">₹{modalData.avgPrice}<span className="text-sm font-medium text-gray-400">/q</span></div>
                  <div className="text-xs text-gray-400 mt-1">Across top 3 mandis</div>
                </div>

                 <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Best Time to Sell</p>
                  <div className="text-xl font-bold text-blue-600 flex items-center gap-1">
                    <Calendar className="w-5 h-5" /> In 2 Days
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Price expected to peak</div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Recommendation</p>
                  <div className="inline-block bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full border border-green-200">
                    Sell at {modalData.topMandis[0].name.split(' ')[0]}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Comparison Chart */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-gray-500" /> Top 3 Mandis Comparison
                      </h3>
                      <div className="flex gap-4 text-xs font-bold">
                        {modalData.topMandis.map((m, i) => (
                           <div key={i} className="flex items-center gap-1">
                             <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-green-600' : i === 1 ? 'bg-blue-500' : 'bg-orange-500'}`} />
                             {m.name.split(' ')[0]}
                           </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={modalData.history}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} domain={['dataMin - 100', 'dataMax + 100']} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                          />
                          <Line type="monotone" dataKey={modalData.topMandis[0].name} stroke="#16a34a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                          <Line type="monotone" dataKey={modalData.topMandis[1].name} stroke="#3b82f6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey={modalData.topMandis[2].name} stroke="#f97316" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                       <Info className="w-5 h-5 text-blue-600 shrink-0" />
                       <p className="text-sm text-blue-800 leading-relaxed">
                         <span className="font-bold">Smart Advice:</span> While {modalData.topMandis[0].name} offers the highest price, prices at {modalData.topMandis[1].name} are rising faster. If you can wait 3 days, {modalData.topMandis[1].name} might offer a better deal.
                       </p>
                    </div>
                  </div>
                </div>

                {/* Profit Calculator */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-gray-500" /> Net Profit Calculator
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">Calculate your effective take-home income per quintal at {modalData.topMandis[0].name}.</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-600">Base Price (Per Quintal)</span>
                       <span className="font-bold text-gray-900">₹{modalData.bestPrice}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <label className="text-gray-600 flex items-center gap-1"><Truck className="w-3 h-3" /> Transport Cost</label>
                        <span className="font-bold text-red-500">- ₹{transportCost}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-lg overflow-hidden relative">
                         <div className="absolute inset-0 bg-red-500/20"></div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Auto-calculated: {selectedOpp.mandi.distance} × ₹2/km
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <label className="text-gray-600 flex items-center gap-1"><Users className="w-3 h-3" /> Labor Charges</label>
                        <span className="font-bold text-red-500">- ₹{calcValues.labor}</span>
                      </div>
                      <input 
                         type="range" min="0" max="100" step="5"
                         value={calcValues.labor}
                         onChange={(e) => setCalcValues({...calcValues, labor: parseInt(e.target.value)})}
                         className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                    </div>

                     <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <label className="text-gray-600 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Loading/Unloading</label>
                        <span className="font-bold text-red-500">- ₹{calcValues.loading}</span>
                      </div>
                      <input 
                         type="range" min="0" max="50" step="5"
                         value={calcValues.loading}
                         onChange={(e) => setCalcValues({...calcValues, loading: parseInt(e.target.value)})}
                         className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-gray-900">Effective Net Profit</span>
                       <span className="text-2xl font-bold text-green-600">
                         ₹{modalData.bestPrice - transportCost - calcValues.labor - calcValues.loading}
                       </span>
                     </div>
                     <p className="text-xs text-right text-gray-500">per quintal</p>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Contact {selectedOpp.mandi.name} Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Icon component for the profile section
function SproutIcon(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}