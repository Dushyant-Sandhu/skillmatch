import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { authRouter } from './routes/authRoutes';
import { projectRouter } from './routes/projectRoutes';
import { applicationRouter } from './routes/applicationRoutes';
import { workspaceRouter } from './routes/workspaceRoutes';
import { reviewRouter } from './routes/reviewRoutes';
import { studentRouter } from './routes/studentRoutes';
import { notificationRouter } from './routes/notificationRoutes';
import { aiRouter } from './routes/aiRoutes';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/students', studentRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/ai', aiRouter);

// Health check & Root greeting
const healthPayload = () => ({
  status: 'healthy',
  service: 'SkillMatch API Server',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  endpoints: {
    health: '/api/health',
    projects: '/api/projects',
    students: '/api/students'
  }
});

app.get('/', (req, res) => {
  res.json(healthPayload());
});

app.get('/health', (req, res) => {
  res.json(healthPayload());
});

app.get('/api/health', (req, res) => {
  res.json(healthPayload());
});

app.listen(PORT, () => {
  console.log(`🚀 SkillMatch API Server running on http://localhost:${PORT}`);
});
