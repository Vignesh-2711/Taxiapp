import { Request, Response } from 'express';
import { AppDataSource } from '../utils/data-source';
import { Ride } from '../models/Ride';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const rideRepo = AppDataSource.getRepository(Ride);
const userRepo = AppDataSource.getRepository(User);

export const createRide = async (req: AuthRequest, res: Response) => {
  const { origin, destination } = req.body;
  try {
    const passenger = await userRepo.findOneBy({ id: req.user!.id });
    if (!passenger) return res.status(404).json({ message: 'User not found' });
    const ride = rideRepo.create({ origin, destination, passenger });
    await rideRepo.save(ride);
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create ride', error: err });
  }
};

export const getRides = async (req: Request, res: Response) => {
  try {
    const rides = await rideRepo.find({ relations: ['passenger', 'driver'] });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rides', error: err });
  }
};

export const bookRide = async (req: AuthRequest, res: Response) => {
  const rideId = parseInt(req.params.id);
  try {
    const ride = await rideRepo.findOne({ where: { id: rideId }, relations: ['driver'] });
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.driver) return res.status(400).json({ message: 'Ride already booked' });
    const driver = await userRepo.findOneBy({ id: req.user!.id });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    ride.driver = driver;
    ride.status = 'accepted';
    await rideRepo.save(ride);
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Failed to book ride', error: err });
  }
};

export const getRideHistory = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userRepo.findOneBy({ id: req.user!.id });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const rides = await rideRepo.find({
      where: [
        { passenger: { id: user.id } },
        { driver: { id: user.id } },
      ],
      relations: ['passenger', 'driver'],
    });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ride history', error: err });
  }
};