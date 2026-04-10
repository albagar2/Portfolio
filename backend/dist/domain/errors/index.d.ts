/**
 * Error base de la aplicación
 * Todos los errores personalizados heredan de esta clase
 */
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
/** Recurso no encontrado (404) */
export declare class NotFoundError extends AppError {
    constructor(resource: string, id?: string);
}
/** Error de validación (400) */
export declare class ValidationError extends AppError {
    readonly errors: Record<string, string[]>;
    constructor(message: string, errors?: Record<string, string[]>);
}
/** Error de autenticación (401) */
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
/** Error de permisos (403) */
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
/** Error de conflicto - recurso ya existe (409) */
export declare class ConflictError extends AppError {
    constructor(message: string);
}
/** Rate limit excedido (429) */
export declare class TooManyRequestsError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=index.d.ts.map