import { TokenPair } from '../../infrastructure/auth/auth.service';
import { UserEntity, ProfileEntity, ProjectEntity, ExperienceEntity, SkillEntity, EducationEntity, PostEntity, ContactMessageEntity } from '../../domain/entities';
import { IUserRepository, IProfileRepository, IProjectRepository, IExperienceRepository, ISkillRepository, IEducationRepository, IPostRepository, IContactMessageRepository } from '../../domain/interfaces/repositories';
import { RegisterDto, LoginDto, CreateProfileDto, UpdateProfileDto, CreateProjectDto, UpdateProjectDto, CreateExperienceDto, UpdateExperienceDto, CreateSkillDto, UpdateSkillDto, CreateEducationDto, UpdateEducationDto, CreatePostDto, UpdatePostDto, CreateContactMessageDto } from '../dtos';
export declare class AuthUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    /** Registro de nuevo usuario */
    register(dto: RegisterDto): Promise<{
        user: Omit<UserEntity, 'password'>;
        tokens: TokenPair;
    }>;
    /** Login con email y contraseña */
    login(dto: LoginDto): Promise<{
        user: Omit<UserEntity, 'password'>;
        tokens: TokenPair;
    }>;
    /** Renovar tokens con refresh token */
    refreshTokens(refreshToken: string): Promise<TokenPair>;
    /** Cerrar sesión - invalidar refresh token */
    logout(userId: string): Promise<void>;
}
export declare class ProfileUseCase {
    private profileRepo;
    constructor(profileRepo: IProfileRepository);
    getProfile(): Promise<ProfileEntity | null>;
    createProfile(dto: CreateProfileDto): Promise<ProfileEntity>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<ProfileEntity>;
}
export declare class ProjectUseCase {
    private projectRepo;
    constructor(projectRepo: IProjectRepository);
    getAll(filters?: {
        category?: string;
        featured?: boolean;
        status?: string;
    }): Promise<ProjectEntity[]>;
    getBySlug(slug: string): Promise<ProjectEntity>;
    getById(id: string): Promise<ProjectEntity>;
    create(dto: CreateProjectDto): Promise<ProjectEntity>;
    update(id: string, dto: UpdateProjectDto): Promise<ProjectEntity>;
    delete(id: string): Promise<void>;
}
export declare class ExperienceUseCase {
    private expRepo;
    constructor(expRepo: IExperienceRepository);
    getAll(): Promise<ExperienceEntity[]>;
    getById(id: string): Promise<ExperienceEntity>;
    create(dto: CreateExperienceDto): Promise<ExperienceEntity>;
    update(id: string, dto: UpdateExperienceDto): Promise<ExperienceEntity>;
    delete(id: string): Promise<void>;
}
export declare class SkillUseCase {
    private skillRepo;
    constructor(skillRepo: ISkillRepository);
    getAll(category?: string): Promise<SkillEntity[]>;
    getById(id: string): Promise<SkillEntity>;
    create(dto: CreateSkillDto): Promise<SkillEntity>;
    update(id: string, dto: UpdateSkillDto): Promise<SkillEntity>;
    delete(id: string): Promise<void>;
}
export declare class EducationUseCase {
    private eduRepo;
    constructor(eduRepo: IEducationRepository);
    getAll(): Promise<EducationEntity[]>;
    getById(id: string): Promise<EducationEntity>;
    create(dto: CreateEducationDto): Promise<EducationEntity>;
    update(id: string, dto: UpdateEducationDto): Promise<EducationEntity>;
    delete(id: string): Promise<void>;
}
export declare class PostUseCase {
    private postRepo;
    constructor(postRepo: IPostRepository);
    getAll(filters?: {
        published?: boolean;
        tag?: string;
    }): Promise<PostEntity[]>;
    getBySlug(slug: string): Promise<PostEntity>;
    getById(id: string): Promise<PostEntity>;
    create(dto: CreatePostDto, authorId: string): Promise<PostEntity>;
    update(id: string, dto: UpdatePostDto): Promise<PostEntity>;
    delete(id: string): Promise<void>;
}
export declare class ContactMessageUseCase {
    private contactRepo;
    constructor(contactRepo: IContactMessageRepository);
    getAll(filters?: {
        read?: boolean;
    }): Promise<ContactMessageEntity[]>;
    getById(id: string): Promise<ContactMessageEntity>;
    create(dto: CreateContactMessageDto, ipAddress?: string): Promise<ContactMessageEntity>;
    markAsRead(id: string): Promise<ContactMessageEntity>;
    markAsReplied(id: string): Promise<ContactMessageEntity>;
    delete(id: string): Promise<void>;
    getUnreadCount(): Promise<number>;
}
//# sourceMappingURL=index.d.ts.map