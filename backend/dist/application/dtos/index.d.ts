import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodString;
    name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const UpdateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    title: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    bio: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    email: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    avatarUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    resumeUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    githubUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    linkedinUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    twitterUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    websiteUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    title?: string | undefined;
    bio?: string | undefined;
    phone?: string | null | undefined;
    location?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    resumeUrl?: string | null | undefined;
    githubUrl?: string | null | undefined;
    linkedinUrl?: string | null | undefined;
    twitterUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    title?: string | undefined;
    bio?: string | undefined;
    phone?: string | null | undefined;
    location?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    resumeUrl?: string | null | undefined;
    githubUrl?: string | null | undefined;
    linkedinUrl?: string | null | undefined;
    twitterUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
}>;
export declare const CreateProfileSchema: z.ZodObject<{
    name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    title: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    bio: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    email: z.ZodEffects<z.ZodString, string, string>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    avatarUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    resumeUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    githubUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    linkedinUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    twitterUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    websiteUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    title: string;
    bio: string;
    phone?: string | null | undefined;
    location?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    resumeUrl?: string | null | undefined;
    githubUrl?: string | null | undefined;
    linkedinUrl?: string | null | undefined;
    twitterUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
}, {
    email: string;
    name: string;
    title: string;
    bio: string;
    phone?: string | null | undefined;
    location?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    resumeUrl?: string | null | undefined;
    githubUrl?: string | null | undefined;
    linkedinUrl?: string | null | undefined;
    twitterUrl?: string | null | undefined;
    websiteUrl?: string | null | undefined;
}>;
export declare const CreateProjectSchema: z.ZodObject<{
    title: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    slug: z.ZodString;
    description: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    longDescription: z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    imageUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    liveUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    githubUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    technologies: z.ZodArray<z.ZodString, "many">;
    category: z.ZodString;
    featured: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["DRAFT", "PUBLISHED", "ARCHIVED"]>>;
    startDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    title: string;
    slug: string;
    description: string;
    technologies: string[];
    category: string;
    featured: boolean;
    order: number;
    githubUrl?: string | null | undefined;
    longDescription?: string | null | undefined;
    imageUrl?: string | null | undefined;
    liveUrl?: string | null | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
}, {
    title: string;
    slug: string;
    description: string;
    technologies: string[];
    category: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    githubUrl?: string | null | undefined;
    longDescription?: string | null | undefined;
    imageUrl?: string | null | undefined;
    liveUrl?: string | null | undefined;
    featured?: boolean | undefined;
    order?: number | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
}>;
export declare const UpdateProjectSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    longDescription: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
    liveUrl: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
    githubUrl: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
    technologies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    category: z.ZodOptional<z.ZodString>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["DRAFT", "PUBLISHED", "ARCHIVED"]>>>;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    githubUrl?: string | null | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    longDescription?: string | null | undefined;
    imageUrl?: string | null | undefined;
    liveUrl?: string | null | undefined;
    technologies?: string[] | undefined;
    category?: string | undefined;
    featured?: boolean | undefined;
    order?: number | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
}, {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    githubUrl?: string | null | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    longDescription?: string | null | undefined;
    imageUrl?: string | null | undefined;
    liveUrl?: string | null | undefined;
    technologies?: string[] | undefined;
    category?: string | undefined;
    featured?: boolean | undefined;
    order?: number | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
}>;
export declare const CreateExperienceSchema: z.ZodObject<{
    company: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    position: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    description: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    current: z.ZodDefault<z.ZodBoolean>;
    location: z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    companyUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    companyLogo: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    description: string;
    order: number;
    startDate: string;
    company: string;
    position: string;
    current: boolean;
    location?: string | null | undefined;
    endDate?: string | null | undefined;
    companyUrl?: string | null | undefined;
    companyLogo?: string | null | undefined;
}, {
    description: string;
    startDate: string;
    company: string;
    position: string;
    location?: string | null | undefined;
    order?: number | undefined;
    endDate?: string | null | undefined;
    current?: boolean | undefined;
    companyUrl?: string | null | undefined;
    companyLogo?: string | null | undefined;
}>;
export declare const UpdateExperienceSchema: z.ZodObject<{
    company: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    position: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    description: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    current: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>>;
    companyUrl: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
    companyLogo: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    location?: string | null | undefined;
    description?: string | undefined;
    order?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | null | undefined;
    company?: string | undefined;
    position?: string | undefined;
    current?: boolean | undefined;
    companyUrl?: string | null | undefined;
    companyLogo?: string | null | undefined;
}, {
    location?: string | null | undefined;
    description?: string | undefined;
    order?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | null | undefined;
    company?: string | undefined;
    position?: string | undefined;
    current?: boolean | undefined;
    companyUrl?: string | null | undefined;
    companyLogo?: string | null | undefined;
}>;
export declare const CreateSkillSchema: z.ZodObject<{
    name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    category: z.ZodString;
    level: z.ZodDefault<z.ZodNumber>;
    iconUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    level: number;
    name: string;
    category: string;
    order: number;
    iconUrl?: string | null | undefined;
}, {
    name: string;
    category: string;
    level?: number | undefined;
    order?: number | undefined;
    iconUrl?: string | null | undefined;
}>;
export declare const UpdateSkillSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    category: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    iconUrl: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    level?: number | undefined;
    name?: string | undefined;
    category?: string | undefined;
    order?: number | undefined;
    iconUrl?: string | null | undefined;
}, {
    level?: number | undefined;
    name?: string | undefined;
    category?: string | undefined;
    order?: number | undefined;
    iconUrl?: string | null | undefined;
}>;
export declare const CreateEducationSchema: z.ZodObject<{
    institution: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    degree: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    field: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    current: z.ZodDefault<z.ZodBoolean>;
    description: z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    order: number;
    startDate: string;
    current: boolean;
    institution: string;
    degree: string;
    field: string;
    description?: string | null | undefined;
    endDate?: string | null | undefined;
}, {
    startDate: string;
    institution: string;
    degree: string;
    field: string;
    description?: string | null | undefined;
    order?: number | undefined;
    endDate?: string | null | undefined;
    current?: boolean | undefined;
}>;
export declare const UpdateEducationSchema: z.ZodObject<{
    institution: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    degree: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    field: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    current: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>>;
    order: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    description?: string | null | undefined;
    order?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | null | undefined;
    current?: boolean | undefined;
    institution?: string | undefined;
    degree?: string | undefined;
    field?: string | undefined;
}, {
    description?: string | null | undefined;
    order?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | null | undefined;
    current?: boolean | undefined;
    institution?: string | undefined;
    degree?: string | undefined;
    field?: string | undefined;
}>;
export declare const CreatePostSchema: z.ZodObject<{
    title: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    slug: z.ZodString;
    excerpt: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    content: z.ZodString;
    coverImage: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    published: z.ZodDefault<z.ZodBoolean>;
    publishedAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    published: boolean;
    coverImage?: string | null | undefined;
    publishedAt?: string | null | undefined;
}, {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null | undefined;
    tags?: string[] | undefined;
    published?: boolean | undefined;
    publishedAt?: string | null | undefined;
}>;
export declare const UpdatePostSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    coverImage: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    published: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    coverImage?: string | null | undefined;
    tags?: string[] | undefined;
    published?: boolean | undefined;
    publishedAt?: string | null | undefined;
}, {
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    coverImage?: string | null | undefined;
    tags?: string[] | undefined;
    published?: boolean | undefined;
    publishedAt?: string | null | undefined;
}>;
export declare const CreateContactMessageSchema: z.ZodObject<{
    name: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    email: z.ZodEffects<z.ZodString, string, string>;
    subject: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
    message: z.ZodPipeline<z.ZodEffects<z.ZodString, string, string>, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    email: string;
    name: string;
    subject: string;
}, {
    message: string;
    email: string;
    name: string;
    subject: string;
}>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export type CreateExperienceDto = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceDto = z.infer<typeof UpdateExperienceSchema>;
export type CreateSkillDto = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillDto = z.infer<typeof UpdateSkillSchema>;
export type CreateEducationDto = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationDto = z.infer<typeof UpdateEducationSchema>;
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
export type CreateContactMessageDto = z.infer<typeof CreateContactMessageSchema>;
//# sourceMappingURL=index.d.ts.map