// ============================================================
// Implementaciones de Repositorios con Prisma
// Capa de infraestructura - implementan las interfaces del dominio
// ============================================================

import { prisma } from '../database/prisma';
import {
  IUserRepository, IProfileRepository, IProjectRepository,
  IExperienceRepository, ISkillRepository, IEducationRepository,
  IPostRepository, IContactMessageRepository,
} from '../../domain/interfaces/repositories';
import {
  UserEntity, ProfileEntity, ProjectEntity, ExperienceEntity,
  SkillEntity, EducationEntity, PostEntity, ContactMessageEntity,
} from '../../domain/entities';

// ---- Repositorio de Usuarios ----
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { id } }) as Promise<UserEntity | null>;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { email } }) as Promise<UserEntity | null>;
  }

  async create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    return prisma.user.create({ data }) as Promise<UserEntity>;
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    return prisma.user.update({ where: { id }, data }) as Promise<UserEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    await prisma.user.update({ where: { id }, data: { refreshToken: token } });
  }
}

// ---- Repositorio de Perfiles ----
export class ProfileRepository implements IProfileRepository {
  async findFirst(): Promise<ProfileEntity | null> {
    return prisma.profile.findFirst() as Promise<ProfileEntity | null>;
  }

  async findById(id: string): Promise<ProfileEntity | null> {
    return prisma.profile.findUnique({ where: { id } }) as Promise<ProfileEntity | null>;
  }

  async create(data: Omit<ProfileEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProfileEntity> {
    return prisma.profile.create({ data }) as Promise<ProfileEntity>;
  }

  async update(id: string, data: Partial<ProfileEntity>): Promise<ProfileEntity> {
    return prisma.profile.update({ where: { id }, data }) as Promise<ProfileEntity>;
  }
}

// ---- Repositorio de Proyectos ----
export class ProjectRepository implements IProjectRepository {
  async findAll(filters?: { category?: string; featured?: boolean; status?: string }): Promise<ProjectEntity[]> {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.featured !== undefined) where.featured = filters.featured;
    if (filters?.status) where.status = filters.status;
    else where.status = 'PUBLISHED'; // Solo publicados por defecto

    return prisma.project.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: { technologies: true },
    }) as unknown as Promise<ProjectEntity[]>;
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    return prisma.project.findUnique({ 
      where: { id },
      include: { technologies: true },
    }) as unknown as Promise<ProjectEntity | null>;
  }

  async findBySlug(slug: string): Promise<ProjectEntity | null> {
    return prisma.project.findUnique({ 
      where: { slug },
      include: { technologies: true },
    }) as unknown as Promise<ProjectEntity | null>;
  }

  async create(data: Omit<ProjectEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectEntity> {
    const { technologies, ...projectData } = data as any;
    return prisma.project.create({ 
      data: {
        ...projectData,
        technologies: {
          create: (technologies || []).map((name: string) => ({ name }))
        }
      },
      include: { technologies: true }
    }) as unknown as Promise<ProjectEntity>;
  }

  async update(id: string, data: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const { technologies, ...projectData } = data as any;

    // Si se envían tecnologías, reemplazamos las anteriores
    if (technologies && Array.isArray(technologies)) {
      await prisma.projectTech.deleteMany({ where: { projectId: id } });
      
      return prisma.project.update({ 
        where: { id }, 
        data: {
          ...projectData,
          technologies: {
            create: technologies.map((name: string) => ({ name }))
          }
        },
        include: { technologies: true }
      }) as unknown as Promise<ProjectEntity>;
    }

    return prisma.project.update({ 
      where: { id }, 
      data: projectData,
      include: { technologies: true }
    }) as unknown as Promise<ProjectEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }

  async reorder(ids: string[]): Promise<void> {
    await prisma.$transaction(
      ids.map((id, index) => 
        prisma.project.update({
          where: { id },
          data: { order: index }
        })
      )
    );
  }
}

// ---- Repositorio de Experiencia ----
export class ExperienceRepository implements IExperienceRepository {
  async findAll(): Promise<ExperienceEntity[]> {
    return prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    }) as Promise<ExperienceEntity[]>;
  }

  async findById(id: string): Promise<ExperienceEntity | null> {
    return prisma.experience.findUnique({ where: { id } }) as Promise<ExperienceEntity | null>;
  }

  async create(data: Omit<ExperienceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExperienceEntity> {
    return prisma.experience.create({ data }) as Promise<ExperienceEntity>;
  }

  async update(id: string, data: Partial<ExperienceEntity>): Promise<ExperienceEntity> {
    return prisma.experience.update({ where: { id }, data }) as Promise<ExperienceEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.experience.delete({ where: { id } });
  }
}

// ---- Repositorio de Skills ----
export class SkillRepository implements ISkillRepository {
  async findAll(category?: string): Promise<SkillEntity[]> {
    const where = category ? { category } : {};
    return prisma.skill.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    }) as Promise<SkillEntity[]>;
  }

  async findById(id: string): Promise<SkillEntity | null> {
    return prisma.skill.findUnique({ where: { id } }) as Promise<SkillEntity | null>;
  }

  async create(data: Omit<SkillEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SkillEntity> {
    return prisma.skill.create({ data }) as Promise<SkillEntity>;
  }

  async update(id: string, data: Partial<SkillEntity>): Promise<SkillEntity> {
    return prisma.skill.update({ where: { id }, data }) as Promise<SkillEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.skill.delete({ where: { id } });
  }
}

// ---- Repositorio de Educación ----
export class EducationRepository implements IEducationRepository {
  async findAll(): Promise<EducationEntity[]> {
    return prisma.education.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    }) as Promise<EducationEntity[]>;
  }

  async findById(id: string): Promise<EducationEntity | null> {
    return prisma.education.findUnique({ where: { id } }) as Promise<EducationEntity | null>;
  }

  async create(data: Omit<EducationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<EducationEntity> {
    return prisma.education.create({ data }) as Promise<EducationEntity>;
  }

  async update(id: string, data: Partial<EducationEntity>): Promise<EducationEntity> {
    return prisma.education.update({ where: { id }, data }) as Promise<EducationEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.education.delete({ where: { id } });
  }
}

// ---- Repositorio de Posts ----
export class PostRepository implements IPostRepository {
  async findAll(filters?: { published?: boolean; tag?: string }): Promise<PostEntity[]> {
    const where: Record<string, unknown> = {};
    if (filters?.published !== undefined) where.published = filters.published;
    if (filters?.tag) where.tags = { has: filters.tag };

    return prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { 
        author: { select: { id: true, name: true, email: true } },
        tags: true 
      },
    }) as unknown as Promise<PostEntity[]>;
  }

  async findById(id: string): Promise<PostEntity | null> {
    return prisma.post.findUnique({
      where: { id },
      include: { 
        author: { select: { id: true, name: true, email: true } },
        tags: true 
      },
    }) as unknown as Promise<PostEntity | null>;
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    return prisma.post.findUnique({
      where: { slug },
      include: { 
        author: { select: { id: true, name: true, email: true } },
        tags: true 
      },
    }) as unknown as Promise<PostEntity | null>;
  }

  async create(data: Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<PostEntity> {
    const { tags, ...postData } = data as any;
    return prisma.post.create({
      data: { 
        ...postData, 
        views: 0,
        tags: {
          create: (tags || []).map((name: string) => ({ name }))
        }
      },
      include: { 
        author: { select: { id: true, name: true, email: true } },
        tags: true
      },
    }) as unknown as Promise<PostEntity>;
  }

  async update(id: string, data: Partial<PostEntity>): Promise<PostEntity> {
    const { tags, ...postData } = data as any;

    if (tags && Array.isArray(tags)) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      return prisma.post.update({
        where: { id },
        data: {
          ...postData,
          tags: {
            create: tags.map((name: string) => ({ name }))
          }
        },
        include: { 
          author: { select: { id: true, name: true, email: true } },
          tags: true
        },
      }) as unknown as Promise<PostEntity>;
    }

    return prisma.post.update({
      where: { id },
      data: postData,
      include: { 
        author: { select: { id: true, name: true, email: true } },
        tags: true
      },
    }) as unknown as Promise<PostEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  async incrementViews(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
}

// ---- Repositorio de Mensajes de Contacto ----
export class ContactMessageRepository implements IContactMessageRepository {
  async findAll(filters?: { read?: boolean }): Promise<ContactMessageEntity[]> {
    const where = filters?.read !== undefined ? { read: filters.read } : {};
    return prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }) as Promise<ContactMessageEntity[]>;
  }

  async findById(id: string): Promise<ContactMessageEntity | null> {
    return prisma.contactMessage.findUnique({ where: { id } }) as Promise<ContactMessageEntity | null>;
  }

  async create(data: Omit<ContactMessageEntity, 'id' | 'createdAt' | 'updatedAt' | 'read' | 'replied'>): Promise<ContactMessageEntity> {
    return prisma.contactMessage.create({ data }) as Promise<ContactMessageEntity>;
  }

  async markAsRead(id: string): Promise<ContactMessageEntity> {
    return prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    }) as Promise<ContactMessageEntity>;
  }

  async markAsReplied(id: string): Promise<ContactMessageEntity> {
    return prisma.contactMessage.update({
      where: { id },
      data: { replied: true },
    }) as Promise<ContactMessageEntity>;
  }

  async delete(id: string): Promise<void> {
    await prisma.contactMessage.delete({ where: { id } });
  }

  async count(filters?: { read?: boolean }): Promise<number> {
    const where = filters?.read !== undefined ? { read: filters.read } : {};
    return prisma.contactMessage.count({ where });
  }
}
