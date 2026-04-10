import { Request, Response, NextFunction } from 'express';
import { AuthUseCase, ProfileUseCase, ProjectUseCase, ExperienceUseCase, SkillUseCase, EducationUseCase, PostUseCase, ContactMessageUseCase } from '../../application/use-cases';
export declare class AuthController {
    private authUC;
    constructor(authUC: AuthUseCase);
    register: (req: Request, res: Response, next: NextFunction) => void;
    login: (req: Request, res: Response, next: NextFunction) => void;
    refreshToken: (req: Request, res: Response, next: NextFunction) => void;
    logout: (req: Request, res: Response, next: NextFunction) => void;
    me: (req: Request, res: Response, next: NextFunction) => void;
}
export declare class ProfileController {
    private profileUC;
    constructor(profileUC: ProfileUseCase);
    getProfile: (req: Request, res: Response, next: NextFunction) => void;
    createProfile: (req: Request, res: Response, next: NextFunction) => void;
    updateProfile: (req: Request, res: Response, next: NextFunction) => void;
}
export declare class ProjectController {
    private projectUC;
    constructor(projectUC: ProjectUseCase);
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getBySlug: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
export declare class ExperienceController {
    private expUC;
    constructor(expUC: ExperienceUseCase);
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
export declare class SkillController {
    private skillUC;
    constructor(skillUC: SkillUseCase);
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
export declare class EducationController {
    private eduUC;
    constructor(eduUC: EducationUseCase);
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
export declare class PostController {
    private postUC;
    constructor(postUC: PostUseCase);
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getBySlug: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
export declare class ContactController {
    private contactUC;
    constructor(contactUC: ContactMessageUseCase);
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    markAsRead: (req: Request, res: Response, next: NextFunction) => void;
    markAsReplied: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
    getUnreadCount: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=index.d.ts.map