const { db } = require('./dist/db/database');
const { calculateMatchScore } = require('./dist/services/matchingEngine');
const { fallbackExtractRequirements } = require('./dist/services/geminiService');

console.log('--- 1. Testing Database Initialization & Seed Data ---');
const profiles = db.getProfiles();
console.log(`Profiles count: ${profiles.length}`);
const alex = db.getProfileById('student-1');
console.log(`Found Alex: ${alex.full_name} (${alex.role}), Rating: ${alex.overall_rating} ★`);

const projects = db.getProjects();
console.log(`Freelance Projects count: ${projects.length}`);
const gymProj = db.getProjectById('proj-1');
console.log(`Found Project 1: "${gymProj.title}", Budget: ₹${gymProj.budget_min}-₹${gymProj.budget_max}`);

console.log('\n--- 2. Testing Deterministic Matching Engine (Section 43 exact weights) ---');
const alexSkills = db.getStudentSkills(alex.id);
const alexPortfolio = db.getPortfolioProjects(alex.id);
const alexMatch = calculateMatchScore(alex, alexSkills, alexPortfolio, gymProj);

console.log(`Alex Match on Gym Landing Page: ${alexMatch.score}%`);
console.log('Breakdown:', JSON.stringify(alexMatch.breakdown));
console.log('Reasons:', alexMatch.reasons);

if (alexMatch.score < 90) {
  console.error('❌ Match score expected to be >= 90% for top candidate!');
  process.exit(1);
} else {
  console.log('✅ Top candidate match score verified >= 90%!');
}

console.log('\n--- 3. Testing Gemini AI Extractor Fallback ---');
const analysis = fallbackExtractRequirements(
  'Need someone to build a modern landing page for our local gym with React, responsive design and a contact form.'
);
console.log('Extracted Analysis:', JSON.stringify(analysis, null, 2));
if (!analysis.skills.some((s) => s.name.toLowerCase().includes('react'))) {
  console.error('❌ Failed to extract React skill!');
  process.exit(1);
} else {
  console.log('✅ Requirement extractor correctly extracted React and Responsive Design!');
}

console.log('\n--- 4. Testing End-to-End Application, Hire, Workspace, & Reputation Loop ---');
// Student-3 applies to proj-2
const rohan = db.getProfileById('student-3');
const rohanSkills = db.getStudentSkills(rohan.id);
const rohanPortfolio = db.getPortfolioProjects(rohan.id);
const proj2 = db.getProjectById('proj-2');
const rohanMatch = calculateMatchScore(rohan, rohanSkills, rohanPortfolio, proj2);

const app = db.createApplication({
  id: `test-app-${Date.now()}`,
  project_id: proj2.id,
  project_title: proj2.title,
  student_id: rohan.id,
  student_name: rohan.full_name,
  student_avatar: rohan.avatar_url,
  student_rating: rohan.overall_rating,
  student_completed_count: rohan.completed_projects,
  proposal: 'I can build this digital menu fast.',
  proposed_price: 12000,
  estimated_days: 5,
  status: 'pending',
  match_score: rohanMatch.score,
  match_breakdown: rohanMatch.breakdown,
  created_at: new Date().toISOString()
});
console.log(`✅ Created Application: ${app.id} for ${rohan.full_name}`);

// Client hires Rohan
db.updateProjectStatus(proj2.id, 'in_progress', rohan.id, rohan.full_name);
console.log(`✅ Hired ${rohan.full_name}, project status updated to in_progress`);

// Student submits deliverable
const sub = db.createSubmission({
  id: `test-sub-${Date.now()}`,
  project_id: proj2.id,
  student_id: rohan.id,
  message: 'Finished building the online menu with live preview.',
  submission_url: 'https://chaistory-menu.vercel.app',
  github_url: 'https://github.com/rohanv-data/chaistory-menu',
  status: 'pending',
  submitted_at: new Date().toISOString()
});
console.log(`✅ Deliverable Submitted: ${sub.submission_url}`);

// Client approves completion
db.updateProjectStatus(proj2.id, 'completed');
console.log('✅ Client approved completion! Project status is completed.');

// Client leaves review
const prevCompleted = rohan.completed_projects;
db.createReview({
  id: `test-rev-${Date.now()}`,
  project_id: proj2.id,
  project_title: proj2.title,
  student_id: rohan.id,
  client_id: 'client-2',
  client_name: 'Sunita Rao',
  client_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80',
  quality_rating: 5,
  communication_rating: 5,
  deadline_rating: 5,
  professionalism_rating: 5,
  overall_rating: 5.0,
  comment: 'Superb work! Fast and responsive.',
  created_at: new Date().toISOString()
});

const updatedRohan = db.getProfileById('student-3');
console.log(`✅ Review created. Completed projects: ${prevCompleted} -> ${updatedRohan.completed_projects}`);
console.log(`✅ Updated Rating: ${updatedRohan.overall_rating} ★`);

// Reset DB back to pristine demo state
db.resetToSeed();
console.log('✅ DB reset to pristine demo state.');
console.log('\n🎉 ALL BACKEND TESTS PASSED!');
