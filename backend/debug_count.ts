import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  try {
    const projects = await prisma.project.count();
    console.log(`COUNT: ${projects}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}
check();
