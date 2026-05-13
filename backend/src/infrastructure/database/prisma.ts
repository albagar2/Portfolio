// ============================================================
// Cliente Prisma Singleton
// Garantiza una única instancia de la conexión a BD
// ============================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

class Database {
  private static instance: PrismaClient;

  /**
   * Obtiene la instancia singleton de PrismaClient
   * Aplica logging en desarrollo para depuración
   */
  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      // Intentamos detectar una ruta persistente en Railway
      const isProduction = process.env.NODE_ENV === 'production';
      const defaultUrl = isProduction ? 'file:/app/data/portfolio.db' : 'file:./portfolio.db';
      const dbUrl = process.env.DATABASE_URL || defaultUrl;

      Database.instance = new PrismaClient({
        datasources: {
          db: {
            url: dbUrl,
          },
        },
        log: [
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ],
      });

      // Registrar errores de la BD en el logger
      Database.instance.$on('error' as never, (e: { message: string }) => {
        logger.error('Error de base de datos', { error: e.message });
      });

      Database.instance.$on('warn' as never, (e: { message: string }) => {
        logger.warn('Advertencia de base de datos', { warning: e.message });
      });
    }
    return Database.instance;
  }

  /**
   * Cierra la conexión a la base de datos
   * Se usa en el shutdown graceful del servidor
   */
  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
      logger.info('Conexión a base de datos cerrada');
    }
  }
}

export const prisma = Database.getInstance();
export { Database };
