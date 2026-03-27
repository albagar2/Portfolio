const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const projects = await prisma.project.findMany();
    require('fs').writeFileSync('REAL_PROJECTS_LIST.txt', projects.map(p => p.title).join('\n'));
  } catch (e) {
    require('fs').writeFileSync('REAL_ERROR.txt', e.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}
main();
