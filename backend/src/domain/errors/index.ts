// ============================================================
// Errores de Dominio Personalizados
// Errores semánticos que representan fallos de negocio,
// no errores técnicos
// ============================================================

/**
 * Error base de la aplicación
 * Todos los errores personalizados heredan de esta clase
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/** Recurso no encontrado (404) */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const msg = id ? `${resource} con id '${id}' no encontrado` : `${resource} no encontrado`;
    super(msg, 404);
  }
}

/** Error de validación (400) */
export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message, 400);
    this.errors = errors;
  }
}

/** Error de autenticación (401) */
export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

/** Error de permisos (403) */
export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, 403);
  }
}

/** Error de conflicto - recurso ya existe (409) */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/** Rate limit excedido (429) */
export class TooManyRequestsError extends AppError {
  constructor(message = 'Demasiadas solicitudes, intente más tarde') {
    super(message, 429);
  }
}
