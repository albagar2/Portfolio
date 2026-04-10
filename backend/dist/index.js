"use strict";
// ============================================================
// Punto de Entrada del Backend
// Configura Express con todas las capas de seguridad,
// middleware y rutas
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_config_1 = require("./infrastructure/config/env.config");
const logger_1 = require("./infrastructure/config/logger");
const routes_1 = require("./presentation/routes");
const error_middleware_1 = require("./presentation/middleware/error.middleware");
const prisma_1 = require("./infrastructure/database/prisma");
const app = (0, express_1.default)();
// ============================================================
// Seguridad: Helmet - Headers HTTP seguros
// ============================================================
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)({
    origin: env_config_1.config.CORS_ORIGIN.split(',').map(o => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // Cache preflight 24h
}));
// ============================================================
// Seguridad: Rate Limiting - Prevención de ataques de fuerza bruta
// ============================================================
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_config_1.config.RATE_LIMIT_WINDOW_MS,
    max: env_config_1.config.NODE_ENV === 'development' ? 5000 : env_config_1.config.RATE_LIMIT_MAX_REQUESTS, // Mucho más permisivo en dev
    message: { success: false, message: 'Demasiadas solicitudes, intente más tarde' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiting más estricto para autenticación
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: env_config_1.config.NODE_ENV === 'development' ? 100 : 10, // Más intentos en dev
    message: { success: false, message: 'Demasiados intentos de autenticación' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiting para formulario de contacto (anti-spam)
const contactLimiter = (0, express_rate_limit_1.default)({
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
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Deshabilitar fingerprinting del servidor
app.disable('x-powered-by');
// ============================================================
// Request logging (sin datos sensibles)
// ============================================================
app.use((req, _res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, 100),
    });
    next();
});
// ============================================================
// Rutas API
// ============================================================
app.use('/api', routes_1.apiRouter);
// ============================================================
// Archivos estáticos (para uploads)
// ============================================================
app.use('/uploads', express_1.default.static('uploads'));
// ============================================================
// Manejo de errores
// ============================================================
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
// ============================================================
// Inicio del servidor
// ============================================================
const PORT = env_config_1.config.PORT;
const server = app.listen(PORT, () => {
    logger_1.logger.info(`🚀 Servidor Portfolio iniciado en puerto ${PORT}`);
    logger_1.logger.info(`📝 Entorno: ${env_config_1.config.NODE_ENV}`);
    logger_1.logger.info(`🔗 API: http://localhost:${PORT}/api`);
});
// ============================================================
// Graceful Shutdown
// ============================================================
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`${signal} recibido. Cerrando servidor...`);
    server.close(async () => {
        logger_1.logger.info('Servidor HTTP cerrado');
        await prisma_1.Database.disconnect();
        logger_1.logger.info('Conexiones de BD cerradas');
        process.exit(0);
    });
    // Forzar cierre después de 10 segundos
    setTimeout(() => {
        logger_1.logger.error('No se pudo cerrar graciosamente, forzando cierre');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Manejar errores no capturados
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Promesa no capturada', { error: reason.message, stack: reason.stack });
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Excepción no capturada', { error: error.message, stack: error.stack });
    gracefulShutdown('uncaughtException');
});
exports.default = app;
//# sourceMappingURL=index.js.map