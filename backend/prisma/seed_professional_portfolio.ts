import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const projects = [
    {
      slug: 'control-gasoil-fam',
      longDescription: 'Sistema de gestión logística personal diseñado para centralizar el control de una flota familiar de vehículos. Permite el seguimiento exhaustivo de repostajes, consumos medios, vencimientos de seguros e ITVs mediante un panel intuitivo. La arquitectura se basa en una integración fluida con Google Drive API para almacenamiento persistente y seguro de documentos escaneados.',
      solved: 'Optimización del gasto familiar mediante analítica de datos histórica. Automatización de alertas preventivas para mantenimientos y trámites legales, eliminando el riesgo de multas por olvidos. Centralización de documentación dispersa en un único punto de acceso seguro.',
      challenges: 'Diseño de una interfaz altamente reactiva capaz de procesar cálculos complejos de consumo en tiempo real. La integración con la API de Google requirió un manejo avanzado de OAuth2 y cuotas de servicio. Implementación de un modo offline para permitir el registro de datos en zonas con baja cobertura (gasolineras remotas).',
      evolution: 'Comenzó como una hoja de cálculo compleja en 2022. En 2023 se transformó en una aplicación Android nativa y finalmente en 2024 evolucionó a una plataforma web Full-Stack más robusta.',
      limitations: 'Actualmente requiere una cuenta de Google para el almacenamiento de archivos. La sincronización inicial puede demorar unos segundos dependiendo del volumen de datos históricos en el Drive del usuario.'
    },
    {
      slug: 'gestor-pro-erp',
      longDescription: 'Software de planificación de recursos empresariales (ERP) enfocado en la gestión de proyectos y eficiencia operativa. Incluye módulos de gestión de tareas, control de tiempos (time-tracking), facturación y analítica financiera. Utiliza una arquitectura multi-tenant para permitir que múltiples organizaciones operen de forma aislada pero eficiente.',
      solved: 'Eliminación del ruido comunicativo en equipos mediante un sistema de hilos de discusión por tarea. Aumento de la rentabilidad de proyectos gracias al seguimiento preciso de horas frente a presupuestos. Automatización del flujo de facturación mensual.',
      challenges: 'Implementación de un sistema de permisos granular (RBAC) extremadamente complejo. El motor de analítica financiera requería el manejo de múltiples divisas y tipos de cambio dinámicos. Sincronización en tiempo real de estados de tareas mediante WebSockets para evitar colisiones de edición.',
      evolution: 'Nació como un gestor de tareas simple. Tras recibir feedback de usuarios reales, se expandió a un ERP completo con contabilidad integrada.',
      limitations: 'La versión actual no dispone de aplicación móvil nativa (aunque es 100% responsive). La integración con bancos externos está en fase beta mediante APIs de Open Banking.'
    },
    {
      slug: 'neural-link-guard',
      longDescription: 'Capa de seguridad avanzada para servicios API que utiliza algoritmos de análisis heurístico para detectar y bloquear comportamientos maliciosos en tiempo real. Actúa como un middleware inteligente entre el balanceador de carga y los servidores de aplicaciones, protegiendo contra ataques de fuerza bruta y SQL Injection.',
      solved: 'Protección de infraestructuras críticas contra escaneos de vulnerabilidades automatizados. Reducción drástica del falso positivo en bloqueos de IP mediante perfiles de comportamiento de usuario. Integración "plug & play" para sistemas Express y Flask.',
      challenges: 'Lograr un tiempo de procesamiento inferior a 5ms para cada petición entrante para no penalizar el rendimiento del sistema. Desarrollo de un motor de reglas flexible capaz de actualizarse en caliente sin reiniciar el cortafuegos. Manejo de picos de tráfico de red masivos mediante colas de prioridad.',
      evolution: 'Iniciado como un proyecto de investigación académica sobre heurística. Evolucionó a una herramienta de producción utilizada en entornos de pruebas de seguridad.',
      limitations: 'Requiere una configuración inicial de "fase de aprendizaje" de 48 horas para entrenar el modelo de comportamiento normal del tráfico.'
    },
    {
      slug: 'crypto-terminal-pro',
      longDescription: 'Terminal de trading de alta fidelidad diseñado para traders profesionales que requieren datos de mercado sin latencia. Ofrece visualizaciones avanzadas, gestión de carteras multi-exchange y ejecución de órdenes algorítmicas mediante una interfaz de comando rápida y eficiente.',
      solved: 'Reducción de la latencia en la recepción de datos de mercado mediante el uso de WebSockets binarios. Agregación de liquidez de múltiples fuentes en una única vista consolidada. Gestión de riesgos mediante alertas automáticas de volatilidad.',
      challenges: 'Renderizado de gráficos de velas (candlestick) de alto rendimiento utilizando Canvas API para manejar miles de puntos de datos sin lag. Conexión estable con APIs de diferentes plataformas con protocolos de autenticación variados. Gestión de la consistencia de datos en memoria ante desconexiones de red.',
      evolution: 'De un visualizador de precios simple a un terminal de ejecución completa con estrategias automatizadas programables en TypeScript.',
      limitations: 'Solo compatible con navegadores de escritorio modernos debido a la carga computacional de los gráficos. No recomendado para conexiones de red con alta inestabilidad.'
    },
    {
      slug: 'bio-sync-health',
      longDescription: 'Ecosistema de salud digital que sincroniza datos de múltiples dispositivos wearables para ofrecer una visión holística del rendimiento físico y bienestar. Utiliza GraphQL para facilitar consultas de datos biométricos complejos y ofrece recomendaciones personalizadas basadas en IA.',
      solved: 'Interoperabilidad entre marcas de dispositivos cerrados. Monitorización proactiva de signos vitales para la detección temprana de anomalías. Motivación del usuario mediante gamificación y retos sociales.',
      challenges: 'Normalización de datos provenientes de diferentes sensores con distintas precisiones y frecuencias de muestreo. Protección de datos de salud (GDPR) mediante cifrado de extremo a extremo. Optimización del consumo de batería en la sincronización continua mediante protocolos Bluetooth Low Energy (BLE).',
      evolution: 'Comenzó como un tracker de pasos y hoy es una plataforma médica de grado deportivo profesional.',
      limitations: 'La precisión depende totalmente de la calidad de los sensores de los wearables conectados. El motor de IA requiere al menos 30 días de datos continuos para dar recomendaciones precisas.'
    },
    {
      slug: 'echo-vault-storage',
      longDescription: 'Servicio de almacenamiento en la nube ultra-seguro diseñado para el resguardo de activos digitales sensibles. Implementa una arquitectura "Zero-Knowledge", donde el servidor nunca conoce las claves de cifrado del usuario, garantizando privacidad absoluta incluso ante brechas de seguridad físicas.',
      solved: 'Prevención de filtraciones de datos corporativos sensibles. Cumplimiento con las normativas internacionales de privacidad más estrictas. Compartición segura de archivos mediante enlaces con caducidad y firma digital.',
      challenges: 'Implementación de cifrado AES-256 en el lado del cliente (browser) para asegurar que nada salga del dispositivo sin cifrar. Desarrollo de un sistema de fragmentación de archivos para mejorar la velocidad de subida. Gestión de claves maestras sin capacidad de recuperación en el servidor (responsabilidad total del usuario).',
      evolution: 'Nacido como un proyecto interno para una firma legal. Se convirtió en una solución SaaS escalable.',
      limitations: 'Si el usuario pierde su clave maestra, es técnicamente imposible recuperar los datos (by-design). La velocidad de carga es ligeramente menor debido al proceso de cifrado intensivo en el cliente.'
    },
    {
      slug: 'tanatorio-tv',
      longDescription: 'Plataforma de Digital Signage especializada para el sector funerario. Gestiona el ciclo de vida completo de la información de despedida: de la administración a pantallas de gran formato, garantizando una presentación sobria, respetuosa y automatizada de las esquelas y servicios.',
      solved: 'Modernización de la comunicación en salas de duelo. Reducción del tiempo administrativo para la actualización de turnos de velatorio. Eliminación de errores en la información mostrada mediante validación centralizada.',
      challenges: 'Desarrollo de un reproductor web capaz de funcionar 24/7 en hardware limitado (Smart TVs, Raspberry Pi) sin degradación de memoria. Sistema de actualización remota de contenidos sin intervención manual. Optimización de assets gráficos para carga instantánea bajo cualquier condición de red.',
      evolution: 'De un sistema de diapositivas estáticas a una plataforma web dinámica con transiciones cinematográficas y gestión multi-sede.',
      limitations: 'Optimizado específicamente para resoluciones 16:9 y 4K. Requiere conexión permanente a internet para actualizaciones de última hora (aunque tiene caché offline).'
    }
  ];

  console.log('🌱 Optimizando portafolio para empresas...');

  for (const project of projects) {
    console.log(`- Actualizando: ${project.slug}`);
    await prisma.project.update({
      where: { slug: project.slug },
      data: project
    });
  }

  console.log('✅ Portafolio profesionalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en la optimización:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
