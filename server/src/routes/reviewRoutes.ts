import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { Review } from '../types';

export const reviewRouter = Router();

// Submit review for student upon project completion
reviewRouter.post('/', (req: Request, res: Response) => {
  const {
    project_id,
    student_id,
    quality_rating,
    communication_rating,
    deadline_rating,
    professionalism_rating,
    comment
  } = req.body;

  const clientId = (req.headers['x-user-id'] as string) || 'client-1';
  const client = db.getProfileById(clientId);
  const project = db.getProjectById(project_id);

  if (!project_id || !student_id || !comment) {
    return res.status(400).json({ error: 'Project ID, Student ID, and comment are required' });
  }

  const q = Number(quality_rating) || 5;
  const c = Number(communication_rating) || 5;
  const d = Number(deadline_rating) || 5;
  const p = Number(professionalism_rating) || 5;

  // Calculate overall rating as average
  const overall = Math.round(((q + c + d + p) / 4) * 10) / 10;

  const review: Review = {
    id: `rev-${Date.now()}`,
    project_id,
    project_title: project ? project.title : 'Completed Freelance Project',
    student_id,
    client_id: client ? client.id : clientId,
    client_name: client ? client.full_name : 'Client Partner',
    client_avatar: client ? client.avatar_url : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client',
    quality_rating: q,
    communication_rating: c,
    deadline_rating: d,
    professionalism_rating: p,
    overall_rating: overall,
    comment,
    created_at: new Date().toISOString()
  };

  const createdReview = db.createReview(review);
  const updatedStudent = db.getProfileById(student_id);

  return res.status(201).json({
    message: 'Review submitted successfully! Student reputation and completed projects updated.',
    review: createdReview,
    updatedStudent
  });
});

// Get reviews for a student or project
reviewRouter.get('/', (req: Request, res: Response) => {
  const { student_id, client_id, project_id } = req.query;
  const reviews = db.getReviews({
    student_id: student_id as string,
    client_id: client_id as string,
    project_id: project_id as string
  });
  return res.json({ reviews });
});
