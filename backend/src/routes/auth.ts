import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { users } from '../db';
import { User } from '../models/types';
import { signToken } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role: 'driver' | 'passenger';
  };
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const existing = users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role,
  };
  users.push(newUser);
  const token = signToken({ id: newUser.id, role: newUser.role });
  res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;