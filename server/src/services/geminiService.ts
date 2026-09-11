import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ExtractedRequirements {
  category: string;
  skills: Array<{ name: string; importance: 'high' | 'medium' | 'low' }>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_days: number;
}

// In-memory cache for fast repeated queries
const cache = new Map<string, ExtractedRequirements>();

/**
 * Deterministic fallback extractor if Gemini API key is missing, network is offline, or rate limited.
 */
export function fallbackExtractRequirements(description: string): ExtractedRequirements {
  const desc = description.toLowerCase();

  let category = 'Web Development';
  if (desc.includes('mobile') || desc.includes('flutter') || desc.includes('ios') || desc.includes('android')) {
    category = 'Mobile App Development';
  } else if (desc.includes('design') || desc.includes('logo') || desc.includes('figma') || desc.includes('ui/ux') || desc.includes('canva')) {
    category = 'UI/UX & Graphic Design';
  } else if (desc.includes('python') || desc.includes('scrape') || desc.includes('automation') || desc.includes('data') || desc.includes('ai')) {
    category = 'Python & Data Automation';
  } else if (desc.includes('content') || desc.includes('writing') || desc.includes('blog') || desc.includes('seo')) {
    category = 'Content & Writing';
  }

  const detectedSkills: Array<{ name: string; importance: 'high' | 'medium' | 'low' }> = [];

  const skillDictionary: Array<{ key: string; name: string; importance: 'high' | 'medium' | 'low' }> = [
    { key: 'react', name: 'React', importance: 'high' },
    { key: 'tailwind', name: 'Tailwind CSS', importance: 'medium' },
    { key: 'node', name: 'Node.js', importance: 'high' },
    { key: 'express', name: 'Express', importance: 'medium' },
    { key: 'python', name: 'Python', importance: 'high' },
    { key: 'flutter', name: 'Flutter', importance: 'high' },
    { key: 'figma', name: 'Figma', importance: 'high' },
    { key: 'ui/ux', name: 'UI/UX Design', importance: 'high' },
    { key: 'responsive', name: 'Responsive Design', importance: 'high' },
    { key: 'html', name: 'HTML/CSS', importance: 'high' },
    { key: 'css', name: 'HTML/CSS', importance: 'medium' },
    { key: 'sql', name: 'SQL', importance: 'medium' },
    { key: 'firebase', name: 'Firebase', importance: 'medium' },
    { key: 'typescript', name: 'TypeScript', importance: 'medium' },
    { key: 'canva', name: 'Canva', importance: 'high' },
    { key: 'seo', name: 'SEO', importance: 'medium' },
    { key: 'api', name: 'REST APIs', importance: 'medium' }
  ];

  for (const item of skillDictionary) {
    if (desc.includes(item.key)) {
      if (!detectedSkills.some((s) => s.name === item.name)) {
        detectedSkills.push({ name: item.name, importance: item.importance });
      }
    }
  }

  // If no skills detected, provide sensible defaults based on category
  if (detectedSkills.length === 0) {
    if (category === 'Web Development') {
      detectedSkills.push({ name: 'React', importance: 'high' }, { name: 'HTML/CSS', importance: 'high' }, { name: 'Responsive Design', importance: 'medium' });
    } else if (category === 'Mobile App Development') {
      detectedSkills.push({ name: 'Flutter', importance: 'high' }, { name: 'Firebase', importance: 'medium' });
    } else if (category === 'UI/UX & Graphic Design') {
      detectedSkills.push({ name: 'Figma', importance: 'high' }, { name: 'UI/UX Design', importance: 'high' });
    } else {
      detectedSkills.push({ name: 'Python', importance: 'high' }, { name: 'Automation', importance: 'medium' });
    }
  }

  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  if (desc.includes('simple') || desc.includes('basic') || desc.includes('quick')) {
    difficulty = 'Beginner';
  } else if (desc.includes('complex') || desc.includes('architecture') || desc.includes('full-stack') || desc.includes('advanced')) {
    difficulty = 'Advanced';
  }

  let estimated_days = 5;
  const daysMatch = desc.match(/(\d+)\s*(day|days)/);
  if (daysMatch && daysMatch[1]) {
    estimated_days = parseInt(daysMatch[1], 10);
  } else if (difficulty === 'Beginner') {
    estimated_days = 3;
  } else if (difficulty === 'Advanced') {
    estimated_days = 10;
  }

  return {
    category,
    skills: detectedSkills.slice(0, 5),
    difficulty,
    estimated_days
  };
}

export async function extractProjectRequirements(description: string): Promise<ExtractedRequirements> {
  const trimmed = description.trim();
  if (cache.has(trimmed)) {
    return cache.get(trimmed)!;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const result = fallbackExtractRequirements(trimmed);
    cache.set(trimmed, result);
    return result;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `You are an expert technical project analyst for SkillMatch freelance marketplace.
Analyze this freelance project description posted by a client and extract structured requirements:
"${trimmed}"

Return ONLY valid JSON adhering strictly to this schema:
{
  "category": "Web Development" | "Mobile App Development" | "UI/UX & Graphic Design" | "Python & Data Automation" | "Content & Writing",
  "skills": [
    { "name": string, "importance": "high" | "medium" | "low" }
  ],
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "estimated_days": number
}`;

    const response = await model.generateContent(prompt);
    const responseText = response.response.text()?.trim() || '';
    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Validate fields
    const validated: ExtractedRequirements = {
      category: typeof parsed.category === 'string' ? parsed.category : 'Web Development',
      skills: Array.isArray(parsed.skills) && parsed.skills.length > 0
        ? parsed.skills.map((s: any) => ({
            name: String(s.name || 'Web Development'),
            importance: ['high', 'medium', 'low'].includes(s.importance) ? s.importance : 'medium'
          }))
        : fallbackExtractRequirements(trimmed).skills,
      difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(parsed.difficulty)
        ? parsed.difficulty
        : 'Intermediate',
      estimated_days: Number.isInteger(parsed.estimated_days) && parsed.estimated_days > 0
        ? parsed.estimated_days
        : 5
    };

    cache.set(trimmed, validated);
    return validated;
  } catch (error) {
    console.warn('[GeminiService] AI extraction failed or unavailable, using deterministic fallback:', error);
    const fallback = fallbackExtractRequirements(trimmed);
    cache.set(trimmed, fallback);
    return fallback;
  }
}
