// ============================================================
// Tests - Servicio de Autenticación
// ============================================================

import { AuthService } from '../../src/infrastructure/auth/auth.service';
import { UserRole } from '../../src/domain/entities';

// Mock de config para tests
jest.mock('../../src/infrastructure/config/env.config', () => ({
  config: {
    JWT_SECRET: 'test-secret-key-that-is-at-least-32-characters-long',
    JWT_REFRESH_SECRET: 'test-refresh-secret-key-that-is-at-least-32-chars',
    JWT_EXPIRATION: '15m',
    JWT_REFRESH_EXPIRATION: '7d',
    NODE_ENV: 'test',
    PORT: 4000,
    LOG_LEVEL: 'error',
  },
}));

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('debe hashear una contraseña correctamente', async () => {
      const password = 'TestPassword@123';
      const hash = await AuthService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // bcrypt hashes son largos
    });

    it('debe generar hashes diferentes para la misma contraseña', async () => {
      const password = 'TestPassword@123';
      const hash1 = await AuthService.hashPassword(password);
      const hash2 = await AuthService.hashPassword(password);

      expect(hash1).not.toBe(hash2); // Salts diferentes
    });
  });

  describe('comparePassword', () => {
    it('debe retornar true para contraseña correcta', async () => {
      const password = 'TestPassword@123';
      const hash = await AuthService.hashPassword(password);

      const isValid = await AuthService.comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('debe retornar false para contraseña incorrecta', async () => {
      const password = 'TestPassword@123';
      const hash = await AuthService.hashPassword(password);

      const isValid = await AuthService.comparePassword('WrongPassword@123', hash);
      expect(isValid).toBe(false);
    });
  });

  describe('generateTokens', () => {
    it('debe generar access y refresh tokens', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@test.com',
        role: UserRole.ADMIN,
      };

      const tokens = AuthService.generateTokens(payload);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    it('debe verificar un token válido', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@test.com',
        role: UserRole.ADMIN,
      };

      const tokens = AuthService.generateTokens(payload);
      const decoded = AuthService.verifyAccessToken(tokens.accessToken);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it('debe lanzar error para token inválido', () => {
      expect(() => AuthService.verifyAccessToken('invalid-token')).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('debe verificar un refresh token válido', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@test.com',
        role: UserRole.ADMIN,
      };

      const tokens = AuthService.generateTokens(payload);
      const decoded = AuthService.verifyRefreshToken(tokens.refreshToken);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('debe lanzar error para refresh token inválido', () => {
      expect(() => AuthService.verifyRefreshToken('invalid-token')).toThrow();
    });
  });
});
