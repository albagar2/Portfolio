import { Request, Response, NextFunction } from 'express';

export const internalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const syncKey = req.headers['x-internal-sync-key'];
  
  if (!syncKey || syncKey !== process.env.INTERNAL_SYNC_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid Sync Key' });
  }
  
  next();
};
