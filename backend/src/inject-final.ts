/**
 * inject-final.ts
 * Este script se encarga de inyectar 4 proyectos finales/reales (ej. LinguaCore, BulkQuest)
 * en la base de datos. Utiliza una operación de upsert (actualizar/crear) para evitar
 * duplicidad si ya se ejecutó anteriormente.
 */
import { Database } from './infrastructure/database/prisma';
import { logger } from './infrastructure/config/logger';

/**
 * Función asíncrona para inyectar los proyectos reales del usuario a la base de datos.
 */
export const injectMissingFour = async () => {
  const prisma = Database.getInstance();
  try {
    logger.info('Inyectando tus proyectos reales (LinguaCore, BulkQuest, etc)...');

    const myRealProjects = [
      {
        title: 'LinguaCore AI',
        title_en: 'LinguaCore AI',
        slug: 'linguacore-ai',
        description: 'Plataforma avanzada de aprendizaje de idiomas con simulaciones de entrevistas C2 y feedback en tiempo real mediante IA.',
        description_en: 'Advanced language learning platform with C2 interview simulations and real-time AI feedback.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/linguacore',
        technologies: { create: [{ name: 'React' }, { name: 'Node.js' }, { name: 'OpenAI API' }, { name: 'Tailwind' }] }
      },
      {
        title: 'BulkQuest Engine',
        title_en: 'BulkQuest Engine',
        slug: 'bulk-quest-engine',
        description: 'Sistema especializado en la gestión y carga masiva de baterías de preguntas para oposiciones y exámenes técnicos.',
        description_en: 'Specialized system for bulk management and uploading of question banks for competitive and technical exams.',
        category: 'api',
        featured: false,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/bulk-quest',
        technologies: { create: [{ name: 'Express' }, { name: 'PostgreSQL' }, { name: 'ExcelJS' }, { name: 'Zod' }] }
      },
      {
        title: 'FamilyGasto Premium',
        title_en: 'FamilyGasto Premium',
        slug: 'family-gasto-premium',
        description: 'Ecosistema de gestión financiera familiar multi-propiedad con seguimiento de gastos de combustible y sincronización en tiempo real.',
        description_en: 'Multi-property family financial management ecosystem with fuel expense tracking and real-time synchronization.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/family-gasto',
        technologies: { create: [{ name: 'Next.js' }, { name: 'Prisma' }, { name: 'Chart.js' }, { name: 'Auth.js' }] }
      },
      {
        title: 'Tanatorio TV Admin',
        title_en: 'Tanatorio TV Admin',
        slug: 'tanatorio-tv-admin',
        description: 'Panel administrativo para la gestión dinámica de esquelas y anuncios en pantallas digitales de salas de tanatorios.',
        description_en: 'Administrative panel for dynamic management of obituaries and announcements on digital screens in funeral parlors.',
        category: 'arquitectura',
        featured: false,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/tanatorio-tv',
        technologies: { create: [{ name: 'Socket.io' }, { name: 'TypeScript' }, { name: 'SQLite' }, { name: 'PM2' }] }
      }
    ];

    for (const proj of myRealProjects) {
      await prisma.project.upsert({
        where: { slug: proj.slug },
        update: {},
        create: proj
      });
    }

    logger.info('¡Tus proyectos reales han sido inyectados con éxito!');
  } catch (error) {
    logger.error('Error inyectando tus proyectos:', error);
  }
};
