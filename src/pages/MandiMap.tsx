import React, { useState, useEffect } from 'react';
import {
  MapPin, Locate, ExternalLink, Star, Navigation2,
  TrendingUp, TrendingDown, ShieldCheck, Clock, ChevronDown, Search
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MANDIS, CROPS, CURRENT_PRICES } from '../lib/mockData';
import { MANDI_COORDINATES } from '../lib/mandiCoordinates';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const highlightIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FlyToLocation({ coords, zoom = 8 }: { coords: [number, number] | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

const TOP_CROPS = ['c1', 'c3', 'c4', 'c5', 'c2'];

interface MandiMapProps {
  onMandiSelect: (mandiId: string) => void;
}

export function MandiMap({ onMandiSelect }: MandiMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [flyZoom, setFlyZoom] = useState(8);
  const [selectedCropId, setSelectedCropId] = useState<string>('c3');
  const [cropSearch, setCropSearch] = useState('');
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [nearbyCount, setNearbyCount] = useState(5);

  const mandisWithCoords = MANDIS.filter(m => MANDI_COORDINATES[m.id]);

  const handleLocateMe = () => {
    setLocating(true);
    setLocationError(null);
    if (!window.isSecureContext) {
      setLocationError('Location needs a secure URL. Open this site on localhost or HTTPS, then try again.');
      setLocating(false);
      return;
    }
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setFlyTo(coords);
        setFlyZoom(7);
        setLocating(false);
      },
      (err) => {
        if (err.code === 1) {
          setLocationError('Location permission blocked. Allow location in your browser settings and retry.');
        } else if (err.code === 2) {
          setLocationError('Location unavailable right now. Please check GPS/network and retry.');
        } else if (err.code === 3) {
          setLocationError('Location request timed out. Retry in an open area or with better network.');
        } else {
          setLocationError('Could not get your location. Please allow location access and try again.');
        }
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const getDistanceKm = (a: [number, number], b: [number, number]): number => {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLon = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  const nearbyMandis = userLocation
    ? mandisWithCoords
        .map(m => ({
          ...m,
          distanceKm: parseFloat(getDistanceKm(userLocation, MANDI_COORDINATES[m.id]).toFixed(1)),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, nearbyCount)
    : [];

  const selectedCrop = CROPS.find(c => c.id === selectedCropId);
  const filteredCrops = CROPS.filter(c =>
    c.name.toLowerCase().includes(cropSearch.toLowerCase())
  );

  const pricesForCrop = nearbyMandis.map(m => ({
    mandiId: m.id,
    price: CURRENT_PRICES[m.id]?.[selectedCropId] || 0,
  }));
  const minPrice = Math.min(...pricesForCrop.map(p => p.price));
  const maxPrice = Math.max(...pricesForCrop.map(p => p.price));

  const nearbyMandiIds = new Set(nearbyMandis.map(m => m.id));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-green-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <MapPin className="w-9 h-9 text-green-300" /> Mandi Map & Prices
          </h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">
            Share your location to instantly find the nearest mandis and compare live crop prices.
          </p>
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="mt-3 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold px-7 py-3 rounded-full transition-all shadow-lg shadow-green-900"
          >
            {locating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <Locate className="w-5 h-5" />
                {userLocation ? 'Update My Location' : 'Use My Location'}
              </>
            )}
          </button>
          {locationError && <p className="text-red-300 text-sm">{locationError}</p>}
          {userLocation && (
            <p className="text-green-300 text-sm flex items-center justify-center gap-1">
              <Navigation2 className="w-4 h-4" />
              Location detected — scroll down to see nearby mandis and prices
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Map + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Map */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '520px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToLocation coords={flyTo} zoom={flyZoom} />

              {userLocation && (
                <>
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div className="text-center font-bold text-blue-700 py-1">📍 Your Location</div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={userLocation}
                    radius={200000}
                    pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.04, weight: 1, dashArray: '5 5' }}
                  />
                </>
              )}

              {mandisWithCoords.map(mandi => {
                const isNearby = nearbyMandiIds.has(mandi.id);
                const price = selectedCropId ? CURRENT_PRICES[mandi.id]?.[selectedCropId] : null;
                const distStr = userLocation
                  ? `~${getDistanceKm(userLocation, MANDI_COORDINATES[mandi.id]).toFixed(1)} km away`
                  : null;
                return (
                  <Marker
                    key={mandi.id}
                    position={MANDI_COORDINATES[mandi.id]}
                    icon={isNearby ? highlightIcon : greenIcon}
                  >
                    <Popup>
                      <div className="space-y-1.5 min-w-[180px]">
                        <p className="font-bold text-gray-900 text-sm">{mandi.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {mandi.location}
                        </p>
                        <p className="text-xs text-yellow-600 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" /> {mandi.trustScore} Trust Score
                        </p>
                        {distStr && (
                          <p className="text-xs text-blue-700 font-semibold">{distStr}</p>
                        )}
                        {price && selectedCrop && (
                          <div className="bg-green-50 rounded-lg px-2 py-1.5 flex items-center justify-between">
                            <span className="text-xs text-green-700 font-medium">{selectedCrop.name.split(' ')[0]}</span>
                            <span className="text-sm font-bold text-green-800">₹{price}/qtl</span>
                          </div>
                        )}
                        <button
                          onClick={() => onMandiSelect(mandi.id)}
                          className="mt-1 w-full text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          View Full Details <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Quick Sidebar */}
          <div className="lg:w-64 space-y-4">
            {!userLocation ? (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Locate className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">Find Nearby Mandis</p>
                <p className="text-sm text-gray-500 mb-4">Share your location to discover mandis and prices near you.</p>
                <button
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  {locating ? 'Locating...' : 'Use My Location'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-green-600 text-white px-4 py-2.5 font-bold text-sm flex items-center gap-2">
                  <Navigation2 className="w-4 h-4" /> {nearbyMandis.length} Nearest Mandis
                </div>
                <div className="divide-y divide-gray-100">
                  {nearbyMandis.map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => { setFlyTo(MANDI_COORDINATES[m.id]); setFlyZoom(11); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-green-50 transition-colors flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.location}</p>
                      </div>
                      <span className="text-xs text-green-700 font-bold shrink-0">{m.distanceKm} km</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gray-700 text-white px-4 py-2.5 font-bold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-300" /> All Mandis
              </div>
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {mandisWithCoords.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setFlyTo(MANDI_COORDINATES[m.id]); setFlyZoom(11); }}
                    className="w-full text-left px-3 py-2 hover:bg-green-50 transition-colors"
                  >
                    <p className="text-xs font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.location}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Legend</p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" className="w-3 h-4 object-contain" alt="" />
                <span>Nearest mandis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" className="w-3 h-4 object-contain" alt="" />
                <span>Other mandis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" className="w-3 h-4 object-contain" alt="" />
                <span>Your location</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Nearby Prices Panel (only after location) ── */}
        {userLocation && nearbyMandis.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

            {/* Panel Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-200" />
                  Prices at Your Nearest Mandis
                </h2>
                <p className="text-green-200 text-sm mt-0.5">
                  Comparing {nearbyMandis.length} mandis closest to your location
                </p>
              </div>

              {/* Crop Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCropDropdown(v => !v)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all min-w-[180px]"
                >
                  <span className="flex-1 text-left truncate">{selectedCrop?.name || 'Select crop'}</span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </button>
                {showCropDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 w-64">
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search crop..."
                          value={cropSearch}
                          onChange={e => setCropSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {filteredCrops.map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setSelectedCropId(c.id); setShowCropDropdown(false); setCropSearch(''); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 transition-colors ${c.id === selectedCropId ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700'}`}
                        >
                          <span>{c.name}</span>
                          <span className="text-xs text-gray-400 ml-2">{c.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Count selector */}
              <select
                value={nearbyCount}
                onChange={e => setNearbyCount(Number(e.target.value))}
                className="bg-white/10 border border-white/30 text-white text-sm rounded-xl px-3 py-2.5 font-bold focus:outline-none appearance-none"
              >
                {[3, 5, 8, 10].map(n => <option key={n} value={n} className="text-gray-900">Top {n}</option>)}
              </select>
            </div>

            {/* Price Cards Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {nearbyMandis.map((mandi, rank) => {
                const price = CURRENT_PRICES[mandi.id]?.[selectedCropId] || 0;
                const isBest = price === minPrice && price > 0;
                const isHighest = price === maxPrice && price > 0;
                const allPrices = TOP_CROPS.map(cid => ({
                  crop: CROPS.find(c => c.id === cid),
                  price: CURRENT_PRICES[mandi.id]?.[cid] || 0,
                }));

                return (
                  <div
                    key={mandi.id}
                    className={`rounded-xl border-2 overflow-hidden flex flex-col transition-all ${
                      isBest
                        ? 'border-green-400 shadow-lg shadow-green-100'
                        : isHighest
                        ? 'border-red-200'
                        : 'border-gray-100'
                    }`}
                  >
                    {/* Card Header */}
                    <div className={`px-4 py-3 flex items-center justify-between ${isBest ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 ${
                          rank === 0 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {rank + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{mandi.name}</p>
                          <p className="text-xs text-gray-400 truncate">{mandi.location}</p>
                        </div>
                      </div>
                      {mandi.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                    </div>

                    {/* Distance + timing */}
                    <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
                      <span className="flex items-center gap-1 text-blue-600 font-semibold">
                        <Navigation2 className="w-3 h-3" /> {mandi.distanceKm} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {mandi.schedule.open}–{mandi.schedule.close}
                      </span>
                    </div>

                    {/* Selected crop price highlight */}
                    <div className={`px-4 py-3 flex items-center justify-between ${isBest ? 'bg-green-600 text-white' : 'bg-white'}`}>
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide ${isBest ? 'text-green-100' : 'text-gray-400'}`}>
                          {selectedCrop?.name.split(' ')[0]}
                        </p>
                        <p className={`text-2xl font-extrabold leading-tight ${isBest ? 'text-white' : 'text-gray-900'}`}>
                          ₹{price.toLocaleString()}
                        </p>
                        <p className={`text-xs ${isBest ? 'text-green-200' : 'text-gray-400'}`}>per quintal</p>
                      </div>
                      <div className="text-right">
                        {isBest && (
                          <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                            <TrendingDown className="w-3 h-3" /> Best Price
                          </span>
                        )}
                        {isHighest && !isBest && (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" /> Highest
                          </span>
                        )}
                        <div className={`mt-1 text-xs ${isBest ? 'text-green-200' : 'text-gray-400'}`}>
                          ★ {mandi.trustScore}
                        </div>
                      </div>
                    </div>

                    {/* Other top crop prices */}
                    <div className="px-4 pt-2 pb-3 flex-1 space-y-1.5 bg-white">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Other crops</p>
                      {allPrices
                        .filter(p => p.crop && p.crop.id !== selectedCropId)
                        .slice(0, 4)
                        .map(({ crop, price: p }) => (
                          <div key={crop!.id} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 truncate max-w-[110px]">{crop!.name.split('(')[0].trim()}</span>
                            <span className="text-xs font-bold text-gray-800">₹{p.toLocaleString()}</span>
                          </div>
                        ))}
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => onMandiSelect(mandi.id)}
                      className="mx-4 mb-4 mt-2 text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Full Price List <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Price Comparison Bar Chart */}
            {nearbyMandis.length > 1 && selectedCrop && (
              <div className="border-t border-gray-100 px-6 py-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Price Comparison — {selectedCrop.name.split('(')[0].trim()} (₹/quintal)
                </h3>
                <div className="space-y-3">
                  {nearbyMandis.map(m => {
                    const price = CURRENT_PRICES[m.id]?.[selectedCropId] || 0;
                    const pct = maxPrice > 0 ? (price / maxPrice) * 100 : 0;
                    const isBest = price === minPrice;
                    return (
                      <div key={m.id} className="flex items-center gap-3">
                        <p className="text-xs text-gray-600 w-32 truncate shrink-0">{m.name.replace(' Mandi', '').replace(' APMC', '')}</p>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div
                            className={`h-full rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold transition-all duration-700 ${
                              isBest ? 'bg-green-500' : 'bg-green-300'
                            }`}
                            style={{ width: `${pct}%`, minWidth: 48 }}
                          >
                            ₹{price.toLocaleString()}
                          </div>
                        </div>
                        {isBest && (
                          <span className="text-xs font-bold text-green-600 shrink-0">Best</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
