import type { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET: Secret = (process.env.JWT_SECRET as string) || 'change_this_secret';

interface JwtPayloadWithId {
  id: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid authorization header' });

  const token: any = parts[1];

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    // jwt.verify can return string or object — guard it
    if (!verified || typeof verified === 'string') {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const payload = verified as JwtPayloadWithId;
    if (!payload.id) {
      return res.status(401).json({ message: 'Token missing user id' });
    }

    req.user = { id: String(payload.id) };
    return next();
  } catch (err) {
    console.error('authGuard error', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
