
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Share2, MessageCircle, Star, Clock, Info, MapPin, ShieldCheck, Phone, Navigation, TrendingUp, ChevronRight, Calendar, ArrowUpRight, ArrowDownRight, Minus, X, CheckCircle2 } from 'lucide-react';
import { MANDIS, CURRENT_PRICES, CROPS, REVIEWS as INITIAL_REVIEWS } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface MandiDetailsProps {
  mandiId: string;
  onBack: () => void;
}

export function MandiDetails({ mandiId, onBack }: MandiDetailsProps) {
  const mandi = MANDIS.find(m => m.id === mandiId);
  const prices = CURRENT_PRICES[mandiId as keyof typeof CURRENT_PRICES];
  const [activeTab, setActiveTab] = useState<'prices' | 'info' | 'reviews'>('prices');
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  
  // Review State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', name: '' });

  const selectedCrop = useMemo(() => {
    if (!selectedCropId) return null;
    return CROPS.find(c => c.id === selectedCropId);
  }, [selectedCropId]);

  // Generate mock history data for the selected crop
  const historyData = useMemo(() => {
    if (!selectedCrop || !prices) return [];
    
    const currentPrice = prices[selectedCrop.id as keyof typeof prices] || 2000;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Create a realistic trend (e.g., slightly upward or downward)
    // We use the crop ID to seed the randomness so it's consistent for the same crop
    const seed = selectedCrop.id.charCodeAt(0) % 3; // 0, 1, or 2
    const trendDirection = seed === 0 ? 1 : seed === 1 ? -1 : 0; 
    
    return days.map((day, index) => {
      // Add some random noise and a trend factor
      const variance = (Math.random() * 0.04) - 0.02; // +/- 2%
      const trendFactor = (index / 7) * 0.08 * trendDirection; // up to 8% change
      
      // Calculate price based on current price
      if (index === 6) return { day, price: currentPrice };
      
      const price = Math.round(currentPrice * (1 - trendFactor + variance));
      return { day, price };
    });
  }, [selectedCrop, prices]);

  const insightData = useMemo(() => {
    if (historyData.length < 2) return { text: "Data unavailable", type: 'neutral' };
    const firstPrice = historyData[0].price;
    const lastPrice = historyData[historyData.length - 1].price;
    const diff = lastPrice - firstPrice;
    const percent = (diff / firstPrice) * 100;

    if (percent > 2) return { 
        text: `Prices are rising! Up by ${percent.toFixed(1)}% this week. High demand expected.`, 
        suggestion: "Hold for better rates",
        type: 'positive' 
    };
    if (percent < -2) return { 
        text: `Prices are falling. Down by ${Math.abs(percent).toFixed(1)}% this week. Supply is increasing.`, 
        suggestion: "Sell now to avoid loss",
        type: 'negative' 
    };
    return { 
        text: "Prices are stable with minimal fluctuation. Good time for regular trading.", 
        suggestion: "Safe to sell",
        type: 'neutral' 
    };
  }, [historyData]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment || !newReview.name) return;

    const review = {
      id: Date.now(),
      user: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment
    };

    setReviews([review, ...reviews]);
    setIsReviewModalOpen(false);
    setNewReview({ rating: 0, comment: '', name: '' });
  };

  if (!mandi) return <div>Mandi not found</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[80vh]">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 w-full group">
        <ImageWithFallback src={mandi.image} alt={mandi.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        <button 
          onClick={() => {
            if (selectedCropId) {
              setSelectedCropId(null);
            } else {
              onBack();
            }
          }}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/30 transition-colors border border-white/10 z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row justify-between items-end gap-6 text-white">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex-1"
          >
            <div className="flex items-center gap-2 mb-3">
              {mandi.isVerified && (
                <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Mandi
                </span>
              )}
              <span className="bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg shadow-green-900/20">Open Now</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">{mandi.name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-200 font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {mandi.location}</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {mandi.trustScore} ({reviews.length} Reviews)</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {mandi.schedule.open} - {mandi.schedule.close}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 w-full md:w-auto"
          >
             <button className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
               <Share2 className="w-5 h-5" /> Share
             </button>
             <button className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
               <Phone className="w-5 h-5" /> Call Now
             </button>
             <button className="flex-1 md:flex-none bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
               <MessageCircle className="w-5 h-5" /> Chat
             </button>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 px-6 md:px-8 sticky top-20 md:top-0 bg-white z-40 shadow-sm">
        <div className="flex gap-8 overflow-x-auto hide-scrollbar">
          {[
            { id: 'prices', label: 'Daily Crop Prices' },
            { id: 'info', label: 'Info & Schedule' },
            { id: 'reviews', label: 'Farmer Reviews' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 min-h-[500px] bg-gray-50">
        {activeTab === 'prices' && (
          <div className="max-w-5xl mx-auto">
            {!selectedCropId ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                 <div className="bg-blue-50 text-blue-900 p-4 rounded-xl flex items-start md:items-center gap-3 mb-6 border border-blue-100 shadow-sm">
                  <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5 md:mt-0" />
                  <p className="text-sm">Prices are updated daily by the Mandi Administrator. Last update: <span className="font-bold">Today, 8:00 AM</span>. Actual prices may vary based on quality.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {CROPS.map((crop, index) => {
                    const price = prices?.[crop.id as keyof typeof prices];
                    if (!price) return null;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={crop.id} 
                        onClick={() => setSelectedCropId(crop.id)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                      >
                        <ImageWithFallback src={crop.image} alt={crop.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100 group-hover:scale-105 transition-transform" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">{crop.name}</h3>
                            <span className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-2 py-1 rounded">Grade A</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">{crop.category}</p>
                          <div className="flex items-end justify-between">
                            <div>
                               <span className="text-2xl font-bold text-green-700">₹{price}</span>
                               <span className="text-xs text-gray-400 ml-1">/ quintal</span>
                            </div>
                            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 text-xs font-bold">
                              <TrendingUp className="w-3 h-3" />
                              <span>+2.4%</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : selectedCrop && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row gap-8"
              >
                  
                  {/* Left Column: Crop Details & Stats */}
                  <div className="lg:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4 mb-6">
                        <ImageWithFallback src={selectedCrop.image} alt={selectedCrop.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedCrop.name}</h2>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{selectedCrop.category}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                           <p className="text-sm text-green-800 mb-1 font-medium">Current Market Price</p>
                           <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold text-green-700">₹{prices?.[selectedCrop.id] || 0}</span>
                             <span className="text-sm text-green-600 font-medium">/ quintal</span>
                           </div>
                           <div className="flex items-center gap-2 mt-2 text-sm text-green-700 font-medium">
                             <TrendingUp className="w-4 h-4" /> 
                             <span>Trending High in {mandi.name}</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <p className="text-xs text-gray-500 mb-1">Min Price</p>
                             <p className="font-bold text-gray-900">₹{Math.min(...historyData.map(d => d.price))}</p>
                           </div>
                           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <p className="text-xs text-gray-500 mb-1">Max Price</p>
                             <p className="font-bold text-gray-900">₹{Math.max(...historyData.map(d => d.price))}</p>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className={`bg-gradient-to-br ${
                      insightData.type === 'positive' ? 'from-green-600 to-green-700' :
                      insightData.type === 'negative' ? 'from-red-600 to-red-700' :
                      'from-blue-600 to-blue-700'
                    } rounded-2xl p-6 text-white shadow-lg`}>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                          {insightData.type === 'positive' ? <ArrowUpRight className="w-6 h-6 text-white" /> :
                           insightData.type === 'negative' ? <ArrowDownRight className="w-6 h-6 text-white" /> :
                           <Info className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                           <h3 className="font-bold text-lg">Smart Insight</h3>
                           <p className="text-white/90 text-sm mt-1 leading-relaxed">
                             {insightData.text}
                           </p>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-sm font-medium border border-white/20 text-center">
                        Suggestion: {insightData.suggestion}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Graph */}
                  <div className="lg:w-2/3">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                       <div className="flex items-center justify-between mb-8">
                         <div>
                           <h3 className="text-xl font-bold text-gray-900">Price Trend Analysis</h3>
                           <p className="text-sm text-gray-500">Last 7 Days Performance</p>
                         </div>
                         <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2">
                           <Calendar className="w-4 h-4" /> Past Week
                         </div>
                       </div>

                       <div className="h-[350px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={insightData.type === 'negative' ? '#ef4444' : "#16a34a"} stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor={insightData.type === 'negative' ? '#ef4444' : "#16a34a"} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                              <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 500}} 
                                dy={10} 
                              />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 500}} 
                                domain={['dataMin - 100', 'dataMax + 100']}
                                tickFormatter={(value) => `₹${value}`}
                              />
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                formatter={(value: number) => [`₹${value}`, 'Price']}
                                labelStyle={{ color: '#6b7280', marginBottom: '0.5rem' }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke={insightData.type === 'negative' ? '#ef4444' : "#16a34a"}
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorPrice)" 
                                animationDuration={1000}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                  </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">About {mandi.name}</h3>
                <p className="text-gray-600 leading-relaxed">
                  Established in 1995, {mandi.name} is one of the most prominent agricultural markets in {mandi.location}. 
                  It serves as a vital hub for farmers across the district, providing auction facilities, cold storage, 
                  and direct payment systems. The mandi is fully computerized and monitored by the APMC board to ensure transparency.
                </p>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">APMC Registered</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">e-NAM Integrated</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">ISO 9001:2015</span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <Info className="w-5 h-5 text-green-600" /> Latest Announcements
                </h3>
                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 text-yellow-900 flex gap-4">
                  <div className="bg-white p-2 rounded-full h-fit shadow-sm shrink-0">
                    <Info className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">{mandi.updates}</p>
                    <p className="text-sm text-yellow-700">Posted by Admin • 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" /> Opening Hours
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Open Time</span>
                    <span className="font-bold text-gray-900">{mandi.schedule.open}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Close Time</span>
                    <span className="font-bold text-gray-900">{mandi.schedule.close}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Weekly Off</span>
                    <span className="font-bold text-red-500">{mandi.schedule.holidays.join(', ')}</span>
                  </div>
                </div>
              </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Mandi Facilities</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" /> Cold Storage Available</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" /> Electronic Weighing</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" /> Farmer Rest House</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" /> Canteen & Water</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" /> Parking (200 Trucks)</li>
                </ul>
              </div>
              
              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg">
                <Navigation className="w-5 h-5" /> Get Directions
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <h3 className="font-bold text-2xl text-gray-900">Farmer Reviews</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
                  </div>
                  <span className="text-gray-500 font-medium">4.8 out of 5</span>
                </div>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Write a Review
              </button>
            </div>
            
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 text-lg uppercase">
                        {review.user[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{review.user}</h4>
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">Verified Farmer</span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 text-xs bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 pl-16 leading-relaxed text-base">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               onClick={() => setIsReviewModalOpen(false)}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
             >
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h2>
                <p className="text-sm text-gray-500 mb-6">Share your experience at {mandi.name} to help other farmers.</p>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReview.name}
                      onChange={e => setNewReview({...newReview, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                    <textarea 
                      required
                      value={newReview.comment}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Was the auction transparent? How were the facilities?"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    Submit Review
                  </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
