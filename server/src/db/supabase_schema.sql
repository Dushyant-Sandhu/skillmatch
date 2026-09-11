-- ==========================================================
-- SkillMatch: Student Freelance Marketplace
-- PostgreSQL & Supabase Production Relational Schema
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL,
  role VARCHAR(16) NOT NULL CHECK (role IN ('student', 'client')),
  full_name VARCHAR(128) NOT NULL,
  avatar_url TEXT NOT NULL,
  college VARCHAR(128),
  course VARCHAR(128),
  year VARCHAR(32),
  bio TEXT,
  location VARCHAR(128),
  availability VARCHAR(64),
  hourly_rate NUMERIC(10, 2) DEFAULT 0,
  overall_rating NUMERIC(3, 2) DEFAULT 0.0 CHECK (overall_rating >= 0 AND overall_rating <= 5.0),
  completed_projects INT DEFAULT 0,
  total_earnings NUMERIC(12, 2) DEFAULT 0,
  github_connected BOOLEAN DEFAULT FALSE,
  github_username VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  category VARCHAR(64) NOT NULL
);

-- 3. STUDENT_SKILLS TABLE
CREATE TABLE IF NOT EXISTS student_skills (
  student_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id VARCHAR(64) REFERENCES skills(id) ON DELETE CASCADE,
  proficiency INT NOT NULL CHECK (proficiency >= 1 AND proficiency <= 100),
  years_experience NUMERIC(3, 1) DEFAULT 1.0,
  portfolio_count INT DEFAULT 0,
  completed_jobs_count INT DEFAULT 0,
  verified_github BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (student_id, skill_id)
);

-- 4. PORTFOLIO_PROJECTS TABLE
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  project_url TEXT,
  github_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FREELANCE_PROJECTS TABLE
CREATE TABLE IF NOT EXISTS freelance_projects (
  id VARCHAR(64) PRIMARY KEY,
  client_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(64) NOT NULL,
  budget_min NUMERIC(10, 2) NOT NULL,
  budget_max NUMERIC(10, 2) NOT NULL,
  deadline VARCHAR(64) NOT NULL,
  difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  status VARCHAR(32) NOT NULL DEFAULT 'posted' CHECK (status IN ('posted', 'hired', 'in_progress', 'completed', 'cancelled')),
  hired_student_id VARCHAR(64) REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROJECT_REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS project_requirements (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES freelance_projects(id) ON DELETE CASCADE,
  skill_id VARCHAR(64) REFERENCES skills(id) ON DELETE CASCADE,
  importance VARCHAR(16) NOT NULL CHECK (importance IN ('high', 'medium', 'low')),
  required_level INT DEFAULT 70 CHECK (required_level >= 1 AND required_level <= 100)
);

-- 7. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES freelance_projects(id) ON DELETE CASCADE,
  student_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  proposed_price NUMERIC(10, 2) NOT NULL,
  estimated_days INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_student_project_application UNIQUE (project_id, student_id)
);

-- 8. PROJECT_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS project_members (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES freelance_projects(id) ON DELETE CASCADE,
  student_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(64) DEFAULT 'freelancer'
);

-- 9. PROJECT_SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS project_submissions (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES freelance_projects(id) ON DELETE CASCADE,
  student_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  submission_url TEXT NOT NULL,
  github_url TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'changes_requested')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES freelance_projects(id) ON DELETE CASCADE,
  student_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  client_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  quality_rating NUMERIC(2, 1) NOT NULL CHECK (quality_rating >= 1.0 AND quality_rating <= 5.0),
  communication_rating NUMERIC(2, 1) NOT NULL CHECK (communication_rating >= 1.0 AND communication_rating <= 5.0),
  deadline_rating NUMERIC(2, 1) NOT NULL CHECK (deadline_rating >= 1.0 AND deadline_rating <= 5.0),
  professionalism_rating NUMERIC(2, 1) NOT NULL CHECK (professionalism_rating >= 1.0 AND professionalism_rating <= 5.0),
  overall_rating NUMERIC(2, 1) NOT NULL CHECK (overall_rating >= 1.0 AND overall_rating <= 5.0),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AI_ANALYSES TABLE
CREATE TABLE IF NOT EXISTS ai_analyses (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES freelance_projects(id) ON DELETE CASCADE,
  extracted_requirements JSONB NOT NULL,
  model VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_freelance_projects_category ON freelance_projects(category);
CREATE INDEX IF NOT EXISTS idx_freelance_projects_status ON freelance_projects(status);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
