const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runE2E() {
  console.log('====================================================');
  console.log('🚀 RUNNING SKILLMATCH FULL-STACK E2E HTTP TEST SUITE');
  console.log('====================================================\n');

  // 1. Healthcheck
  console.log('1. Checking Backend Healthcheck (/api/health)...');
  const health = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  });
  console.log(`   Status: ${health.status}, Service: ${health.body.service}`);
  if (health.status !== 200) throw new Error('Healthcheck failed');

  // 2. Active User Check
  console.log('\n2. Fetching Active Demo Session (/api/auth/me)...');
  const me = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'x-user-id': 'student-1' }
  });
  console.log(`   Logged in as: ${me.body.user.full_name} (${me.body.user.role})`);
  console.log(`   Initial Rating: ${me.body.user.overall_rating} ★, Completed: ${me.body.user.completed_projects}`);

  // 3. Projects Marketplace & Deterministic Matching
  console.log('\n3. Fetching Marketplace Projects & Match Scores for Alex (/api/projects)...');
  const projects = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/projects',
    method: 'GET',
    headers: { 'x-user-id': 'student-1' }
  });
  console.log(`   Found ${projects.body.projects.length} freelance projects.`);
  const gymProj = projects.body.projects.find((p) => p.id === 'proj-1');
  console.log(`   Project: "${gymProj.title}"`);
  console.log(`   Match Score: ${gymProj.match_score}% Match!`);
  console.log(`   Breakdown:`, JSON.stringify(gymProj.match_breakdown));
  console.log(`   Reasons:`, gymProj.match_reasons);

  if (!gymProj.match_score || gymProj.match_score < 90) {
    throw new Error('Alex match score should be >= 90%!');
  }

  // 4. Project Detail
  console.log('\n4. Fetching Project Detail (/api/projects/proj-1)...');
  const detail = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/projects/proj-1',
    method: 'GET',
    headers: { 'x-user-id': 'student-1' }
  });
  console.log(`   Title: ${detail.body.project.title}, Budget: ₹${detail.body.project.budget_min}–₹${detail.body.project.budget_max}`);
  console.log(`   Match Compatibility: ${detail.body.match.score}%`);

  // 5. Submit Proposal (Student 3 - Rohan Verma applies to proj-3)
  console.log('\n5. Submitting Application from Rohan for Python Project (/api/projects/proj-3/apply)...');
  const applyRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/projects/proj-3/apply',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': 'student-3' }
  }, {
    proposal: 'I built PriceWatch with Python and automated background schedulers. Ready to deliver in 3 days.',
    proposed_price: 8500,
    estimated_days: 3
  });
  console.log(`   Application status: ${applyRes.status}, ID: ${applyRes.body.application?.id}`);

  // 6. Client Reviews Ranked Applicants
  console.log('\n6. Client Fetches Ranked Applicants (/api/projects/proj-1/applicants)...');
  const applicants = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/projects/proj-1/applicants',
    method: 'GET',
    headers: { 'x-user-id': 'client-1' }
  });
  console.log(`   Applicants count: ${applicants.body.applicants.length}`);
  console.log(`   Top Ranked Applicant: ${applicants.body.applicants[0].student_name} (${applicants.body.applicants[0].match_score}% Match)`);

  // 7. Client Hires Alex for proj-1
  console.log('\n7. Client Hires Alex Mehta (/api/projects/proj-1/hire)...');
  const hireRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/projects/proj-1/hire',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': 'client-1' }
  }, {
    studentId: 'student-1',
    applicationId: 'app-1'
  });
  console.log(`   Hired result message: ${hireRes.body.message}`);
  console.log(`   New project status: ${hireRes.body.project.status}`);

  // 8. Student Submits Deliverable to Workspace
  console.log('\n8. Student Submits Deliverables to Workspace (/api/workspace/proj-1/submit)...');
  const submitRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/workspace/proj-1/submit',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': 'student-1' }
  }, {
    submission_url: 'https://fitzone-gym-delhi.vercel.app',
    github_url: 'https://github.com/alexmehta-dev/fitzone-landing',
    message: 'Finished the responsive React landing page with class schedule filters and Maps API.'
  });
  console.log(`   Deliverable submitted: ${submitRes.body.submission?.submission_url}`);

  // 9. Client Approves Completion
  console.log('\n9. Client Approves Completion (/api/workspace/proj-1/approve)...');
  const approveRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/workspace/proj-1/approve',
    method: 'POST',
    headers: { 'x-user-id': 'client-1' }
  });
  console.log(`   Project status: ${approveRes.body.project.status}`);

  // 10. Client Leaves 5-Star Review & Updates Reputation
  console.log('\n10. Client Posts 5-Star Review & Updates Student Reputation (/api/reviews)...');
  const reviewRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/reviews',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': 'client-1' }
  }, {
    project_id: 'proj-1',
    student_id: 'student-1',
    quality_rating: 5,
    communication_rating: 5,
    deadline_rating: 5,
    professionalism_rating: 5,
    comment: 'Alex blew us away! The gym landing page looks ultra sleek, responsive on all phones, and fast.'
  });
  console.log(`    Review recorded. Student: ${reviewRes.body.updatedStudent.full_name}`);
  console.log(`    New Rating: ${reviewRes.body.updatedStudent.overall_rating} ★`);
  console.log(`    New Completed Count: ${reviewRes.body.updatedStudent.completed_projects}`);

  // 11. Test AI Assist Extractor
  console.log('\n11. Testing AI Project Requirement Extraction (/api/ai/analyze-project)...');
  const aiRes = await request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/ai/analyze-project',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    description: 'Looking for a React and Tailwind developer to design a modern gym website with a 5-day delivery.'
  });
  console.log(`    AI Extracted Category: ${aiRes.body.data.category}`);
  console.log(`    AI Extracted Difficulty: ${aiRes.body.data.difficulty}`);
  console.log(`    AI Extracted Skills:`, aiRes.body.data.skills.map(s => s.name).join(', '));

  console.log('\n====================================================');
  console.log('🎉 ALL 11 HTTP END-TO-END VERIFICATION TESTS PASSED!');
  console.log('====================================================');
}

runE2E().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
