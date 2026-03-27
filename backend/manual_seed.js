const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const p = await prisma.project.upsert({
      where: { slug: 'comfort-food' },
      update: {
        title: 'Comfort Food',
        description: 'Plataforma de gestión de restauración y pedidos a domicilio con sistema de administración, menús dinámicos y perfiles de usuario diferenciados.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/matildejb/ProyectoFinal2DAW',
      },
      create: {
        title: 'Comfort Food',
        slug: 'comfort-food',
        description: 'Plataforma de gestión de restauración y pedidos a domicilio con sistema de administración, menús dinámicos y perfiles de usuario diferenciados.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/matildejb/ProyectoFinal2DAW',
      }
    });
    console.log('RE-SEED SUCCESS:', p.slug);
  } catch (e) {
    console.error('RE-SEED ERROR:', e);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}
main();
