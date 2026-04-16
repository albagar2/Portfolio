// ============================================================
// Definición de Rutas API
// Configura todas las rutas con sus middleware de validación,
// autenticación y autorización
// ============================================================

import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRole } from '../../domain/entities';
import {
  LoginSchema, RegisterSchema, RefreshTokenSchema,
  CreateProfileSchema, UpdateProfileSchema,
  CreateProjectSchema, UpdateProjectSchema,
  CreateExperienceSchema, UpdateExperienceSchema,
  CreateSkillSchema, UpdateSkillSchema,
  CreateEducationSchema, UpdateEducationSchema,
  CreatePostSchema, UpdatePostSchema,
  CreateContactMessageSchema,
} from '../../application/dtos';
import {
  AuthController, ProfileController, ProjectController,
  ExperienceController, SkillController, EducationController,
  PostController, ContactController,
} from '../controllers';
import {
  AuthUseCase, ProfileUseCase, ProjectUseCase, ExperienceUseCase,
  SkillUseCase, EducationUseCase, PostUseCase, ContactMessageUseCase,
} from '../../application/use-cases';
import {
  UserRepository, ProfileRepository, ProjectRepository,
  ExperienceRepository, SkillRepository, EducationRepository,
  PostRepository, ContactMessageRepository,
} from '../../infrastructure/repositories';

// ---- Inicializar Repositorios ----
const userRepo = new UserRepository();
const profileRepo = new ProfileRepository();
const projectRepo = new ProjectRepository();
const expRepo = new ExperienceRepository();
const skillRepo = new SkillRepository();
const eduRepo = new EducationRepository();
const postRepo = new PostRepository();
const contactRepo = new ContactMessageRepository();

// ---- Inicializar Casos de Uso ----
const authUC = new AuthUseCase(userRepo);
const profileUC = new ProfileUseCase(profileRepo);
const projectUC = new ProjectUseCase(projectRepo);
const expUC = new ExperienceUseCase(expRepo);
const skillUC = new SkillUseCase(skillRepo);
const eduUC = new EducationUseCase(eduRepo);
const postUC = new PostUseCase(postRepo);
const contactUC = new ContactMessageUseCase(contactRepo);

// ---- Inicializar Controladores ----
const authCtrl = new AuthController(authUC);
const profileCtrl = new ProfileController(profileUC);
const projectCtrl = new ProjectController(projectUC);
const expCtrl = new ExperienceController(expUC);
const skillCtrl = new SkillController(skillUC);
const eduCtrl = new EducationController(eduUC);
const postCtrl = new PostController(postUC);
const contactCtrl = new ContactController(contactUC);

// ============================================================
// Router Principal
// ============================================================
const router = Router();

// ---- Health Check ----
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Portfolio activa', timestamp: new Date().toISOString() });
});

// ---- Rutas de Autenticación ----
const authRouter = Router();
authRouter.post('/register', validate(RegisterSchema), authCtrl.register);
authRouter.post('/login', validate(LoginSchema), authCtrl.login);
authRouter.post('/refresh', validate(RefreshTokenSchema), authCtrl.refreshToken);
authRouter.post('/logout', authMiddleware, authCtrl.logout);
authRouter.get('/me', authMiddleware, authCtrl.me);
router.use('/auth', authRouter);

// ---- Rutas de Perfil ----
const profileRouter = Router();
profileRouter.get('/', profileCtrl.getProfile); // Público
profileRouter.post('/', authMiddleware, authorize(UserRole.ADMIN), validate(CreateProfileSchema), profileCtrl.createProfile);
profileRouter.put('/:id', authMiddleware, authorize(UserRole.ADMIN), validate(UpdateProfileSchema), profileCtrl.updateProfile);
router.use('/profile', profileRouter);

// ---- Rutas de Proyectos ----
const projectRouter = Router();
projectRouter.get('/', projectCtrl.getAll); // Público
projectRouter.get('/slug/:slug', projectCtrl.getBySlug); // Público
projectRouter.get('/:id', projectCtrl.getById); // Público
projectRouter.post('/', authMiddleware, authorize(UserRole.ADMIN, UserRole.EDITOR), validate(CreateProjectSchema), projectCtrl.create);
projectRouter.put('/:id', authMiddleware, authorize(UserRole.ADMIN, UserRole.EDITOR), validate(UpdateProjectSchema), projectCtrl.update);
projectRouter.patch('/reorder', authMiddleware, authorize(UserRole.ADMIN), projectCtrl.reorder);
projectRouter.delete('/:id', authMiddleware, authorize(UserRole.ADMIN), projectCtrl.delete);
router.use('/projects', projectRouter);

// ---- Rutas de Experiencia ----
const expRouter = Router();
expRouter.get('/', expCtrl.getAll); // Público
expRouter.get('/:id', expCtrl.getById); // Público
expRouter.post('/', authMiddleware, authorize(UserRole.ADMIN), validate(CreateExperienceSchema), expCtrl.create);
expRouter.put('/:id', authMiddleware, authorize(UserRole.ADMIN), validate(UpdateExperienceSchema), expCtrl.update);
expRouter.delete('/:id', authMiddleware, authorize(UserRole.ADMIN), expCtrl.delete);
router.use('/experience', expRouter);

// ---- Rutas de Skills ----
const skillRouter = Router();
skillRouter.get('/', skillCtrl.getAll); // Público
skillRouter.get('/:id', skillCtrl.getById); // Público
skillRouter.post('/', authMiddleware, authorize(UserRole.ADMIN), validate(CreateSkillSchema), skillCtrl.create);
skillRouter.put('/:id', authMiddleware, authorize(UserRole.ADMIN), validate(UpdateSkillSchema), skillCtrl.update);
skillRouter.delete('/:id', authMiddleware, authorize(UserRole.ADMIN), skillCtrl.delete);
router.use('/skills', skillRouter);

// ---- Rutas de Educación ----
const eduRouter = Router();
eduRouter.get('/', eduCtrl.getAll); // Público
eduRouter.get('/:id', eduCtrl.getById); // Público
eduRouter.post('/', authMiddleware, authorize(UserRole.ADMIN), validate(CreateEducationSchema), eduCtrl.create);
eduRouter.put('/:id', authMiddleware, authorize(UserRole.ADMIN), validate(UpdateEducationSchema), eduCtrl.update);
eduRouter.delete('/:id', authMiddleware, authorize(UserRole.ADMIN), eduCtrl.delete);
router.use('/education', eduRouter);

// ---- Rutas de Blog ----
const postRouter = Router();
postRouter.get('/', postCtrl.getAll); // Público (filtra por published)
postRouter.get('/slug/:slug', postCtrl.getBySlug); // Público
postRouter.get('/:id', postCtrl.getById); // Público
postRouter.post('/', authMiddleware, authorize(UserRole.ADMIN, UserRole.EDITOR), validate(CreatePostSchema), postCtrl.create);
postRouter.put('/:id', authMiddleware, authorize(UserRole.ADMIN, UserRole.EDITOR), validate(UpdatePostSchema), postCtrl.update);
postRouter.delete('/:id', authMiddleware, authorize(UserRole.ADMIN), postCtrl.delete);
router.use('/posts', postRouter);

// ---- Rutas de Contacto ----
const contactRouter = Router();
contactRouter.post('/', validate(CreateContactMessageSchema), contactCtrl.create); // Público
contactRouter.get('/', authMiddleware, authorize(UserRole.ADMIN), contactCtrl.getAll); // Solo admin
contactRouter.get('/unread-count', authMiddleware, authorize(UserRole.ADMIN), contactCtrl.getUnreadCount);
contactRouter.get('/:id', authMiddleware, authorize(UserRole.ADMIN), contactCtrl.getById);
contactRouter.patch('/:id/read', authMiddleware, authorize(UserRole.ADMIN), contactCtrl.markAsRead);
contactRouter.patch('/:id/replied', authMiddleware, authorize(UserRole.ADMIN), contactCtrl.markAsReplied);
contactRouter.delete('/:id', authMiddleware, authorize(UserRole.ADMIN), contactCtrl.delete);
router.use('/contact', contactRouter);

// ---- Rutas de Upload ----
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, data: { url: fileUrl } });
});

export { router as apiRouter };
