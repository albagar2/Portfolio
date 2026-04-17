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
        challenges: 'Uno de los mayores retos fue la sincronización en tiempo real del estado de los pedidos entre la cocina y los repartidores, además de gestionar la persistencia de carritos abandonados.',
        solved: 'Implementé un sistema de WebSockets para notificaciones instantáneas y utilicé Redis para el almacenamiento temporal persistente de carritos de compra.'
      },
      create: {
        title: 'Comfort Food',
        slug: 'comfort-food',
        description: 'Plataforma de gestión de restauración y pedidos a domicilio con sistema de administración, menús dinámicos y perfiles de usuario diferenciados.',
        category: 'web',
        featured: true,
        status: 'PUBLISHED',
        githubUrl: 'https://github.com/matildejb/ProyectoFinal2DAW',
        challenges: 'Uno de los mayores retos fue la sincronización en tiempo real del estado de los pedidos entre la cocina y los repartidores, además de gestionar la persistencia de carritos abandonados.',
        solved: 'Implementé un sistema de WebSockets para notificaciones instantáneas y utilicé Redis para el almacenamiento temporal persistente de carritos de compra.'
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
