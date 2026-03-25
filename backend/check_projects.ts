import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const projects = await prisma.project.findMany();
  console.log('TOTAL_PROJECTS:', projects.length);
  projects.forEach(p => console.log(`- [${p.status}] ${p.title} (${p.slug})`));
  await prisma.$disconnect();
}

check();
