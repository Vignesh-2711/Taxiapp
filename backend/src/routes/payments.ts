import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment
} from '../controllers/paymentController';
import { auth, requireRole } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create a Stripe payment intent
// @access  Private (Passengers only)
router.post('/create-intent', auth, requireRole(['passenger']), createPaymentIntent);

// @route   POST /api/payments/confirm
// @desc    Confirm payment status
// @access  Private (Passengers only)
router.post('/confirm', auth, requireRole(['passenger']), confirmPayment);

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private (Passengers only)
router.get('/history', auth, requireRole(['passenger']), getPaymentHistory);

// @route   POST /api/payments/:rideId/refund
// @desc    Process refund for cancelled ride
// @access  Private (Passengers only)
router.post('/:rideId/refund', auth, requireRole(['passenger']), refundPayment);

export default router;