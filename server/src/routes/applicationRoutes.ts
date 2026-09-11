import { Router, Request, Response } from 'express';
import { db } from '../db/database';

export const applicationRouter = Router();

// Get applications
applicationRouter.get('/', (req: Request, res: Response) => {
  const { student_id, project_id } = req.query;
  const currentUserId = (req.headers['x-user-id'] as string) || 'student-1';

  const filterStudentId = (student_id as string) || (currentUserId.startsWith('student') ? currentUserId : undefined);

  const applications = db.getApplications({
    student_id: filterStudentId,
    project_id: project_id as string
  });

  return res.json({ applications });
});

// Update application status (shortlist, reject, accept)
applicationRouter.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid application status' });
  }

  const updated = db.updateApplicationStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Application not found' });
  }

  return res.json({ message: `Application marked as ${status}`, application: updated });
});
