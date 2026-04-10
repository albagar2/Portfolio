import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../../infrastructure/auth/auth.service';
import { UserRole } from '../../domain/entities';
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
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
/**
 * Middleware de autorización por roles (RBAC)
 * Verifica que el usuario autenticado tiene uno de los roles permitidos
 * Debe usarse DESPUÉS del middleware de autenticación
 *
 * @param roles - Array de roles permitidos
 */
export declare function authorize(...roles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Middleware opcional de autenticación
 * Si hay token, lo verifica y adjunta al request
 * Si no hay token, continúa sin error
 */
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map