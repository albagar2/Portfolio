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

  // Detectar la ruta real que espera Prisma
  const defaultUrl = 'file:/app/data/portfolio.db';
  const dbUrl = process.env.DATABASE_URL || defaultUrl;
  
  // Extraer la ruta del archivo (quitando 'file:')
  const persistentDbPath = dbUrl.replace('file:', '');
  const persistentDir = path.dirname(persistentDbPath);
  const sourceDbPath = path.join(process.cwd(), 'prisma', 'portfolio.db');

  logger.info(`Iniciando chequeo de persistencia. Destino: ${persistentDbPath}`);

  try {
    // 1. Asegurar que el directorio existe (solo si no es /tmp que ya existe)
    if (persistentDir !== '/tmp' && !fs.existsSync(persistentDir)) {
      try {
        fs.mkdirSync(persistentDir, { recursive: true });
        logger.info(`Directorio creado: ${persistentDir}`);
      } catch (e) {
        logger.error(`No se pudo crear el directorio ${persistentDir}. ¿Has montado el volumen en Railway?`);
      }
    }

    // 2. Si la DB no existe en el destino, copiar la de Git
    if (!fs.existsSync(persistentDbPath)) {
      if (fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, persistentDbPath);
        logger.info(`Base de datos inicializada: ${sourceDbPath} -> ${persistentDbPath}`);
      } else {
        logger.error('CRÍTICO: No se encontró portfolio.db en la carpeta prisma/ para inicializar.');
      }
    } else {
      logger.info('Base de datos detectada y lista para usar.');
    }
  } catch (error) {
    logger.error('Error en initializeDatabase:', error);
  }
};
