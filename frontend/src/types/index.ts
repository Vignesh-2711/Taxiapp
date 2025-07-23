export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'passenger' | 'driver';
  isActive: boolean;
  profileImage?: string;
  // Driver specific fields
  licenseNumber?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  isAvailable?: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  rating?: number;
  totalRides?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Ride {
  _id: string;
  passenger: User;
  driver?: User;
  pickupLocation: Location;
  destination: Location;
  distance: number;
  duration: number;
  fare: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    total: number;
  };
  status: 'requested' | 'accepted' | 'pickup' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  rideType: 'economy' | 'premium' | 'luxury';
  notes?: string;
  rating?: {
    passengerRating?: number;
    driverRating?: number;
    passengerComment?: string;
    driverComment?: string;
  };
  requestedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RideRequest {
  pickupLocation: Location;
  destination: Location;
  rideType?: 'economy' | 'premium' | 'luxury';
  notes?: string;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}