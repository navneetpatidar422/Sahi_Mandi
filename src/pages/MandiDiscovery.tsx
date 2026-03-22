import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, MapPin, SlidersHorizontal, ArrowUpDown, Filter, X,
  ChevronDown, TrendingUp, Locate, Navigation2, LayoutGrid, Map
} from 'lucide-react';
import { MandiCard } from '../components/MandiCard';
import { MANDIS, CROPS, CURRENT_PRICES } from '../lib/mockData';
import { MANDI_COORDINATES } from '../lib/mandiCoordinates';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const nearbyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49], iconAnchor: [15, 49], popupAnchor: [1, -40], shadowSize: [41, 41],
});
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function FlyTo({ coords, zoom }: { coords: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo(coords, zoom, { duration: 1.4 }); }, [coords]);
  return null;
}

function calcDistanceKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

interface MandiDiscoveryProps {
  onMandiSelect: (mandiId: string) => void;
  initialSearch?: string;
}

export function MandiDiscovery({ onMandiSelect, initialSearch = '' }: MandiDiscoveryProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [maxDistance, setMaxDistance] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'relevance' | 'trust' | 'distance' | 'priceLow' | 'priceHigh'>('relevance');
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<{ coords: [number, number]; zoom: number } | null>(null);

  const selectedCrop = useMemo(() => CROPS.find(c => c.id === selectedCropId), [selectedCropId]);

  useEffect(() => {
    if (selectedCropId) setSortBy('distance');
  }, [selectedCropId]);

  const handleLocateMe = () => {
    setLocating(true);
    setLocationError(null);
    if (!window.isSecureContext) {
      setLocationError('Location needs a secure URL. Open this site on localhost or HTTPS, then try again.');
      setLocating(false);
      return;
    }
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setFlyTo({ coords, zoom: 7 });
        setSortBy('distance');
        setLocating(false);
        setViewMode('map');
      },
      (err) => {
        if (err.code === 1) {
          setLocationError('Location permission blocked. Allow location in your browser settings and retry.');
        } else if (err.code === 2) {
          setLocationError('Location unavailable right now. Please check GPS/network and retry.');
        } else if (err.code === 3) {
          setLocationError('Location request timed out. Retry in an open area or with better network.');
        } else {
          setLocationError('Could not get your location. Please allow location access.');
        }
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const mandisWithDist = useMemo(() => {
    return MANDIS.map(m => {
      const coords = MANDI_COORDINATES[m.id];
      const realDist = userLocation && coords
        ? parseFloat(calcDistanceKm(userLocation, coords).toFixed(1))
        : parseFloat(m.distance);
      return { ...m, realDistKm: realDist };
    });
  }, [userLocation]);

  const filteredMandis = useMemo(() => {
    return mandisWithDist
      .filter(m => {
        const matchesSearch =
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDist = userLocation ? m.realDistKm <= maxDistance : true;
        return matchesSearch && matchesDist;
      })
      .sort((a, b) => {
        if (sortBy === 'trust') return parseFloat(b.trustScore) - parseFloat(a.trustScore);
        if (sortBy === 'distance') return a.realDistKm - b.realDistKm;
        if (selectedCropId) {
          const pA = CURRENT_PRICES[a.id]?.[selectedCropId] || 0;
          const pB = CURRENT_PRICES[b.id]?.[selectedCropId] || 0;
          if (sortBy === 'priceLow') return pA - pB;
          if (sortBy === 'priceHigh') return pB - pA;
        }
        return 0;
      });
  }, [mandisWithDist, searchTerm, maxDistance, sortBy, selectedCropId, userLocation]);

  const displayedMandis = showAll ? filteredMandis : filteredMandis.slice(0, 9);
  const nearbySet = new Set(filteredMandis.slice(0, 5).map(m => m.id));
  const mapMandis = filteredMandis.filter(m => MANDI_COORDINATES[m.id]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative bg-green-900 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1595855720058-255a737ee992?auto=format&fit=crop&q=80&w=2000"
            alt="bg" className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Find Verified Mandis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-xl text-green-100 max-w-2xl mx-auto"
          >
            Search by name or use your location to instantly find the nearest mandis.
          </motion.p>

          {/* Search + Locate row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            {/* Search bar */}
            <div className="bg-white flex-1 flex items-center rounded-2xl shadow-xl overflow-hidden">
              <Search className="ml-4 text-gray-400 w-5 h-5 shrink-0" />
              <input
                type="text"
                placeholder="Search mandis (e.g. Azadpur, Nashik)..."
                className="flex-1 pl-3 pr-4 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Locate Me */}
            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl transition-all shrink-0"
            >
              {locating
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Locating…</>
                : <><Locate className="w-5 h-5" /> {userLocation ? 'Relocate' : 'Near Me'}</>
              }
            </button>
          </motion.div>

          {locationError && <p className="text-red-300 text-sm">{locationError}</p>}

          {userLocation && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-green-300 text-sm flex items-center justify-center gap-1.5"
            >
              <Navigation2 className="w-4 h-4" />
              Location found — showing {filteredMandis.length} mandis sorted by real distance from you
            </motion.p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
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

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24 space-y-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">Refine Search</h3>
              </div>

              {/* Location status */}
              {userLocation ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-700 flex items-center gap-1.5">
                    <Navigation2 className="w-3.5 h-3.5" /> Location Active
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">Sorting by real distance from you</p>
                  <button
                    onClick={() => { setUserLocation(null); setSortBy('relevance'); }}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Clear location
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  <Locate className="w-4 h-4" />
                  {locating ? 'Locating…' : 'Use My Location'}
                </button>
              )}

              <hr className="border-gray-100" />

              {/* Crop Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Compare Crop Price</label>
                <div className="relative">
                  <select
                    value={selectedCropId || ''}
                    onChange={e => setSelectedCropId(e.target.value || null)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                  >
                    <option value="">Select a crop…</option>
                    {CROPS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {selectedCrop && (
                  <p className="text-xs text-green-600 mt-1.5 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Showing prices for {selectedCrop.name}
                  </p>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="distance">{userLocation ? 'Nearest First (Real Distance)' : 'Nearest First'}</option>
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

              {/* Max Distance — only when location is active */}
              {userLocation && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Max Distance</label>
                    <span className="text-sm font-bold text-green-600">{maxDistance} km</span>
                  </div>
                  <input
                    type="range" min="10" max="2000" step="10"
                    value={maxDistance}
                    onChange={e => setMaxDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10 km</span><span>2000 km</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setMaxDistance(500); setSortBy('relevance'); setSearchTerm(''); setSelectedCropId(null); setUserLocation(null); }}
                className="w-full text-sm text-gray-500 hover:text-green-600 hover:bg-green-50 py-2 rounded-lg transition-colors border border-dashed border-gray-300 hover:border-green-200"
              >
                Reset All Filters
              </button>
            </div>
          </motion.div>

          {/* Results Area */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {userLocation ? 'Mandis Near You' : 'Top Mandis'}
                <span className="text-gray-400 text-lg font-normal ml-2">({filteredMandis.length} found)</span>
              </h2>

              <div className="flex items-center gap-2">
                {/* List / Map toggle */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-colors ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <LayoutGrid className="w-4 h-4" /> List
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-colors ${viewMode === 'map' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Map className="w-4 h-4" /> Map
                  </button>
                </div>

                <button
                  className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium shadow-sm"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>
            </div>

            {/* ── MAP VIEW ── */}
            {viewMode === 'map' && (
              <div className="space-y-4">
                {!userLocation && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-4">
                    <div className="bg-green-100 rounded-full p-2.5 shrink-0">
                      <Locate className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800 text-sm">Enable location for better results</p>
                      <p className="text-green-600 text-xs">We'll show the nearest mandis ranked by real distance from where you are.</p>
                    </div>
                    <button
                      onClick={handleLocateMe}
                      disabled={locating}
                      className="shrink-0 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                    >
                      {locating ? 'Locating…' : 'Use My Location'}
                    </button>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Map */}
                  <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                    <MapContainer
                      center={userLocation || [20.5937, 78.9629]}
                      zoom={userLocation ? 7 : 5}
                      style={{ height: '540px', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {flyTo && <FlyTo coords={flyTo.coords} zoom={flyTo.zoom} />}

                      {userLocation && (
                        <>
                          <Marker position={userLocation} icon={userIcon}>
                            <Popup><div className="font-bold text-blue-700 text-sm py-1">📍 Your Location</div></Popup>
                          </Marker>
                          <Circle
                            center={userLocation}
                            radius={maxDistance * 1000}
                            pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.04, weight: 1, dashArray: '6 4' }}
                          />
                        </>
                      )}

                      {mapMandis.map(mandi => {
                        const price = selectedCropId ? CURRENT_PRICES[mandi.id]?.[selectedCropId] : null;
                        const isNearby = nearbySet.has(mandi.id);
                        const dist = userLocation
                          ? `${mandi.realDistKm} km away`
                          : null;
                        return (
                          <Marker
                            key={mandi.id}
                            position={MANDI_COORDINATES[mandi.id]}
                            icon={isNearby ? nearbyIcon : greenIcon}
                          >
                            <Popup>
                              <div className="space-y-1.5 min-w-[175px]">
                                <p className="font-bold text-gray-900 text-sm">{mandi.name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {mandi.location}
                                </p>
                                {dist && <p className="text-xs font-bold text-blue-600 flex items-center gap-1"><Navigation2 className="w-3 h-3" />{dist}</p>}
                                {price && selectedCrop && (
                                  <div className="bg-green-50 rounded-lg px-2 py-1.5 flex items-center justify-between">
                                    <span className="text-xs text-green-700">{selectedCrop.name.split('(')[0].trim()}</span>
                                    <span className="text-sm font-extrabold text-green-800">₹{price}/qtl</span>
                                  </div>
                                )}
                                <button
                                  onClick={() => onMandiSelect(mandi.id)}
                                  className="mt-1 w-full text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 rounded-lg transition-colors"
                                >
                                  View Details →
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>

                  {/* Nearby list panel */}
                  {userLocation && filteredMandis.length > 0 && (
                    <div className="lg:w-64 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden self-start">
                      <div className="bg-green-600 text-white px-4 py-3 font-bold text-sm flex items-center gap-2">
                        <Navigation2 className="w-4 h-4" /> Nearest Mandis
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                        {filteredMandis.slice(0, 15).map((mandi, i) => {
                          const price = selectedCropId ? CURRENT_PRICES[mandi.id]?.[selectedCropId] : null;
                          return (
                            <button
                              key={mandi.id}
                              onClick={() => {
                                if (MANDI_COORDINATES[mandi.id]) {
                                  setFlyTo({ coords: MANDI_COORDINATES[mandi.id], zoom: 11 });
                                }
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 ${i < 5 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-900 truncate">{mandi.name}</p>
                                  <p className="text-xs text-gray-400">{mandi.location}</p>
                                </div>
                                <span className="text-xs font-bold text-green-700 shrink-0">{mandi.realDistKm} km</span>
                              </div>
                              {price && selectedCrop && (
                                <div className="mt-1.5 ml-7 text-xs text-green-700 font-semibold">
                                  {selectedCrop.name.split('(')[0].trim()}: ₹{price}/qtl
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 text-xs text-gray-500 bg-white rounded-xl px-4 py-3 border border-gray-100 w-fit">
                  <span className="font-semibold text-gray-600">Legend:</span>
                  <span className="flex items-center gap-1.5">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" className="w-2.5 h-4 object-contain" alt="" /> Top 5 nearest
                  </span>
                  <span className="flex items-center gap-1.5">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" className="w-2.5 h-4 object-contain" alt="" /> Other mandis
                  </span>
                  <span className="flex items-center gap-1.5">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" className="w-2.5 h-4 object-contain" alt="" /> Your location
                  </span>
                </div>
              </div>
            )}

            {/* ── LIST VIEW ── */}
            {viewMode === 'list' && (
              <>
                {filteredMandis.length > 0 ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      <AnimatePresence>
                        {displayedMandis.map((mandi, index) => (
                          <motion.div
                            key={mandi.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            layout
                          >
                            <div className="relative">
                              {userLocation && index < 3 && (
                                <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full shadow">
                                  #{index + 1} Nearest
                                </div>
                              )}
                              <MandiCard
                                mandi={{
                                  ...mandi,
                                  distance: userLocation ? `${mandi.realDistKm} km` : mandi.distance,
                                }}
                                onClick={() => onMandiSelect(mandi.id)}
                                priceInfo={selectedCropId && selectedCrop ? {
                                  price: CURRENT_PRICES[mandi.id]?.[selectedCropId] || 0,
                                  cropName: selectedCrop.name,
                                } : undefined}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {filteredMandis.length > 9 && !showAll && (
                      <div className="mt-12 text-center">
                        <button
                          onClick={() => setShowAll(true)}
                          className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 hover:text-green-600 transition-colors shadow-sm inline-flex items-center gap-2"
                        >
                          See All Mandis <ChevronDown className="w-4 h-4" />
                        </button>
                        <p className="text-sm text-gray-400 mt-3">Showing 9 of {filteredMandis.length} mandis</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Mandis Found</h3>
                    <p className="text-gray-500 mb-6">Try increasing the distance or clearing filters.</p>
                    <button
                      onClick={() => { setMaxDistance(2000); setSearchTerm(''); setSelectedCropId(null); }}
                      className="text-green-600 font-bold hover:underline"
                    >
                      Show All Mandis
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
