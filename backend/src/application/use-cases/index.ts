/**
 * application/use-cases/index.ts
 * Define los "Casos de Uso" principales del dominio (Auth, Profile, Project, etc.).
 * Implementa la lógica de negocio y orquesta las llamadas a los repositorios
 * de forma independiente de la capa web o de base de datos.
 */
// ============================================================
// Casos de Uso (Application Layer)
// Contienen la lógica de negocio de la aplicación
// Son independientes de frameworks y la capa de presentación
// ============================================================

import { AuthService, TokenPair } from '../../infrastructure/auth/auth.service';
import {
  UserEntity, ProfileEntity, ProjectEntity, ExperienceEntity,
  SkillEntity, EducationEntity, PostEntity, ContactMessageEntity,
} from '../../domain/entities';
import {
  IUserRepository, IProfileRepository, IProjectRepository,
  IExperienceRepository, ISkillRepository, IEducationRepository,
  IPostRepository, IContactMessageRepository,
} from '../../domain/interfaces/repositories';
import {
  NotFoundError, ConflictError, UnauthorizedError, ValidationError,
} from '../../domain/errors';
import {
  RegisterDto, LoginDto, CreateProfileDto, UpdateProfileDto,
  CreateProjectDto, UpdateProjectDto, CreateExperienceDto, UpdateExperienceDto,
  CreateSkillDto, UpdateSkillDto, CreateEducationDto, UpdateEducationDto,
  CreatePostDto, UpdatePostDto, CreateContactMessageDto,
} from '../dtos';
import { logger } from '../../infrastructure/config/logger';
import { EmailService } from '../../infrastructure/services/email.service';

// ============================================================
// Caso de Uso: Autenticación
// ============================================================
export class AuthUseCase {
  constructor(private userRepo: IUserRepository) {}

  /** Registro de nuevo usuario */
  async register(dto: RegisterDto): Promise<{ user: Omit<UserEntity, 'password'>; tokens: TokenPair }> {
    // Verificar si el email ya existe
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await AuthService.hashPassword(dto.password);

    // Crear usuario
    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: 'ADMIN' as any,
      refreshToken: null,
    });

    // Generar tokens
    const tokens = AuthService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Guardar refresh token en BD
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    logger.info('Nuevo usuario registrado', { userId: user.id });

    // Retornar sin password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  /** Login con email y contraseña */
  async login(dto: LoginDto): Promise<{ user: Omit<UserEntity, 'password'>; tokens: TokenPair }> {
    // Buscar usuario
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await AuthService.comparePassword(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar tokens
    const tokens = AuthService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Guardar refresh token
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    logger.info('Usuario autenticado', { userId: user.id });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  /** Renovar tokens con refresh token */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    // Verificar refresh token
    const payload = AuthService.verifyRefreshToken(refreshToken);

    // Buscar usuario
    const user = await this.userRepo.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }
    
    // Saltamos la verificación estricta de rotación para evitar condiciones de carrera en el Dashboard
    // Pero solo si el token es válido por firma y fecha (que ya lo ha comprobado AuthService.verifyRefreshToken)

    // Generar nuevos tokens
    const tokens = AuthService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Actualizar refresh token
    await this.userRepo.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /** Cerrar sesión - invalidar refresh token */
  async logout(userId: string): Promise<void> {
    await this.userRepo.updateRefreshToken(userId, null);
    logger.info('Usuario cerró sesión', { userId });
  }
}

// ============================================================
// Caso de Uso: Perfil
// ============================================================
export class ProfileUseCase {
  constructor(private profileRepo: IProfileRepository) {}

  async getProfile(): Promise<ProfileEntity | null> {
    return this.profileRepo.findFirst();
  }

  async createProfile(dto: CreateProfileDto): Promise<ProfileEntity> {
    // Solo puede existir un perfil
    const existing = await this.profileRepo.findFirst();
    if (existing) {
      throw new ConflictError('Ya existe un perfil. Use la ruta de actualización.');
    }
    return this.profileRepo.create(dto as any);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<ProfileEntity> {
    const profile = await this.profileRepo.findById(id);
    if (!profile) throw new NotFoundError('Perfil', id);
    return this.profileRepo.update(id, dto as any);
  }
}

// ============================================================
// Caso de Uso: Proyectos
// ============================================================
export class ProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async getAll(filters?: { category?: string; featured?: boolean; status?: string }): Promise<ProjectEntity[]> {
    return this.projectRepo.findAll(filters);
  }

  async getBySlug(slug: string): Promise<ProjectEntity> {
    const project = await this.projectRepo.findBySlug(slug);
    if (!project) throw new NotFoundError('Proyecto', slug);
    return project;
  }

  async getById(id: string): Promise<ProjectEntity> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundError('Proyecto', id);
    return project;
  }

  async create(dto: CreateProjectDto): Promise<ProjectEntity> {
    // Verificar slug único
    const existing = await this.projectRepo.findBySlug(dto.slug);
    if (existing) throw new ConflictError(`Ya existe un proyecto con el slug '${dto.slug}'`);
    return this.projectRepo.create(dto as any);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectEntity> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundError('Proyecto', id);

    // Si se cambia el slug, verificar unicidad
    if (dto.slug && dto.slug !== project.slug) {
      const existing = await this.projectRepo.findBySlug(dto.slug);
      if (existing) throw new ConflictError(`Ya existe un proyecto con el slug '${dto.slug}'`);
    }

    return this.projectRepo.update(id, dto as any);
  }

  async delete(id: string): Promise<void> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundError('Proyecto', id);
    await this.projectRepo.delete(id);
    logger.info('Proyecto eliminado', { projectId: id });
  }

  async reorder(ids: string[]): Promise<void> {
    await this.projectRepo.reorder(ids);
    logger.info('Proyectos reordenados');
  }
}

// ============================================================
// Caso de Uso: Experiencia
// ============================================================
export class ExperienceUseCase {
  constructor(private expRepo: IExperienceRepository) {}

  async getAll(): Promise<ExperienceEntity[]> {
    return this.expRepo.findAll();
  }

  async getById(id: string): Promise<ExperienceEntity> {
    const exp = await this.expRepo.findById(id);
    if (!exp) throw new NotFoundError('Experiencia', id);
    return exp;
  }

  async create(dto: CreateExperienceDto): Promise<ExperienceEntity> {
    return this.expRepo.create(dto as any);
  }

  async update(id: string, dto: UpdateExperienceDto): Promise<ExperienceEntity> {
    const exp = await this.expRepo.findById(id);
    if (!exp) throw new NotFoundError('Experiencia', id);
    return this.expRepo.update(id, dto as any);
  }

  async delete(id: string): Promise<void> {
    const exp = await this.expRepo.findById(id);
    if (!exp) throw new NotFoundError('Experiencia', id);
    await this.expRepo.delete(id);
  }
}

// ============================================================
// Caso de Uso: Skills
// ============================================================
export class SkillUseCase {
  constructor(private skillRepo: ISkillRepository) {}

  async getAll(category?: string): Promise<SkillEntity[]> {
    return this.skillRepo.findAll(category);
  }

  async getById(id: string): Promise<SkillEntity> {
    const skill = await this.skillRepo.findById(id);
    if (!skill) throw new NotFoundError('Skill', id);
    return skill;
  }

  async create(dto: CreateSkillDto): Promise<SkillEntity> {
    return this.skillRepo.create(dto as any);
  }

  async update(id: string, dto: UpdateSkillDto): Promise<SkillEntity> {
    const skill = await this.skillRepo.findById(id);
    if (!skill) throw new NotFoundError('Skill', id);
    return this.skillRepo.update(id, dto as any);
  }

  async delete(id: string): Promise<void> {
    const skill = await this.skillRepo.findById(id);
    if (!skill) throw new NotFoundError('Skill', id);
    await this.skillRepo.delete(id);
  }
}

// ============================================================
// Caso de Uso: Educación
// ============================================================
export class EducationUseCase {
  constructor(private eduRepo: IEducationRepository) {}

  async getAll(): Promise<EducationEntity[]> {
    return this.eduRepo.findAll();
  }

  async getById(id: string): Promise<EducationEntity> {
    const edu = await this.eduRepo.findById(id);
    if (!edu) throw new NotFoundError('Educación', id);
    return edu;
  }

  async create(dto: CreateEducationDto): Promise<EducationEntity> {
    return this.eduRepo.create(dto as any);
  }

  async update(id: string, dto: UpdateEducationDto): Promise<EducationEntity> {
    const edu = await this.eduRepo.findById(id);
    if (!edu) throw new NotFoundError('Educación', id);
    return this.eduRepo.update(id, dto as any);
  }

  async delete(id: string): Promise<void> {
    const edu = await this.eduRepo.findById(id);
    if (!edu) throw new NotFoundError('Educación', id);
    await this.eduRepo.delete(id);
  }
}

// ============================================================
// Caso de Uso: Blog Posts
// ============================================================
export class PostUseCase {
  constructor(private postRepo: IPostRepository) {}

  async getAll(filters?: { published?: boolean; tag?: string }): Promise<PostEntity[]> {
    return this.postRepo.findAll(filters);
  }

  async getBySlug(slug: string): Promise<PostEntity> {
    const post = await this.postRepo.findBySlug(slug);
    if (!post) throw new NotFoundError('Post', slug);
    // Incrementar vistas
    await this.postRepo.incrementViews(post.id);
    return post;
  }

  async getById(id: string): Promise<PostEntity> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundError('Post', id);
    return post;
  }

  async create(dto: CreatePostDto, authorId: string): Promise<PostEntity> {
    const existing = await this.postRepo.findBySlug(dto.slug);
    if (existing) throw new ConflictError(`Ya existe un post con el slug '${dto.slug}'`);

    return this.postRepo.create({
      ...dto as any,
      authorId,
      publishedAt: dto.published ? new Date() : null,
    });
  }

  async update(id: string, dto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundError('Post', id);

    if (dto.slug && dto.slug !== post.slug) {
      const existing = await this.postRepo.findBySlug(dto.slug);
      if (existing) throw new ConflictError(`Ya existe un post con el slug '${dto.slug}'`);
    }

    // Si se publica por primera vez, establecer fecha de publicación
    const updateData: any = { ...dto };
    if (dto.published && !post.published) {
      updateData.publishedAt = new Date();
    }

    return this.postRepo.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundError('Post', id);
    await this.postRepo.delete(id);
  }
}

// ============================================================
// Caso de Uso: Mensajes de Contacto
// ============================================================
export class ContactMessageUseCase {
  constructor(private contactRepo: IContactMessageRepository) {}

  async getAll(filters?: { read?: boolean }): Promise<ContactMessageEntity[]> {
    return this.contactRepo.findAll(filters);
  }

  async getById(id: string): Promise<ContactMessageEntity> {
    const msg = await this.contactRepo.findById(id);
    if (!msg) throw new NotFoundError('Mensaje', id);
    return msg;
  }

  async create(dto: CreateContactMessageDto, ipAddress?: string): Promise<ContactMessageEntity> {
    const createdMsg = await this.contactRepo.create({
      ...dto,
      ipAddress: ipAddress || null,
    });

    // Enviar correo de forma asíncrona (en segundo plano)
    EmailService.sendContactMessageEmail({
      name: createdMsg.name,
      email: createdMsg.email,
      subject: createdMsg.subject,
      message: createdMsg.message,
      ipAddress: createdMsg.ipAddress,
      createdAt: createdMsg.createdAt,
    }).catch(err => {
      logger.error('❌ Error asíncrono enviando email de contacto:', { error: err.message });
    });

    return createdMsg;
  }

  async markAsRead(id: string): Promise<ContactMessageEntity> {
    const msg = await this.contactRepo.findById(id);
    if (!msg) throw new NotFoundError('Mensaje', id);
    return this.contactRepo.markAsRead(id);
  }

  async markAsReplied(id: string): Promise<ContactMessageEntity> {
    const msg = await this.contactRepo.findById(id);
    if (!msg) throw new NotFoundError('Mensaje', id);
    return this.contactRepo.markAsReplied(id);
  }

  async delete(id: string): Promise<void> {
    const msg = await this.contactRepo.findById(id);
    if (!msg) throw new NotFoundError('Mensaje', id);
    await this.contactRepo.delete(id);
  }

  async getUnreadCount(): Promise<number> {
    return this.contactRepo.count({ read: false });
  }
}
