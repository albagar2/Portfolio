import fs from 'fs';
import path from 'path';
import { logger } from './infrastructure/config/logger';

/**
 * Script de inicialización de Base de Datos
 * Asegura que la base de datos persista en el volumen de Railway
 * pero se inicialice con los datos de Git si es necesario.
 */
export const initializeDatabase = () => {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) return;

  const persistentDir = '/app/data';
  const persistentDbPath = path.join(persistentDir, 'portfolio.db');
  const sourceDbPath = path.join(process.cwd(), 'prisma', 'portfolio.db');

  try {
    // 1. Asegurar que el directorio existe
    if (!fs.existsSync(persistentDir)) {
      fs.mkdirSync(persistentDir, { recursive: true });
      logger.info('Directorio persistente creado en /app/data');
    }

    // 2. Si la DB no existe en el volumen, copiar la de Git
    if (!fs.existsSync(persistentDbPath)) {
      if (fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, persistentDbPath);
        logger.info('Base de datos inicial copiada desde Git a /app/data');
      } else {
        logger.warn('No se encontró base de datos inicial en prisma/portfolio.db');
      }
    } else {
      logger.info('Usando base de datos persistente existente en /app/data');
    }
  } catch (error) {
    logger.error('Error inicializando base de datos persistente:', error);
  }
};
