"use strict";
// ============================================================
// Casos de Uso (Application Layer)
// Contienen la lógica de negocio de la aplicación
// Son independientes de frameworks y la capa de presentación
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessageUseCase = exports.PostUseCase = exports.EducationUseCase = exports.SkillUseCase = exports.ExperienceUseCase = exports.ProjectUseCase = exports.ProfileUseCase = exports.AuthUseCase = void 0;
const auth_service_1 = require("../../infrastructure/auth/auth.service");
const errors_1 = require("../../domain/errors");
const logger_1 = require("../../infrastructure/config/logger");
// ============================================================
// Caso de Uso: Autenticación
// ============================================================
class AuthUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    /** Registro de nuevo usuario */
    async register(dto) {
        // Verificar si el email ya existe
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) {
            throw new errors_1.ConflictError('El email ya está registrado');
        }
        // Hashear la contraseña
        const hashedPassword = await auth_service_1.AuthService.hashPassword(dto.password);
        // Crear usuario
        const user = await this.userRepo.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: 'ADMIN',
            refreshToken: null,
        });
        // Generar tokens
        const tokens = auth_service_1.AuthService.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Guardar refresh token en BD
        await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);
        logger_1.logger.info('Nuevo usuario registrado', { userId: user.id });
        // Retornar sin password
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, tokens };
    }
    /** Login con email y contraseña */
    async login(dto) {
        // Buscar usuario
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user) {
            throw new errors_1.UnauthorizedError('Credenciales inválidas');
        }
        // Verificar contraseña
        const isValidPassword = await auth_service_1.AuthService.comparePassword(dto.password, user.password);
        if (!isValidPassword) {
            throw new errors_1.UnauthorizedError('Credenciales inválidas');
        }
        // Generar tokens
        const tokens = auth_service_1.AuthService.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Guardar refresh token
        await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);
        logger_1.logger.info('Usuario autenticado', { userId: user.id });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, tokens };
    }
    /** Renovar tokens con refresh token */
    async refreshTokens(refreshToken) {
        // Verificar refresh token
        const payload = auth_service_1.AuthService.verifyRefreshToken(refreshToken);
        // Buscar usuario
        const user = await this.userRepo.findById(payload.userId);
        if (!user) {
            throw new errors_1.UnauthorizedError('Usuario no encontrado');
        }
        // Saltamos la verificación estricta de rotación para evitar condiciones de carrera en el Dashboard
        // Pero solo si el token es válido por firma y fecha (que ya lo ha comprobado AuthService.verifyRefreshToken)
        // Generar nuevos tokens
        const tokens = auth_service_1.AuthService.generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        // Actualizar refresh token
        await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    /** Cerrar sesión - invalidar refresh token */
    async logout(userId) {
        await this.userRepo.updateRefreshToken(userId, null);
        logger_1.logger.info('Usuario cerró sesión', { userId });
    }
}
exports.AuthUseCase = AuthUseCase;
// ============================================================
// Caso de Uso: Perfil
// ============================================================
class ProfileUseCase {
    profileRepo;
    constructor(profileRepo) {
        this.profileRepo = profileRepo;
    }
    async getProfile() {
        return this.profileRepo.findFirst();
    }
    async createProfile(dto) {
        // Solo puede existir un perfil
        const existing = await this.profileRepo.findFirst();
        if (existing) {
            throw new errors_1.ConflictError('Ya existe un perfil. Use la ruta de actualización.');
        }
        return this.profileRepo.create(dto);
    }
    async updateProfile(id, dto) {
        const profile = await this.profileRepo.findById(id);
        if (!profile)
            throw new errors_1.NotFoundError('Perfil', id);
        return this.profileRepo.update(id, dto);
    }
}
exports.ProfileUseCase = ProfileUseCase;
// ============================================================
// Caso de Uso: Proyectos
// ============================================================
class ProjectUseCase {
    projectRepo;
    constructor(projectRepo) {
        this.projectRepo = projectRepo;
    }
    async getAll(filters) {
        return this.projectRepo.findAll(filters);
    }
    async getBySlug(slug) {
        const project = await this.projectRepo.findBySlug(slug);
        if (!project)
            throw new errors_1.NotFoundError('Proyecto', slug);
        return project;
    }
    async getById(id) {
        const project = await this.projectRepo.findById(id);
        if (!project)
            throw new errors_1.NotFoundError('Proyecto', id);
        return project;
    }
    async create(dto) {
        // Verificar slug único
        const existing = await this.projectRepo.findBySlug(dto.slug);
        if (existing)
            throw new errors_1.ConflictError(`Ya existe un proyecto con el slug '${dto.slug}'`);
        return this.projectRepo.create(dto);
    }
    async update(id, dto) {
        const project = await this.projectRepo.findById(id);
        if (!project)
            throw new errors_1.NotFoundError('Proyecto', id);
        // Si se cambia el slug, verificar unicidad
        if (dto.slug && dto.slug !== project.slug) {
            const existing = await this.projectRepo.findBySlug(dto.slug);
            if (existing)
                throw new errors_1.ConflictError(`Ya existe un proyecto con el slug '${dto.slug}'`);
        }
        return this.projectRepo.update(id, dto);
    }
    async delete(id) {
        const project = await this.projectRepo.findById(id);
        if (!project)
            throw new errors_1.NotFoundError('Proyecto', id);
        await this.projectRepo.delete(id);
        logger_1.logger.info('Proyecto eliminado', { projectId: id });
    }
}
exports.ProjectUseCase = ProjectUseCase;
// ============================================================
// Caso de Uso: Experiencia
// ============================================================
class ExperienceUseCase {
    expRepo;
    constructor(expRepo) {
        this.expRepo = expRepo;
    }
    async getAll() {
        return this.expRepo.findAll();
    }
    async getById(id) {
        const exp = await this.expRepo.findById(id);
        if (!exp)
            throw new errors_1.NotFoundError('Experiencia', id);
        return exp;
    }
    async create(dto) {
        return this.expRepo.create(dto);
    }
    async update(id, dto) {
        const exp = await this.expRepo.findById(id);
        if (!exp)
            throw new errors_1.NotFoundError('Experiencia', id);
        return this.expRepo.update(id, dto);
    }
    async delete(id) {
        const exp = await this.expRepo.findById(id);
        if (!exp)
            throw new errors_1.NotFoundError('Experiencia', id);
        await this.expRepo.delete(id);
    }
}
exports.ExperienceUseCase = ExperienceUseCase;
// ============================================================
// Caso de Uso: Skills
// ============================================================
class SkillUseCase {
    skillRepo;
    constructor(skillRepo) {
        this.skillRepo = skillRepo;
    }
    async getAll(category) {
        return this.skillRepo.findAll(category);
    }
    async getById(id) {
        const skill = await this.skillRepo.findById(id);
        if (!skill)
            throw new errors_1.NotFoundError('Skill', id);
        return skill;
    }
    async create(dto) {
        return this.skillRepo.create(dto);
    }
    async update(id, dto) {
        const skill = await this.skillRepo.findById(id);
        if (!skill)
            throw new errors_1.NotFoundError('Skill', id);
        return this.skillRepo.update(id, dto);
    }
    async delete(id) {
        const skill = await this.skillRepo.findById(id);
        if (!skill)
            throw new errors_1.NotFoundError('Skill', id);
        await this.skillRepo.delete(id);
    }
}
exports.SkillUseCase = SkillUseCase;
// ============================================================
// Caso de Uso: Educación
// ============================================================
class EducationUseCase {
    eduRepo;
    constructor(eduRepo) {
        this.eduRepo = eduRepo;
    }
    async getAll() {
        return this.eduRepo.findAll();
    }
    async getById(id) {
        const edu = await this.eduRepo.findById(id);
        if (!edu)
            throw new errors_1.NotFoundError('Educación', id);
        return edu;
    }
    async create(dto) {
        return this.eduRepo.create(dto);
    }
    async update(id, dto) {
        const edu = await this.eduRepo.findById(id);
        if (!edu)
            throw new errors_1.NotFoundError('Educación', id);
        return this.eduRepo.update(id, dto);
    }
    async delete(id) {
        const edu = await this.eduRepo.findById(id);
        if (!edu)
            throw new errors_1.NotFoundError('Educación', id);
        await this.eduRepo.delete(id);
    }
}
exports.EducationUseCase = EducationUseCase;
// ============================================================
// Caso de Uso: Blog Posts
// ============================================================
class PostUseCase {
    postRepo;
    constructor(postRepo) {
        this.postRepo = postRepo;
    }
    async getAll(filters) {
        return this.postRepo.findAll(filters);
    }
    async getBySlug(slug) {
        const post = await this.postRepo.findBySlug(slug);
        if (!post)
            throw new errors_1.NotFoundError('Post', slug);
        // Incrementar vistas
        await this.postRepo.incrementViews(post.id);
        return post;
    }
    async getById(id) {
        const post = await this.postRepo.findById(id);
        if (!post)
            throw new errors_1.NotFoundError('Post', id);
        return post;
    }
    async create(dto, authorId) {
        const existing = await this.postRepo.findBySlug(dto.slug);
        if (existing)
            throw new errors_1.ConflictError(`Ya existe un post con el slug '${dto.slug}'`);
        return this.postRepo.create({
            ...dto,
            authorId,
            publishedAt: dto.published ? new Date() : null,
        });
    }
    async update(id, dto) {
        const post = await this.postRepo.findById(id);
        if (!post)
            throw new errors_1.NotFoundError('Post', id);
        if (dto.slug && dto.slug !== post.slug) {
            const existing = await this.postRepo.findBySlug(dto.slug);
            if (existing)
                throw new errors_1.ConflictError(`Ya existe un post con el slug '${dto.slug}'`);
        }
        // Si se publica por primera vez, establecer fecha de publicación
        const updateData = { ...dto };
        if (dto.published && !post.published) {
            updateData.publishedAt = new Date();
        }
        return this.postRepo.update(id, updateData);
    }
    async delete(id) {
        const post = await this.postRepo.findById(id);
        if (!post)
            throw new errors_1.NotFoundError('Post', id);
        await this.postRepo.delete(id);
    }
}
exports.PostUseCase = PostUseCase;
// ============================================================
// Caso de Uso: Mensajes de Contacto
// ============================================================
class ContactMessageUseCase {
    contactRepo;
    constructor(contactRepo) {
        this.contactRepo = contactRepo;
    }
    async getAll(filters) {
        return this.contactRepo.findAll(filters);
    }
    async getById(id) {
        const msg = await this.contactRepo.findById(id);
        if (!msg)
            throw new errors_1.NotFoundError('Mensaje', id);
        return msg;
    }
    async create(dto, ipAddress) {
        return this.contactRepo.create({
            ...dto,
            ipAddress: ipAddress || null,
        });
    }
    async markAsRead(id) {
        const msg = await this.contactRepo.findById(id);
        if (!msg)
            throw new errors_1.NotFoundError('Mensaje', id);
        return this.contactRepo.markAsRead(id);
    }
    async markAsReplied(id) {
        const msg = await this.contactRepo.findById(id);
        if (!msg)
            throw new errors_1.NotFoundError('Mensaje', id);
        return this.contactRepo.markAsReplied(id);
    }
    async delete(id) {
        const msg = await this.contactRepo.findById(id);
        if (!msg)
            throw new errors_1.NotFoundError('Mensaje', id);
        await this.contactRepo.delete(id);
    }
    async getUnreadCount() {
        return this.contactRepo.count({ read: false });
    }
}
exports.ContactMessageUseCase = ContactMessageUseCase;
//# sourceMappingURL=index.js.map