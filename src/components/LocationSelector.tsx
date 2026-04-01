import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Navigation, Loader2, X, ChevronDown } from 'lucide-react';
import { getCurrentLocation, MAJOR_CITIES } from '../lib/locationUtils';
import { getAllStates, getDistrictsByState } from '../lib/indiaLocations';
import { motion, AnimatePresence } from 'motion/react';

interface LocationSelectorProps {
  onLocationSelect: (location: { latitude: number; longitude: number; name: string }) => void;
  currentLocation?: { latitude: number; longitude: number; name: string } | null;
}

export function LocationSelector({ onLocationSelect, currentLocation }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getCurrentLocation();
      onLocationSelect({
        ...location,
        name: 'My Location',
      });
      setIsOpen(false);
      setError(null);
    } catch (err: any) {
      // Better error message based on error type
      if (err.code === 1) {
        setError('Location permission denied. Please select a city manually.');
      } else if (err.message && err.message.includes('permissions policy')) {
        setError('Location not available in this environment. Please select a city below.');
      } else {
        setError('Unable to get location. Please select a city manually.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (cityKey: string) => {
    const city = MAJOR_CITIES[cityKey as keyof typeof MAJOR_CITIES];
    onLocationSelect({
      latitude: city.lat,
      longitude: city.lng,
      name: city.name,
    });
    setIsOpen(false);
    setError(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all shadow-sm w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLocation ? currentLocation.name : 'Choose Location'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[999999]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setIsOpen(false);
                setError(null);
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="font-bold text-gray-900 text-lg">Choose Your Location</h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setError(null);
                  }}
                  className="p-1.5 hover:bg-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                {/* Get Current Location */}
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-bold">
                      {isLoading ? 'Getting location...' : 'Use My Current Location'}
                    </div>
                    <div className="text-xs text-green-100">Most accurate results</div>
                  </div>
                </button>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-sm text-red-700 font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500 font-medium">Or select a city</span>
                  </div>
                </div>

                {/* Major Cities */}
                <div className="space-y-1">
                  {Object.entries(MAJOR_CITIES).map(([key, city]) => (
                    <button
                      key={key}
                      onClick={() => handleCitySelect(key)}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-green-50 rounded-xl transition-colors text-left group border-2 ${
                        currentLocation?.name === city.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-transparent'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                        {city.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}