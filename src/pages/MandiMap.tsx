import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Locate, X, ExternalLink, Star, Navigation2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MANDIS } from '../lib/mockData';
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

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

interface MandiMapProps {
  onMandiSelect: (mandiId: string) => void;
}

export function MandiMap({ onMandiSelect }: MandiMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedMandi, setSelectedMandi] = useState<typeof MANDIS[0] | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const mandisWithCoords = MANDIS.filter(m => MANDI_COORDINATES[m.id]);

  const handleLocateMe = () => {
    setLocating(true);
    setLocationError(null);
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
        setLocating(false);
      },
      (err) => {
        setLocationError('Could not get your location. Please allow location access.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const getDistanceKm = (a: [number, number], b: [number, number]) => {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLon = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return (R * c).toFixed(1);
  };

  const nearbyMandis = userLocation
    ? mandisWithCoords
        .map(m => ({
          ...m,
          distanceKm: parseFloat(getDistanceKm(userLocation, MANDI_COORDINATES[m.id])),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <MapPin className="w-9 h-9 text-green-300" /> Mandi Map
          </h1>
          <p className="text-green-100 text-lg">Find verified mandis across India. Tap "Locate Me" to see what's near you.</p>
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="mt-4 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold px-7 py-3 rounded-full transition-all shadow-lg shadow-green-900"
          >
            {locating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <Locate className="w-5 h-5" /> Locate Me
              </>
            )}
          </button>
          {locationError && (
            <p className="text-red-300 text-sm mt-2">{locationError}</p>
          )}
          {userLocation && (
            <p className="text-green-300 text-sm mt-2 flex items-center justify-center gap-1">
              <Navigation2 className="w-4 h-4" />
              Your location found — showing nearest mandis on the map.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border border-gray-200" style={{ minHeight: 500 }}>
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '560px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToLocation coords={flyTo} />

              {userLocation && (
                <>
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div className="text-center font-bold text-blue-700">📍 Your Location</div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={userLocation}
                    radius={50000}
                    pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.05, weight: 1 }}
                  />
                </>
              )}

              {mandisWithCoords.map(mandi => (
                <Marker
                  key={mandi.id}
                  position={MANDI_COORDINATES[mandi.id]}
                  icon={greenIcon}
                  eventHandlers={{ click: () => setSelectedMandi(mandi) }}
                >
                  <Popup>
                    <div className="space-y-1 min-w-[160px]">
                      <p className="font-bold text-gray-900">{mandi.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {mandi.location}
                      </p>
                      <p className="text-sm text-yellow-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" /> {mandi.trustScore}
                      </p>
                      {userLocation && (
                        <p className="text-xs text-green-700 font-medium">
                          ~{getDistanceKm(userLocation, MANDI_COORDINATES[mandi.id])} km away
                        </p>
                      )}
                      <button
                        onClick={() => onMandiSelect(mandi.id)}
                        className="mt-2 w-full text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        View Details <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="lg:w-72 space-y-4">
            {userLocation && nearbyMandis.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-green-600 text-white px-4 py-3 font-bold flex items-center gap-2">
                  <Navigation2 className="w-4 h-4" /> Nearest Mandis
                </div>
                <div className="divide-y divide-gray-100">
                  {nearbyMandis.map((mandi, i) => (
                    <button
                      key={mandi.id}
                      onClick={() => {
                        setSelectedMandi(mandi);
                        setFlyTo(MANDI_COORDINATES[mandi.id]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{mandi.name}</p>
                        <p className="text-xs text-gray-500">{mandi.location}</p>
                      </div>
                      <span className="text-xs text-green-700 font-bold shrink-0">{mandi.distanceKm} km</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!userLocation && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Locate className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">Find Nearby Mandis</p>
                <p className="text-sm text-gray-500 mb-4">Allow location access to discover mandis closest to you.</p>
                <button
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  {locating ? 'Locating...' : 'Allow Location'}
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gray-700 text-white px-4 py-3 font-bold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-300" /> All Mandis ({mandisWithCoords.length})
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {mandisWithCoords.map(mandi => (
                  <button
                    key={mandi.id}
                    onClick={() => {
                      setSelectedMandi(mandi);
                      setFlyTo(MANDI_COORDINATES[mandi.id]);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-green-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">{mandi.name}</p>
                    <p className="text-xs text-gray-400">{mandi.location}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 space-y-2">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Map Legend</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" className="w-3 h-5 object-contain" alt="mandi" />
                <span>Verified Mandi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" className="w-3 h-5 object-contain" alt="user" />
                <span>Your Location</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
