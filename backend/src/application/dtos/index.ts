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
  name: safeString.pipe(z.string().min(2)).optional(),
  title: safeString.optional(),
  bio: safeString.optional(),
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
  slug: z.string().regex(slugRegex, 'Slug inválido (solo letras minúsculas, números y guiones)'),
  description: safeString.pipe(z.string().min(10)),
  longDescription: safeString.optional().nullable(),
  imageUrl: safeUrl.nullable(),
  liveUrl: safeUrl.nullable(),
  githubUrl: safeUrl.nullable(),
  technologies: z.array(z.string()).min(1, 'Al menos una tecnología requerida'),
  category: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// ---- Experience DTOs ----
export const CreateExperienceSchema = z.object({
  company: safeString.pipe(z.string().min(2)),
  position: safeString.pipe(z.string().min(2)),
  description: safeString.pipe(z.string().min(10)),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
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
  field: safeString.pipe(z.string().min(2)),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  current: z.boolean().default(false),
  description: safeString.optional().nullable(),
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
