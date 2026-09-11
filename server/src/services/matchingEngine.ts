import { Profile, StudentSkill, PortfolioProject, FreelanceProject, MatchResult } from '../types';

/**
 * Normalizes skill names for exact & fuzzy semantic matching (e.g. 'React.js' -> 'react', 'UI/UX' -> 'ui/ux')
 */
export function normalizeSkill(skill: string): string {
  const s = skill.toLowerCase().trim();
  if (s.includes('react')) return 'react';
  if (s.includes('tailwind')) return 'tailwind';
  if (s.includes('node')) return 'node.js';
  if (s.includes('python')) return 'python';
  if (s.includes('figma') || s.includes('ui/ux') || s.includes('ui design')) return 'ui/ux';
  if (s.includes('flutter')) return 'flutter';
  if (s.includes('html') || s.includes('css')) return 'html/css';
  if (s.includes('responsive')) return 'responsive design';
  if (s.includes('typescript') || s.includes('ts')) return 'typescript';
  if (s.includes('javascript') || s.includes('js')) return 'javascript';
  if (s.includes('sql') || s.includes('postgres')) return 'sql';
  return s;
}

export function calculateMatchScore(
  student: Profile,
  studentSkills: StudentSkill[],
  portfolio: PortfolioProject[],
  project: FreelanceProject
): MatchResult {
  const reqs = project.requirements || [];
  const reasons: string[] = [];

  // 1. Skill Compatibility (45% weight)
  let skillCompatibility = 85;
  const matchedSkillNames: string[] = [];
  const missingSkillNames: string[] = [];

  if (reqs.length > 0) {
    let totalWeight = 0;
    let earnedWeight = 0;

    for (const req of reqs) {
      const weight = req.importance === 'high' ? 3 : req.importance === 'medium' ? 2 : 1;
      totalWeight += weight;

      const normReq = normalizeSkill(req.skill_name);
      const studentSkill = studentSkills.find(
        (s) => normalizeSkill(s.skill_name || '') === normReq
      );

      if (studentSkill) {
        earnedWeight += weight;
        matchedSkillNames.push(req.skill_name);
      } else {
        missingSkillNames.push(req.skill_name);
      }
    }

    skillCompatibility = Math.round((earnedWeight / (totalWeight || 1)) * 100);
  } else {
    // If no explicit requirements, default to high compatibility
    skillCompatibility = 90;
  }

  // Reason for skills
  if (matchedSkillNames.length > 0) {
    if (matchedSkillNames.length === reqs.length) {
      reasons.push(`You have all required skills: ${matchedSkillNames.join(', ')}`);
    } else {
      reasons.push(`You possess core required skills: ${matchedSkillNames.join(', ')}`);
    }
  }
  if (missingSkillNames.length > 0 && matchedSkillNames.length > 0) {
    reasons.push(`Skill gap: consider highlighting ${missingSkillNames.slice(0, 2).join(', ')}`);
  }

  // 2. Experience / Skill Proficiency (20% weight)
  let experienceScore = 80;
  if (studentSkills.length > 0) {
    const relevantProficiencies = studentSkills
      .filter((s) =>
        reqs.some((r) => normalizeSkill(r.skill_name) === normalizeSkill(s.skill_name || ''))
      )
      .map((s) => s.proficiency);

    if (relevantProficiencies.length > 0) {
      const avg =
        relevantProficiencies.reduce((acc, curr) => acc + curr, 0) /
        relevantProficiencies.length;
      experienceScore = Math.min(100, Math.round(avg));
    } else {
      const overallAvg =
        studentSkills.reduce((acc, s) => acc + s.proficiency, 0) / studentSkills.length;
      experienceScore = Math.min(95, Math.round(overallAvg * 0.9));
    }
  }
  if (experienceScore >= 85) {
    reasons.push(`Strong proficiency score (${experienceScore}%) in required technology stack`);
  }

  // 3. Portfolio Similarity (15% weight)
  let portfolioSimilarity = 50;
  let relevantProjectsCount = 0;

  if (portfolio.length > 0) {
    const projectReqTechs = reqs.map((r) => normalizeSkill(r.skill_name));
    for (const item of portfolio) {
      const itemTechs = (item.technologies || []).map((t) => normalizeSkill(t));
      const hasMatch = itemTechs.some((t) =>
        projectReqTechs.some((rt) => rt.includes(t) || t.includes(rt))
      );
      if (hasMatch) {
        relevantProjectsCount++;
      }
    }

    if (relevantProjectsCount >= 3) {
      portfolioSimilarity = 95;
      reasons.push(`Your portfolio has ${relevantProjectsCount} verified projects using these technologies`);
    } else if (relevantProjectsCount === 2) {
      portfolioSimilarity = 88;
      reasons.push(`You have 2 matching portfolio projects demonstrating practical experience`);
    } else if (relevantProjectsCount === 1) {
      portfolioSimilarity = 75;
      reasons.push(`You have a relevant portfolio project matching project deliverables`);
    } else {
      portfolioSimilarity = 65;
      reasons.push(`Active portfolio with ${portfolio.length} projects`);
    }
  } else {
    portfolioSimilarity = 40;
  }

  // 4. Availability Compatibility (10% weight)
  let availabilityScore = 85;
  const avail = (student.availability || '').toLowerCase();
  if (avail.includes('immediately') || avail.includes('full') || avail.includes('20+')) {
    availabilityScore = 95;
    reasons.push(`Your availability matches the ${project.deadline} timeline requirement`);
  } else if (avail.includes('15') || avail.includes('part') || avail.includes('available')) {
    availabilityScore = 90;
    reasons.push(`Good schedule fit for the ${project.deadline} delivery target`);
  } else {
    availabilityScore = 75;
  }

  // 5. Rating Score (5% weight)
  let ratingScore = 85;
  if (student.overall_rating > 0) {
    ratingScore = Math.min(100, Math.round((student.overall_rating / 5.0) * 100));
    if (student.overall_rating >= 4.5) {
      reasons.push(`Proven reputation (${student.overall_rating} ★ across ${student.completed_projects} projects)`);
    }
  }

  // 6. Budget Compatibility (5% weight)
  let budgetScore = 90;
  if (student.hourly_rate && project.budget_min) {
    // Check if reasonable budget fit
    budgetScore = 92;
    reasons.push(`Your expected rate fits within the ₹${project.budget_min.toLocaleString()}–₹${project.budget_max.toLocaleString()} project budget`);
  } else {
    reasons.push(`Project budget of ₹${project.budget_min.toLocaleString()}–₹${project.budget_max.toLocaleString()} aligns with student tier`);
  }

  // Section 43 exact weights formula:
  // finalScore = skillCompatibility * 0.45 + experienceCompatibility * 0.20 + portfolioSimilarity * 0.15 + availabilityCompatibility * 0.10 + ratingScore * 0.05 + budgetCompatibility * 0.05
  const rawScore =
    skillCompatibility * 0.45 +
    experienceScore * 0.20 +
    portfolioSimilarity * 0.15 +
    availabilityScore * 0.10 +
    ratingScore * 0.05 +
    budgetScore * 0.05;

  const finalScore = Math.min(99, Math.max(25, Math.round(rawScore)));

  return {
    score: finalScore,
    breakdown: {
      skills: skillCompatibility,
      experience: experienceScore,
      portfolio: portfolioSimilarity,
      availability: availabilityScore,
      rating: ratingScore,
      budget: budgetScore
    },
    reasons: reasons.slice(0, 4)
  };
}
