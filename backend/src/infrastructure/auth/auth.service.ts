// ============================================================
// Servicio de Autenticación
// Maneja JWT tokens, hash de contraseñas y verificación
// ============================================================

import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env.config';
import { UnauthorizedError } from '../../domain/errors';
import { UserRole } from '../../domain/entities';

// Payload del token JWT
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Resultado de generar tokens
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const SALT_ROUNDS = 12; // bcrypt salt rounds (resistente a brute force)

export class AuthService {
  /**
   * Hashea una contraseña con bcrypt
   * Usa 12 rounds de salt para seguridad óptima
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con su hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Genera un par de tokens: access + refresh
   * Access token: vida corta (15min por defecto)
   * Refresh token: vida larga (7d por defecto)
   */
  static generateTokens(payload: TokenPayload): TokenPair {
    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRATION,
    });

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verifica y decodifica un access token con diagnóstico
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload & TokenPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role as UserRole,
      };
    } catch (err: any) {
      // Diagnostic log for the specific failure
      const reason = err.name === 'TokenExpiredError' ? 'EXPIRADO' : 'FIRMA INVÁLIDA';
      console.error(`[AUTH] Error Access Token: ${reason} (${err.message})`);
      throw new UnauthorizedError('Token de acceso inválido o expirado');
    }
  }

  /**
   * Verifica y decodifica un refresh token con diagnóstico
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload & TokenPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role as UserRole,
      };
    } catch (err: any) {
      // Diagnostic log for the specific failure
      const reason = err.name === 'TokenExpiredError' ? 'EXPIRADO' : 'FIRMA INVÁLIDA';
      console.error(`[AUTH] Error Refresh Token: ${reason} (${err.message})`);
      throw new UnauthorizedError('Token de refresco inválido o expirado');
    }
  }
}
