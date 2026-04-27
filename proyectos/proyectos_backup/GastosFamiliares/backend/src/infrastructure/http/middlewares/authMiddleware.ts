import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables');
}

const SECRET = JWT_SECRET;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    familyId: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET) as any;
    req.user = {
      id: decoded.id,
      familyId: decoded.familyId,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
