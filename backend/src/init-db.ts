/**
 * init-db.ts
 * Este archivo provee un script para inicializar la base de datos de SQLite en producción.
 * Asegura que la base de datos se persista correctamente (por ejemplo, en un volumen de Railway)
 * o, en caso de no existir, copia un archivo de base de datos predeterminado para su uso.
 */
import fs from 'fs';
import path from 'path';
import { logger } from './infrastructure/config/logger';

/**
 * Script de inicialización de Base de Datos
 * Asegura que la base de datos persista en el volumen de Railway
 * pero se inicialice con los datos de Git si es necesario.
 */
export const initializeDatabase = () => {
  // Comprobamos si el entorno es producción
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) return; // Si no estamos en producción, terminamos temprano

  // Detectar la ruta real que espera Prisma para la base de datos

  const defaultUrl = 'file:/app/data/portfolio.db';
  const dbUrl = process.env.DATABASE_URL || defaultUrl;
  
  // Extraer la ruta del archivo (quitando 'file:')
  const persistentDbPath = dbUrl.replace('file:', '');
  const persistentDir = path.dirname(persistentDbPath);
  
  // Intentar encontrar la semilla en varias rutas posibles
  const sourceDbPath = fs.existsSync(path.join(process.cwd(), 'prisma', 'portfolio.db'))
    ? path.join(process.cwd(), 'prisma', 'portfolio.db')
    : path.join(__dirname, '..', 'prisma', 'portfolio.db');

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
