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

  console.log('🌱 Sincronizando Portfolio con el CV de Alba...');

  // 1. Limpieza de datos genéricos
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.projectTech.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});

  // 2. Usuario Core
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, password: hashedPassword },
    create: { email: ADMIN_EMAIL, password: hashedPassword, name: ADMIN_NAME, role: 'ADMIN' },
  });

  // 3. Perfil Auténtico
  const profile = await prisma.profile.findFirst();
  const profileData = {
    name: ADMIN_NAME,
    title: 'Desarrolladora Web Full-Stack',
    bio: 'Desarrolladora en formación con gran pasión por crear aplicaciones web modernas, funcionales y eficientes. Especializada en el ecosistema Frontend y Backend con conocimientos en Java, SQL y redes. Persona proactiva, organizada y con gran capacidad para el trabajo en equipo. Poseo carnet de conducir con disponibilidad total para desplazarme.',
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
      description: 'Creación y mantenimiento de aplicaciones web modernas. Aplicación de conocimientos en HTML, CSS y JavaScript para proyectos de marketing digital.',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-06-30'),
      current: false,
      location: 'Córdoba, España',
    },
    {
      company: 'Peluqueria Coketa',
      position: 'Community Manager',
      description: 'Gestión de redes sociales y comunicación digital para el negocio, mejorando la presencia online y captación de clientes.',
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
      field: 'Informática y Comunicaciones',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2025-06-30'),
      current: false,
      description: 'Formación intensiva en lenguajes de programación, bases de datos SQL/NoSQL y metodologías de desarrollo ágil.',
    },
    {
      institution: 'IES Nuevo Scala',
      degree: 'Bachillerato de Ciencias Sociales',
      field: 'Ciencias Sociales',
      startDate: new Date('2021-09-01'),
      endDate: new Date('2023-06-30'),
      current: false,
      description: 'Formación base enfocada en el análisis y comprensión de sistemas sociales y económicos.',
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
      slug: 'control-gasoil-fam',
      description: 'Sistema completo de gestión integral para vehículos, repostajes, mantenimientos y seguros en entornos familiares con integración en Google Drive.',
      category: 'web',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/controlGasoilFamiliar',
      liveUrl: 'https://familydrive.onrender.com',
      technologies: { create: [{ name: 'Angular' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'Google Drive API' }] }
    },
    {
      title: 'ALBA-OS Control Center',
      slug: 'alba-os-control-center',
      description: 'Interfaz de mando de alta seguridad para la monitorización de servicios cloud en tiempo real bajo estética Command Line y arquitectura hexagonal.',
      category: 'arquitectura',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/alba-os-control-center',
      technologies: { create: [{ name: 'TypeScript' }, { name: 'React' }, { name: 'Framer Motion' }, { name: 'Prisma' }] }
    },
    {
      title: 'GestorPro ERP',
      slug: 'gestor-pro-erp',
      description: 'Sistema empresarial avanzado para la gestión de proyectos, tareas y analítica financiera con arquitectura multi-tenant y diseño Glassmorphism.',
      category: 'web',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/gestorDeProyectos',
      technologies: { create: [{ name: 'React' }, { name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'Socket.io' }, { name: 'Docker' }] }
    },
    {
      title: 'Neural Link Guard',
      slug: 'neural-link-guard',
      description: 'Sistema de seguridad perimetral para APIs REST con detección de intrusiones mediante análisis heurístico y protección OWASP Top 10.',
      category: 'api',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/neural-link-guard',
      technologies: { create: [{ name: 'Express' }, { name: 'Python' }, { name: 'Docker' }, { name: 'Zod' }] }
    },
    {
      title: 'Crypto Terminal Pro',
      slug: 'crypto-terminal-pro',
      description: 'Dashboard de trading de alta fidelidad con actualizaciones de mercado vía WebSockets de baja latencia y visualización avanzada.',
      category: 'web',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/crypto-terminal-pro',
      technologies: { create: [{ name: 'Next.js' }, { name: 'Socket.io' }, { name: 'Tailwind' }, { name: 'Recharts' }] }
    },
    {
      title: 'Bio-Sync Health Tech',
      slug: 'bio-sync-health',
      description: 'Aplicación móvil para la sincronización de datos biométricos y análisis de rendimiento deportivo en tiempo real.',
      category: 'web',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/bio-sync-health',
      technologies: { create: [{ name: 'React Native' }, { name: 'Firebase' }, { name: 'GraphQL' }] }
    },
    {
      title: 'Echo Vault Storage',
      slug: 'echo-vault-storage',
      description: 'Solución de almacenamiento cifrado punto a punto para activos digitales de alta sensibilidad con protocolos de seguridad bancaria.',
      category: 'api',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/echo-vault-storage',
      technologies: { create: [{ name: 'Go' }, { name: 'PostgreSQL' }, { name: 'AWS S3' }] }
    },
    {
      title: 'Esquelas TV',
      slug: 'tanatorio-tv',
      description: 'Aplicación para gestionar y mostrar esquelas en pantallas de TV de tanatorios, con panel de administración y visualización dinámica optimizada para Digital Signage.',
      category: 'web',
      featured: true,
      status: 'PUBLISHED',
      githubUrl: 'https://github.com/albagar2/tanatorio-tv',
      liveUrl: 'https://esquelastv.up.railway.app',
      technologies: { create: [{ name: 'Node.js' }, { name: 'Express' }, { name: 'SQLite' }, { name: 'Vanilla JS' }] }
    },
    {
      title: 'Comfort Food',
      slug: 'comfort-food',
      description: 'Plataforma de gestión de restauración y pedidos a domicilio con sistema de administración, menús dinámicos y perfiles de usuario diferenciados.',
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
        slug: 'arquitectura-microservicios-nodejs',
        excerpt: 'Explorando cómo escalar sistemas distribuidos mediante el uso de patrones de diseño avanzados.',
        content: `# Introducción a Microservicios\n\nLos microservicios permiten que los equipos desarrollen y escalen servicios de forma independiente.\n\n## Beneficios Clave\n\n*   **Escalabilidad**: Solo escala lo que necesitas.\n*   **Aislamiento**: Fallos contenidos.\n\n### Implementación Local\n\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'UP', node: process.pid });\n});\n\napp.listen(3000);\n\`\`\`\n\n**Conclusión**: Ideal para sistemas complejos.`,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        tags: { create: [{ name: 'backend' }, { name: 'node' }] }
      },
      {
        title: 'Domina Framer Motion en React 18',
        slug: 'domina-framer-motion-react-18',
        excerpt: 'Cómo crear interfaces fluidas y animaciones cinemáticas de alto impacto.',
        content: `# Animaciones Premium\n\nFramer Motion es el estándar para animaciones en React.\n\n## Core Concepts\n\n1.  **Animate**: El estado final.\n2.  **Initial**: El estado de entrada.\n\n### Ejemplo de Stagger\n\n\`\`\`typescript\nconst variants = {\n  hidden: { opacity: 0 },\n  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }\n};\n\`\`\`\n\nDiseña experiencias que dejen huella.`,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        tags: { create: [{ name: 'frontend' }, { name: 'ui' }] }
      }
    ];

    for (const p of examplePosts) {
      await prisma.post.create({ data: p });
    }
  }

  console.log('🎉 ¡Sincronización Total Completada! Tu portfolio refleja ahora tu CV real.');
  require('fs').writeFileSync('seed_done.txt', 'DONE at ' + new Date().toISOString());
}

main()
  .catch((e) => {
    console.error('❌ Error en sincronización:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
