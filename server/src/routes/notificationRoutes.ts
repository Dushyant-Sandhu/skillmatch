import { Router, Request, Response } from 'express';
import { db } from '../db/database';

export const notificationRouter = Router();

notificationRouter.get('/', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || 'student-1';
  const notifications = db.getNotifications(userId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return res.json({ notifications, unreadCount });
});

notificationRouter.patch('/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.markNotificationRead(id);
  return res.json({ success });
});

notificationRouter.post('/read-all', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || 'student-1';
  db.markAllNotificationsRead(userId);
  return res.json({ success: true });
});
