// ============================================================
// Middleware de Autenticación y Autorización (RBAC)
// Verifica JWT tokens y controla acceso por roles
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { AuthService, TokenPayload } from '../../infrastructure/auth/auth.service';
import { UnauthorizedError, ForbiddenError } from '../../domain/errors';
import { UserRole } from '../../domain/entities';

// Extender Request de Express para incluir datos del usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware de autenticación
 * Verifica el token JWT del header Authorization
 * Formato esperado: "Bearer <token>"
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de autenticación no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Formato de token inválido');
    }

    // Verificar y decodificar el token
    const payload = AuthService.verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware de autorización por roles (RBAC)
 * Verifica que el usuario autenticado tiene uno de los roles permitidos
 * Debe usarse DESPUÉS del middleware de autenticación
 *
 * @param roles - Array de roles permitidos
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Debe autenticarse primero');
      }

      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError(
          `Rol '${req.user.role}' no tiene permisos para esta acción. Roles requeridos: ${roles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware opcional de autenticación
 * Si hay token, lo verifica y adjunta al request
 * Si no hay token, continúa sin error
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        req.user = AuthService.verifyAccessToken(token);
      }
    }

    next();
  } catch {
    // Si el token es inválido, simplemente continuamos sin autenticación
    next();
  }
}
