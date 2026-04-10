import { UserRole } from '../../domain/entities';
export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    /**
     * Hashea una contraseña con bcrypt
     * Usa 12 rounds de salt para seguridad óptima
     */
    static hashPassword(password: string): Promise<string>;
    /**
     * Compara una contraseña en texto plano con su hash
     */
    static comparePassword(password: string, hash: string): Promise<boolean>;
    /**
     * Genera un par de tokens: access + refresh
     * Access token: vida corta (15min por defecto)
     * Refresh token: vida larga (7d por defecto)
     */
    static generateTokens(payload: TokenPayload): TokenPair;
    /**
     * Verifica y decodifica un access token con diagnóstico
     */
    static verifyAccessToken(token: string): TokenPayload;
    /**
     * Verifica y decodifica un refresh token con diagnóstico
     */
    static verifyRefreshToken(token: string): TokenPayload;
}
//# sourceMappingURL=auth.service.d.ts.map