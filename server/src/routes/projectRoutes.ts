import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { calculateMatchScore } from '../services/matchingEngine';
import { FreelanceProject, Application } from '../types';

export const projectRouter = Router();

// List projects with optional filtering and student matching calculation
projectRouter.get('/', (req: Request, res: Response) => {
  const { category, difficulty, status, search, studentId } = req.query;

  let projects = db.getProjects({
    category: category as string,
    difficulty: difficulty as string,
    status: status as string,
    search: search as string
  });

  // If studentId provided, calculate match score for each project
  const targetStudentId = (studentId as string) || (req.headers['x-user-id'] as string);
  const student = targetStudentId ? db.getProfileById(targetStudentId) : undefined;

  let enriched = projects;
  if (student && student.role === 'student') {
    const studentSkills = db.getStudentSkills(student.id);
    const portfolio = db.getPortfolioProjects(student.id);

    enriched = projects.map((proj) => {
      const match = calculateMatchScore(student, studentSkills, portfolio, proj);
      return {
        ...proj,
        match_score: match.score,
        match_breakdown: match.breakdown,
        match_reasons: match.reasons
      };
    });

    // Optionally sort by match score if not searching
    if (!search) {
      enriched.sort((a, b) => ((b as any).match_score || 0) - ((a as any).match_score || 0));
    }
  }

  return res.json({ projects: enriched });
});

// Get single project detail with match score breakdown
projectRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = db.getProjectById(id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const studentId = (req.query.studentId as string) || (req.headers['x-user-id'] as string) || 'student-1';
  const student = db.getProfileById(studentId);

  let matchResult = null;
  if (student && student.role === 'student') {
    const studentSkills = db.getStudentSkills(student.id);
    const portfolio = db.getPortfolioProjects(student.id);
    matchResult = calculateMatchScore(student, studentSkills, portfolio, project);
  }

  return res.json({
    project,
    match: matchResult
  });
});

// Post a new project (Client)
projectRouter.post('/', (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    budget_min,
    budget_max,
    deadline,
    difficulty,
    requirements
  } = req.body;

  const clientId = (req.headers['x-user-id'] as string) || 'client-1';
  const client = db.getProfileById(clientId);

  if (!title || !description || !category || !budget_min || !budget_max || !deadline) {
    return res.status(400).json({ error: 'Missing required project parameters' });
  }

  const id = `proj-${Date.now()}`;
  const daysMatch = deadline.match(/(\d+)/);
  const deadlineDays = daysMatch ? parseInt(daysMatch[1], 10) : 5;

  const newProject: FreelanceProject = {
    id,
    client_id: client ? client.id : clientId,
    client_name: client ? client.full_name : 'Client Partner',
    client_avatar: client ? client.avatar_url : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client',
    title,
    description,
    category,
    budget_min: Number(budget_min),
    budget_max: Number(budget_max),
    deadline,
    deadline_days: deadlineDays,
    difficulty: difficulty || 'Intermediate',
    status: 'posted',
    applicants_count: 0,
    created_at: new Date().toISOString()
  };

  const reqList: Array<{ skill_name: string; importance: 'high' | 'medium' | 'low'; required_level: number }> =
    Array.isArray(requirements) && requirements.length > 0
      ? requirements.map((r: any) => ({
          skill_name: typeof r === 'string' ? r : r.skill_name || r.name,
          importance: r.importance || 'high',
          required_level: r.required_level || 80
        }))
      : [{ skill_name: 'React', importance: 'high', required_level: 80 }];

  const created = db.createProject(newProject, reqList);

  return res.status(201).json({ message: 'Project created successfully', project: created });
});

// Get applicants for a project, sorted by actual matching score!
projectRouter.get('/:id/applicants', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = db.getProjectById(id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const applications = db.getApplications({ project_id: id });

  // Calculate real match score and skill proof for each applicant
  const enrichedApplicants = applications.map((app) => {
    const student = db.getProfileById(app.student_id);
    if (!student) return app;

    const studentSkills = db.getStudentSkills(student.id);
    const portfolio = db.getPortfolioProjects(student.id);
    const match = calculateMatchScore(student, studentSkills, portfolio, project);

    return {
      ...app,
      student_avatar: student.avatar_url,
      student_name: student.full_name,
      student_rating: student.overall_rating,
      student_completed_count: student.completed_projects,
      match_score: match.score,
      match_breakdown: match.breakdown,
      match_reasons: match.reasons,
      student_skills: studentSkills,
      portfolio_count: portfolio.length
    };
  });

  // Sort by match score descending (Section 19: "Display applicants sorted by actual matching score")
  enrichedApplicants.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  return res.json({ applicants: enrichedApplicants, project });
});

// Apply to a project (Student)
projectRouter.post('/:id/apply', (req: Request, res: Response) => {
  const { id } = req.params;
  const { proposal, proposed_price, estimated_days } = req.body;
  const studentId = (req.headers['x-user-id'] as string) || 'student-1';

  const project = db.getProjectById(id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const student = db.getProfileById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student profile not found' });
  }

  // Check if already applied
  const existing = db.getApplications({ project_id: id, student_id: studentId });
  if (existing.length > 0) {
    return res.status(400).json({ error: 'You have already applied for this project' });
  }

  const studentSkills = db.getStudentSkills(student.id);
  const portfolio = db.getPortfolioProjects(student.id);
  const match = calculateMatchScore(student, studentSkills, portfolio, project);

  const application: Application = {
    id: `app-${Date.now()}`,
    project_id: id,
    project_title: project.title,
    student_id: student.id,
    student_name: student.full_name,
    student_avatar: student.avatar_url,
    student_rating: student.overall_rating,
    student_completed_count: student.completed_projects,
    proposal: proposal || 'I am excited to build this project with precision and on-time delivery.',
    proposed_price: Number(proposed_price) || project.budget_min,
    estimated_days: Number(estimated_days) || project.deadline_days || 5,
    status: 'pending',
    match_score: match.score,
    match_breakdown: match.breakdown,
    created_at: new Date().toISOString()
  };

  db.createApplication(application);

  return res.status(201).json({ message: 'Application submitted successfully', application });
});

// Hire student (Client)
projectRouter.post('/:id/hire', (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentId, applicationId } = req.body;

  const project = db.getProjectById(id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const student = db.getProfileById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Update application status
  if (applicationId) {
    db.updateApplicationStatus(applicationId, 'accepted');
  }

  // Update project status: POSTED -> HIRED / IN_PROGRESS
  const updated = db.updateProjectStatus(id, 'in_progress', student.id, student.full_name);

  // Send direct notification to student
  const notif = {
    id: `notif-${Date.now()}`,
    user_id: student.id,
    type: 'hire' as const,
    title: `You were hired for "${project.title}"! 🎉`,
    message: `Congratulations! The client has hired you. Head over to the project workspace to begin work.`,
    link: `/workspace/${project.id}`,
    read: false,
    created_at: new Date().toISOString()
  };
  (db as any).data.notifications.unshift(notif);

  return res.json({
    message: `Hired ${student.full_name}! Project is now In Progress.`,
    project: updated
  });
});
