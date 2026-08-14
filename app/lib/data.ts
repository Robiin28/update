import projectsData from '../data/projects.json';
import experiencesData from '../data/experiences.json';
import blogData from '../data/blog.json';
import skillsData from '../data/skills.json';
import educationData from '../data/education.json';
import profileData from '../data/profile.json';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  imageUrl: string;
  imageFocus?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  dateCompleted: string;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location?: string;
  logoUrl?: string;
  logoFallback?: string;
  accentColor?: string;
  narrative?: string;
  description: string;
  technologies: string[];
  achievements: string[];
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  readTimeMinutes: number;
  coverImage: string;
}

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
}

export interface VolunteerEntry {
  role: string;
  organization: string;
  period: string;
  note?: string;
}

export interface LanguageEntry {
  name: string;
  level: string;
}

export interface Background {
  education: EducationEntry[];
  volunteering: VolunteerEntry[];
  languages: LanguageEntry[];
}

export interface Profile {
  yearsExperience: number;
  aboutPortraitUrl: string;
  sentinelPortraitUrl: string;
  resumeUrl: string;
  bio: string;
  location: string;
  availabilityText: string;
}

const isDatabaseMode = process.env.NEXT_PUBLIC_DATABASE_MODE === 'database';

export async function getProjects(): Promise<Project[]> {
  if (isDatabaseMode) {
    // Implement database fetching logic later
    return [];
  }
  return (projectsData as Project[]).sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

export async function getExperiences(): Promise<Experience[]> {
  if (isDatabaseMode) {
    return [];
  }
  return (experiencesData as Experience[]).sort((a, b) => a.order - b.order);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isDatabaseMode) {
    return [];
  }
  return (blogData as BlogPost[]).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getSkills(): Promise<{ categories: SkillCategory[] }> {
  if (isDatabaseMode) {
    return { categories: [] };
  }
  return skillsData as { categories: SkillCategory[] };
}

export async function getBackground(): Promise<Background> {
  if (isDatabaseMode) {
    return { education: [], volunteering: [], languages: [] };
  }
  return educationData as Background;
}

export async function getProfile(): Promise<Profile> {
  if (isDatabaseMode) {
    return {
      yearsExperience: 0,
      aboutPortraitUrl: "",
      sentinelPortraitUrl: "",
      resumeUrl: "",
      bio: "",
      location: "",
      availabilityText: "",
    };
  }
  return profileData as Profile;
}
