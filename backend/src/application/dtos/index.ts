/**
 * application/dtos/index.ts
 * Archivo de definición de DTOs (Data Transfer Objects) usando Zod.
 * Proporciona esquemas de validación estricta para garantizar que los datos de entrada
 * cumplan con los formatos esperados antes de procesarlos.
 */
// ============================================================
// DTOs (Data Transfer Objects) y Esquemas de Validación
// Validan y transforman datos de entrada usando Zod
// ============================================================

import { z } from 'zod';

// ---- Helpers de validación ----
const sanitizeString = (val: string) => val.trim().replace(/<[^>]*>/g, ''); // Elimina HTML tags (XSS)
const safeString = z.string().transform(sanitizeString);
const safeEmail = z.string().email('Email inválido').transform((v) => v.trim().toLowerCase());
const safeUrl = z.string().url('URL inválida').optional().or(z.literal(''));
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---- Auth DTOs ----
export const LoginSchema = z.object({
  email: safeEmail,
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const RegisterSchema = z.object({
  email: safeEmail,
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  name: safeString.pipe(z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Token de refresco requerido'),
});

// ---- Profile DTOs ----
export const UpdateProfileSchema = z.object({
  name: safeString.optional(),
  name_en: safeString.optional(),
  title: safeString.optional(),
  title_en: safeString.optional(),
  bio: safeString.optional(),
  bio_en: safeString.optional(),
  email: safeEmail.optional(),
  phone: safeString.optional().nullable(),
  location: safeString.optional().nullable(),
  avatarUrl: safeUrl.nullable(),
  resumeUrl: safeUrl.nullable(),
  githubUrl: safeUrl.nullable(),
  linkedinUrl: safeUrl.nullable(),
  twitterUrl: safeUrl.nullable(),
  websiteUrl: safeUrl.nullable(),
});

export const CreateProfileSchema = z.object({
  name: safeString.pipe(z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
  title: safeString.pipe(z.string().min(2)),
  bio: safeString.pipe(z.string().min(10, 'La bio debe tener al menos 10 caracteres')),
  email: safeEmail,
  phone: safeString.optional().nullable(),
  location: safeString.optional().nullable(),
  avatarUrl: safeUrl.nullable(),
  resumeUrl: safeUrl.nullable(),
  githubUrl: safeUrl.nullable(),
  linkedinUrl: safeUrl.nullable(),
  twitterUrl: safeUrl.nullable(),
  websiteUrl: safeUrl.nullable(),
});

// ---- Project DTOs ----
export const CreateProjectSchema = z.object({
  title: safeString.pipe(z.string().min(2)),
  title_en: safeString.optional().nullable(),
  slug: z.string().regex(slugRegex, 'Slug inválido (solo letras minúsculas, números y guiones)'),
  description: safeString.pipe(z.string().min(10)),
  description_en: safeString.optional().nullable(),
  longDescription: safeString.optional().nullable(),
  longDescription_en: safeString.optional().nullable(),
  imageUrl: safeUrl.nullable(),
  liveUrl: safeUrl.nullable(),
  githubUrl: safeUrl.nullable(),
  technologies: z.array(z.string()).min(1, 'Debe incluir al menos una tecnología'),
  category: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  challenges: safeString.optional().nullable(),
  challenges_en: safeString.optional().nullable(),
  solved: safeString.optional().nullable(),
  solved_en: safeString.optional().nullable(),
  evolution: safeString.optional().nullable(),
  evolution_en: safeString.optional().nullable(),
  limitations: safeString.optional().nullable(),
  limitations_en: safeString.optional().nullable(),
  manual: safeString.optional().nullable(),
  manual_en: safeString.optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// ---- Experience DTOs ----
export const CreateExperienceSchema = z.object({
  company: safeString.pipe(z.string().min(2)),
  position: safeString.pipe(z.string().min(2)),
  position_en: safeString.optional().nullable(),
  description: safeString.pipe(z.string().min(5)),
  description_en: safeString.optional().nullable(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).transform(v => v.includes('T') ? v : `${v}T00:00:00.000Z`),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).transform(v => v.includes('T') ? v : `${v}T00:00:00.000Z`).optional().nullable(),
  current: z.boolean().default(false),
  location: safeString.optional().nullable(),
  companyUrl: safeUrl.nullable(),
  companyLogo: safeUrl.nullable(),
  order: z.number().int().min(0).default(0),
});

export const UpdateExperienceSchema = CreateExperienceSchema.partial();

// ---- Skill DTOs ----
export const CreateSkillSchema = z.object({
  name: safeString.pipe(z.string().min(1)),
  category: z.string().min(1),
  level: z.number().int().min(0).max(100).default(80),
  iconUrl: safeUrl.nullable(),
  order: z.number().int().min(0).default(0),
});

export const UpdateSkillSchema = CreateSkillSchema.partial();

// ---- Education DTOs ----
export const CreateEducationSchema = z.object({
  institution: safeString.pipe(z.string().min(2)),
  degree: safeString.pipe(z.string().min(2)),
  degree_en: safeString.optional().nullable(),
  field: safeString.pipe(z.string().min(2)),
  field_en: safeString.optional().nullable(),
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).transform(v => v.includes('T') ? v : `${v}T00:00:00.000Z`),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).transform(v => v.includes('T') ? v : `${v}T00:00:00.000Z`).optional().nullable(),
  current: z.boolean().default(false),
  description: safeString.optional().nullable(),
  description_en: safeString.optional().nullable(),
  order: z.number().int().min(0).default(0),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();

// ---- Post DTOs ----
export const CreatePostSchema = z.object({
  title: safeString.pipe(z.string().min(2)),
  slug: z.string().regex(slugRegex, 'Slug inválido'),
  excerpt: safeString.pipe(z.string().min(10)),
  content: z.string().min(10), // Content can contain HTML (blog posts)
  coverImage: safeUrl.nullable(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

// ---- Contact Message DTOs ----
export const CreateContactMessageSchema = z.object({
  name: safeString.pipe(z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
  email: safeEmail,
  subject: safeString.pipe(z.string().min(3, 'El asunto debe tener al menos 3 caracteres')),
  message: safeString.pipe(z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(5000, 'El mensaje no puede exceder 5000 caracteres')),
});

// ---- Tipos derivados de los schemas ----
export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export type CreateExperienceDto = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceDto = z.infer<typeof UpdateExperienceSchema>;
export type CreateSkillDto = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillDto = z.infer<typeof UpdateSkillSchema>;
export type CreateEducationDto = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationDto = z.infer<typeof UpdateEducationSchema>;
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
export type CreateContactMessageDto = z.infer<typeof CreateContactMessageSchema>;

// ---- Demo DTOs ----
export const CreateDemoSchema = z.object({
  title: safeString.pipe(z.string().min(2)),
  codeName: safeString.pipe(z.string().min(2)),
  description: safeString.pipe(z.string().min(5)),
  url: z.string().url('URL inválida'),
  themeColor: z.string().min(2),
  btnText: safeString.pipe(z.string().min(2)),
  order: z.number().int().min(0).default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const UpdateDemoSchema = CreateDemoSchema.partial();

export type CreateDemoDto = z.infer<typeof CreateDemoSchema>;
export type UpdateDemoDto = z.infer<typeof UpdateDemoSchema>;
