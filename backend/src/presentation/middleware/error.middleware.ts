// ============================================================
// Middleware Global de Manejo de Errores
// Captura todos los errores y los transforma en respuestas HTTP
// consistentes. No expone información sensible en producción.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../../domain/errors';
import { ZodError } from 'zod';
import { logger } from '../../infrastructure/config/logger';
import { config } from '../../infrastructure/config/env.config';

/**
 * Interfaz estándar de respuesta de error
 */
interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

/**
 * Middleware de manejo de errores
 * Convierte errores en respuestas HTTP consistentes
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log del error (sanitizado)
  logger.error('Error en petición', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Error de validación Zod (capturado de los DTOs)
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(e.message);
    });

    const response: ErrorResponse = {
      success: false,
      message: 'Error de validación',
      errors,
    };

    res.status(400).json(response);
    return;
  }

  // Error personalizado de la aplicación
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
    };

    // Incluir errores de validación si los hay
    if (err instanceof ValidationError && err.errors) {
      response.errors = err.errors;
    }

    // Solo incluir stack trace en desarrollo
    if (config.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Error inesperado (no operacional)
  // En producción NO exponer detalles internos
  const response: ErrorResponse = {
    success: false,
    message: config.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message,
  };

  if (config.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(500).json(response);
}

/**
 * Middleware para rutas no encontradas (404)
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.path} no encontrada`,
  });
}
