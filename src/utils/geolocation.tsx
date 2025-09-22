export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface GeotagData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  capturedBy: string;
  capturedByPhone: string;
  capturedAt: Date;
  deviceInfo?: string;
}

// Get current geolocation with high accuracy
export const getCurrentLocation = (): Promise<GeolocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorMessage = 'Unknown geolocation error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

// Reverse geocoding to get address from coordinates
export const getAddressFromCoordinates = async (
  latitude: number, 
  longitude: number
): Promise<string> => {
  try {
    // Using a mock reverse geocoding for demo purposes
    // In a real app, you would use a service like Google Maps API, OpenStreetMap, etc.
    const mockAddresses = [
      'Mall Road, Kanpur, Uttar Pradesh',
      'Civil Lines, Kanpur, UP',
      'Swaroop Nagar, Kanpur',
      'Govind Nagar, Kanpur',
      'Kalyanpur, Kanpur',
      'Kakadeo, Kanpur',
      'Kidwai Nagar, Kanpur',
      'Nawabganj, Kanpur'
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a mock address based on coordinates
    const addressIndex = Math.floor((Math.abs(latitude + longitude) * 1000) % mockAddresses.length);
    return mockAddresses[addressIndex];
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

// Get device information
export const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  let deviceInfo = 'Unknown Device';
  
  try {
    if (/Android/i.test(userAgent)) {
      const androidMatch = userAgent.match(/Android ([0-9\.]+)/);
      deviceInfo = `Android ${androidMatch ? androidMatch[1] : 'Unknown'}`;
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      const iosMatch = userAgent.match(/OS ([0-9_]+)/);
      deviceInfo = `iOS ${iosMatch ? iosMatch[1].replace(/_/g, '.') : 'Unknown'}`;
    } else if (/Windows/i.test(userAgent)) {
      deviceInfo = 'Windows';
    } else if (/Mac/i.test(userAgent)) {
      deviceInfo = 'macOS';
    } else if (/Linux/i.test(userAgent)) {
      deviceInfo = 'Linux';
    }
    
    // Add browser info
    if (/Chrome/i.test(userAgent)) {
      deviceInfo += ' - Chrome';
    } else if (/Firefox/i.test(userAgent)) {
      deviceInfo += ' - Firefox';
    } else if (/Safari/i.test(userAgent)) {
      deviceInfo += ' - Safari';
    } else if (/Edge/i.test(userAgent)) {
      deviceInfo += ' - Edge';
    }
  } catch (error) {
    console.warn('Failed to detect device info:', error);
  }
  
  return deviceInfo;
};

// Create complete geotag data
export const createGeotagData = async (
  capturedBy: string,
  capturedByPhone: string,
  customLocation?: GeolocationData
): Promise<GeotagData> => {
  try {
    // Get location data
    const locationData = customLocation || await getCurrentLocation();
    
    // Get address from coordinates
    const address = await getAddressFromCoordinates(
      locationData.latitude, 
      locationData.longitude
    );
    
    // Get device info
    const deviceInfo = getDeviceInfo();
    
    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy,
      address,
      capturedBy,
      capturedByPhone,
      capturedAt: new Date(),
      deviceInfo
    };
  } catch (error) {
    console.error('Failed to create geotag data:', error);
    throw error;
  }
};

// Request location permission
export const requestLocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }

    // Try to get current position to trigger permission request
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { 
        enableHighAccuracy: false, 
        timeout: 5000, 
        maximumAge: 60000 
      }
    );
  });
};

// Check if geolocation is supported and permitted
export const isGeolocationAvailable = (): boolean => {
  return 'geolocation' in navigator;
};

// Format coordinates for display
export const formatCoordinates = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};