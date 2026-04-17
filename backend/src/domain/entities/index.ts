// ============================================================
// Entidades del Dominio
// Representan los objetos de negocio puros, sin dependencias
// de frameworks ni bases de datos
// ============================================================

// ---- Roles de Usuario ----
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

// ---- Estado de Proyecto ----
export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// ---- Entidad Usuario ----
export interface UserEntity {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Entidad Perfil ----
export interface ProfileEntity {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Entidad Proyecto ----
export interface ProjectEntity {
  id: string;
  title: string;
  title_en?: string | null;
  slug: string;
  description: string;
  description_en?: string | null;
  longDescription?: string | null;
  longDescription_en?: string | null;
  imageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  technologies: string[];
  category: string;
  featured: boolean;
  order: number;
  status: ProjectStatus;
  challenges?: string | null;
  challenges_en?: string | null;
  solved?: string | null;
  solved_en?: string | null;
  evolution?: string | null;
  evolution_en?: string | null;
  limitations?: string | null;
  limitations_en?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Entidad Experiencia ----
export interface ExperienceEntity {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  location?: string | null;
  companyUrl?: string | null;
  companyLogo?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Entidad Skill ----
export interface SkillEntity {
  id: string;
  name: string;
  category: string;
  level: number;
  iconUrl?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Entidad Educación ----
export interface EducationEntity {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  description?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Entidad Post de Blog ----
export interface PostEntity {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  tags: string[];
  published: boolean;
  publishedAt?: Date | null;
  authorId: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Entidad Mensaje de Contacto ----
export interface ContactMessageEntity {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  ipAddress?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
