# SkillMatch — Student Freelance Marketplace

> **Work. Collaborate. Grow.**  
> *Student talent deserves better opportunities.*

SkillMatch is a production-grade, full-stack student-first freelance marketplace designed around a single core differentiator: **"Match students based on demonstrated skills, not just what they claim on their profile."**

Unlike traditional freelance platforms with generic profiles and bidding wars, SkillMatch computes real-time compatibility using a **deterministic 6-factor matching engine** backed by **evidence proof** (verified GitHub repositories, live demo URLs, and multi-dimensional client reviews).

---

## 🌟 Key Features

### 1. Evidence-Backed Skill Proof
- Replaces unverified 1–10 self-assessments with concrete proof:
  - Total verified portfolio projects using each technology.
  - Number of delivered freelance jobs in production.
  - Connected GitHub repositories with commit verification.
  - Distinct **"Evidence-backed skill"** certification badge.

### 2. Deterministic Matching Engine
- Strictly follows the weighted compatibility formula:
  - **45% Skill Compatibility**: Matches project requirements against verified skills with normalized technology mapping.
  - **20% Skill Proficiency / Experience**: Depth of knowledge and practical years of experience.
  - **15% Portfolio Similarity**: Direct technology overlap across candidate's portfolio projects.
  - **10% Availability**: Evaluates student's weekly bandwidth against project delivery deadline.
  - **5% Rating & Track Record**: Verified client feedback score.
  - **5% Budget Compatibility**: Fits student rate within client budget range.
- Delivers normalized 0–100 match scores, granular percentage breakdown, and an expandable **"Why this matches you"** checklist.

### 3. Project Requirement Extraction with Gemini AI
- When clients input natural language descriptions (e.g., *"Need someone to build a modern landing page for our local gym with React, responsive design and a contact form"*), the Gemini AI model (`gemini-1.5-flash`) extracts structured JSON requirements:
  - Category, prioritized skills with importance levels, difficulty tier, and estimated duration in days.
  - Editable tags allow the client to tweak and customize before publishing.
  - **Resilient Fallback**: If `GEMINI_API_KEY` is not provided or the network is offline, a deterministic extractor ensures project creation never fails.

### 4. Interactive Project Workspace (`/workspace/:projectId`)
- Visual 5-stage project lifecycle tracker:
  `Project Started ➔ Work In Progress ➔ Deliverable Submitted ➔ Client Approved ➔ Completed & Reviewed`
- Student deliverable submission with live URL and codebase link.
- Client approval controls or change request revisions.

### 5. Multi-Dimensional Reputation Loop
- Clients rate completed work across 4 essential pillars (1 to 5 stars):
  - **Quality of Work**
  - **Communication**
  - **Deadline Adherence**
  - **Professionalism**
- Automatic overall rating recalculation and completed jobs tally displayed on public profiles.

### 6. Interactive Demo Switcher & Tour Guide
- Persistent top bar enabling 1-click persona switching between:
  - **Alex Mehta** (Student — React Specialist, 94% match)
  - **Priya Sharma** (Student — UI/UX Designer)
  - **Rohan Verma** (Student — Python & Data)
  - **Vikram Malhotra** (Client — FitZone Gym Owner)
  - **Sunita Rao** (Client — The Chai Story)
- 1-click database reset button to return data to a pristine state at any time.

---

## 🗄️ Relational Database Schema

SkillMatch includes a complete relational database design (`server/src/db/supabase_schema.sql`):
1. `profiles`: ID, role (`student` | `client`), full name, avatar, college, course, year, bio, location, availability, hourly rate, overall rating, completed projects, total earnings.
2. `skills`: ID, name, category.
3. `student_skills`: student ID, skill ID, proficiency (1–100), years experience, portfolio count, completed jobs count, verified GitHub.
4. `portfolio_projects`: ID, student ID, title, description, technologies array, live URL, GitHub URL, image URL.
5. `freelance_projects`: ID, client ID, title, description, category, budget min/max, deadline, difficulty, status.
6. `project_requirements`: ID, project ID, skill ID, importance (`high` | `medium` | `low`), required level.
7. `applications`: ID, project ID, student ID, proposal, proposed price, estimated days, status (`pending` | `shortlisted` | `accepted` | `rejected`).
8. `project_submissions`: ID, project ID, student ID, message, submission URL, GitHub URL, status.
9. `reviews`: ID, project ID, student ID, client ID, quality, communication, deadline, professionalism, overall rating, comment.
10. `notifications`: ID, user ID, type, title, message, link, read flag.
11. `ai_analyses`: ID, project ID, extracted requirements, model name.

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the root directory (or copy `.env.example`):
```env
PORT=3001
VITE_API_URL=http://localhost:3001

# Optional: Google Gemini API Key for AI Project Requirement Extraction
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase configuration
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### 4. Run the Application

In Terminal 1 (Start Backend Server):
```bash
cd server
npm run dev
# Server will run on http://localhost:3001
```

In Terminal 2 (Start Frontend Dev Server):
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🎮 60-Second Hackathon Demo Flow

1. **Open Landing Page**: Visit `http://localhost:5173/` and observe the shader hero background and live feature highlights.
2. **Student Dashboard**: Switch to **Alex Mehta** in the top bar. Note the 94% match on *"Landing Page for Local Gym"*.
3. **Inspect Match Breakdown**: Click **"94% Match"** to view the 6-factor breakdown (Skills 100%, Experience 92%, Portfolio 95%, Availability 95%, Budget 92%) and reasons checklist.
4. **View Student Profile**: Open `/profile/student-1` to view **Skill Proof** (4 portfolio projects, 2 deployed apps, verified GitHub badge).
5. **Apply**: Submit an application for *"Landing Page for Local Gym"*. Status becomes `Pending`.
6. **Client Review**: Switch to client **Vikram Malhotra (FitZone)** in the top bar. Open `/projects/proj-1/applicants` to view applicants ranked by match score.
7. **Hire**: Click **"Hire Student"** and confirm. Status transitions to `IN PROGRESS`.
8. **Workspace**: Switch back to Alex. Open `/workspace/proj-1`. Submit live deliverable URL.
9. **Approve & Review**: Switch to Vikram. Click **"Approve Completion"**. Fill out the 5-star review across Quality, Communication, Deadline, and Professionalism.
10. **Reputation Update**: Return to Alex's profile. Observe completed projects count incremented and rating recalculated in real-time!

---

## 📁 Project Structure

```
├── .env.example               # Environment variables template
├── components/ui/             # Hero shader component (@paper-design/shaders-react)
├── index.html                 # App HTML with typography & SEO meta
├── package.json               # Frontend dependencies & scripts
├── server/                    # Express + TypeScript Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── test_unit.js           # Full-stack automated flow verification
│   └── src/
│       ├── index.ts           # Express server entry point
│       ├── types/             # TypeScript data models
│       ├── db/                # Relational store, seed data, and Supabase SQL
│       │   ├── database.ts
│       │   └── supabase_schema.sql
│       ├── services/          # Deterministic matching & Gemini AI
│       │   ├── matchingEngine.ts
│       │   └── geminiService.ts
│       └── routes/            # REST API routers
│           ├── authRoutes.ts
│           ├── projectRoutes.ts
│           ├── applicationRoutes.ts
│           ├── workspaceRoutes.ts
│           ├── reviewRoutes.ts
│           ├── studentRoutes.ts
│           ├── notificationRoutes.ts
│           └── aiRoutes.ts
├── src/                       # React + TypeScript Frontend
│   ├── App.tsx                # App routes & layout shell
│   ├── main.tsx               # DOM bootstrap
│   ├── index.css              # Glassmorphism & Tailwind utilities
│   ├── types/                 # Shared client types
│   ├── context/               # AuthContext & instant persona switcher
│   ├── services/api.ts        # Centralized REST API client
│   ├── components/
│   │   ├── layout/            # Navbar, DemoBar, footer
│   │   ├── matching/          # SkillProofCard, MatchBadge, MatchModal
│   │   ├── projects/          # ProjectCard
│   │   ├── applications/      # ApplyModal
│   │   └── reviews/           # ReviewModal (with confetti celebration)
│   └── pages/                 # Full feature views
│       ├── Landing.tsx
│       ├── StudentDashboard.tsx
│       ├── Projects.tsx
│       ├── ProjectDetail.tsx
│       ├── Applicants.tsx
│       ├── Workspace.tsx
│       ├── StudentProfile.tsx
│       ├── Discover.tsx
│       ├── Applications.tsx
│       ├── ClientDashboard.tsx
│       ├── PostProject.tsx
│       ├── StudentsList.tsx
│       ├── Login.tsx
│       └── Signup.tsx
```

---

## 🚫 Intentionally Excluded Features (Hackathon Scope)

As outlined in Section 41 of the specification, the following features were excluded to prioritize a polished core marketplace loop:
- Payment gateway / crypto / escrow simulation.
- Video calling & heavy real-time chat sockets.
- Complex contracts and legal document generation.
- Social media feeds & dating mechanics.
