import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: 'driver' | 'passenger' };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';

export const signToken = (payload: { id: string; role: 'driver' | 'passenger' }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const authMiddleware = (roles: Array<'driver' | 'passenger'> = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: 'driver' | 'passenger' };
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};