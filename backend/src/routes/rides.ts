import express from 'express';
import {
  createRide,
  getAvailableRides,
  acceptRide,
  updateRideStatus,
  getRideHistory,
  getRideById,
  rateRide
} from '../controllers/rideController';
import { auth, requireRole } from '../middleware/auth';
import { validateRideRequest, validateRating, handleValidationErrors } from '../utils/validation';

const router = express.Router();

// @route   POST /api/rides
// @desc    Create a new ride request
// @access  Private (Passengers only)
router.post(
  '/',
  auth,
  requireRole(['passenger']),
  validateRideRequest,
  handleValidationErrors,
  createRide
);

// @route   GET /api/rides/available
// @desc    Get available rides for drivers
// @access  Private (Drivers only)
router.get('/available', auth, requireRole(['driver']), getAvailableRides);

// @route   POST /api/rides/:rideId/accept
// @desc    Accept a ride request
// @access  Private (Drivers only)
router.post('/:rideId/accept', auth, requireRole(['driver']), acceptRide);

// @route   PUT /api/rides/:rideId/status
// @desc    Update ride status
// @access  Private
router.put('/:rideId/status', auth, updateRideStatus);

// @route   GET /api/rides/history
// @desc    Get user's ride history
// @access  Private
router.get('/history', auth, getRideHistory);

// @route   GET /api/rides/:rideId
// @desc    Get ride by ID
// @access  Private
router.get('/:rideId', auth, getRideById);

// @route   POST /api/rides/:rideId/rate
// @desc    Rate a completed ride
// @access  Private
router.post(
  '/:rideId/rate',
  auth,
  validateRating,
  handleValidationErrors,
  rateRide
);

export default router;