import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Middleware factory que valida req.body contra un esquema Zod
 * Si la validación falla, lanza un ZodError que será capturado
 * por el errorHandler global
 *
 * @param schema - Esquema Zod a validar
 */
export declare function validate(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Middleware factory que valida query parameters
 *
 * @param schema - Esquema Zod a validar
 */
export declare function validateQuery(schema: ZodSchema): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.middleware.d.ts.map