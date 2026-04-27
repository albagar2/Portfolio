import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`Unhandled error at ${req.method} ${req.url}`, err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status,
    message,
    timestamp: new Date().toISOString()
  });
};
