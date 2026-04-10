"use strict";
// ============================================================
// Implementaciones de Repositorios con Prisma
// Capa de infraestructura - implementan las interfaces del dominio
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessageRepository = exports.PostRepository = exports.EducationRepository = exports.SkillRepository = exports.ExperienceRepository = exports.ProjectRepository = exports.ProfileRepository = exports.UserRepository = void 0;
const prisma_1 = require("../database/prisma");
// ---- Repositorio de Usuarios ----
class UserRepository {
    async findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        return prisma_1.prisma.user.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.user.update({ where: { id }, data });
    }
    async delete(id) {
        await prisma_1.prisma.user.delete({ where: { id } });
    }
    async updateRefreshToken(id, token) {
        await prisma_1.prisma.user.update({ where: { id }, data: { refreshToken: token } });
    }
}
exports.UserRepository = UserRepository;
// ---- Repositorio de Perfiles ----
class ProfileRepository {
    async findFirst() {
        return prisma_1.prisma.profile.findFirst();
    }
    async findById(id) {
        return prisma_1.prisma.profile.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.profile.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.profile.update({ where: { id }, data });
    }
}
exports.ProfileRepository = ProfileRepository;
// ---- Repositorio de Proyectos ----
class ProjectRepository {
    async findAll(filters) {
        const where = {};
        if (filters?.category)
            where.category = filters.category;
        if (filters?.featured !== undefined)
            where.featured = filters.featured;
        if (filters?.status)
            where.status = filters.status;
        else
            where.status = 'PUBLISHED'; // Solo publicados por defecto
        return prisma_1.prisma.project.findMany({
            where,
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
            include: { technologies: true },
        });
    }
    async findById(id) {
        return prisma_1.prisma.project.findUnique({
            where: { id },
            include: { technologies: true },
        });
    }
    async findBySlug(slug) {
        return prisma_1.prisma.project.findUnique({
            where: { slug },
            include: { technologies: true },
        });
    }
    async create(data) {
        const { technologies, ...projectData } = data;
        return prisma_1.prisma.project.create({
            data: {
                ...projectData,
                technologies: {
                    create: (technologies || []).map((name) => ({ name }))
                }
            },
            include: { technologies: true }
        });
    }
    async update(id, data) {
        const { technologies, ...projectData } = data;
        // Si se envían tecnologías, reemplazamos las anteriores
        if (technologies && Array.isArray(technologies)) {
            await prisma_1.prisma.projectTech.deleteMany({ where: { projectId: id } });
            return prisma_1.prisma.project.update({
                where: { id },
                data: {
                    ...projectData,
                    technologies: {
                        create: technologies.map((name) => ({ name }))
                    }
                },
                include: { technologies: true }
            });
        }
        return prisma_1.prisma.project.update({
            where: { id },
            data: projectData,
            include: { technologies: true }
        });
    }
    async delete(id) {
        await prisma_1.prisma.project.delete({ where: { id } });
    }
}
exports.ProjectRepository = ProjectRepository;
// ---- Repositorio de Experiencia ----
class ExperienceRepository {
    async findAll() {
        return prisma_1.prisma.experience.findMany({
            orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
        });
    }
    async findById(id) {
        return prisma_1.prisma.experience.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.experience.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.experience.update({ where: { id }, data });
    }
    async delete(id) {
        await prisma_1.prisma.experience.delete({ where: { id } });
    }
}
exports.ExperienceRepository = ExperienceRepository;
// ---- Repositorio de Skills ----
class SkillRepository {
    async findAll(category) {
        const where = category ? { category } : {};
        return prisma_1.prisma.skill.findMany({
            where,
            orderBy: [{ category: 'asc' }, { order: 'asc' }],
        });
    }
    async findById(id) {
        return prisma_1.prisma.skill.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.skill.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.skill.update({ where: { id }, data });
    }
    async delete(id) {
        await prisma_1.prisma.skill.delete({ where: { id } });
    }
}
exports.SkillRepository = SkillRepository;
// ---- Repositorio de Educación ----
class EducationRepository {
    async findAll() {
        return prisma_1.prisma.education.findMany({
            orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
        });
    }
    async findById(id) {
        return prisma_1.prisma.education.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.education.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.education.update({ where: { id }, data });
    }
    async delete(id) {
        await prisma_1.prisma.education.delete({ where: { id } });
    }
}
exports.EducationRepository = EducationRepository;
// ---- Repositorio de Posts ----
class PostRepository {
    async findAll(filters) {
        const where = {};
        if (filters?.published !== undefined)
            where.published = filters.published;
        if (filters?.tag)
            where.tags = { has: filters.tag };
        return prisma_1.prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, name: true, email: true } },
                tags: true
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.post.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, name: true, email: true } },
                tags: true
            },
        });
    }
    async findBySlug(slug) {
        return prisma_1.prisma.post.findUnique({
            where: { slug },
            include: {
                author: { select: { id: true, name: true, email: true } },
                tags: true
            },
        });
    }
    async create(data) {
        const { tags, ...postData } = data;
        return prisma_1.prisma.post.create({
            data: {
                ...postData,
                views: 0,
                tags: {
                    create: (tags || []).map((name) => ({ name }))
                }
            },
            include: {
                author: { select: { id: true, name: true, email: true } },
                tags: true
            },
        });
    }
    async update(id, data) {
        const { tags, ...postData } = data;
        if (tags && Array.isArray(tags)) {
            await prisma_1.prisma.postTag.deleteMany({ where: { postId: id } });
            return prisma_1.prisma.post.update({
                where: { id },
                data: {
                    ...postData,
                    tags: {
                        create: tags.map((name) => ({ name }))
                    }
                },
                include: {
                    author: { select: { id: true, name: true, email: true } },
                    tags: true
                },
            });
        }
        return prisma_1.prisma.post.update({
            where: { id },
            data: postData,
            include: {
                author: { select: { id: true, name: true, email: true } },
                tags: true
            },
        });
    }
    async delete(id) {
        await prisma_1.prisma.post.delete({ where: { id } });
    }
    async incrementViews(id) {
        await prisma_1.prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } },
        });
    }
}
exports.PostRepository = PostRepository;
// ---- Repositorio de Mensajes de Contacto ----
class ContactMessageRepository {
    async findAll(filters) {
        const where = filters?.read !== undefined ? { read: filters.read } : {};
        return prisma_1.prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return prisma_1.prisma.contactMessage.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.contactMessage.create({ data });
    }
    async markAsRead(id) {
        return prisma_1.prisma.contactMessage.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAsReplied(id) {
        return prisma_1.prisma.contactMessage.update({
            where: { id },
            data: { replied: true },
        });
    }
    async delete(id) {
        await prisma_1.prisma.contactMessage.delete({ where: { id } });
    }
    async count(filters) {
        const where = filters?.read !== undefined ? { read: filters.read } : {};
        return prisma_1.prisma.contactMessage.count({ where });
    }
}
exports.ContactMessageRepository = ContactMessageRepository;
//# sourceMappingURL=index.js.map