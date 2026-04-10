"use strict";
// ============================================================
// Servicio de Autenticación
// Maneja JWT tokens, hash de contraseñas y verificación
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const errors_1 = require("../../domain/errors");
const SALT_ROUNDS = 12; // bcrypt salt rounds (resistente a brute force)
class AuthService {
    /**
     * Hashea una contraseña con bcrypt
     * Usa 12 rounds de salt para seguridad óptima
     */
    static async hashPassword(password) {
        return bcryptjs_1.default.hash(password, SALT_ROUNDS);
    }
    /**
     * Compara una contraseña en texto plano con su hash
     */
    static async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    /**
     * Genera un par de tokens: access + refresh
     * Access token: vida corta (15min por defecto)
     * Refresh token: vida larga (7d por defecto)
     */
    static generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, env_config_1.config.JWT_SECRET, {
            expiresIn: env_config_1.config.JWT_EXPIRATION,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, env_config_1.config.JWT_REFRESH_SECRET, {
            expiresIn: env_config_1.config.JWT_REFRESH_EXPIRATION,
        });
        return { accessToken, refreshToken };
    }
    /**
     * Verifica y decodifica un access token con diagnóstico
     */
    static verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_config_1.config.JWT_SECRET);
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };
        }
        catch (err) {
            // Diagnostic log for the specific failure
            const reason = err.name === 'TokenExpiredError' ? 'EXPIRADO' : 'FIRMA INVÁLIDA';
            console.error(`[AUTH] Error Access Token: ${reason} (${err.message})`);
            throw new errors_1.UnauthorizedError('Token de acceso inválido o expirado');
        }
    }
    /**
     * Verifica y decodifica un refresh token con diagnóstico
     */
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_config_1.config.JWT_REFRESH_SECRET);
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };
        }
        catch (err) {
            // Diagnostic log for the specific failure
            const reason = err.name === 'TokenExpiredError' ? 'EXPIRADO' : 'FIRMA INVÁLIDA';
            console.error(`[AUTH] Error Refresh Token: ${reason} (${err.message})`);
            throw new errors_1.UnauthorizedError('Token de refresco inválido o expirado');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map