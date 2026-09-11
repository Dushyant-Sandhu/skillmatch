export type UserRole = 'student' | 'client';
export const UserRole = { STUDENT: 'student', CLIENT: 'client' } as const;

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string;
  college?: string;
  course?: string;
  year?: string;
  bio?: string;
  location?: string;
  availability?: string;
  hourly_rate?: number;
  overall_rating: number;
  completed_projects: number;
  total_earnings: number;
  github_connected?: boolean;
  github_username?: string;
  created_at: string;
}
export const Profile = {};

export interface Skill {
  id: string;
  name: string;
  category: string;
}
export const Skill = {};

export interface StudentSkill {
  student_id: string;
  skill_id: string;
  skill_name?: string;
  proficiency: number;
  proficiency_label?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  years_experience: number;
  portfolio_count?: number;
  completed_jobs_count?: number;
  verified_github?: boolean;
}
export const StudentSkill = {};

export interface PortfolioProject {
  id: string;
  student_id: string;
  title: string;
  description: string;
  technologies: string[];
  project_url?: string;
  github_url?: string;
  image_url?: string;
  created_at: string;
}
export const PortfolioProject = {};

export type ProjectStatus = 'posted' | 'hired' | 'in_progress' | 'completed' | 'cancelled';
export const ProjectStatus = {};

export interface FreelanceProject {
  id: string;
  client_id: string;
  client_name?: string;
  client_avatar?: string;
  client_organization?: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  deadline_days?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: ProjectStatus;
  created_at: string;
  requirements?: ProjectRequirement[];
  applicants_count?: number;
  hired_student_id?: string;
  hired_student_name?: string;
  match_score?: number;
  match_breakdown?: MatchBreakdown;
  match_reasons?: string[];
}
export const FreelanceProject = {};

export interface ProjectRequirement {
  id: string;
  project_id: string;
  skill_id: string;
  skill_name: string;
  importance: 'high' | 'medium' | 'low';
  required_level: number;
}
export const ProjectRequirement = {};

export type ApplicationStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';
export const ApplicationStatus = {};

export interface Application {
  id: string;
  project_id: string;
  project_title?: string;
  student_id: string;
  student_name?: string;
  student_avatar?: string;
  student_rating?: number;
  student_completed_count?: number;
  proposal: string;
  proposed_price: number;
  estimated_days: number;
  status: ApplicationStatus;
  created_at: string;
  match_score?: number;
  match_breakdown?: MatchBreakdown;
  match_reasons?: string[];
  student_skills?: StudentSkill[];
  portfolio_count?: number;
}
export const Application = {};

export interface ProjectSubmission {
  id: string;
  project_id: string;
  student_id: string;
  message: string;
  submission_url: string;
  github_url?: string;
  status: 'pending' | 'approved' | 'changes_requested';
  submitted_at: string;
}
export const ProjectSubmission = {};

export interface Review {
  id: string;
  project_id: string;
  project_title?: string;
  student_id: string;
  client_id: string;
  client_name?: string;
  client_avatar?: string;
  quality_rating: number;
  communication_rating: number;
  deadline_rating: number;
  professionalism_rating: number;
  overall_rating: number;
  comment: string;
  created_at: string;
}
export const Review = {};

export interface Notification {
  id: string;
  user_id: string;
  type: 'application' | 'hire' | 'submission' | 'approval' | 'review' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}
export const Notification = {};

export interface MatchBreakdown {
  skills: number;
  experience: number;
  portfolio: number;
  availability: number;
  rating: number;
  budget: number;
}
export const MatchBreakdown = {};

export interface MatchResult {
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
}
export const MatchResult = {};
