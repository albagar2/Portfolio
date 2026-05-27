/**
 * index.ts
 * Archivo principal y punto de entrada del backend de la aplicación.
 * Aquí se configura el servidor Express, los middlewares de seguridad (CORS, Helmet, Rate Limit),
 * las rutas, el manejo de errores, y se inicializa la conexión y sincronización de la base de datos.
 */
// ============================================================
// Punto de Entrada del Backend
// Configura Express con todas las capas de seguridad,
// middleware y rutas
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './infrastructure/config/env.config';
import { logger } from './infrastructure/config/logger';
import { apiRouter } from './presentation/routes';
import { errorHandler, notFoundHandler } from './presentation/middleware/error.middleware';
import { Database } from './infrastructure/database/prisma';
import { initializeDatabase } from './init-db';
import { injectMissingFour } from './inject-final';
import { injectDemos } from './inject-demos';

// Inicializar Persistencia de DB
initializeDatabase();

// Inyectar los 4 proyectos finales para completar 13
injectMissingFour();
// Inyectar las Demos si no existen
injectDemos();

console.log("Triggering Railway Deploy for Demos Schema update...");

const app = express();

// Necesario para Railway/Vercel (están detrás de un proxy reverso)
app.set('trust proxy', 1);

// ============================================================
// Seguridad: Helmet - Headers HTTP seguros
// ============================================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ============================================================
// Seguridad: CORS - Control de orígenes permitidos
// ============================================================
app.use(cors({
  origin: true, // Permitir cualquier origen en producción para evitar bloqueos de CORS entre Vercel/Railway
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  maxAge: 86400,
}));

// ============================================================
// Seguridad: Rate Limiting - Prevención de ataques de fuerza bruta
// ============================================================
const generalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.NODE_ENV === 'development' ? 5000 : config.RATE_LIMIT_MAX_REQUESTS, // Mucho más permisivo en dev
  message: { success: false, message: 'Demasiadas solicitudes, intente más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: config.NODE_ENV === 'development' ? 100 : 10, // Más intentos en dev
  message: { success: false, message: 'Demasiados intentos de autenticación' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para formulario de contacto (anti-spam)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 mensajes por hora
  message: { success: false, message: 'Demasiados mensajes enviados. Intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.post('/api/contact', contactLimiter); // Solo para enviar mensajes

// ============================================================
// Parsers y configuración básica
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Deshabilitar fingerprinting del servidor
app.disable('x-powered-by');

// ============================================================
// Request logging (sin datos sensibles)
// ============================================================
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')?.substring(0, 100),
  });
  next();
});

// ============================================================
// Health Check (diagnóstico de la BD en producción)
// ============================================================
app.get('/api/health', async (_req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./portfolio.db'
        }
      }
    });
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    res.json({ 
      status: 'ok', 
      db: 'connected', 
      cwd: process.cwd(),
      dbUrl: process.env.DATABASE_URL 
    });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'error', 
      message: err.message, 
      code: err.code,
      meta: err.meta,
      dbUrl: process.env.DATABASE_URL 
    });
  }
});

app.get('/api/debug-push', async (_req, res) => {
  try {
    const { execSync } = await import('child_process');
    const output = execSync('npx prisma db push --accept-data-loss', { encoding: 'utf-8' });
    res.json({ status: 'ok', output });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message, stdout: err.stdout?.toString(), stderr: err.stderr?.toString() });
  }
});

// ============================================================
// Rutas API
// ============================================================
app.use('/api', apiRouter);

// ============================================================
// Archivos estáticos (para uploads)
// ============================================================
// Archivos estáticos (para uploads)
// ============================================================
const storagePath = process.env.STORAGE_PATH || 'uploads';
const fs = require('fs');
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}
app.use('/uploads', express.static(storagePath));

// ============================================================
// Manejo de errores
// ============================================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// Inicio del servidor
// ============================================================
const PORT = config.PORT;

const server = app.listen(PORT, async () => {
  logger.info(`🚀 Servidor Portfolio iniciado en puerto ${PORT}`);
  logger.info(`📝 Entorno: ${config.NODE_ENV}`);
  
  // Sincronización automática de BD al arrancar
  try {
    const { execSync } = await import('child_process');
    logger.info('📦 Sincronizando tablas de base de datos...');
    execSync('npx prisma db push --accept-data-loss --skip-generate', { stdio: 'inherit' });
    
    logger.info('🌱 Ejecutando seed de datos...');
    // Ejecutamos el seed. El propio seed.ts ya tiene lógica para no duplicar datos
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
    
    logger.info('✅ Sistema de base de datos verificado');
  } catch (dbError: any) {
    logger.error('❌ Error sincronizando base de datos:', { error: dbError.message });
  }
});

// ============================================================
// Graceful Shutdown
// ============================================================
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} recibido. Cerrando servidor...`);

  server.close(async () => {
    logger.info('Servidor HTTP cerrado');
    await Database.disconnect();
    logger.info('Conexiones de BD cerradas');
    process.exit(0);
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    logger.error('No se pudo cerrar graciosamente, forzando cierre');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejar errores no capturados
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Promesa no capturada', { error: reason.message, stack: reason.stack });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Excepción no capturada', { error: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

export default app;
