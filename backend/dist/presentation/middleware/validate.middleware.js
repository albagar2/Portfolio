"use strict";
// ============================================================
// Middleware de Validación con Zod
// Wrapper que valida el body de las peticiones usando Zod schemas
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.validateQuery = validateQuery;
/**
 * Middleware factory que valida req.body contra un esquema Zod
 * Si la validación falla, lanza un ZodError que será capturado
 * por el errorHandler global
 *
 * @param schema - Esquema Zod a validar
 */
function validate(schema) {
    return (req, _res, next) => {
        try {
            // parse() lanza ZodError si falla la validación
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Middleware factory que valida query parameters
 *
 * @param schema - Esquema Zod a validar
 */
function validateQuery(schema) {
    return (req, _res, next) => {
        try {
            req.query = schema.parse(req.query);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map