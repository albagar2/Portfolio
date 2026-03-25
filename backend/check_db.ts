import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const exps = await prisma.experience.count();
  const projects = await prisma.project.count();
  const profile = await prisma.profile.findFirst();
  console.log(`CHECK_RESULT: Experiences: ${exps}, Projects: ${projects}, Profile: ${profile?.title}`);
  process.exit(0);
}
check();
