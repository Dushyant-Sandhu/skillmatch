export type UserRole = 'student' | 'client';

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
  availability?: string; // e.g., '15 hrs/week', 'Available Immediately'
  hourly_rate?: number; // In INR ₹
  overall_rating: number; // 0 - 5.0
  completed_projects: number;
  total_earnings: number; // In INR ₹
  github_connected?: boolean;
  github_username?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string; // e.g. 'Frontend', 'Backend', 'Design', 'Mobile', 'Data', 'AI'
}

export interface StudentSkill {
  student_id: string;
  skill_id: string;
  skill_name?: string;
  proficiency: number; // 1-100
  proficiency_label?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  years_experience: number;
  // Evidence metrics
  portfolio_count?: number;
  completed_jobs_count?: number;
  verified_github?: boolean;
}

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

export type ProjectStatus = 'posted' | 'hired' | 'in_progress' | 'completed' | 'cancelled';

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
  deadline: string; // e.g. '5 days', '2 weeks'
  deadline_days?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: ProjectStatus;
  created_at: string;
  requirements?: ProjectRequirement[];
  applicants_count?: number;
  hired_student_id?: string;
  hired_student_name?: string;
}

export interface ProjectRequirement {
  id: string;
  project_id: string;
  skill_id: string;
  skill_name: string;
  importance: 'high' | 'medium' | 'low';
  required_level: number; // 1-100
}

export type ApplicationStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected';

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
}

export interface ProjectMember {
  id: string;
  project_id: string;
  student_id: string;
  role: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'changes_requested';

export interface ProjectSubmission {
  id: string;
  project_id: string;
  student_id: string;
  message: string;
  submission_url: string;
  github_url?: string;
  status: SubmissionStatus;
  submitted_at: string;
}

export interface Review {
  id: string;
  project_id: string;
  project_title?: string;
  student_id: string;
  client_id: string;
  client_name?: string;
  client_avatar?: string;
  quality_rating: number; // 1-5
  communication_rating: number; // 1-5
  deadline_rating: number; // 1-5
  professionalism_rating: number; // 1-5
  overall_rating: number; // 1-5
  comment: string;
  created_at: string;
}

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

export interface AIAnalysis {
  id: string;
  project_id?: string;
  extracted_requirements: {
    category: string;
    skills: Array<{ name: string; importance: 'high' | 'medium' | 'low' }>;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimated_days: number;
    budget_recommendation?: { min: number; max: number };
  };
  model: string;
  created_at: string;
}

export interface MatchBreakdown {
  skills: number; // 0-100
  experience: number; // 0-100
  portfolio: number; // 0-100
  availability: number; // 0-100
  rating: number; // 0-100
  budget: number; // 0-100
}

export interface MatchResult {
  score: number; // 0-100
  breakdown: MatchBreakdown;
  reasons: string[];
}
