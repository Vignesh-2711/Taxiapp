export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  total: number;
}

export interface RideTypeConfig {
  baseFare: number;
  perKm: number;
  perMinute: number;
  multiplier: number;
}

const rideTypeConfigs: Record<string, RideTypeConfig> = {
  economy: {
    baseFare: 3.00,
    perKm: 1.50,
    perMinute: 0.25,
    multiplier: 1.0
  },
  premium: {
    baseFare: 5.00,
    perKm: 2.25,
    perMinute: 0.40,
    multiplier: 1.5
  },
  luxury: {
    baseFare: 8.00,
    perKm: 3.50,
    perMinute: 0.60,
    multiplier: 2.0
  }
};

export const calculateFare = (
  distance: number, // in kilometers
  duration: number, // in minutes
  rideType: 'economy' | 'premium' | 'luxury' = 'economy'
): FareBreakdown => {
  const config = rideTypeConfigs[rideType];
  
  const baseFare = config.baseFare;
  const distanceFare = distance * config.perKm;
  const timeFare = duration * config.perMinute;
  
  const subtotal = baseFare + distanceFare + timeFare;
  const total = Math.round((subtotal * config.multiplier) * 100) / 100; // Round to 2 decimal places
  
  return {
    baseFare: Math.round(baseFare * 100) / 100,
    distanceFare: Math.round(distanceFare * 100) / 100,
    timeFare: Math.round(timeFare * 100) / 100,
    total
  };
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// Estimate duration based on distance (rough estimate: 30 km/h average speed in city)
export const estimateDuration = (distance: number): number => {
  const averageSpeed = 30; // km/h
  const duration = (distance / averageSpeed) * 60; // Convert to minutes
  return Math.round(duration);
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};