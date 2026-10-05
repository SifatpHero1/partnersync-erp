import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// TypeScript-কে বোঝানো যে req অবজেক্টে user প্রপার্টি থাকতে পারে
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Header থেকে টোকেন নেওয়া (Format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded; // req.user এর ভেতর id এবং role সেভ হবে
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};