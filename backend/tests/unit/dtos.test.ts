// ============================================================
// Tests - Validación de DTOs
// ============================================================

import {
  LoginSchema, RegisterSchema,
  CreateProjectSchema, CreateContactMessageSchema,
} from '../../src/application/dtos';

describe('DTO Validations', () => {
  describe('LoginSchema', () => {
    it('debe validar un login correcto', () => {
      const result = LoginSchema.safeParse({
        email: 'user@test.com',
        password: 'Password@123',
      });
      expect(result.success).toBe(true);
    });

    it('debe rechazar email inválido', () => {
      const result = LoginSchema.safeParse({
        email: 'not-an-email',
        password: 'Password@123',
      });
      expect(result.success).toBe(false);
    });

    it('debe rechazar contraseña corta', () => {
      const result = LoginSchema.safeParse({
        email: 'user@test.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('RegisterSchema', () => {
    it('debe validar un registro correcto', () => {
      const result = RegisterSchema.safeParse({
        email: 'newuser@test.com',
        password: 'StrongP@ss1',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('debe rechazar contraseña sin mayúscula', () => {
      const result = RegisterSchema.safeParse({
        email: 'user@test.com',
        password: 'weakpassword@1',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('debe rechazar contraseña sin carácter especial', () => {
      const result = RegisterSchema.safeParse({
        email: 'user@test.com',
        password: 'NoSpecial123',
        name: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('debe sanitizar HTML del nombre (prevención XSS)', () => {
      const result = RegisterSchema.safeParse({
        email: 'user@test.com',
        password: 'StrongP@ss1',
        name: '<script>alert("xss")</script>Test User',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).not.toContain('<script>');
      }
    });
  });

  describe('CreateProjectSchema', () => {
    it('debe validar un proyecto correcto', () => {
      const result = CreateProjectSchema.safeParse({
        title: 'Mi Proyecto',
        slug: 'mi-proyecto',
        description: 'Descripción del proyecto de al menos 10 caracteres',
        technologies: ['React', 'Node.js'],
        category: 'web',
      });
      expect(result.success).toBe(true);
    });

    it('debe rechazar slug con caracteres inválidos', () => {
      const result = CreateProjectSchema.safeParse({
        title: 'Mi Proyecto',
        slug: 'Mi Proyecto!!!',
        description: 'Descripción del proyecto',
        technologies: ['React'],
        category: 'web',
      });
      expect(result.success).toBe(false);
    });

    it('debe rechazar proyecto sin tecnologías', () => {
      const result = CreateProjectSchema.safeParse({
        title: 'Mi Proyecto',
        slug: 'mi-proyecto',
        description: 'Descripción del proyecto',
        technologies: [],
        category: 'web',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CreateContactMessageSchema', () => {
    it('debe validar un mensaje correcto', () => {
      const result = CreateContactMessageSchema.safeParse({
        name: 'Juan García',
        email: 'juan@example.com',
        subject: 'Consulta sobre servicios',
        message: 'Me gustaría saber más sobre tus servicios de desarrollo web.',
      });
      expect(result.success).toBe(true);
    });

    it('debe rechazar mensaje demasiado largo (>5000 chars)', () => {
      const result = CreateContactMessageSchema.safeParse({
        name: 'Test',
        email: 'test@test.com',
        subject: 'Test',
        message: 'a'.repeat(5001),
      });
      expect(result.success).toBe(false);
    });

    it('debe sanitizar HTML en campos de texto', () => {
      const result = CreateContactMessageSchema.safeParse({
        name: '<img onerror=alert(1)>Test',
        email: 'test@test.com',
        subject: 'Test subject text',
        message: 'Un mensaje normal de al menos 10 caracteres',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).not.toContain('<img');
      }
    });
  });
});
