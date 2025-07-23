import { Router } from 'express';
import { rides } from '../db';
import { Ride } from '../models/types';
import { authMiddleware } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/rides - list all rides
router.get('/', (req, res) => {
  res.json(rides);
});

// POST /api/rides - driver create ride
router.post('/', authMiddleware(['driver']), (req, res) => {
  const { origin, destination, dateTime, seatsAvailable, price } = req.body as Omit<Ride, 'id' | 'driverId' | 'passengers'>;
  const ride: Ride = {
    id: uuidv4(),
    driverId: req.user!.id,
    origin,
    destination,
    dateTime,
    seatsAvailable,
    price,
    passengers: [],
  };
  rides.push(ride);
  res.status(201).json(ride);
});

// POST /api/rides/:rideId/book - passenger books ride
router.post('/:rideId/book', authMiddleware(['passenger']), (req, res) => {
  const ride = rides.find((r) => r.id === req.params.rideId);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  if (ride.seatsAvailable <= ride.passengers.length) {
    return res.status(400).json({ message: 'No seats left' });
  }
  if (ride.passengers.includes(req.user!.id)) {
    return res.status(400).json({ message: 'Already booked' });
  }
  ride.passengers.push(req.user!.id);
  res.json({ message: 'Ride booked', ride });
});

// GET /api/rides/history - user's ride history
router.get('/history', authMiddleware(), (req, res) => {
  const userId = req.user!.id;
  const asDriver = rides.filter((r) => r.driverId === userId);
  const asPassenger = rides.filter((r) => r.passengers.includes(userId));
  res.json({ asDriver, asPassenger });
});

export default router;