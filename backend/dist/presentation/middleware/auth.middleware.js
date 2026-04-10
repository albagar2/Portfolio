"use strict";
// ============================================================
// Middleware de Autenticación y Autorización (RBAC)
// Verifica JWT tokens y controla acceso por roles
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.authorize = authorize;
exports.optionalAuth = optionalAuth;
const auth_service_1 = require("../../infrastructure/auth/auth.service");
const errors_1 = require("../../domain/errors");
/**
 * Middleware de autenticación
 * Verifica el token JWT del header Authorization
 * Formato esperado: "Bearer <token>"
 */
function authMiddleware(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('Token de autenticación no proporcionado');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new errors_1.UnauthorizedError('Formato de token inválido');
        }
        // Verificar y decodificar el token
        const payload = auth_service_1.AuthService.verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
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
function authorize(...roles) {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.UnauthorizedError('Debe autenticarse primero');
            }
            if (!roles.includes(req.user.role)) {
                throw new errors_1.ForbiddenError(`Rol '${req.user.role}' no tiene permisos para esta acción. Roles requeridos: ${roles.join(', ')}`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Middleware opcional de autenticación
 * Si hay token, lo verifica y adjunta al request
 * Si no hay token, continúa sin error
 */
function optionalAuth(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token) {
                req.user = auth_service_1.AuthService.verifyAccessToken(token);
            }
        }
        next();
    }
    catch {
        // Si el token es inválido, simplemente continuamos sin autenticación
        next();
    }
}
//# sourceMappingURL=auth.middleware.js.map