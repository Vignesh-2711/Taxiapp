import mongoose, { Document, Schema } from 'mongoose';

export interface IRide extends Document {
  _id: string;
  passenger: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: number; // in kilometers
  duration: number; // in minutes
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
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rideSchema = new Schema<IRide>({
  passenger: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickupLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  destination: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  fare: {
    baseFare: { type: Number, required: true },
    distanceFare: { type: Number, required: true },
    timeFare: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'pickup', 'in_progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    default: null
  },
  rideType: {
    type: String,
    enum: ['economy', 'premium', 'luxury'],
    default: 'economy'
  },
  notes: {
    type: String,
    trim: true
  },
  rating: {
    passengerRating: { type: Number, min: 1, max: 5 },
    driverRating: { type: Number, min: 1, max: 5 },
    passengerComment: { type: String, trim: true },
    driverComment: { type: String, trim: true }
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  pickedUpAt: Date,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes for efficient queries
rideSchema.index({ passenger: 1, createdAt: -1 });
rideSchema.index({ driver: 1, createdAt: -1 });
rideSchema.index({ status: 1 });
rideSchema.index({ 'pickupLocation.lat': 1, 'pickupLocation.lng': 1 });

export default mongoose.model<IRide>('Ride', rideSchema);