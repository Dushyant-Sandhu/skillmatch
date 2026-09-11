import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { Profile } from '../types';

export const authRouter = Router();

// Get current user / session
authRouter.get('/me', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || 'student-1';
  const profile = db.getProfileById(userId);
  if (!profile) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  return res.json({ user: profile });
});

// Switch demo persona (Instant 1-click role & user toggle)
authRouter.post('/switch-demo', (req: Request, res: Response) => {
  const { userId } = req.body;
  const profile = db.getProfileById(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Demo persona not found' });
  }
  return res.json({ message: 'Switched persona', user: profile });
});

// Signup (Student or Client)
authRouter.post('/signup', (req: Request, res: Response) => {
  const { role, full_name, email, college, course, year, organization, bio, skills } = req.body;

  if (!role || !full_name || !email) {
    return res.status(400).json({ error: 'Role, full name, and email are required' });
  }

  const id = `${role}-${Date.now()}`;
  const newProfile: Profile = {
    id,
    user_id: `user-${Date.now()}`,
    role: role === 'client' ? 'client' : 'student',
    full_name,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`,
    college: college || '',
    course: course || '',
    year: year || '',
    bio: bio || (role === 'student' ? 'Student eager to take on impactful freelance projects.' : 'Client hiring top student talent.'),
    location: 'Remote',
    availability: role === 'student' ? 'Available (15 hrs/week)' : undefined,
    hourly_rate: role === 'student' ? 600 : undefined,
    overall_rating: 5.0,
    completed_projects: 0,
    total_earnings: 0,
    created_at: new Date().toISOString()
  };

  db.createProfile(newProfile);

  // Add primary skills if provided
  if (role === 'student' && Array.isArray(skills)) {
    skills.forEach((skillName: string) => {
      db.addStudentSkill({
        student_id: id,
        skill_id: `skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`,
        skill_name: skillName,
        proficiency: 85,
        proficiency_label: 'Advanced',
        years_experience: 1.5,
        portfolio_count: 1,
        completed_jobs_count: 0
      });
    });
  }

  return res.status(201).json({ message: 'Account created successfully', user: newProfile });
});

// Login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  const profiles = db.getProfiles();
  
  // Find matching profile or default to demo
  let matched = profiles.find((p) => p.user_id.includes(email) || p.full_name.toLowerCase().includes((email || '').toLowerCase()));
  if (!matched) {
    matched = role === 'client' ? profiles.find((p) => p.role === 'client') : profiles.find((p) => p.role === 'student');
  }

  if (!matched) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json({ message: 'Logged in successfully', user: matched });
});

// Reset demo dataset
authRouter.post('/reset-demo', (req: Request, res: Response) => {
  db.resetToSeed();
  return res.json({ message: 'Database reset to initial demo state' });
});
