"use strict";
// ============================================================
// Definición de Rutas API
// Configura todas las rutas con sus middleware de validación,
// autenticación y autorización
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const entities_1 = require("../../domain/entities");
const dtos_1 = require("../../application/dtos");
const controllers_1 = require("../controllers");
const use_cases_1 = require("../../application/use-cases");
const repositories_1 = require("../../infrastructure/repositories");
// ---- Inicializar Repositorios ----
const userRepo = new repositories_1.UserRepository();
const profileRepo = new repositories_1.ProfileRepository();
const projectRepo = new repositories_1.ProjectRepository();
const expRepo = new repositories_1.ExperienceRepository();
const skillRepo = new repositories_1.SkillRepository();
const eduRepo = new repositories_1.EducationRepository();
const postRepo = new repositories_1.PostRepository();
const contactRepo = new repositories_1.ContactMessageRepository();
// ---- Inicializar Casos de Uso ----
const authUC = new use_cases_1.AuthUseCase(userRepo);
const profileUC = new use_cases_1.ProfileUseCase(profileRepo);
const projectUC = new use_cases_1.ProjectUseCase(projectRepo);
const expUC = new use_cases_1.ExperienceUseCase(expRepo);
const skillUC = new use_cases_1.SkillUseCase(skillRepo);
const eduUC = new use_cases_1.EducationUseCase(eduRepo);
const postUC = new use_cases_1.PostUseCase(postRepo);
const contactUC = new use_cases_1.ContactMessageUseCase(contactRepo);
// ---- Inicializar Controladores ----
const authCtrl = new controllers_1.AuthController(authUC);
const profileCtrl = new controllers_1.ProfileController(profileUC);
const projectCtrl = new controllers_1.ProjectController(projectUC);
const expCtrl = new controllers_1.ExperienceController(expUC);
const skillCtrl = new controllers_1.SkillController(skillUC);
const eduCtrl = new controllers_1.EducationController(eduUC);
const postCtrl = new controllers_1.PostController(postUC);
const contactCtrl = new controllers_1.ContactController(contactUC);
// ============================================================
// Router Principal
// ============================================================
const router = (0, express_1.Router)();
exports.apiRouter = router;
// ---- Health Check ----
router.get('/health', (_req, res) => {
    res.json({ success: true, message: 'API Portfolio activa', timestamp: new Date().toISOString() });
});
// ---- Rutas de Autenticación ----
const authRouter = (0, express_1.Router)();
authRouter.post('/register', (0, validate_middleware_1.validate)(dtos_1.RegisterSchema), authCtrl.register);
authRouter.post('/login', (0, validate_middleware_1.validate)(dtos_1.LoginSchema), authCtrl.login);
authRouter.post('/refresh', (0, validate_middleware_1.validate)(dtos_1.RefreshTokenSchema), authCtrl.refreshToken);
authRouter.post('/logout', auth_middleware_1.authMiddleware, authCtrl.logout);
authRouter.get('/me', auth_middleware_1.authMiddleware, authCtrl.me);
router.use('/auth', authRouter);
// ---- Rutas de Perfil ----
const profileRouter = (0, express_1.Router)();
profileRouter.get('/', profileCtrl.getProfile); // Público
profileRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.CreateProfileSchema), profileCtrl.createProfile);
profileRouter.put('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.UpdateProfileSchema), profileCtrl.updateProfile);
router.use('/profile', profileRouter);
// ---- Rutas de Proyectos ----
const projectRouter = (0, express_1.Router)();
projectRouter.get('/', projectCtrl.getAll); // Público
projectRouter.get('/slug/:slug', projectCtrl.getBySlug); // Público
projectRouter.get('/:id', projectCtrl.getById); // Público
projectRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN, entities_1.UserRole.EDITOR), (0, validate_middleware_1.validate)(dtos_1.CreateProjectSchema), projectCtrl.create);
projectRouter.put('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN, entities_1.UserRole.EDITOR), (0, validate_middleware_1.validate)(dtos_1.UpdateProjectSchema), projectCtrl.update);
projectRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), projectCtrl.delete);
router.use('/projects', projectRouter);
// ---- Rutas de Experiencia ----
const expRouter = (0, express_1.Router)();
expRouter.get('/', expCtrl.getAll); // Público
expRouter.get('/:id', expCtrl.getById); // Público
expRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.CreateExperienceSchema), expCtrl.create);
expRouter.put('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.UpdateExperienceSchema), expCtrl.update);
expRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), expCtrl.delete);
router.use('/experience', expRouter);
// ---- Rutas de Skills ----
const skillRouter = (0, express_1.Router)();
skillRouter.get('/', skillCtrl.getAll); // Público
skillRouter.get('/:id', skillCtrl.getById); // Público
skillRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.CreateSkillSchema), skillCtrl.create);
skillRouter.put('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.UpdateSkillSchema), skillCtrl.update);
skillRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), skillCtrl.delete);
router.use('/skills', skillRouter);
// ---- Rutas de Educación ----
const eduRouter = (0, express_1.Router)();
eduRouter.get('/', eduCtrl.getAll); // Público
eduRouter.get('/:id', eduCtrl.getById); // Público
eduRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.CreateEducationSchema), eduCtrl.create);
eduRouter.put('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), (0, validate_middleware_1.validate)(dtos_1.UpdateEducationSchema), eduCtrl.update);
eduRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), eduCtrl.delete);
router.use('/education', eduRouter);
// ---- Rutas de Blog ----
const postRouter = (0, express_1.Router)();
postRouter.get('/', postCtrl.getAll); // Público (filtra por published)
postRouter.get('/slug/:slug', postCtrl.getBySlug); // Público
postRouter.get('/:id', postCtrl.getById); // Público
postRouter.post('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN, entities_1.UserRole.EDITOR), (0, validate_middleware_1.validate)(dtos_1.CreatePostSchema), postCtrl.create);
postRouter.put('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN, entities_1.UserRole.EDITOR), (0, validate_middleware_1.validate)(dtos_1.UpdatePostSchema), postCtrl.update);
postRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), postCtrl.delete);
router.use('/posts', postRouter);
// ---- Rutas de Contacto ----
const contactRouter = (0, express_1.Router)();
contactRouter.post('/', (0, validate_middleware_1.validate)(dtos_1.CreateContactMessageSchema), contactCtrl.create); // Público
contactRouter.get('/', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), contactCtrl.getAll); // Solo admin
contactRouter.get('/unread-count', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), contactCtrl.getUnreadCount);
contactRouter.get('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), contactCtrl.getById);
contactRouter.patch('/:id/read', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), contactCtrl.markAsRead);
contactRouter.patch('/:id/replied', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), contactCtrl.markAsReplied);
contactRouter.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorize)(entities_1.UserRole.ADMIN), contactCtrl.delete);
router.use('/contact', contactRouter);
//# sourceMappingURL=index.js.map