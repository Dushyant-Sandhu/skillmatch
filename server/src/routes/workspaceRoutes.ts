import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { ProjectSubmission } from '../types';

export const workspaceRouter = Router();

// Get workspace state for a project
workspaceRouter.get('/:projectId', (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project = db.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const submissions = db.getSubmissions(projectId);
  const hiredStudent = project.hired_student_id ? db.getProfileById(project.hired_student_id) : undefined;
  const reviews = db.getReviews({ project_id: projectId });

  return res.json({
    project,
    hiredStudent,
    submissions,
    reviews
  });
});

// Student submits deliverable
workspaceRouter.post('/:projectId/submit', (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { message, submission_url, github_url } = req.body;
  const studentId = (req.headers['x-user-id'] as string) || 'student-1';

  const project = db.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (!submission_url || !message) {
    return res.status(400).json({ error: 'Submission URL and message description are required' });
  }

  const submission: ProjectSubmission = {
    id: `sub-${Date.now()}`,
    project_id: projectId,
    student_id: studentId,
    message,
    submission_url,
    github_url,
    status: 'pending',
    submitted_at: new Date().toISOString()
  };

  db.createSubmission(submission);

  return res.status(201).json({ message: 'Deliverables submitted successfully', submission });
});

// Client approves completion
workspaceRouter.post('/:projectId/approve', (req: Request, res: Response) => {
  const { projectId } = req.params;
  const project = db.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Update project status to completed
  const updated = db.updateProjectStatus(projectId, 'completed');

  // Update latest submission status to approved
  const submissions = db.getSubmissions(projectId);
  if (submissions.length > 0) {
    submissions[0].status = 'approved';
  }

  // Send notification to student
  if (project.hired_student_id) {
    const notif = {
      id: `notif-${Date.now()}`,
      user_id: project.hired_student_id,
      type: 'approval' as const,
      title: `Work Approved for "${project.title}"! 🏆`,
      message: `The client has officially approved your project deliverables! Project is marked Completed.`,
      link: `/workspace/${project.id}`,
      read: false,
      created_at: new Date().toISOString()
    };
    (db as any).data.notifications.unshift(notif);
  }

  return res.json({
    message: 'Project work approved and marked Completed! Please leave a review for the student.',
    project: updated
  });
});

// Client requests changes
workspaceRouter.post('/:projectId/request-changes', (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { feedback } = req.body;

  const project = db.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const submissions = db.getSubmissions(projectId);
  if (submissions.length > 0) {
    submissions[0].status = 'changes_requested';
  }

  if (project.hired_student_id) {
    const notif = {
      id: `notif-${Date.now()}`,
      user_id: project.hired_student_id,
      type: 'submission' as const,
      title: `Client Requested Changes on "${project.title}"`,
      message: feedback || 'Please review the client feedback and submit revised deliverables.',
      link: `/workspace/${project.id}`,
      read: false,
      created_at: new Date().toISOString()
    };
    (db as any).data.notifications.unshift(notif);
  }

  return res.json({ message: 'Change request sent to student' });
});
