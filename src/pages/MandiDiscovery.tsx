import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, Filter, X, ChevronDown, CheckCircle2, TrendingUp, Map as MapIcon, Grid3x3, Navigation } from 'lucide-react';
import { MandiCard } from '../components/MandiCard';
import { MANDIS, CROPS, CURRENT_PRICES } from '../lib/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { MapView } from '../components/MapView';
import { LocationSelector } from '../components/LocationSelector';
import { calculateDistance, formatDistance } from '../lib/locationUtils';

interface MandiDiscoveryProps {
  onMandiSelect: (mandiId: string) => void;
  initialSearch?: string;
  userLocation?: any;
}

export function MandiDiscovery({ onMandiSelect, initialSearch = '', userLocation: initialUserLocation }: MandiDiscoveryProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMandiId, setSelectedMandiId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; name: string } | null>(() => {
    // Initialize user location from farmer data if available
    if (initialUserLocation?.latitude && initialUserLocation?.longitude) {
      return {
        latitude: initialUserLocation.latitude,
        longitude: initialUserLocation.longitude,
        name: initialUserLocation.location || 'Your Location'
      };
    }
    return null;
  });
  
  // Filter States
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'relevance' | 'trust' | 'distance' | 'priceLow' | 'priceHigh'>('relevance');
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  const selectedCrop = useMemo(() => CROPS.find(c => c.id === selectedCropId), [selectedCropId]);

  // Sync user location from props when logged in user changes
  useEffect(() => {
    if (initialUserLocation?.latitude && initialUserLocation?.longitude) {
      setUserLocation({
        latitude: initialUserLocation.latitude,
        longitude: initialUserLocation.longitude,
        name: initialUserLocation.location || 'Your Location'
      });
    }
  }, [initialUserLocation]);

  // Calculate real distances based on user location
  const mandisWithDistances = useMemo(() => {
    if (!userLocation) return MANDIS;
    
    return MANDIS.map(mandi => ({
      ...mandi,
      calculatedDistance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        mandi.latitude,
        mandi.longitude
      ),
      distance: formatDistance(
        calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          mandi.latitude,
          mandi.longitude
        )
      )
    }));
  }, [userLocation]);

  // Update sort when crop is selected
  useEffect(() => {
    if (selectedCropId) {
      setSortBy('distance');
    }
  }, [selectedCropId]);

  // Filter Logic
  const filteredMandis = useMemo(() => {
    return mandisWithDistances.filter(mandi => {
      // Search Text
      const matchesSearch = 
        mandi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mandi.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Distance
      const dist = mandi.calculatedDistance !== undefined ? mandi.calculatedDistance : parseFloat(mandi.distance);
      const matchesDistance = dist <= maxDistance;

      return matchesSearch && matchesDistance;
    }).sort((a, b) => {
      if (sortBy === 'trust') return parseFloat(b.trustScore) - parseFloat(a.trustScore);
      if (sortBy === 'distance') {
        const distA = a.calculatedDistance !== undefined ? a.calculatedDistance : parseFloat(a.distance);
        const distB = b.calculatedDistance !== undefined ? b.calculatedDistance : parseFloat(b.distance);
        return distA - distB;
      }
      
      if (selectedCropId) {
        const priceA = CURRENT_PRICES[a.id]?.[selectedCropId] || 0;
        const priceB = CURRENT_PRICES[b.id]?.[selectedCropId] || 0;
        
        if (sortBy === 'priceLow') return priceA - priceB;
        if (sortBy === 'priceHigh') return priceB - priceA;
      }

      return 0; // relevance
    });
  }, [searchTerm, maxDistance, sortBy, selectedCropId, mandisWithDistances]);

  // Pagination / Limit logic
  const displayedMandis = showAll ? filteredMandis : filteredMandis.slice(0, 9);

  const handleMandiClick = (mandiId: string) => {
    setSelectedMandiId(mandiId);
    onMandiSelect(mandiId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1595855720058-255a737ee992?auto=format&fit=crop&q=80&w=2000" 
            alt="Agriculture Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Find Verified Mandis
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-light text-green-100 max-w-2xl mx-auto leading-relaxed"
          >
            Search verified mandis near you and compare prices instantly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-2 rounded-2xl shadow-xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2 mt-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for mandis (e.g. Azadpur, Nashik)..."
                className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg">
              Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Help Banner */}
        {!userLocation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3"
          >
            <div className="bg-blue-600 p-2 rounded-lg shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">Set Your Location for Accurate Results</h4>
              <p className="text-sm text-gray-600">
                Choose your location in the filters to see real distances and find the nearest mandis to you. 
                We'll show you precise km calculations from your location.
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-1/4 space-y-6 ${showFilters ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:relative lg:bg-transparent lg:p-0' : 'hidden lg:block'}`}
          >
            {showFilters && (
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">Refine Search</h3>
                </div>

                {/* Location Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Location</label>
                  <LocationSelector
                    onLocationSelect={(location) => {
                      setUserLocation(location);
                      setSortBy('distance');
                    }}
                    currentLocation={userLocation}
                  />
                  {userLocation && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800 font-medium flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        Showing distances from {userLocation.name}
                      </p>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100 mb-6" />

                {/* Crop Filter */}
                <div className="mb-6">
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Compare Crop Price</label>
                   <div className="relative">
                     <select 
                       value={selectedCropId || ''}
                       onChange={(e) => setSelectedCropId(e.target.value || null)}
                       className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                     >
                       <option value="">Select a crop...</option>
                       {CROPS.map(crop => (
                         <option key={crop.id} value={crop.id}>{crop.name}</option>
                       ))}
                     </select>
                     <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                   {selectedCrop && (
                     <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                       <TrendingUp className="w-3 h-3" /> Showing prices for {selectedCrop.name}
                     </p>
                   )}
                </div>

                <hr className="border-gray-100 mb-6" />

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="distance">Nearest First</option>
                      <option value="trust">Highest Trust Score</option>
                      {selectedCropId && (
                        <>
                          <option value="priceLow">Price: Low to High</option>
                          <option value="priceHigh">Price: High to Low</option>
                        </>
                      )}
                    </select>
                    <ArrowUpDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Max Distance</label>
                    <span className="text-sm font-bold text-green-600">{maxDistance} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="500" 
                    step="5"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5 km</span>
                    <span>500 km</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setMaxDistance(50);
                    setSortBy('relevance');
                    setSearchTerm('');
                    setSelectedCropId(null);
                  }}
                  className="w-full mt-6 text-sm text-gray-500 hover:text-green-600 hover:bg-green-50 py-2 rounded-lg transition-colors border border-dashed border-gray-300 hover:border-green-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Mandis <span className="text-gray-400 text-lg font-normal">({filteredMandis.length} found)</span>
              </h2>
              
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="hidden sm:flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                      viewMode === 'grid'
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                      viewMode === 'map'
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Map</span>
                  </button>
                </div>

                <button 
                  className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>
            </div>

            {filteredMandis.length > 0 ? (
              <>
                {viewMode === 'map' ? (
                  <MapView
                    mandis={displayedMandis}
                    selectedMandiId={selectedMandiId}
                    onMandiSelect={handleMandiClick}
                    height="600px"
                    userLocation={userLocation}
                  />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    <AnimatePresence>
                      {displayedMandis.map((mandi, index) => (
                        <motion.div
                          key={mandi.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                        >
                          <MandiCard 
                            mandi={mandi} 
                            onClick={() => onMandiSelect(mandi.id)}
                            priceInfo={selectedCropId && selectedCrop ? {
                              price: CURRENT_PRICES[mandi.id]?.[selectedCropId] || 0,
                              cropName: selectedCrop.name
                            } : undefined}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
                
                {viewMode === 'grid' && filteredMandis.length > 9 && !showAll && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setShowAll(true)}
                      className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 hover:text-green-600 transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                      See All Mandis <ChevronDown className="w-4 h-4" />
                    </button>
                    <p className="text-sm text-gray-400 mt-3">Showing 9 of {filteredMandis.length} mandis near you</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Mandis Found</h3>
                <p className="text-gray-500 mb-6">Try increasing the distance range or checking your spelling.</p>
                <button 
                  onClick={() => {
                    setMaxDistance(500);
                    setSearchTerm('');
                    setSelectedCropId(null);
                  }}
                  className="text-green-600 font-bold hover:underline"
                >
                  View All Mandis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}