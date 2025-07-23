import { Response } from 'express';
import Ride from '../models/Ride';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { calculateDistance, estimateDuration, calculateFare } from '../utils/fareCalculator';

export const createRide = async (req: AuthRequest, res: Response) => {
  try {
    const {
      pickupLocation,
      destination,
      rideType = 'economy',
      notes
    } = req.body;

    const passengerId = req.user!._id;

    // Calculate distance and duration
    const distance = calculateDistance(
      pickupLocation.lat,
      pickupLocation.lng,
      destination.lat,
      destination.lng
    );

    const duration = estimateDuration(distance);

    // Calculate fare
    const fare = calculateFare(distance, duration, rideType);

    // Create ride
    const ride = new Ride({
      passenger: passengerId,
      pickupLocation,
      destination,
      distance,
      duration,
      fare,
      rideType,
      notes,
      status: 'requested'
    });

    await ride.save();
    await ride.populate('passenger', 'firstName lastName phone profileImage');

    res.status(201).json({
      message: 'Ride requested successfully',
      ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ message: 'Server error creating ride' });
  }
};

export const getAvailableRides = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can view available rides' });
    }

    const rides = await Ride.find({ 
      status: 'requested',
      driver: null
    })
    .populate('passenger', 'firstName lastName phone profileImage rating')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({ rides });
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({ message: 'Server error fetching available rides' });
  }
};

export const acceptRide = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId } = req.params;
    const driverId = req.user!._id;

    if (req.user!.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can accept rides' });
    }

    // Check if driver is available
    const driver = await User.findById(driverId);
    if (!driver?.isAvailable) {
      return res.status(400).json({ message: 'Driver is not available' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }

    if (ride.driver) {
      return res.status(400).json({ message: 'Ride has already been accepted' });
    }

    // Update ride
    ride.driver = driverId as any;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();
    await ride.save();

    // Update driver availability
    await User.findByIdAndUpdate(driverId, { isAvailable: false });

    await ride.populate([
      { path: 'passenger', select: 'firstName lastName phone profileImage' },
      { path: 'driver', select: 'firstName lastName phone vehicleInfo rating totalRides' }
    ]);

    res.json({
      message: 'Ride accepted successfully',
      ride
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({ message: 'Server error accepting ride' });
  }
};

export const updateRideStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    const userId = req.user!._id;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is involved in this ride
    const isPassenger = ride.passenger.toString() === userId.toString();
    const isDriver = ride.driver?.toString() === userId.toString();

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      'requested': ['cancelled'],
      'accepted': ['pickup', 'cancelled'],
      'pickup': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled']
    };

    if (!validTransitions[ride.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${ride.status} to ${status}` 
      });
    }

    // Only drivers can update to pickup and in_progress
    if (['pickup', 'in_progress'].includes(status) && req.user!.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can update ride progress' });
    }

    // Update ride status
    ride.status = status as any;

    switch (status) {
      case 'pickup':
        ride.pickedUpAt = new Date();
        break;
      case 'completed':
        ride.completedAt = new Date();
        // Make driver available again
        if (ride.driver) {
          await User.findByIdAndUpdate(ride.driver, { 
            isAvailable: true,
            $inc: { totalRides: 1 }
          });
        }
        break;
      case 'cancelled':
        ride.cancelledAt = new Date();
        // Make driver available again if assigned
        if (ride.driver) {
          await User.findByIdAndUpdate(ride.driver, { isAvailable: true });
        }
        break;
    }

    await ride.save();
    await ride.populate([
      { path: 'passenger', select: 'firstName lastName phone profileImage' },
      { path: 'driver', select: 'firstName lastName phone vehicleInfo rating totalRides' }
    ]);

    res.json({
      message: 'Ride status updated successfully',
      ride
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ message: 'Server error updating ride status' });
  }
};

export const getRideHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { page = 1, limit = 10, status } = req.query;

    const query: any = {
      $or: [
        { passenger: userId },
        { driver: userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .populate('passenger', 'firstName lastName phone profileImage rating')
      .populate('driver', 'firstName lastName phone vehicleInfo rating totalRides')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Ride.countDocuments(query);

    res.json({
      rides,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({ message: 'Server error fetching ride history' });
  }
};

export const getRideById = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId } = req.params;
    const userId = req.user!._id;

    const ride = await Ride.findById(rideId)
      .populate('passenger', 'firstName lastName phone profileImage rating')
      .populate('driver', 'firstName lastName phone vehicleInfo rating totalRides');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is involved in this ride
    const isPassenger = ride.passenger._id.toString() === userId.toString();
    const isDriver = ride.driver?._id.toString() === userId.toString();

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ ride });
  } catch (error) {
    console.error('Get ride by ID error:', error);
    res.status(500).json({ message: 'Server error fetching ride' });
  }
};

export const rateRide = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user!._id;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed rides' });
    }

    const isPassenger = ride.passenger.toString() === userId.toString();
    const isDriver = ride.driver?.toString() === userId.toString();

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update rating
    if (!ride.rating) {
      ride.rating = {};
    }

    if (isPassenger) {
      ride.rating.driverRating = rating;
      ride.rating.driverComment = comment;
    } else {
      ride.rating.passengerRating = rating;
      ride.rating.passengerComment = comment;
    }

    await ride.save();

    // Update user's average rating
    const targetUserId = isPassenger ? ride.driver : ride.passenger;
    if (targetUserId) {
      const ratingField = isPassenger ? 'rating.driverRating' : 'rating.passengerRating';
      const userRides = await Ride.find({
        [isPassenger ? 'driver' : 'passenger']: targetUserId,
        status: 'completed',
        [ratingField]: { $exists: true }
      });

      const totalRating = userRides.reduce((sum, r) => {
        const ratingValue = isPassenger ? r.rating?.driverRating : r.rating?.passengerRating;
        return sum + (ratingValue || 0);
      }, 0);

      const averageRating = totalRating / userRides.length;
      await User.findByIdAndUpdate(targetUserId, { rating: Math.round(averageRating * 10) / 10 });
    }

    res.json({
      message: 'Rating submitted successfully',
      ride
    });
  } catch (error) {
    console.error('Rate ride error:', error);
    res.status(500).json({ message: 'Server error submitting rating' });
  }
};