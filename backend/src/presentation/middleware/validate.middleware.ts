// ============================================================
// Middleware de Validación con Zod
// Wrapper que valida el body de las peticiones usando Zod schemas
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware factory que valida req.body contra un esquema Zod
 * Si la validación falla, lanza un ZodError que será capturado
 * por el errorHandler global
 *
 * @param schema - Esquema Zod a validar
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // parse() lanza ZodError si falla la validación
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware factory que valida query parameters
 *
 * @param schema - Esquema Zod a validar
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}
