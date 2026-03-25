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

const app = express();

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
}));

// ============================================================
// Seguridad: CORS - Control de orígenes permitidos
// ============================================================
app.use(cors({
  origin: config.CORS_ORIGIN.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight 24h
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
// Rutas API
// ============================================================
app.use('/api', apiRouter);

// ============================================================
// Archivos estáticos (para uploads)
// ============================================================
app.use('/uploads', express.static('uploads'));

// ============================================================
// Manejo de errores
// ============================================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// Inicio del servidor
// ============================================================
const PORT = config.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor Portfolio iniciado en puerto ${PORT}`);
  logger.info(`📝 Entorno: ${config.NODE_ENV}`);
  logger.info(`🔗 API: http://localhost:${PORT}/api`);
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
