const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const projects = await prisma.project.findMany();
    require('fs').writeFileSync('current_projects.json', JSON.stringify(projects, null, 2));
    console.log('SUCCESS');
  } catch (e) {
    require('fs').writeFileSync('current_projects_error.txt', e.stack);
    console.error(e);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}
main();
