"use strict";
// ============================================================
// Configuración de Variables de Entorno
// Carga y valida todas las variables necesarias con Zod
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
// Esquema de validación para variables de entorno
const envSchema = zod_1.z.object({
    // Servidor
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('4000'),
    // Base de datos
    // En SQLite la URL puede ser local (file:./dev.db), omitimos validación estricta de URL externa
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL es requerida'),
    // Admin inicial (Personalización única)
    ADMIN_NAME: zod_1.z.string().default('Admin'),
    ADMIN_EMAIL: zod_1.z.string().email().default('admin@portfolio.dev'),
    ADMIN_PASSWORD: zod_1.z.string().min(8).default('Admin@123456'),
    ADMIN_TITLE: zod_1.z.string().default('Software Architect'),
    ADMIN_BIO: zod_1.z.string().default('Bio por defecto'),
    // JWT
    JWT_SECRET: zod_1.z.string().min(10, 'JWT_SECRET debe tener al menos 10 caracteres'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(10, 'JWT_REFRESH_SECRET debe tener al menos 10 caracteres'),
    JWT_EXPIRATION: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRATION: zod_1.z.string().default('7d'),
    // CORS
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).default('900000'), // 15 minutos
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().transform(Number).default('100'),
    // Uploads
    UPLOAD_MAX_SIZE_MB: zod_1.z.string().transform(Number).default('5'),
    // Logging
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});
// Validar variables de entorno
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const missingVars = error.errors
                .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
                .join('\n');
            console.error(`❌ Variables de entorno inválidas:\n${missingVars}`);
            process.exit(1);
        }
        throw error;
    }
}
exports.config = validateEnv();
//# sourceMappingURL=env.config.js.map