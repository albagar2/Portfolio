// ============================================================
// Controladores (Presentation Layer)
// Manejan las peticiones HTTP y delegan al caso de uso correspondiente
// ============================================================

import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import {
  AuthUseCase, ProfileUseCase, ProjectUseCase, ExperienceUseCase,
  SkillUseCase, EducationUseCase, PostUseCase, ContactMessageUseCase,
} from '../../application/use-cases';
import { Database } from '../../infrastructure/database/prisma';

// ---- Tipo helper para async handler ----
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ============================================================
// Controlador de Autenticación
// ============================================================
export class AuthController {
  constructor(private authUC: AuthUseCase) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authUC.register(req.body);
    res.status(201).json({ success: true, data: result });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authUC.login(req.body);
    res.json({ success: true, data: result });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const tokens = await this.authUC.refreshTokens(req.body.refreshToken);
    res.json({ success: true, data: tokens });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await this.authUC.logout(req.user!.userId);
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    res.json({ success: true, data: req.user });
  });
}

// ============================================================
// Controlador de Perfil
// ============================================================
export class ProfileController {
  constructor(private profileUC: ProfileUseCase) {}

  getProfile = asyncHandler(async (_req: Request, res: Response) => {
    const profile = await this.profileUC.getProfile();
    res.json({ success: true, data: profile });
  });

  createProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.profileUC.createProfile(req.body);
    res.status(201).json({ success: true, data: profile });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    // Protección extra: El invitado no puede editar el perfil del "Boss"
    if (req.user?.role === 'GUEST') {
      res.json({ success: true, message: 'Modo Demo: Cambios simulados con éxito' });
      return;
    }
    const profile = await this.profileUC.updateProfile((req.params.id as string), req.body);
    res.json({ success: true, data: profile });
  });
}

// ============================================================
// Controlador de Proyectos
// ============================================================
export class ProjectController {
  constructor(private projectUC: ProjectUseCase) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { category, featured, status } = req.query;
    const filters = {
      category: category as string | undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      status: status as string | undefined,
    };
    const projects = await this.projectUC.getAll(filters);
    res.json({ success: true, data: projects });
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const project = await this.projectUC.getBySlug((req.params.slug as string));
    res.json({ success: true, data: project });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const project = await this.projectUC.getById((req.params.id as string));
    res.json({ success: true, data: project });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    // Sanitizar tecnologías si vienen como objetos
    if (req.body.technologies && Array.isArray(req.body.technologies)) {
      req.body.technologies = req.body.technologies.map((t: any) => 
        typeof t === 'object' ? t.name : t
      );
    }
    const project = await this.projectUC.create(req.body);
    res.status(201).json({ success: true, data: project });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    // Sanitizar tecnologías si vienen como objetos
    if (req.body.technologies && Array.isArray(req.body.technologies)) {
      req.body.technologies = req.body.technologies.map((t: any) => 
        typeof t === 'object' ? t.name : t
      );
    }
    const project = await this.projectUC.update((req.params.id as string), req.body);
    res.json({ success: true, data: project });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.projectUC.delete((req.params.id as string));
    res.json({ success: true, message: 'Proyecto eliminado' });
  });

  reorder = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      res.status(400).json({ success: false, message: 'Se requiere un array de IDs' });
      return;
    }
    await this.projectUC.reorder(ids);
    res.json({ success: true, message: 'Proyectos reordenados correctamente' });
  });

  private isSyncingGlobal = false;

  syncGithub = asyncHandler(async (req: Request, res: Response) => {
    if (this.isSyncingGlobal) {
      res.status(409).json({ success: false, message: 'Ya hay una sincronización en curso' });
      return;
    }
    this.isSyncingGlobal = true;
    
    const db = Database.getInstance();
    let addedCount = 0;
    try {
      const response = await fetch('https://api.github.com/users/albagar2/repos?per_page=100', {
        headers: { 'User-Agent': 'Portfolio-Sync' }
      });
      if (!response.ok) throw new Error('Error fetching from GitHub');
      const repos = await response.json() as any[];
      
      const existingProjects = await db.project.findMany();
      const existingGithubUrls = existingProjects.flatMap(p => {
        const urls = [];
        if (p.githubUrl) urls.push(p.githubUrl.toLowerCase().trim());
        if (p.liveUrl) urls.push(p.liveUrl.toLowerCase().trim()); // Many users paste Github URL in the Live URL field
        return urls;
      }).filter(Boolean);
      
      const normalizeStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

      for (const repo of repos) {
        if (!repo.html_url) continue;
        const repoUrl = repo.html_url.toLowerCase().trim();
        const repoNameNorm = normalizeStr(repo.name);
        const repoPathName = `/${repo.name.toLowerCase()}`;
        
        // 1. Check exact URL match OR if the existing URL ends with the repo name (handles trailing slashes and .git)
        let isDuplicate = existingGithubUrls.some(url => 
          url === repoUrl || 
          url === repoUrl + '/' ||
          url === repoUrl + '.git' ||
          url.includes(repoPathName)
        );

        // 2. Check name similarity if URL doesn't match
        if (!isDuplicate) {
          isDuplicate = existingProjects.some(p => {
            const pNorm = normalizeStr(p.title);
            // Matches if one name is fully contained in the other
            return pNorm === repoNameNorm || 
                   (pNorm.length > 4 && repoNameNorm.includes(pNorm)) || 
                   (repoNameNorm.length > 4 && pNorm.includes(repoNameNorm));
          });
        }
        
        if (!isDuplicate) {
          const slug = repo.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
          await db.project.create({
            data: {
              title: repo.name,
              slug: slug + '-' + Date.now().toString().slice(-4),
              description: repo.description || 'Sin descripción',
              category: 'web',
              status: 'DRAFT',
              githubUrl: repo.html_url,
              featured: false,
            }
          });
          addedCount++;
        }
      }
      res.json({ success: true, message: `Sincronización completada. ${addedCount} proyectos añadidos.` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    } finally {
      this.isSyncingGlobal = false;
    }
  });

  cleanDrafts = asyncHandler(async (req: Request, res: Response) => {
    const db = Database.getInstance();
    try {
      const result = await db.project.deleteMany({
        where: { status: 'DRAFT' }
      });
      res.json({ success: true, message: `Se han eliminado ${result.count} borradores.` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

// ============================================================
// Controlador de Experiencia
// ============================================================
export class ExperienceController {
  constructor(private expUC: ExperienceUseCase) {}

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const experiences = await this.expUC.getAll();
    res.json({ success: true, data: experiences });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const experience = await this.expUC.getById((req.params.id as string));
    res.json({ success: true, data: experience });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const experience = await this.expUC.create(req.body);
    res.status(201).json({ success: true, data: experience });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const experience = await this.expUC.update((req.params.id as string), req.body);
    res.json({ success: true, data: experience });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.expUC.delete((req.params.id as string));
    res.json({ success: true, message: 'Experiencia eliminada' });
  });
}

// ============================================================
// Controlador de Skills
// ============================================================
export class SkillController {
  constructor(private skillUC: SkillUseCase) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const skills = await this.skillUC.getAll(req.query.category as string);
    res.json({ success: true, data: skills });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const skill = await this.skillUC.getById((req.params.id as string));
    res.json({ success: true, data: skill });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const skill = await this.skillUC.create(req.body);
    res.status(201).json({ success: true, data: skill });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const skill = await this.skillUC.update((req.params.id as string), req.body);
    res.json({ success: true, data: skill });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.skillUC.delete((req.params.id as string));
    res.json({ success: true, message: 'Skill eliminada' });
  });
}

// ============================================================
// Controlador de Educación
// ============================================================
export class EducationController {
  constructor(private eduUC: EducationUseCase) {}

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const educations = await this.eduUC.getAll();
    res.json({ success: true, data: educations });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const education = await this.eduUC.getById((req.params.id as string));
    res.json({ success: true, data: education });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const education = await this.eduUC.create(req.body);
    res.status(201).json({ success: true, data: education });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const education = await this.eduUC.update((req.params.id as string), req.body);
    res.json({ success: true, data: education });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.eduUC.delete((req.params.id as string));
    res.json({ success: true, message: 'Educación eliminada' });
  });
}

// ============================================================
// Controlador de Blog Posts
// ============================================================
export class PostController {
  constructor(private postUC: PostUseCase) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { published, tag } = req.query;
    const filters = {
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      tag: tag as string | undefined,
    };
    const posts = await this.postUC.getAll(filters);
    res.json({ success: true, data: posts });
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const post = await this.postUC.getBySlug((req.params.slug as string));
    res.json({ success: true, data: post });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const post = await this.postUC.getById((req.params.id as string));
    res.json({ success: true, data: post });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const post = await this.postUC.create(req.body, req.user!.userId);
    res.status(201).json({ success: true, data: post });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const post = await this.postUC.update((req.params.id as string), req.body);
    res.json({ success: true, data: post });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.postUC.delete((req.params.id as string));
    res.json({ success: true, message: 'Post eliminado' });
  });
}

// ============================================================
// Controlador de Mensajes de Contacto
// ============================================================
export class ContactController {
  constructor(private contactUC: ContactMessageUseCase) {}

  getAll = asyncHandler(async (req: Request, res: Response) => {
    // Si es un invitado, devolvemos mensajes de ejemplo ficticios
    if (req.user?.role === 'GUEST') {
      const mockMessages = [
        { id: 'mock-1', name: 'Reclutador Tech', email: 'hr@example.com', subject: 'Propuesta de Colaboración', message: '¡Hola! Nos encanta tu portfolio. ¿Hablamos?', read: true, createdAt: new Date() },
        { id: 'mock-2', name: 'Sistemas Cloud', email: 'cloud@example.com', subject: 'Configuración Servidor', message: 'Los despliegues en Railway son ultra-rápidos.', read: false, createdAt: new Date() }
      ];
      res.json({ success: true, data: mockMessages });
      return;
    }
    const read = req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined;
    const messages = await this.contactUC.getAll({ read });
    res.json({ success: true, data: messages });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const message = await this.contactUC.getById((req.params.id as string));
    res.json({ success: true, data: message });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    // Obtener IP del cliente de forma segura
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;
    const message = await this.contactUC.create(req.body, ipAddress);
    res.status(201).json({ success: true, data: message });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const message = await this.contactUC.markAsRead((req.params.id as string));
    res.json({ success: true, data: message });
  });

  markAsReplied = asyncHandler(async (req: Request, res: Response) => {
    const message = await this.contactUC.markAsReplied((req.params.id as string));
    res.json({ success: true, data: message });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.contactUC.delete((req.params.id as string));
    res.json({ success: true, message: 'Mensaje eliminado' });
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    if (req.user?.role === 'GUEST') {
      res.json({ success: true, data: { unreadCount: 1 } });
      return;
    }
    const count = await this.contactUC.getUnreadCount();
    res.json({ success: true, data: { unreadCount: count } });
  });
}

// ============================================================
// Controlador de Sistema (Explorador de BD)
// ============================================================
export class SystemController {
  getDbExplorer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const table = req.query.table as string;
    if (!table) {
      res.status(400).json({ success: false, message: 'Tabla no especificada' });
      return;
    }

    const allowedTables = ['user', 'profile', 'project', 'experience', 'skill', 'education', 'post', 'contactMessage'];
    if (!allowedTables.includes(table)) {
      res.status(403).json({ success: false, message: 'Acceso a tabla no permitido' });
      return;
    }

    try {
      const db = Database.getInstance();
      const data = await (db as any)[table].findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  getBackup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const isProd = process.env.NODE_ENV === 'production';
      const pathsToTry = isProd 
        ? ['/app/data/portfolio.db', '/tmp/portfolio.db']
        : [path.join(process.cwd(), 'prisma', 'portfolio.db'), path.join(process.cwd(), 'portfolio.db')];

      let dbPath = '';
      for (const p of pathsToTry) {
        if (fs.existsSync(p)) {
          dbPath = p;
          break;
        }
      }

      if (!dbPath) {
        res.status(404).json({ 
          success: false, 
          message: 'Archivo de base de datos no encontrado',
          debug: { tried: pathsToTry, cwd: process.cwd() }
        });
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      res.download(dbPath, `portfolio-backup-${timestamp}.db`);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

// ============================================================
// Demo Controller (Cyber-Portal)
// ============================================================
export class DemoController {
  private get db() {
    return Database.getInstance();
  }

  async getAll(req: Request, res: Response) {
    try {
      const demos = await this.db.demo.findMany({
        orderBy: { order: 'asc' }
      });
      res.json({ status: 'success', data: demos });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: 'Error retrieving demos: ' + (error.message || String(error)) });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const demo = await this.db.demo.create({
        data: req.body
      });
      res.status(201).json({ status: 'success', data: demo });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error creating demo' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const demo = await this.db.demo.update({
        where: { id: req.params.id as string },
        data: req.body
      });
      res.json({ status: 'success', data: demo });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error updating demo' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.db.demo.delete({
        where: { id: req.params.id as string }
      });
      res.json({ status: 'success', message: 'Demo deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error deleting demo' });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        res.status(400).json({ status: 'error', message: 'Invalid payload' });
        return;
      }

      await this.db.$transaction(
        ids.map((id, index) => 
          this.db.demo.update({
            where: { id },
            data: { order: index }
          })
        )
      );

      res.json({ status: 'success', message: 'Order updated successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error reordering demos' });
    }
  }

  async checkStatus(req: Request, res: Response) {
    try {
      const { url } = req.query;
      if (!url || typeof url !== 'string') {
        res.status(400).json({ status: 'error', message: 'URL required' });
        return;
      }

      // Proxy request to bypass CORS
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(url, { 
          method: 'GET',
          signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        res.json({ status: 'success', isOnline: true });
      } catch (err) {
        clearTimeout(timeoutId);
        res.json({ status: 'success', isOnline: false });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error checking status' });
    }
  }
}
