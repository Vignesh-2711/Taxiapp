export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'driver' | 'passenger';
}

export interface Ride {
  id: string;
  driverId: string;
  origin: string;
  destination: string;
  dateTime: string; // ISO format
  seatsAvailable: number;
  price: number;
  passengers: string[]; // user ids
}