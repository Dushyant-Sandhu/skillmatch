import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { calculateMatchScore } from '../services/matchingEngine';
import { StudentSkill, PortfolioProject } from '../types';

export const studentRouter = Router();

// List students
studentRouter.get('/', (req: Request, res: Response) => {
  const { skill, search } = req.query;
  let students = db.getProfiles().filter((p) => p.role === 'student');

  if (search) {
    const q = (search as string).toLowerCase();
    students = students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        (s.college && s.college.toLowerCase().includes(q)) ||
        (s.bio && s.bio.toLowerCase().includes(q))
    );
  }

  const enriched = students.map((s) => {
    const skills = db.getStudentSkills(s.id);
    const portfolio = db.getPortfolioProjects(s.id);
    return {
      ...s,
      skills,
      portfolio_count: portfolio.length
    };
  });

  if (skill) {
    const targetSkill = (skill as string).toLowerCase();
    return res.json({
      students: enriched.filter((s) =>
        s.skills.some((sk) => sk.skill_name?.toLowerCase().includes(targetSkill))
      )
    });
  }

  return res.json({ students: enriched });
});

// Get single student profile with verified skills, evidence, portfolio, and reviews
studentRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = db.getProfileById(id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const skills = db.getStudentSkills(student.id);
  const portfolio = db.getPortfolioProjects(student.id);
  const reviews = db.getReviews({ student_id: student.id });
  const applications = db.getApplications({ student_id: student.id });

  // Calculate profile completion percentage
  let profileStrength = 40;
  if (student.bio && student.bio.length > 20) profileStrength += 15;
  if (skills.length >= 3) profileStrength += 15;
  if (portfolio.length >= 2) profileStrength += 15;
  if (student.github_connected) profileStrength += 10;
  if (student.college) profileStrength += 5;
  profileStrength = Math.min(100, profileStrength);

  return res.json({
    student,
    skills,
    portfolio,
    reviews,
    applications_count: applications.length,
    profile_strength: profileStrength
  });
});

// Update student profile
studentRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.updateProfile(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }
  return res.json({ message: 'Profile updated successfully', student: updated });
});

// Add or update student skill
studentRouter.post('/:id/skills', (req: Request, res: Response) => {
  const { id } = req.params;
  const { skill_name, proficiency, years_experience } = req.body;

  if (!skill_name) {
    return res.status(400).json({ error: 'Skill name is required' });
  }

  const student = db.getProfileById(id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const prof = Number(proficiency) || 80;
  let proficiency_label: StudentSkill['proficiency_label'] = 'Intermediate';
  if (prof >= 90) proficiency_label = 'Expert';
  else if (prof >= 75) proficiency_label = 'Advanced';
  else if (prof <= 50) proficiency_label = 'Beginner';

  const newSkill: StudentSkill = {
    student_id: id,
    skill_id: `skill-${skill_name.toLowerCase().replace(/\s+/g, '-')}`,
    skill_name,
    proficiency: prof,
    proficiency_label,
    years_experience: Number(years_experience) || 1.0,
    portfolio_count: 1,
    completed_jobs_count: 0,
    verified_github: student.github_connected || false
  };

  db.addStudentSkill(newSkill);
  return res.status(201).json({ message: 'Skill added', skill: newSkill });
});

// Add portfolio project
studentRouter.post('/:id/portfolio', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, technologies, project_url, github_url, image_url } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newProject: PortfolioProject = {
    id: `port-${Date.now()}`,
    student_id: id,
    title,
    description,
    technologies: Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? technologies.split(',').map((t) => t.trim())
      : ['React'],
    project_url,
    github_url,
    image_url: image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  };

  db.addPortfolioProject(newProject);
  return res.status(201).json({ message: 'Portfolio project added', project: newProject });
});

// Personalized project matches for a student
studentRouter.get('/:id/matches', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = db.getProfileById(id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const skills = db.getStudentSkills(student.id);
  const portfolio = db.getPortfolioProjects(student.id);
  const projects = db.getProjects({ status: 'posted' });

  const matchedProjects = projects.map((proj) => {
    const match = calculateMatchScore(student, skills, portfolio, proj);
    return {
      ...proj,
      match_score: match.score,
      match_breakdown: match.breakdown,
      match_reasons: match.reasons
    };
  });

  // Sort descending by match score
  matchedProjects.sort((a, b) => b.match_score - a.match_score);

  return res.json({ matches: matchedProjects });
});
