/**
 * @fileoverview portfolio.ts
 * @description Definiciones de tipos e interfaces principales para el portfolio.
 */

export interface ProjectTechnology {
  id?: string;
  name: string;
  projectId?: string;
}

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  slug: string;
  description: string;
  description_en?: string;
  longDescription?: string;
  longDescription_en?: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured?: boolean;
  order?: number;
  status?: string;
  challenges?: string;
  challenges_en?: string;
  solved?: string;
  solved_en?: string;
  evolution?: string;
  evolution_en?: string;
  limitations?: string;
  limitations_en?: string;
  manual?: string;
  manual_en?: string;
  technologies: ProjectTechnology[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  id?: string;
  name: string;
  title: string;
  title_en?: string;
  bio: string;
  bio_en?: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  position_en?: string;
  description: string;
  description_en?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  companyUrl?: string;
  companyLogo?: string;
  order?: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  degree_en?: string;
  field: string;
  field_en?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  description_en?: string;
  order?: number;
}

export interface PostTag {
  id?: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  title_en?: string;
  slug: string;
  excerpt: string;
  excerpt_en?: string;
  content: string;
  content_en?: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: string;
  authorId?: string;
  views?: number;
  tags?: PostTag[];
}

export interface PortfolioData {
  projects: Project[];
  profile: Profile | null;
  exp: Experience[];
  edu: Education[];
  posts: Post[];
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
  color: string;
}
