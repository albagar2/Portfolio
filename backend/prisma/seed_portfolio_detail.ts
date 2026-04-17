import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'alba-os-control-center';
  
  console.log(`🌱 Actualizando detalles técnicos y evolución del proyecto: ${slug}...`);

  await prisma.project.update({
    where: { slug: slug },
    data: {
      longDescription: 'Este portafolio fue concebido no solo como una galería, sino como una declaración de principios técnicos. Decidí utilizar una arquitectura hexagonal en el backend para separar las reglas de negocio de la infraestructura (Prisma/Express), lo que permite una escalabilidad real y tests unitarios limpios. En el frontend, opté por React con Framer Motion para lograr una estética "Cyberpunk/OS" que simula un sistema operativo hacker, priorizando la interactividad y la experiencia de usuario (UX).',
      solved: 'Sincronización de estados complejos entre el dashboard administrativo y la vista pública en tiempo real. Implementación de un sistema de internacionalización (i18n) a medida sin dependencias externas pesadas para mantener la ligereza del core. Gestión de autenticación robusta utilizando JWT y Refresh Tokens con rotación automática.',
      challenges: 'Uno de los mayores retos fue mantener el rendimiento (60fps) a pesar de la alta carga de animaciones y filtros de blur dinámicos. Tuve que optimizar los ciclos de renderizado de React y utilizar técnicas de "hardware acceleration" en CSS. Además, la persistencia en SQLite requirió un diseño cuidadoso de las relaciones para emular comportamientos de bases de datos más complejas sin sacrificar la simplicidad de despliegue "zero-config".',
      evolution: 'El proyecto comenzó como una simple SPA (Single Page Application) estática. En la v1.5 evolucionó a un sistema con backend propio y CMS integrado. La v2.0 introdujo la estética "OS" actual y la arquitectura hexagonal para mejorar la mantenibilidad de cara al futuro.',
      limitations: 'Actualmente, el sistema depende de una persistencia local en SQLite por lo que no es ideal para despliegues horizontales masivos sin una capa de sincronización adicional. El motor de animaciones, aunque fluido, consume recursos significativos en dispositivos móviles de gama baja, un área en la que estoy trabajando actualmente mediante la lazy-loading de componentes pesados.'
    }
  });

  console.log('✅ Proyecto actualizado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
