import { Request, Response, NextFunction } from 'express';
/**
 * Middleware de manejo de errores
 * Convierte errores en respuestas HTTP consistentes
 */
export declare function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void;
/**
 * Middleware para rutas no encontradas (404)
 */
export declare function notFoundHandler(req: Request, res: Response): void;
//# sourceMappingURL=error.middleware.d.ts.map