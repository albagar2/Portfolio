import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncGithub() {
  try {
    console.log('Fetching repositories for albagar2...');
    const response = await fetch('https://api.github.com/users/albagar2/repos?per_page=100', {
      headers: {
        'User-Agent': 'Portfolio-Sync'
      }
    });
    const repos = await response.json();
    
    console.log(`Found ${repos.length} repositories on GitHub.`);

    const existingProjects = await prisma.project.findMany();
    const existingGithubUrls = existingProjects.map(p => p.githubUrl?.toLowerCase());

    let addedCount = 0;

    for (const repo of repos) {
      if (!repo.html_url) continue;
      
      const repoUrl = repo.html_url.toLowerCase();
      
      if (!existingGithubUrls.includes(repoUrl)) {
        console.log(`Adding new project: ${repo.name}`);
        
        const slug = repo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        await prisma.project.create({
          data: {
            title: repo.name,
            slug: slug + '-' + Date.now().toString().slice(-4), // ensure uniqueness
            description: repo.description || 'Sin descripción',
            category: 'web', // Default category
            status: 'DRAFT', // Add as draft so they can edit it later
            githubUrl: repo.html_url,
            featured: false,
          }
        });
        addedCount++;
      }
    }

    console.log(`Synchronization complete. Added ${addedCount} new projects.`);
  } catch (error) {
    console.error('Error syncing GitHub:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncGithub();
