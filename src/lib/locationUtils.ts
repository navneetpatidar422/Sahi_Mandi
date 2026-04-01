// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get user's current location using browser Geolocation API
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Major Indian cities coordinates for fallback
export const MAJOR_CITIES = {
  delhi: { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  mumbai: { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  bangalore: { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  chennai: { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  kolkata: { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  hyderabad: { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  pune: { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  ahmedabad: { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  jaipur: { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  lucknow: { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
};

// Geocode Indian pincode to lat/long using Nominatim (OpenStreetMap)
export async function geocodePincode(pincode: string): Promise<{ 
  latitude: number; 
  longitude: number;
  city?: string;
  village?: string;
  district?: string;
  state?: string;
} | null> {
  if (!pincode || pincode.length !== 6) {
    return null;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SahiMandi/1.0'
        }
      }
    );

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const address = result.address || {};
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        city: address.city || address.town || address.municipality,
        village: address.village || address.hamlet || address.suburb,
        district: address.state_district || address.county,
        state: address.state
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}