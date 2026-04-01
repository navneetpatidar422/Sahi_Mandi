import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { MANDIS } from '../lib/mockData';

interface MapViewProps {
  mandis?: typeof MANDIS;
  selectedMandiId?: string;
  onMandiSelect?: (mandiId: string) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
  userLocation?: { latitude: number; longitude: number; name?: string } | null;
}

export function MapView({
  mandis = MANDIS,
  selectedMandiId,
  onMandiSelect,
  height = '500px',
  center,
  zoom = 5,
  userLocation
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        
        return new Promise<void>((resolve) => {
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
    };

    const initMap = async () => {
      await loadLeaflet();
      
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      // Only initialize once
      if (mapInstanceRef.current) return;

      // Calculate center if not provided
      const mapCenter = center || [20.5937, 78.9629]; // India center

      // Initialize map
      const map = L.map(mapRef.current).setView(mapCenter, zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom icon for markers
      const greenIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
            <path fill="#16a34a" stroke="#fff" stroke-width="2" d="M16 0C7.611 0 0 6.5 0 15.2c0 8.7 16 26.8 16 26.8s16-18.1 16-26.8C32 6.5 24.389 0 16 0z"/>
            <circle cx="16" cy="15" r="6" fill="#fff"/>
          </svg>
        `),
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42]
      });

      const selectedIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="50" viewBox="0 0 38 50">
            <path fill="#ea580c" stroke="#fff" stroke-width="2" d="M19 0C8.5 0 0 7.5 0 18c0 10.5 19 32 19 32s19-21.5 19-32C38 7.5 29.5 0 19 0z"/>
            <circle cx="19" cy="18" r="7" fill="#fff"/>
          </svg>
        `),
        iconSize: [38, 50],
        iconAnchor: [19, 50],
        popupAnchor: [0, -50]
      });

      // User location icon - distinct blue pulsing marker
      const userIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 40px; height: 40px;">
            <!-- Pulsing ring -->
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 40px;
              height: 40px;
              background: rgba(59, 130, 246, 0.3);
              border-radius: 50%;
              animation: pulse 2s ease-out infinite;
            "></div>
            <!-- Inner dot -->
            <div style="
              position: absolute;
              top: 10px;
              left: 10px;
              width: 20px;
              height: 20px;
              background: #3b82f6;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              100% {
                transform: scale(1.5);
                opacity: 0;
              }
            }
          </style>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
        className: 'user-location-marker'
      });

      // Add user location marker if available
      if (userLocation?.latitude && userLocation?.longitude) {
        const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
          icon: userIcon,
          title: 'Your Location',
          zIndexOffset: 1000 // Ensure it appears on top
        }).addTo(map);

        const userPopupContent = `
          <div style="min-width: 150px; text-align: center;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px; color: #3b82f6;">
              📍 आप यहां हैं
            </div>
            <div style="color: #666; font-size: 14px;">
              ${userLocation.name || 'Your Location'}
            </div>
          </div>
        `;

        userMarker.bindPopup(userPopupContent);
        
        // Store user marker separately
        markersRef.current.push({ id: 'user-location', marker: userMarker, isUser: true });
      }

      // Add markers for each mandi
      mandis.forEach((mandi) => {
        if (mandi.latitude && mandi.longitude) {
          const isSelected = selectedMandiId === mandi.id;
          const marker = L.marker([mandi.latitude, mandi.longitude], {
            icon: isSelected ? selectedIcon : greenIcon,
            title: mandi.name
          }).addTo(map);

          // Create popup content
          const popupContent = `
            <div style="min-width: 200px;">
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #16a34a;">
                ${mandi.name}
              </div>
              <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
                📍 ${mandi.location}
              </div>
              <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
                📏 ${mandi.distance}
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="color: #f59e0b; font-size: 14px;">⭐ ${mandi.trustScore}</span>
                ${mandi.isVerified ? '<span style="color: #16a34a; font-size: 12px;">✓ Verified</span>' : ''}
              </div>
              ${onMandiSelect ? `
                <button 
                  onclick="window.selectMandi('${mandi.id}')" 
                  style="background: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; width: 100%;"
                >
                  View Details
                </button>
              ` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);

          // Open popup for selected mandi
          if (isSelected) {
            marker.openPopup();
          }

          markersRef.current.push({ id: mandi.id, marker });
        }
      });

      // Fit bounds to show all markers if multiple mandis
      if (mandis.length > 1 && !center) {
        const group = L.featureGroup(markersRef.current.map(m => m.marker));
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

    // Make selectMandi available globally for popup buttons
    (window as any).selectMandi = (mandiId: string) => {
      if (onMandiSelect) {
        onMandiSelect(mandiId);
      }
    };

    initMap();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  // Update marker styles when selection changes
  useEffect(() => {
    if (!(window as any).L || !mapInstanceRef.current) return;

    const L = (window as any).L;

    const greenIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
          <path fill="#16a34a" stroke="#fff" stroke-width="2" d="M16 0C7.611 0 0 6.5 0 15.2c0 8.7 16 26.8 16 26.8s16-18.1 16-26.8C32 6.5 24.389 0 16 0z"/>
          <circle cx="16" cy="15" r="6" fill="#fff"/>
        </svg>
      `),
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });

    const selectedIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="50" viewBox="0 0 38 50">
          <path fill="#ea580c" stroke="#fff" stroke-width="2" d="M19 0C8.5 0 0 7.5 0 18c0 10.5 19 32 19 32s19-21.5 19-32C38 7.5 29.5 0 19 0z"/>
          <circle cx="19" cy="18" r="7" fill="#fff"/>
        </svg>
      `),
      iconSize: [38, 50],
      iconAnchor: [19, 50],
      popupAnchor: [0, -50]
    });

    markersRef.current.forEach(({ id, marker, isUser }) => {
      // Skip user location marker
      if (isUser) return;
      
      const isSelected = selectedMandiId === id;
      marker.setIcon(isSelected ? selectedIcon : greenIcon);
      
      if (isSelected) {
        marker.openPopup();
        mapInstanceRef.current.setView(marker.getLatLng(), Math.max(mapInstanceRef.current.getZoom(), 10));
      }
    });
  }, [selectedMandiId]);

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="z-0"
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <div className="text-sm font-bold text-gray-900 mb-2">Legend</div>
        <div className="space-y-2">
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs text-gray-700 font-medium">आप यहां हैं (You)</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-700">Mandi Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full border-2 border-white"></div>
            <span className="text-xs text-gray-700">Selected Mandi</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-0 left-0 bg-white/90 px-2 py-1 text-xs text-gray-600 z-[1000]">
        Map data © OpenStreetMap
      </div>
    </div>
  );
}