import { Database } from './infrastructure/database/prisma';
import { logger } from './infrastructure/config/logger';

export const injectMissingFour = async () => {
  const prisma = Database.getInstance();
  try {
    logger.info('Inyectando los 4 proyectos finales para llegar a 13...');

    const missingProjects = [
      {
        title: 'Quantum Stock Analytics',
        title_en: 'Quantum Stock Analytics',
        slug: 'quantum-stock-analytics',
        description: 'Algoritmo de análisis predictivo de mercados financieros con visualización de datos en tiempo real y arquitectura de microservicios.',
        description_en: 'Predictive financial market analysis algorithm with real-time data visualization and microservices architecture.',
        category: 'api',
        featured: false,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/quantum-stock',
        technologies: { create: [{ name: 'Python' }, { name: 'FastAPI' }, { name: 'Redis' }, { name: 'D3.js' }] }
      },
      {
        title: 'Sentinel IoT Hub',
        title_en: 'Sentinel IoT Hub',
        slug: 'sentinel-iot-hub',
        description: 'Centro de mando para la gestión de dispositivos inteligentes con protocolos MQTT y panel de monitorización de red.',
        description_en: 'Command center for smart device management with MQTT protocols and network monitoring panel.',
        category: 'arquitectura',
        featured: false,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/sentinel-iot',
        technologies: { create: [{ name: 'Node.js' }, { name: 'MQTT' }, { name: 'InfluxDB' }, { name: 'Grafana' }] }
      },
      {
        title: 'Vortex Video Stream',
        title_en: 'Vortex Video Stream',
        slug: 'vortex-video-stream',
        description: 'Infraestructura de streaming de vídeo de alta definición con transcodificación en la nube y baja latencia.',
        description_en: 'High-definition video streaming infrastructure with cloud transcoding and low latency.',
        category: 'web',
        featured: false,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/vortex-stream',
        technologies: { create: [{ name: 'WebRTC' }, { name: 'FFmpeg' }, { name: 'React' }, { name: 'AWS' }] }
      },
      {
        title: 'Arkham Security API',
        title_en: 'Arkham Security API',
        slug: 'arkham-security-api',
        description: 'Middleware de seguridad avanzada con cifrado AES-256 y sistema de prevención de ataques de fuerza bruta.',
        description_en: 'Advanced security middleware with AES-256 encryption and brute-force attack prevention system.',
        category: 'api',
        featured: false,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/albagar2/arkham-security',
        technologies: { create: [{ name: 'Go' }, { name: 'JWT' }, { name: 'PostgreSQL' }, { name: 'Docker' }] }
      }
    ];

    for (const proj of missingProjects) {
      // Usamos upsert para no duplicar si por casualidad ya existen
      await prisma.project.upsert({
        where: { slug: proj.slug },
        update: {},
        create: proj
      });
    }

    logger.info('¡Los 4 proyectos adicionales se han inyectado! Total: 13 proyectos.');
  } catch (error) {
    logger.error('Error inyectando los 4 proyectos:', error);
  }
};
