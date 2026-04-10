"use strict";
// ============================================================
// Errores de Dominio Personalizados
// Errores semánticos que representan fallos de negocio,
// no errores técnicos
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.NotFoundError = exports.AppError = void 0;
/**
 * Error base de la aplicación
 * Todos los errores personalizados heredan de esta clase
 */
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
/** Recurso no encontrado (404) */
class NotFoundError extends AppError {
    constructor(resource, id) {
        const msg = id ? `${resource} con id '${id}' no encontrado` : `${resource} no encontrado`;
        super(msg, 404);
    }
}
exports.NotFoundError = NotFoundError;
/** Error de validación (400) */
class ValidationError extends AppError {
    errors;
    constructor(message, errors = {}) {
        super(message, 400);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
/** Error de autenticación (401) */
class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/** Error de permisos (403) */
class ForbiddenError extends AppError {
    constructor(message = 'Acceso denegado') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
/** Error de conflicto - recurso ya existe (409) */
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
/** Rate limit excedido (429) */
class TooManyRequestsError extends AppError {
    constructor(message = 'Demasiadas solicitudes, intente más tarde') {
        super(message, 429);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
//# sourceMappingURL=index.js.map