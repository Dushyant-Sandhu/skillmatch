import { Router, Request, Response } from 'express';
import { extractProjectRequirements } from '../services/geminiService';

export const aiRouter = Router();

aiRouter.post('/analyze-project', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({
        error: 'Please provide a project description of at least 10 characters for AI extraction.'
      });
    }

    const analysis = await extractProjectRequirements(description);

    return res.json({
      success: true,
      data: analysis,
      model: process.env.GEMINI_API_KEY ? 'gemini-1.5-flash' : 'skillmatch-deterministic-engine'
    });
  } catch (error: any) {
    console.error('[AI Route] Error analyzing project description:', error);
    return res.status(500).json({
      error: 'Failed to analyze project description with AI. You can enter requirements manually.'
    });
  }
});
