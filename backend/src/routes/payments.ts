import { Router } from 'express';
import Stripe from 'stripe';
import { authMiddleware } from '../middleware/auth';
const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' });

router.post('/create-intent', authMiddleware(['passenger']), async (req, res) => {
  const { amount, currency = 'usd' } = req.body as { amount: number; currency?: string };
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: req.user!.id },
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

export default router;