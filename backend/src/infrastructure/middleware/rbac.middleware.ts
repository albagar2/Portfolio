import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Middleware para bloquear acciones de escritura a usuarios invitados (Demo Mode)
 */
export const restrictToAdmin = (req: any, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }

  // Si es GUEST, solo permitimos métodos de lectura (GET)
  if (user.role === 'GUEST' && req.method !== 'GET') {
    logger.warn(`🔒 Intento de escritura bloqueado para GUEST: ${user.email} en ${req.method} ${req.originalUrl}`);
    return res.status(403).json({ 
      success: false, 
      message: 'MODO DEMO: No tienes permisos para realizar cambios. Crea tu propia instancia para editar.' 
    });
  }

  next();
};
