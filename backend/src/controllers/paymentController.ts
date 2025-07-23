import { Response } from 'express';
import Stripe from 'stripe';
import Ride from '../models/Ride';
import { AuthRequest } from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId } = req.body;
    const userId = req.user!._id;

    // Find the ride
    const ride = await Ride.findById(rideId).populate('passenger');
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is the passenger
    if (ride.passenger._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the passenger can create payment for this ride' });
    }

    // Check if ride is completed
    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot create payment for incomplete ride' });
    }

    // Check if payment already exists
    if (ride.paymentIntentId) {
      return res.status(400).json({ message: 'Payment already exists for this ride' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(ride.fare.total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        rideId: ride._id.toString(),
        passengerId: userId.toString()
      }
    });

    // Update ride with payment intent ID
    ride.paymentIntentId = paymentIntent.id;
    await ride.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: ride.fare.total
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error creating payment intent' });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user!._id;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment intent not found' });
    }

    // Find the ride
    const ride = await Ride.findById(paymentIntent.metadata.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is the passenger
    if (ride.passenger.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update payment status based on Stripe status
    if (paymentIntent.status === 'succeeded') {
      ride.paymentStatus = 'paid';
    } else if (paymentIntent.status === 'payment_failed') {
      ride.paymentStatus = 'failed';
    }

    await ride.save();

    res.json({
      message: 'Payment status updated',
      paymentStatus: ride.paymentStatus,
      stripeStatus: paymentIntent.status
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error confirming payment' });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { page = 1, limit = 10 } = req.query;

    const rides = await Ride.find({
      passenger: userId,
      paymentStatus: { $in: ['paid', 'failed'] }
    })
    .populate('driver', 'firstName lastName vehicleInfo')
    .sort({ completedAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

    const total = await Ride.countDocuments({
      passenger: userId,
      paymentStatus: { $in: ['paid', 'failed'] }
    });

    res.json({
      payments: rides,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error fetching payment history' });
  }
};

export const refundPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId } = req.params;
    const userId = req.user!._id;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is the passenger
    if (ride.passenger.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the passenger can request refund' });
    }

    // Check if payment was made
    if (ride.paymentStatus !== 'paid' || !ride.paymentIntentId) {
      return res.status(400).json({ message: 'No payment found for this ride' });
    }

    // Check if ride was cancelled
    if (ride.status !== 'cancelled') {
      return res.status(400).json({ message: 'Refunds are only available for cancelled rides' });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: ride.paymentIntentId,
      metadata: {
        rideId: ride._id.toString(),
        reason: 'ride_cancelled'
      }
    });

    // Update ride payment status
    ride.paymentStatus = 'refunded';
    await ride.save();

    res.json({
      message: 'Refund processed successfully',
      refundId: refund.id,
      amount: refund.amount / 100
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: 'Server error processing refund' });
  }
};