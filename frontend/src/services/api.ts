import axios, { AxiosResponse } from 'axios';
import { AuthResponse, User, Ride, RideRequest, PaymentIntent } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role?: 'passenger' | 'driver';
    licenseNumber?: string;
    vehicleInfo?: {
      make: string;
      model: string;
      year: number;
      color: string;
      licensePlate: string;
    };
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Rides API
export const ridesAPI = {
  createRide: async (rideData: RideRequest): Promise<{ ride: Ride }> => {
    const response = await api.post('/rides', rideData);
    return response.data;
  },

  getAvailableRides: async (): Promise<{ rides: Ride[] }> => {
    const response = await api.get('/rides/available');
    return response.data;
  },

  acceptRide: async (rideId: string): Promise<{ ride: Ride }> => {
    const response = await api.post(`/rides/${rideId}/accept`);
    return response.data;
  },

  updateRideStatus: async (rideId: string, status: string): Promise<{ ride: Ride }> => {
    const response = await api.put(`/rides/${rideId}/status`, { status });
    return response.data;
  },

  getRideHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    rides: Ride[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await api.get('/rides/history', { params });
    return response.data;
  },

  getRideById: async (rideId: string): Promise<{ ride: Ride }> => {
    const response = await api.get(`/rides/${rideId}`);
    return response.data;
  },

  rateRide: async (rideId: string, rating: number, comment?: string): Promise<{ ride: Ride }> => {
    const response = await api.post(`/rides/${rideId}/rate`, { rating, comment });
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: async (rideId: string): Promise<PaymentIntent> => {
    const response = await api.post('/payments/create-intent', { rideId });
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string): Promise<{
    paymentStatus: string;
    stripeStatus: string;
  }> => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  getPaymentHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    payments: Ride[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await api.get('/payments/history', { params });
    return response.data;
  },

  refundPayment: async (rideId: string): Promise<{
    refundId: string;
    amount: number;
  }> => {
    const response = await api.post(`/payments/${rideId}/refund`);
    return response.data;
  },
};

export default api;