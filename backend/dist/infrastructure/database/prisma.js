"use strict";
// ============================================================
// Cliente Prisma Singleton
// Garantiza una única instancia de la conexión a BD
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../config/logger");
class Database {
    static instance;
    /**
     * Obtiene la instancia singleton de PrismaClient
     * Aplica logging en desarrollo para depuración
     */
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new client_1.PrismaClient({
                log: [
                    { emit: 'event', level: 'error' },
                    { emit: 'event', level: 'warn' },
                ],
            });
            // Registrar errores de la BD en el logger
            Database.instance.$on('error', (e) => {
                logger_1.logger.error('Error de base de datos', { error: e.message });
            });
            Database.instance.$on('warn', (e) => {
                logger_1.logger.warn('Advertencia de base de datos', { warning: e.message });
            });
        }
        return Database.instance;
    }
    /**
     * Cierra la conexión a la base de datos
     * Se usa en el shutdown graceful del servidor
     */
    static async disconnect() {
        if (Database.instance) {
            await Database.instance.$disconnect();
            logger_1.logger.info('Conexión a base de datos cerrada');
        }
    }
}
exports.Database = Database;
exports.prisma = Database.getInstance();
//# sourceMappingURL=prisma.js.map