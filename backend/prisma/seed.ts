import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

async function main() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'albagarcialopez39@gmail.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '4lb4-G4rc14';
  const ADMIN_NAME = 'Alba García López';

  console.log('🌱 Sincronizando Usuarios Core...');

  // 1. Usuarios Core
  const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, password: hashedAdminPassword },
    create: { email: ADMIN_EMAIL, password: hashedAdminPassword, name: ADMIN_NAME, role: 'ADMIN' },
  });

  // Usuario Invitado (GUEST) para la Demo
  const guestPassword = await bcrypt.hash('guest1234', 12);
  await prisma.user.upsert({
    where: { email: 'guest@portfolio.demo' },
    update: { password: guestPassword },
    create: { email: 'guest@portfolio.demo', password: guestPassword, name: 'Guest User', role: 'GUEST' },
  });

  console.log('✅ Usuarios sincronizados');

  // 2. Comprobación de seguridad: Si ya hay proyectos o experiencias, no tocamos nada de contenido
  const projectCount = await prisma.project.count();
  const experienceCount = await prisma.experience.count();
  
  if (projectCount > 0 || experienceCount > 0) {
    console.log('ℹ️ La base de datos ya tiene contenido. No se regenerará el portfolio, pero los usuarios se han actualizado.');
    return;
  }

  // 3. Perfil Auténtico
  const profile = await prisma.profile.findFirst();
  const profileData = {
    name: ADMIN_NAME,
    title: 'Desarrolladora Web Full-Stack',
    title_en: 'Full-Stack Web Developer',
    bio: 'Desarrolladora en formación con gran pasión por crear aplicaciones web modernas, funcionales y eficientes. Especializada en el ecosistema Frontend y Backend con conocimientos en Java, SQL y redes. Persona proactiva, organizada y con gran capacidad para el trabajo en equipo. Poseo carnet de conducir con disponibilidad total para desplazarme.',
    bio_en: 'Trilingual developer with a passion for building modern, functional, and efficient web applications. Specialized in Frontend and Backend ecosystems with strong knowledge in Java, SQL, and networking. Proactive, organized, and a team player with full availability for travel.',
    email: ADMIN_EMAIL,
    phone: '+34 606 99 09 74',
    location: 'Estepona, España (Disponibilidad para viajar)',
    githubUrl: 'https://github.com/albagar2',
    linkedinUrl: 'https://www.linkedin.com/in/alba-garcía-lópez-355922297?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    twitterUrl: 'https://twitter.com/albagarcia',
  };

  if (profile) {
    await prisma.profile.update({ where: { id: profile.id }, data: profileData });
  } else {
    await prisma.profile.create({ data: profileData });
  }

  // 4. Experiencia Real (según PDF)
  const experiences = [
    {
      company: 'Inma Suanes Diseño y Marketing',
      position: 'Desarrolladora Web',
      position_en: 'Web Developer',
      description: 'Creación y mantenimiento de aplicaciones web modernas. Aplicación de conocimientos en HTML, CSS y JavaScript para proyectos de marketing digital.',
      description_en: 'Creation and maintenance of modern web applications. Applying HTML, CSS, and JavaScript knowledge for digital marketing projects.',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-06-30'),
      current: false,
      location: 'Córdoba, España',
    },
    {
      company: 'Peluqueria Coketa',
      position: 'Community Manager',
      position_en: 'Social Media Manager',
      description: 'Gestión de redes sociales y comunicación digital para el negocio, mejorando la presencia online y captación de clientes.',
      description_en: 'Social media management and digital communication for the business, improving online presence and customer acquisition.',
      startDate: new Date('2012-01-01'),
      endDate: new Date('2014-12-31'),
      current: false,
      location: 'España',
    }
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  // 5. Educación Real (según PDF)
  const educations = [
    {
      institution: 'IES Marqués de Comares',
      degree: 'Técnico Superior en Desarrollo de Aplicaciones Web',
      degree_en: 'Higher Technician in Web Application Development',
      field: 'Informática y Comunicaciones',
      field_en: 'Computer Science and Communications',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2025-06-30'),
      current: false,
      description: 'Formación intensiva en lenguajes de programación, bases de datos SQL/NoSQL y metodologías de desarrollo ágil.',
      description_en: 'Intensive training in programming languages, SQL/NoSQL databases, and agile development methodologies.',
    },
    {
      institution: 'IES Nuevo Scala',
      degree: 'Bachillerato de Ciencias Sociales',
      degree_en: 'High School Diploma in Social Sciences',
      field: 'Ciencias Sociales',
      field_en: 'Social Sciences',
      startDate: new Date('2021-09-01'),
      endDate: new Date('2023-06-30'),
      current: false,
      description: 'Formación base enfocada en el análisis y comprensión de sistemas sociales y económicos.',
      description_en: 'Core training focused on the analysis and understanding of social and economic systems.',
    }
  ];

  for (const edu of educations) {
    await prisma.education.create({ data: edu });
  }

  // 6. Skills Técnicos (según PDF)
  const skills = [
    { name: 'Java', category: 'Backend', level: 85 },
    { name: 'HTML5/CSS3', category: 'Frontend', level: 90 },
    { name: 'MySQL / MongoDB', category: 'Database', level: 80 },
    { name: 'Git (GitHub/GitLab)', category: 'Tools', level: 85 },
    { name: 'Cisco Networking', category: 'Networks', level: 75 }
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  // 7. Proyectos de Referencia (Sistemas Core)
  await prisma.projectTech.deleteMany({});
  await prisma.project.deleteMany({});

  const exampleProjects = [
    {
      title: 'Control Gasoil Familiar',
      title_en: 'Family Gasoil Control',
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
      description_en: 'Restaurant management and home delivery platform with administration system, dynamic menus, and differentiated user profiles.',
      category: 'web',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/ComfortFood.git',
      technologies: { create: [{ name: 'Laravel' }, { name: 'Livewire' }, { name: 'Flux UI' }, { name: 'PHP' }, { name: 'MySQL' }] }
    }
  ];

  for (const projData of exampleProjects) {
    await prisma.project.create({ data: projData });
  }

  // 8. Blog Posts de Ejemplo (Visualización Técnica)
  await prisma.postTag.deleteMany({});
  await prisma.post.deleteMany({});
  
  const user = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
  if (user) {
    const examplePosts = [
      {
        title: 'Arquitectura de Microservicios en Node.js',
        title_en: 'Microservices Architecture in Node.js',
        slug: 'arquitectura-microservicios-nodejs',
        excerpt: 'Explorando cómo escalar sistemas distribuidos mediante el uso de patrones de diseño avanzados.',
        excerpt_en: 'Exploring how to scale distributed systems through the use of advanced design patterns.',
        content: `# Introducción a Microservicios\n\nLos microservicios permiten que los equipos desarrollen y escalen servicios de forma independiente.\n\n## Beneficios Clave\n\n*   **Escalabilidad**: Solo escala lo que necesitas.\n*   **Aislamiento**: Fallos contenidos.\n\n### Implementación Local\n\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'UP', node: process.pid });\n});\n\napp.listen(3000);\n\`\`\`\n\n**Conclusión**: Ideal para sistemas complejos.`,
        content_en: `# Introduction to Microservices\n\nMicroservices allow teams to develop and scale services independently.\n\n## Key Benefits\n\n*   **Scalability**: Only scale what you need.\n*   **Isolation**: Contained failures.\n\n### Local Implementation\n\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'UP', node: process.pid });\n});\n\napp.listen(3000);\n\`\`\`\n\n**Conclusion**: Ideal for complex systems.`,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        tags: { create: [{ name: 'backend' }, { name: 'node' }] }
      },
      {
        title: 'Domina Framer Motion en React 18',
        title_en: 'Mastering Framer Motion in React 18',
        slug: 'domina-framer-motion-react-18',
        excerpt: 'Cómo crear interfaces fluidas y animaciones cinemáticas de alto impacto.',
        excerpt_en: 'How to create fluid interfaces and high-impact cinematic animations.',
        content: `# Animaciones Premium\n\nFramer Motion es el estándar para animaciones en React.\n\n## Core Concepts\n\n1.  **Animate**: El estado final.\n2.  **Initial**: El estado de entrada.\n\n### Ejemplo de Stagger\n\n\`\`\`typescript\nconst variants = {\n  hidden: { opacity: 0 },\n  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }\n};\n\`\`\`\n\nDiseña experiencias que dejen huella.`,
        content_en: `# Premium Animations\n\nFramer Motion is the standard for animations in React.\n\n## Core Concepts\n\n1.  **Animate**: The final state.\n2.  **Initial**: The entry state.\n\n### Stagger Example\n\n\`\`\`typescript\nconst variants = {\n  hidden: { opacity: 0 },\n  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }\n};\n\`\`\`\n\nDesign experiences that leave a mark.`,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        tags: { create: [{ name: 'frontend' }, { name: 'ui' }] }
      },
      {
        title: 'Clean Architecture en Node.js',
        title_en: 'Clean Architecture in Node.js',
        slug: 'clean-architecture-nodejs',
        excerpt: 'Descubre cómo organizar tus proyectos para que sean escalables, mantenibles y fáciles de testear.',
        excerpt_en: 'Discover how to organize your projects to be scalable, maintainable, and easy to test.',
        content: `# Arquitectura Limpia\n\nLa Clean Architecture separa las reglas de negocio del framework y los detalles técnicos.\n\n## Capas Principales\n\n1. **Entidades**: Lógica de negocio pura.\n2. **Casos de Uso**: Orquestación de la lógica.\n3. **Adaptadores**: Puentes con el mundo exterior (API, DB).\n\nOrganiza tu código hoy para el éxito del mañana.`,
        content_en: `# Clean Architecture\n\nClean Architecture separates business rules from frameworks and technical details.\n\n## Main Layers\n\n1. **Entities**: Pure business logic.\n2. **Use Cases**: Orchestration of logic.\n3. **Adapters**: Bridges to the outside world (API, DB).\n\nOrganize your code today for tomorrow's success.`,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        tags: { create: [{ name: 'arquitectura' }, { name: 'backend' }] }
      },
      {
        title: 'El Futuro del Desarrollo con IA',
        title_en: 'The Future of Development with AI',
        slug: 'futuro-desarrollo-ia',
        excerpt: '¿Cómo están cambiando las herramientas de IA generativa la forma en que escribimos código?',
        excerpt_en: 'How are generative AI tools changing the way we write code?',
        content: `# IA y Desarrollo\n\nLas herramientas como Copilot y agentes autónomos están transformando nuestra profesión.\n\n## Tendencias Clave\n\n* **Pair Programming** aumentado.\n* **Generación de código** repetitivo.\n* **Refactorización automática**.\n\nNo es el fin del programador, es el inicio de un super-programador.`,
        content_en: `# AI and Development\n\nTools like Copilot and autonomous agents are transforming our profession.\n\n## Key Trends\n\n* Augmented **Pair Programming**.\n* Repetitive **code generation**.\n* **Automatic refactoring**.\n\nIt's not the end of the programmer, it's the start of a super-programmer.`,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        tags: { create: [{ name: 'ia' }, { name: 'productividad' }] }
      }
    ];

    for (const p of examplePosts) {
      const existingPost = await prisma.post.findUnique({ where: { slug: p.slug } });
      if (!existingPost) {
        await prisma.post.create({ data: p });
        console.log(`📝 Artículo añadido: ${p.title}`);
      }
    }
  }

  console.log('🎉 ¡Sincronización Total Completada!');
  require('fs').writeFileSync('/tmp/seed_done.txt', 'DONE at ' + new Date().toISOString());
}


main()
  .catch((e) => {
    console.error('❌ Error en sincronización:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
