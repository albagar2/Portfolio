// ============================================================
// Interfaces de Repositorios (Domain Layer)
// Definen los contratos que la capa de infraestructura
// debe implementar - Principio de Inversión de Dependencias
// ============================================================

import {
  UserEntity, ProfileEntity, ProjectEntity, ExperienceEntity,
  SkillEntity, EducationEntity, PostEntity, ContactMessageEntity,
} from '../entities';

// ---- Repositorio de Usuarios ----
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  updateRefreshToken(id: string, token: string | null): Promise<void>;
}

// ---- Repositorio de Perfiles ----
export interface IProfileRepository {
  findFirst(): Promise<ProfileEntity | null>;
  findById(id: string): Promise<ProfileEntity | null>;
  create(data: Omit<ProfileEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProfileEntity>;
  update(id: string, data: Partial<ProfileEntity>): Promise<ProfileEntity>;
}

// ---- Repositorio de Proyectos ----
export interface IProjectRepository {
  findAll(filters?: { category?: string; featured?: boolean; status?: string }): Promise<ProjectEntity[]>;
  findById(id: string): Promise<ProjectEntity | null>;
  findBySlug(slug: string): Promise<ProjectEntity | null>;
  create(data: Omit<ProjectEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectEntity>;
  update(id: string, data: Partial<ProjectEntity>): Promise<ProjectEntity>;
  delete(id: string): Promise<void>;
  reorder(ids: string[]): Promise<void>;
}

// ---- Repositorio de Experiencia ----
export interface IExperienceRepository {
  findAll(): Promise<ExperienceEntity[]>;
  findById(id: string): Promise<ExperienceEntity | null>;
  create(data: Omit<ExperienceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExperienceEntity>;
  update(id: string, data: Partial<ExperienceEntity>): Promise<ExperienceEntity>;
  delete(id: string): Promise<void>;
}

// ---- Repositorio de Skills ----
export interface ISkillRepository {
  findAll(category?: string): Promise<SkillEntity[]>;
  findById(id: string): Promise<SkillEntity | null>;
  create(data: Omit<SkillEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<SkillEntity>;
  update(id: string, data: Partial<SkillEntity>): Promise<SkillEntity>;
  delete(id: string): Promise<void>;
}

// ---- Repositorio de Educación ----
export interface IEducationRepository {
  findAll(): Promise<EducationEntity[]>;
  findById(id: string): Promise<EducationEntity | null>;
  create(data: Omit<EducationEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<EducationEntity>;
  update(id: string, data: Partial<EducationEntity>): Promise<EducationEntity>;
  delete(id: string): Promise<void>;
}

// ---- Repositorio de Posts ----
export interface IPostRepository {
  findAll(filters?: { published?: boolean; tag?: string }): Promise<PostEntity[]>;
  findById(id: string): Promise<PostEntity | null>;
  findBySlug(slug: string): Promise<PostEntity | null>;
  create(data: Omit<PostEntity, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<PostEntity>;
  update(id: string, data: Partial<PostEntity>): Promise<PostEntity>;
  delete(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
}

// ---- Repositorio de Mensajes de Contacto ----
export interface IContactMessageRepository {
  findAll(filters?: { read?: boolean }): Promise<ContactMessageEntity[]>;
  findById(id: string): Promise<ContactMessageEntity | null>;
  create(data: Omit<ContactMessageEntity, 'id' | 'createdAt' | 'updatedAt' | 'read' | 'replied'>): Promise<ContactMessageEntity>;
  markAsRead(id: string): Promise<ContactMessageEntity>;
  markAsReplied(id: string): Promise<ContactMessageEntity>;
  delete(id: string): Promise<void>;
  count(filters?: { read?: boolean }): Promise<number>;
}
