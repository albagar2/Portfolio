// ============================================================
// Configuración de Variables de Entorno
// Carga y valida todas las variables necesarias con Zod
// ============================================================

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Esquema de validación para variables de entorno
const envSchema = z.object({
  // Servidor
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('4000'),

  // Base de datos
  // En SQLite la URL puede ser local (file:./dev.db)
  DATABASE_URL: z.string().default('file:./portfolio.db'),

  // Admin inicial (Personalización única)
  ADMIN_NAME: z.string().default('Admin'),
  ADMIN_EMAIL: z.string().email().default('admin@portfolio.dev'),
  ADMIN_PASSWORD: z.string().min(8).default('Admin@123456'),
  ADMIN_TITLE: z.string().default('Software Architect'),
  ADMIN_BIO: z.string().default('Bio por defecto'),

  // JWT
  JWT_SECRET: z.string().min(10, 'JWT_SECRET debe tener al menos 10 caracteres'),
  JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET debe tener al menos 10 caracteres'),
  JWT_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutos
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('1000'),

  // Uploads
  UPLOAD_MAX_SIZE_MB: z.string().transform(Number).default('5'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Tipo derivado del esquema
type EnvConfig = z.infer<typeof envSchema>;

// Validar variables de entorno
function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
        .join('\n');
      console.error(`❌ Variables de entorno inválidas:\n${missingVars}`);
      process.exit(1);
    }
    throw error;
  }
}

export const config = validateEnv();
