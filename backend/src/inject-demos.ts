import { Database } from './infrastructure/database/prisma';
import { logger } from './infrastructure/config/logger';

export async function injectDemos() {
  const db = Database.getInstance();
  try {
    const demoCount = await db.demo.count();
    if (demoCount > 0) {
      logger.info('ℹ️ Demos ya existen en la base de datos.');
      return;
    }

    const demos = [
      {
        title: 'Batería de Preguntas',
        codeName: 'BETA_TEST',
        description: 'Aplicación interactiva de evaluación con múltiples categorías.',
        url: 'http://localhost:5173',
        themeColor: 'cyber-blue',
        btnText: '[ Iniciar Demo ]',
        order: 0,
        status: 'ACTIVE'
      },
      {
        title: 'Gasoil Familiar',
        codeName: 'STANDBY',
        description: 'App de control de gastos de combustible y mantenimientos vehiculares del núcleo familiar.',
        url: 'http://localhost:5174',
        themeColor: 'cyber-blue',
        btnText: '[ Conectar P.5174 ]',
        order: 1,
        status: 'INACTIVE'
      },
      {
        title: 'GestorPro',
        codeName: 'DOCKER-DEPLOY',
        description: 'ERP/CRM de gestión de proyectos Full Stack con despliegues automatizados y containers.',
        url: 'http://localhost:3001',
        themeColor: 'cyber-purple',
        btnText: '[ Conectar P.3001 ]',
        order: 2,
        status: 'ACTIVE'
      },
      {
        title: 'Bio Sync Health',
        codeName: 'OPERATIVO',
        description: 'Monitor de constantes vitales biométricas y tracking de salud sincronizado.',
        url: 'http://localhost:5175',
        themeColor: 'cyber-green',
        btnText: '[ Enlace Vite ]',
        order: 3,
        status: 'ACTIVE'
      },
      {
        title: 'Neural Link Guard',
        codeName: 'OPERATIVO',
        description: 'Sistema ciberseguridad neuro-conectada de prevención de intrusos.',
        url: 'http://localhost:5176',
        themeColor: 'cyber-green',
        btnText: '[ Enlace Vite ]',
        order: 4,
        status: 'ACTIVE'
      },
      {
        title: 'ALBA-OS (Portfolio)',
        codeName: 'CORE_SYSTEM',
        description: 'Centro de operaciones principal que hospeda tu currículum, trayectoria y base de datos maestra.',
        url: 'http://localhost:3000',
        themeColor: 'cyber-purple',
        btnText: '[ C-3000 / MAIN ]',
        order: 5,
        status: 'ACTIVE'
      }
    ];

    for (const demo of demos) {
      await db.demo.create({ data: demo });
    }
    logger.info('✅ Demos iniciales inyectadas correctamente.');
  } catch (error) {
    logger.error('❌ Error inyectando demos:', error);
  }
}
