// ============================================================
// Tests - Errores de Dominio
// ============================================================

import {
  AppError, NotFoundError, ValidationError,
  UnauthorizedError, ForbiddenError, ConflictError,
} from '../../src/domain/errors';

describe('Domain Errors', () => {
  describe('AppError', () => {
    it('debe crear un error con statusCode y mensaje', () => {
      const error = new AppError('Error de prueba', 500);
      expect(error.message).toBe('Error de prueba');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('NotFoundError', () => {
    it('debe crear error 404 con ID', () => {
      const error = new NotFoundError('Proyecto', '123');
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('Proyecto');
      expect(error.message).toContain('123');
    });

    it('debe crear error 404 sin ID', () => {
      const error = new NotFoundError('Perfil');
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('Perfil');
    });
  });

  describe('ValidationError', () => {
    it('debe incluir errores de validación', () => {
      const errors = { email: ['Email inválido'], name: ['Nombre requerido'] };
      const error = new ValidationError('Datos inválidos', errors);
      expect(error.statusCode).toBe(400);
      expect(error.errors).toEqual(errors);
    });
  });

  describe('UnauthorizedError', () => {
    it('debe crear error 401', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
    });
  });

  describe('ForbiddenError', () => {
    it('debe crear error 403', () => {
      const error = new ForbiddenError();
      expect(error.statusCode).toBe(403);
    });
  });

  describe('ConflictError', () => {
    it('debe crear error 409', () => {
      const error = new ConflictError('Email ya registrado');
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Email ya registrado');
    });
  });
});
