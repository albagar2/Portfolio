"use strict";
// ============================================================
// Middleware Global de Manejo de Errores
// Captura todos los errores y los transforma en respuestas HTTP
// consistentes. No expone información sensible en producción.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const errors_1 = require("../../domain/errors");
const zod_1 = require("zod");
const logger_1 = require("../../infrastructure/config/logger");
const env_config_1 = require("../../infrastructure/config/env.config");
/**
 * Middleware de manejo de errores
 * Convierte errores en respuestas HTTP consistentes
 */
function errorHandler(err, req, res, _next) {
    // Log del error (sanitizado)
    logger_1.logger.error('Error en petición', {
        method: req.method,
        path: req.path,
        error: err.message,
        stack: env_config_1.config.NODE_ENV === 'development' ? err.stack : undefined,
    });
    // Error de validación Zod (capturado de los DTOs)
    if (err instanceof zod_1.ZodError) {
        const errors = {};
        err.errors.forEach((e) => {
            const path = e.path.join('.');
            if (!errors[path])
                errors[path] = [];
            errors[path].push(e.message);
        });
        const response = {
            success: false,
            message: 'Error de validación',
            errors,
        };
        res.status(400).json(response);
        return;
    }
    // Error personalizado de la aplicación
    if (err instanceof errors_1.AppError) {
        const response = {
            success: false,
            message: err.message,
        };
        // Incluir errores de validación si los hay
        if (err instanceof errors_1.ValidationError && err.errors) {
            response.errors = err.errors;
        }
        // Solo incluir stack trace en desarrollo
        if (env_config_1.config.NODE_ENV === 'development') {
            response.stack = err.stack;
        }
        res.status(err.statusCode).json(response);
        return;
    }
    // Error inesperado (no operacional)
    // En producción NO exponer detalles internos
    const response = {
        success: false,
        message: env_config_1.config.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message,
    };
    if (env_config_1.config.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    res.status(500).json(response);
}
/**
 * Middleware para rutas no encontradas (404)
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.method} ${req.path} no encontrada`,
    });
}
//# sourceMappingURL=error.middleware.js.map