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

  // 7. Proyecto de Referencia (Control Gasoil)
  await prisma.project.create({
    data: {
      title: 'Control Gasoil Familiar',
      slug: 'control-gasoil-fam',
      description: 'Sistema completo de gestión para mantenimientos y repostajes familiares con integración en Google Drive.',
      category: 'web',
      featured: true,
      status: 'PUBLISHED',
      technologies: {
        create: [{ name: 'React' }, { name: 'Node.js' }, { name: 'PostgreSQL' }]
      }
    }
  });

  console.log('🎉 ¡Sincronización Total Completada! Tu portfolio refleja ahora tu CV real.');
}

main()
  .catch((e) => {
    console.error('❌ Error en sincronización:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
