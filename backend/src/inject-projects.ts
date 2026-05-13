import { Database } from './infrastructure/database/prisma';
import { logger } from './infrastructure/config/logger';

export const injectProjectsSafe = async () => {
  const prisma = Database.getInstance();
  try {
    const projectCount = await prisma.project.count();
    
    // Si ya hay 9 o más proyectos, asumimos que ya se inyectaron
    if (projectCount >= 9) {
      logger.info('Los proyectos ya están inyectados. Saltando...');
      return;
    }

    logger.info('Inyectando los 9 proyectos de demostración sin tocar el perfil...');

    // Limpiamos SOLO los proyectos
    await prisma.projectTech.deleteMany({});
    await prisma.project.deleteMany({});

    const exampleProjects = [
      {
        title: 'Family Drive',
        title_en: 'Family Drive',
        slug: 'control-gasoil-fam',
        description: 'Sistema completo de gestión integral para vehículos, repostajes, mantenimientos y seguros en entornos familiares con integración en Google Drive.',
        description_en: 'Comprehensive management system for vehicles, refueling, maintenance, and insurance in family environments with Google Drive integration.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/controlGasoilFamiliar',
        liveUrl: 'https://familydrive.onrender.com',
        manual: '### Manual de Family Drive\n\n1. **Registro de Vehículos**: Añade los vehículos de la familia desde el panel de control.\n2. **Gestión deRepostajes**: Registra cada carga de combustible para calcular el consumo medio automáticamente.\n3. **Mantenimiento**: Configura alertas para cambios de aceite, revisiones e ITV.\n4. **Seguros**: Sube copias digitales de tus pólizas para tenerlas siempre a mano.\n5. **Sincronización**: Todos los datos se respaldan en Google Drive mediante la API oficial.',
        technologies: { create: [{ name: 'Angular' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'Google Drive API' }] }
      },
      {
        title: 'ALBA-OS Control Center',
        title_en: 'ALBA-OS Control Center',
        slug: 'alba-os-control-center',
        description: 'Interfaz de mando de alta seguridad para la monitorización de servicios cloud en tiempo real bajo estética Command Line y arquitectura hexagonal.',
        description_en: 'High-security command interface for real-time cloud service monitoring with Command Line aesthetics and hexagonal architecture.',
        category: 'arquitectura',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/alba-os-control-center',
        manual: '### Manual de ALBA-OS\n\nEste centro de control permite:\n- **Monitoreo Real-Time**: Visualiza el estado de tus servicios en la consola.\n- **Comandos**: Interactúa con el sistema mediante una interfaz de línea de comandos (CLI) web.\n- **Logs**: Revisa los registros de actividad filtrados por severidad.\n- **Arquitectura**: Basado en arquitectura hexagonal para facilitar el escalado y testing.',
        technologies: { create: [{ name: 'TypeScript' }, { name: 'React' }, { name: 'Framer Motion' }, { name: 'Prisma' }] }
      },
      {
        title: 'GestorPro ERP',
        title_en: 'GestorPro ERP',
        slug: 'gestor-pro-erp',
        description: 'Sistema empresarial avanzado para la gestión de proyectos, tareas y analítica financiera con arquitectura multi-tenant y diseño Glassmorphism.',
        description_en: 'Advanced enterprise system for project and task management and financial analytics with multi-tenant architecture and Glassmorphism design.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/gestorDeProyectos',
        technologies: { create: [{ name: 'React' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'Socket.io' }, { name: 'Docker' }] }
      },
      {
        title: 'Neural Link Guard',
        title_en: 'Neural Link Guard',
        slug: 'neural-link-guard',
        description: 'Sistema de seguridad perimetral para APIs REST con detección de intrusiones mediante análisis heurístico y protección OWASP Top 10.',
        description_en: 'Perimeter security system for REST APIs with intrusion detection via heuristic analysis and OWASP Top 10 protection.',
        category: 'api',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/neural-link-guard',
        technologies: { create: [{ name: 'Express' }, { name: 'Python' }, { name: 'Docker' }, { name: 'Zod' }] }
      },
      {
        title: 'Crypto Terminal Pro',
        title_en: 'Crypto Terminal Pro',
        slug: 'crypto-terminal-pro',
        description: 'Dashboard de trading de alta fidelidad con actualizaciones de mercado vía WebSockets de baja latencia y visualización avanzada.',
        description_en: 'High-fidelity trading dashboard with low-latency market updates via WebSockets and advanced visualization.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/crypto-terminal-pro',
        technologies: { create: [{ name: 'Next.js' }, { name: 'Socket.io' }, { name: 'Tailwind' }, { name: 'Recharts' }] }
      },
      {
        title: 'Bio-Sync Health Tech',
        title_en: 'Bio-Sync Health Tech',
        slug: 'bio-sync-health',
        description: 'Aplicación móvil para la sincronización de datos biométricos y análisis de rendimiento deportivo en tiempo real.',
        description_en: 'Mobile application for biometric data synchronization and real-time sports performance analysis.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/bio-sync-health',
        technologies: { create: [{ name: 'React Native' }, { name: 'Firebase' }, { name: 'GraphQL' }] }
      },
      {
        title: 'Echo Vault Storage',
        title_en: 'Echo Vault Storage',
        slug: 'echo-vault-storage',
        description: 'Solución de almacenamiento cifrado punto a punto para activos digitales de alta sensibilidad con protocolos de seguridad bancaria.',
        description_en: 'End-to-end encrypted storage solution for high-sensitivity digital assets with banking security protocols.',
        category: 'api',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/echo-vault-storage',
        technologies: { create: [{ name: 'Go' }, { name: 'PostgreSQL' }, { name: 'AWS S3' }] }
      },
      {
        title: 'Esquelas TV',
        title_en: 'Esquelas TV',
        slug: 'tanatorio-tv',
        description: 'Aplicación para gestionar y mostrar esquelas en pantallas de TV de tanatorios, con panel de administración y visualización dinámica optimizada para Digital Signage.',
        description_en: 'Application for managing and displaying obituaries on mortuary TV screens, with an administration panel and dynamic visualization optimized for Digital Signage.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/tanatorio-tv',
        liveUrl: 'https://esquelastv.up.railway.app',
        manual: '### Manual de Esquelas TV\n\n1. **Administración**: Accede al panel para crear nuevas esquelas con foto y detalles.\n2. **Asignación de Salas**: Indica en qué sala se velará al difunto.\n3. **Visualización**: La pantalla de TV se actualiza automáticamente (Polling) mostrando la esquela activa.\n4. **Personalización**: Permite elegir temas visuales para las esquelas.',
        technologies: { create: [{ name: 'Node.js' }, { name: 'Express' }, { name: 'SQLite' }, { name: 'Vanilla JS' }] }
      },
      {
        title: 'Comfort Food',
        title_en: 'Comfort Food',
        slug: 'comfort-food',
        description: 'Plataforma de gestión de restauración y pedidos a domicilio con sistema de administración, menús dinámicos y perfiles de usuario diferenciados.',
        description_en: 'Restaurant management and food delivery platform with an administration system, dynamic menus, and differentiated user profiles.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/comfort-food',
        technologies: { create: [{ name: 'Vue.js' }, { name: 'Laravel' }, { name: 'MySQL' }, { name: 'Stripe' }] }
      }
    ];

    for (const proj of exampleProjects) {
      await prisma.project.create({ data: proj });
    }

    logger.info('¡Los 9 proyectos se han inyectado correctamente!');
  } catch (error) {
    logger.error('Error inyectando proyectos:', error);
  }
};
