import { Router } from 'express';
import { createPaymentIntent } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/intent', authenticate, createPaymentIntent);

export default router;