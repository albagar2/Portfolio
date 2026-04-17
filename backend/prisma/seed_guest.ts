import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const GUEST_EMAIL = 'guest@example.com';
  const GUEST_PASSWORD = 'guest1234';
  const GUEST_NAME = 'Invitado Demo';

  console.log('🌱 Creando usuario de invitados...');

  const hashedPassword = await bcrypt.hash(GUEST_PASSWORD, 12);
  
  await prisma.user.upsert({
    where: { email: GUEST_EMAIL },
    update: { 
      name: GUEST_NAME, 
      password: hashedPassword,
      role: 'VIEWER' // Le damos rol de espectador si existe o simplemente ADMIN para que pruebe todo
    },
    create: { 
      email: GUEST_EMAIL, 
      password: hashedPassword, 
      name: GUEST_NAME, 
      role: 'ADMIN' // Lo ponemos como ADMIN para que pueda ver y "tocar" todo el panel (aunque podríamos luego limitar acciones de escritura en el servidor si quisiéramos modo lectura absoluta)
    },
  });

  console.log('✅ Usuario GUEST creado correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
