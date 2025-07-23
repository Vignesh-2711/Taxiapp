import { Router } from 'express';
import { createRide, getRides, bookRide, getRideHistory } from '../controllers/rideController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getRides);
router.post('/', authenticate, createRide);
router.post('/:id/book', authenticate, bookRide);
router.get('/history', authenticate, getRideHistory);

export default router;