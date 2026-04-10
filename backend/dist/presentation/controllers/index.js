"use strict";
// ============================================================
// Controladores (Presentation Layer)
// Manejan las peticiones HTTP y delegan al caso de uso correspondiente
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = exports.PostController = exports.EducationController = exports.SkillController = exports.ExperienceController = exports.ProjectController = exports.ProfileController = exports.AuthController = void 0;
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
// ============================================================
// Controlador de Autenticación
// ============================================================
class AuthController {
    authUC;
    constructor(authUC) {
        this.authUC = authUC;
    }
    register = asyncHandler(async (req, res) => {
        const result = await this.authUC.register(req.body);
        res.status(201).json({ success: true, data: result });
    });
    login = asyncHandler(async (req, res) => {
        const result = await this.authUC.login(req.body);
        res.json({ success: true, data: result });
    });
    refreshToken = asyncHandler(async (req, res) => {
        const tokens = await this.authUC.refreshTokens(req.body.refreshToken);
        res.json({ success: true, data: tokens });
    });
    logout = asyncHandler(async (req, res) => {
        await this.authUC.logout(req.user.userId);
        res.json({ success: true, message: 'Sesión cerrada exitosamente' });
    });
    me = asyncHandler(async (req, res) => {
        res.json({ success: true, data: req.user });
    });
}
exports.AuthController = AuthController;
// ============================================================
// Controlador de Perfil
// ============================================================
class ProfileController {
    profileUC;
    constructor(profileUC) {
        this.profileUC = profileUC;
    }
    getProfile = asyncHandler(async (_req, res) => {
        const profile = await this.profileUC.getProfile();
        res.json({ success: true, data: profile });
    });
    createProfile = asyncHandler(async (req, res) => {
        const profile = await this.profileUC.createProfile(req.body);
        res.status(201).json({ success: true, data: profile });
    });
    updateProfile = asyncHandler(async (req, res) => {
        const profile = await this.profileUC.updateProfile(req.params.id, req.body);
        res.json({ success: true, data: profile });
    });
}
exports.ProfileController = ProfileController;
// ============================================================
// Controlador de Proyectos
// ============================================================
class ProjectController {
    projectUC;
    constructor(projectUC) {
        this.projectUC = projectUC;
    }
    getAll = asyncHandler(async (req, res) => {
        const { category, featured, status } = req.query;
        const filters = {
            category: category,
            featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
            status: status,
        };
        const projects = await this.projectUC.getAll(filters);
        res.json({ success: true, data: projects });
    });
    getBySlug = asyncHandler(async (req, res) => {
        const project = await this.projectUC.getBySlug(req.params.slug);
        res.json({ success: true, data: project });
    });
    getById = asyncHandler(async (req, res) => {
        const project = await this.projectUC.getById(req.params.id);
        res.json({ success: true, data: project });
    });
    create = asyncHandler(async (req, res) => {
        // Sanitizar tecnologías si vienen como objetos
        if (req.body.technologies && Array.isArray(req.body.technologies)) {
            req.body.technologies = req.body.technologies.map((t) => typeof t === 'object' ? t.name : t);
        }
        const project = await this.projectUC.create(req.body);
        res.status(201).json({ success: true, data: project });
    });
    update = asyncHandler(async (req, res) => {
        // Sanitizar tecnologías si vienen como objetos
        if (req.body.technologies && Array.isArray(req.body.technologies)) {
            req.body.technologies = req.body.technologies.map((t) => typeof t === 'object' ? t.name : t);
        }
        const project = await this.projectUC.update(req.params.id, req.body);
        res.json({ success: true, data: project });
    });
    delete = asyncHandler(async (req, res) => {
        await this.projectUC.delete(req.params.id);
        res.json({ success: true, message: 'Proyecto eliminado' });
    });
}
exports.ProjectController = ProjectController;
// ============================================================
// Controlador de Experiencia
// ============================================================
class ExperienceController {
    expUC;
    constructor(expUC) {
        this.expUC = expUC;
    }
    getAll = asyncHandler(async (_req, res) => {
        const experiences = await this.expUC.getAll();
        res.json({ success: true, data: experiences });
    });
    getById = asyncHandler(async (req, res) => {
        const experience = await this.expUC.getById(req.params.id);
        res.json({ success: true, data: experience });
    });
    create = asyncHandler(async (req, res) => {
        const experience = await this.expUC.create(req.body);
        res.status(201).json({ success: true, data: experience });
    });
    update = asyncHandler(async (req, res) => {
        const experience = await this.expUC.update(req.params.id, req.body);
        res.json({ success: true, data: experience });
    });
    delete = asyncHandler(async (req, res) => {
        await this.expUC.delete(req.params.id);
        res.json({ success: true, message: 'Experiencia eliminada' });
    });
}
exports.ExperienceController = ExperienceController;
// ============================================================
// Controlador de Skills
// ============================================================
class SkillController {
    skillUC;
    constructor(skillUC) {
        this.skillUC = skillUC;
    }
    getAll = asyncHandler(async (req, res) => {
        const skills = await this.skillUC.getAll(req.query.category);
        res.json({ success: true, data: skills });
    });
    getById = asyncHandler(async (req, res) => {
        const skill = await this.skillUC.getById(req.params.id);
        res.json({ success: true, data: skill });
    });
    create = asyncHandler(async (req, res) => {
        const skill = await this.skillUC.create(req.body);
        res.status(201).json({ success: true, data: skill });
    });
    update = asyncHandler(async (req, res) => {
        const skill = await this.skillUC.update(req.params.id, req.body);
        res.json({ success: true, data: skill });
    });
    delete = asyncHandler(async (req, res) => {
        await this.skillUC.delete(req.params.id);
        res.json({ success: true, message: 'Skill eliminada' });
    });
}
exports.SkillController = SkillController;
// ============================================================
// Controlador de Educación
// ============================================================
class EducationController {
    eduUC;
    constructor(eduUC) {
        this.eduUC = eduUC;
    }
    getAll = asyncHandler(async (_req, res) => {
        const educations = await this.eduUC.getAll();
        res.json({ success: true, data: educations });
    });
    getById = asyncHandler(async (req, res) => {
        const education = await this.eduUC.getById(req.params.id);
        res.json({ success: true, data: education });
    });
    create = asyncHandler(async (req, res) => {
        const education = await this.eduUC.create(req.body);
        res.status(201).json({ success: true, data: education });
    });
    update = asyncHandler(async (req, res) => {
        const education = await this.eduUC.update(req.params.id, req.body);
        res.json({ success: true, data: education });
    });
    delete = asyncHandler(async (req, res) => {
        await this.eduUC.delete(req.params.id);
        res.json({ success: true, message: 'Educación eliminada' });
    });
}
exports.EducationController = EducationController;
// ============================================================
// Controlador de Blog Posts
// ============================================================
class PostController {
    postUC;
    constructor(postUC) {
        this.postUC = postUC;
    }
    getAll = asyncHandler(async (req, res) => {
        const { published, tag } = req.query;
        const filters = {
            published: published === 'true' ? true : published === 'false' ? false : undefined,
            tag: tag,
        };
        const posts = await this.postUC.getAll(filters);
        res.json({ success: true, data: posts });
    });
    getBySlug = asyncHandler(async (req, res) => {
        const post = await this.postUC.getBySlug(req.params.slug);
        res.json({ success: true, data: post });
    });
    getById = asyncHandler(async (req, res) => {
        const post = await this.postUC.getById(req.params.id);
        res.json({ success: true, data: post });
    });
    create = asyncHandler(async (req, res) => {
        const post = await this.postUC.create(req.body, req.user.userId);
        res.status(201).json({ success: true, data: post });
    });
    update = asyncHandler(async (req, res) => {
        const post = await this.postUC.update(req.params.id, req.body);
        res.json({ success: true, data: post });
    });
    delete = asyncHandler(async (req, res) => {
        await this.postUC.delete(req.params.id);
        res.json({ success: true, message: 'Post eliminado' });
    });
}
exports.PostController = PostController;
// ============================================================
// Controlador de Mensajes de Contacto
// ============================================================
class ContactController {
    contactUC;
    constructor(contactUC) {
        this.contactUC = contactUC;
    }
    getAll = asyncHandler(async (req, res) => {
        const read = req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined;
        const messages = await this.contactUC.getAll({ read });
        res.json({ success: true, data: messages });
    });
    getById = asyncHandler(async (req, res) => {
        const message = await this.contactUC.getById(req.params.id);
        res.json({ success: true, data: message });
    });
    create = asyncHandler(async (req, res) => {
        // Obtener IP del cliente de forma segura
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        const message = await this.contactUC.create(req.body, ipAddress);
        res.status(201).json({ success: true, data: message });
    });
    markAsRead = asyncHandler(async (req, res) => {
        const message = await this.contactUC.markAsRead(req.params.id);
        res.json({ success: true, data: message });
    });
    markAsReplied = asyncHandler(async (req, res) => {
        const message = await this.contactUC.markAsReplied(req.params.id);
        res.json({ success: true, data: message });
    });
    delete = asyncHandler(async (req, res) => {
        await this.contactUC.delete(req.params.id);
        res.json({ success: true, message: 'Mensaje eliminado' });
    });
    getUnreadCount = asyncHandler(async (_req, res) => {
        const count = await this.contactUC.getUnreadCount();
        res.json({ success: true, data: { unreadCount: count } });
    });
}
exports.ContactController = ContactController;
//# sourceMappingURL=index.js.map