"use strict";
// ============================================================
// DTOs (Data Transfer Objects) y Esquemas de Validación
// Validan y transforman datos de entrada usando Zod
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContactMessageSchema = exports.UpdatePostSchema = exports.CreatePostSchema = exports.UpdateEducationSchema = exports.CreateEducationSchema = exports.UpdateSkillSchema = exports.CreateSkillSchema = exports.UpdateExperienceSchema = exports.CreateExperienceSchema = exports.UpdateProjectSchema = exports.CreateProjectSchema = exports.CreateProfileSchema = exports.UpdateProfileSchema = exports.RefreshTokenSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
// ---- Helpers de validación ----
const sanitizeString = (val) => val.trim().replace(/<[^>]*>/g, ''); // Elimina HTML tags (XSS)
const safeString = zod_1.z.string().transform(sanitizeString);
const safeEmail = zod_1.z.string().email('Email inválido').transform((v) => v.trim().toLowerCase());
const safeUrl = zod_1.z.string().url('URL inválida').optional().or(zod_1.z.literal(''));
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// ---- Auth DTOs ----
exports.LoginSchema = zod_1.z.object({
    email: safeEmail,
    password: zod_1.z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});
exports.RegisterSchema = zod_1.z.object({
    email: safeEmail,
    password: zod_1.z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una minúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    name: safeString.pipe(zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Token de refresco requerido'),
});
// ---- Profile DTOs ----
exports.UpdateProfileSchema = zod_1.z.object({
    name: safeString.pipe(zod_1.z.string().min(2)).optional(),
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
exports.CreateProfileSchema = zod_1.z.object({
    name: safeString.pipe(zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
    title: safeString.pipe(zod_1.z.string().min(2)),
    bio: safeString.pipe(zod_1.z.string().min(10, 'La bio debe tener al menos 10 caracteres')),
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
exports.CreateProjectSchema = zod_1.z.object({
    title: safeString.pipe(zod_1.z.string().min(2)),
    slug: zod_1.z.string().regex(slugRegex, 'Slug inválido (solo letras minúsculas, números y guiones)'),
    description: safeString.pipe(zod_1.z.string().min(10)),
    longDescription: safeString.optional().nullable(),
    imageUrl: safeUrl.nullable(),
    liveUrl: safeUrl.nullable(),
    githubUrl: safeUrl.nullable(),
    technologies: zod_1.z.array(zod_1.z.string()).min(1, 'Al menos una tecnología requerida'),
    category: zod_1.z.string().min(1),
    featured: zod_1.z.boolean().default(false),
    order: zod_1.z.number().int().min(0).default(0),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
    startDate: zod_1.z.string().datetime().optional().nullable(),
    endDate: zod_1.z.string().datetime().optional().nullable(),
});
exports.UpdateProjectSchema = exports.CreateProjectSchema.partial();
// ---- Experience DTOs ----
exports.CreateExperienceSchema = zod_1.z.object({
    company: safeString.pipe(zod_1.z.string().min(2)),
    position: safeString.pipe(zod_1.z.string().min(2)),
    description: safeString.pipe(zod_1.z.string().min(10)),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime().optional().nullable(),
    current: zod_1.z.boolean().default(false),
    location: safeString.optional().nullable(),
    companyUrl: safeUrl.nullable(),
    companyLogo: safeUrl.nullable(),
    order: zod_1.z.number().int().min(0).default(0),
});
exports.UpdateExperienceSchema = exports.CreateExperienceSchema.partial();
// ---- Skill DTOs ----
exports.CreateSkillSchema = zod_1.z.object({
    name: safeString.pipe(zod_1.z.string().min(1)),
    category: zod_1.z.string().min(1),
    level: zod_1.z.number().int().min(0).max(100).default(80),
    iconUrl: safeUrl.nullable(),
    order: zod_1.z.number().int().min(0).default(0),
});
exports.UpdateSkillSchema = exports.CreateSkillSchema.partial();
// ---- Education DTOs ----
exports.CreateEducationSchema = zod_1.z.object({
    institution: safeString.pipe(zod_1.z.string().min(2)),
    degree: safeString.pipe(zod_1.z.string().min(2)),
    field: safeString.pipe(zod_1.z.string().min(2)),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime().optional().nullable(),
    current: zod_1.z.boolean().default(false),
    description: safeString.optional().nullable(),
    order: zod_1.z.number().int().min(0).default(0),
});
exports.UpdateEducationSchema = exports.CreateEducationSchema.partial();
// ---- Post DTOs ----
exports.CreatePostSchema = zod_1.z.object({
    title: safeString.pipe(zod_1.z.string().min(2)),
    slug: zod_1.z.string().regex(slugRegex, 'Slug inválido'),
    excerpt: safeString.pipe(zod_1.z.string().min(10)),
    content: zod_1.z.string().min(10), // Content can contain HTML (blog posts)
    coverImage: safeUrl.nullable(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    published: zod_1.z.boolean().default(false),
    publishedAt: zod_1.z.string().datetime().optional().nullable(),
});
exports.UpdatePostSchema = exports.CreatePostSchema.partial();
// ---- Contact Message DTOs ----
exports.CreateContactMessageSchema = zod_1.z.object({
    name: safeString.pipe(zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
    email: safeEmail,
    subject: safeString.pipe(zod_1.z.string().min(3, 'El asunto debe tener al menos 3 caracteres')),
    message: safeString.pipe(zod_1.z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(5000, 'El mensaje no puede exceder 5000 caracteres')),
});
//# sourceMappingURL=index.js.map