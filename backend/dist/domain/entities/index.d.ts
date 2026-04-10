export declare enum UserRole {
    ADMIN = "ADMIN",
    EDITOR = "EDITOR",
    VIEWER = "VIEWER"
}
export declare enum ProjectStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export interface UserEntity {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    refreshToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProfileEntity {
    id: string;
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string | null;
    location?: string | null;
    avatarUrl?: string | null;
    resumeUrl?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    websiteUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProjectEntity {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription?: string | null;
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    technologies: string[];
    category: string;
    featured: boolean;
    order: number;
    status: ProjectStatus;
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface ExperienceEntity {
    id: string;
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
    location?: string | null;
    companyUrl?: string | null;
    companyLogo?: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface SkillEntity {
    id: string;
    name: string;
    category: string;
    level: number;
    iconUrl?: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface EducationEntity {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
    description?: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface PostEntity {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    tags: string[];
    published: boolean;
    publishedAt?: Date | null;
    authorId: string;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ContactMessageEntity {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    replied: boolean;
    ipAddress?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=index.d.ts.map