import fs from 'fs';
import path from 'path';
import {
  Profile,
  Skill,
  StudentSkill,
  PortfolioProject,
  FreelanceProject,
  ProjectRequirement,
  Application,
  ProjectSubmission,
  Review,
  Notification,
  AIAnalysis
} from '../types';

export interface DatabaseState {
  profiles: Profile[];
  skills: Skill[];
  student_skills: StudentSkill[];
  portfolio_projects: PortfolioProject[];
  freelance_projects: FreelanceProject[];
  project_requirements: ProjectRequirement[];
  applications: Application[];
  project_submissions: ProjectSubmission[];
  reviews: Review[];
  notifications: Notification[];
  ai_analyses: AIAnalysis[];
}

const DB_FILE = path.join(__dirname, 'skillmatch_db.json');

class DatabaseStore {
  private data: DatabaseState = {
    profiles: [],
    skills: [],
    student_skills: [],
    portfolio_projects: [],
    freelance_projects: [],
    project_requirements: [],
    applications: [],
    project_submissions: [],
    reviews: [],
    notifications: [],
    ai_analyses: []
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('[DB] Loaded existing data from storage.');
      } else {
        this.seedInitialData();
        this.save();
        console.log('[DB] Seeded initial production demo dataset.');
      }
    } catch (e) {
      console.error('[DB] Error loading DB file, re-seeding:', e);
      this.seedInitialData();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Error persisting DB file:', e);
    }
  }

  // ==========================================
  // SEED DATA GENERATOR
  // ==========================================
  public resetToSeed() {
    this.seedInitialData();
    this.save();
  }

  private seedInitialData() {
    // 1. Skills
    const skills: Skill[] = [
      { id: 'skill-react', name: 'React', category: 'Frontend' },
      { id: 'skill-ts', name: 'TypeScript', category: 'Frontend' },
      { id: 'skill-tailwind', name: 'Tailwind CSS', category: 'Frontend' },
      { id: 'skill-next', name: 'Next.js', category: 'Frontend' },
      { id: 'skill-html-css', name: 'HTML/CSS', category: 'Frontend' },
      { id: 'skill-responsive', name: 'Responsive Design', category: 'Frontend' },
      { id: 'skill-node', name: 'Node.js', category: 'Backend' },
      { id: 'skill-express', name: 'Express', category: 'Backend' },
      { id: 'skill-sql', name: 'SQL', category: 'Backend' },
      { id: 'skill-postgres', name: 'PostgreSQL', category: 'Backend' },
      { id: 'skill-python', name: 'Python', category: 'AI & Data' },
      { id: 'skill-pandas', name: 'Pandas', category: 'AI & Data' },
      { id: 'skill-automation', name: 'Automation', category: 'AI & Data' },
      { id: 'skill-figma', name: 'Figma', category: 'Design' },
      { id: 'skill-uiux', name: 'UI/UX Design', category: 'Design' },
      { id: 'skill-canva', name: 'Canva', category: 'Design' },
      { id: 'skill-illustrator', name: 'Illustrator', category: 'Design' },
      { id: 'skill-branding', name: 'Branding', category: 'Design' },
      { id: 'skill-flutter', name: 'Flutter', category: 'Mobile' },
      { id: 'skill-firebase', name: 'Firebase', category: 'Mobile' },
      { id: 'skill-content', name: 'Content Writing', category: 'Writing' },
      { id: 'skill-seo', name: 'SEO', category: 'Writing' },
      { id: 'skill-api', name: 'REST APIs', category: 'Backend' }
    ];

    // 2. Profiles (Students & Clients)
    const profiles: Profile[] = [
      // Students
      {
        id: 'student-1',
        user_id: 'user-alex',
        role: 'student',
        full_name: 'Alex Mehta',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&auto=format&fit=crop&q=80',
        college: 'IIT Delhi',
        course: 'Computer Science & Eng',
        year: '3rd Year',
        bio: 'Frontend & Full-stack engineer crafting responsive, high-performance web applications. Specialized in React, Tailwind, and TypeScript.',
        location: 'New Delhi / Remote',
        availability: 'Available Immediately (20 hrs/week)',
        hourly_rate: 650,
        overall_rating: 4.8,
        completed_projects: 6,
        total_earnings: 68000,
        github_connected: true,
        github_username: 'alexmehta-dev',
        created_at: new Date(Date.now() - 60 * 86400000).toISOString()
      },
      {
        id: 'student-2',
        user_id: 'user-priya',
        role: 'student',
        full_name: 'Priya Sharma',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180&auto=format&fit=crop&q=80',
        college: 'National Institute of Design',
        course: 'Interaction & Product Design',
        year: '4th Year',
        bio: 'Product and UI/UX Designer obsessed with human-centered interfaces, user empathy, design systems, and responsive web accessibility.',
        location: 'Ahmedabad / Remote',
        availability: 'Available (15 hrs/week)',
        hourly_rate: 750,
        overall_rating: 4.9,
        completed_projects: 7,
        total_earnings: 82000,
        github_connected: true,
        github_username: 'priyasharma-ui',
        created_at: new Date(Date.now() - 75 * 86400000).toISOString()
      },
      {
        id: 'student-3',
        user_id: 'user-rohan',
        role: 'student',
        full_name: 'Rohan Verma',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80',
        college: 'BITS Pilani',
        course: 'Data Science & CS',
        year: '3rd Year',
        bio: 'Python automation engineer and data enthusiast building intelligent scrapers, ETL pipelines, and API integrations.',
        location: 'Goa / Remote',
        availability: 'Available Immediately (25 hrs/week)',
        hourly_rate: 600,
        overall_rating: 4.7,
        completed_projects: 4,
        total_earnings: 44000,
        github_connected: true,
        github_username: 'rohanv-data',
        created_at: new Date(Date.now() - 45 * 86400000).toISOString()
      },
      {
        id: 'student-4',
        user_id: 'user-ananya',
        role: 'student',
        full_name: 'Ananya Singh',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=180&auto=format&fit=crop&q=80',
        college: 'Delhi Technological University',
        course: 'Software Engineering',
        year: '3rd Year',
        bio: 'Backend specialist focused on scalable Node.js microservices, PostgreSQL schema optimization, and secure RESTful architectures.',
        location: 'Delhi / Remote',
        availability: 'Available (15 hrs/week)',
        hourly_rate: 600,
        overall_rating: 4.8,
        completed_projects: 3,
        total_earnings: 36000,
        github_connected: true,
        github_username: 'ananya-singh-dev',
        created_at: new Date(Date.now() - 50 * 86400000).toISOString()
      },
      {
        id: 'student-5',
        user_id: 'user-devansh',
        role: 'student',
        full_name: 'Devansh Patel',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&auto=format&fit=crop&q=80',
        college: 'NIT Surathkal',
        course: 'Information Technology',
        year: '4th Year',
        bio: 'Cross-platform mobile architect with Flutter and Firebase. Built 6+ mobile applications featured on Google Play & App Store.',
        location: 'Bangalore / Remote',
        availability: 'Available (20 hrs/week)',
        hourly_rate: 800,
        overall_rating: 4.9,
        completed_projects: 5,
        total_earnings: 75000,
        github_connected: true,
        github_username: 'devpatel-flutter',
        created_at: new Date(Date.now() - 90 * 86400000).toISOString()
      },
      {
        id: 'student-6',
        user_id: 'user-sneha',
        role: 'student',
        full_name: 'Sneha Rao',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=180&auto=format&fit=crop&q=80',
        college: "St. Stephen's College",
        course: 'Economics & Statistics',
        year: '2nd Year',
        bio: 'Data analyst turning raw datasets into actionable executive insights with Python Pandas, SQL queries, and interactive visual dashboards.',
        location: 'New Delhi / Remote',
        availability: 'Available (10 hrs/week)',
        hourly_rate: 550,
        overall_rating: 4.6,
        completed_projects: 3,
        total_earnings: 28000,
        github_connected: false,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'student-7',
        user_id: 'user-kabir',
        role: 'student',
        full_name: 'Kabir Verma',
        avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=180&auto=format&fit=crop&q=80',
        college: 'Ashoka University',
        course: 'English & Communications',
        year: '3rd Year',
        bio: 'Technical copywriter and SEO specialist. Translating complex software and business concepts into high-converting copy and clear documentation.',
        location: 'Sonipat / Remote',
        availability: 'Available Immediately (15 hrs/week)',
        hourly_rate: 500,
        overall_rating: 4.8,
        completed_projects: 6,
        total_earnings: 41000,
        github_connected: false,
        created_at: new Date(Date.now() - 70 * 86400000).toISOString()
      },
      {
        id: 'student-8',
        user_id: 'user-meera',
        role: 'student',
        full_name: 'Meera Nair',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=180&auto=format&fit=crop&q=80',
        college: 'Srishti Institute of Art, Design & Tech',
        course: 'Visual Communication',
        year: '3rd Year',
        bio: 'Brand identity creator and visual designer. Crafting iconic logos, brand guidelines, and vibrant social media creative packages for startups.',
        location: 'Bangalore / Remote',
        availability: 'Available (20 hrs/week)',
        hourly_rate: 650,
        overall_rating: 4.9,
        completed_projects: 5,
        total_earnings: 52000,
        github_connected: false,
        created_at: new Date(Date.now() - 80 * 86400000).toISOString()
      },

      // Clients
      {
        id: 'client-1',
        user_id: 'user-client-fitzone',
        role: 'client',
        full_name: 'Vikram Malhotra',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80',
        location: 'Mumbai, India',
        bio: 'Founder & Managing Director of FitZone Fitness & Gyms. Passionate about empowering energetic student talent on digital projects.',
        overall_rating: 4.9,
        completed_projects: 8,
        total_earnings: 120000,
        created_at: new Date(Date.now() - 100 * 86400000).toISOString()
      },
      {
        id: 'client-2',
        user_id: 'user-client-chaistory',
        role: 'client',
        full_name: 'Sunita Rao',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80',
        location: 'Bangalore, India',
        bio: 'Brand Director at The Chai Story & Artisanal Roasters. We hire student designers and web developers for agile marketing campaigns.',
        overall_rating: 5.0,
        completed_projects: 5,
        total_earnings: 85000,
        created_at: new Date(Date.now() - 120 * 86400000).toISOString()
      },
      {
        id: 'client-3',
        user_id: 'user-client-cloudscale',
        role: 'client',
        full_name: 'Arjun Deshmukh',
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        location: 'Pune / Remote',
        bio: 'CTO at CloudScale Ventures. Sponsoring university hackathons and hiring standout student software engineers for MVP builds.',
        overall_rating: 4.8,
        completed_projects: 12,
        total_earnings: 240000,
        created_at: new Date(Date.now() - 150 * 86400000).toISOString()
      }
    ];

    // 3. Student Skills (with Evidence metrics: portfolio_count, completed_jobs_count, verified_github)
    const studentSkills: StudentSkill[] = [
      // Alex (student-1)
      { student_id: 'student-1', skill_id: 'skill-react', skill_name: 'React', proficiency: 92, proficiency_label: 'Advanced', years_experience: 2.5, portfolio_count: 4, completed_jobs_count: 4, verified_github: true },
      { student_id: 'student-1', skill_id: 'skill-ts', skill_name: 'TypeScript', proficiency: 88, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 3, verified_github: true },
      { student_id: 'student-1', skill_id: 'skill-tailwind', skill_name: 'Tailwind CSS', proficiency: 94, proficiency_label: 'Expert', years_experience: 2.0, portfolio_count: 4, completed_jobs_count: 4, verified_github: true },
      { student_id: 'student-1', skill_id: 'skill-html-css', skill_name: 'HTML/CSS', proficiency: 95, proficiency_label: 'Expert', years_experience: 3.0, portfolio_count: 4, completed_jobs_count: 4, verified_github: true },
      { student_id: 'student-1', skill_id: 'skill-responsive', skill_name: 'Responsive Design', proficiency: 90, proficiency_label: 'Advanced', years_experience: 2.5, portfolio_count: 4, completed_jobs_count: 4, verified_github: true },
      { student_id: 'student-1', skill_id: 'skill-next', skill_name: 'Next.js', proficiency: 82, proficiency_label: 'Advanced', years_experience: 1.5, portfolio_count: 2, completed_jobs_count: 2, verified_github: true },

      // Priya (student-2)
      { student_id: 'student-2', skill_id: 'skill-figma', skill_name: 'Figma', proficiency: 96, proficiency_label: 'Expert', years_experience: 3.0, portfolio_count: 5, completed_jobs_count: 5, verified_github: false },
      { student_id: 'student-2', skill_id: 'skill-uiux', skill_name: 'UI/UX Design', proficiency: 94, proficiency_label: 'Expert', years_experience: 3.0, portfolio_count: 5, completed_jobs_count: 5, verified_github: false },
      { student_id: 'student-2', skill_id: 'skill-responsive', skill_name: 'Responsive Design', proficiency: 88, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 4, completed_jobs_count: 4, verified_github: true },
      { student_id: 'student-2', skill_id: 'skill-html-css', skill_name: 'HTML/CSS', proficiency: 85, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 3, verified_github: true },

      // Rohan (student-3)
      { student_id: 'student-3', skill_id: 'skill-python', skill_name: 'Python', proficiency: 91, proficiency_label: 'Advanced', years_experience: 2.5, portfolio_count: 3, completed_jobs_count: 3, verified_github: true },
      { student_id: 'student-3', skill_id: 'skill-automation', skill_name: 'Automation', proficiency: 89, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 2, verified_github: true },
      { student_id: 'student-3', skill_id: 'skill-api', skill_name: 'REST APIs', proficiency: 85, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 2, completed_jobs_count: 2, verified_github: true },

      // Ananya (student-4)
      { student_id: 'student-4', skill_id: 'skill-node', skill_name: 'Node.js', proficiency: 90, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 2, verified_github: true },
      { student_id: 'student-4', skill_id: 'skill-express', skill_name: 'Express', proficiency: 88, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 2, verified_github: true },
      { student_id: 'student-4', skill_id: 'skill-sql', skill_name: 'SQL', proficiency: 85, proficiency_label: 'Advanced', years_experience: 1.5, portfolio_count: 2, completed_jobs_count: 2, verified_github: true },

      // Devansh (student-5)
      { student_id: 'student-5', skill_id: 'skill-flutter', skill_name: 'Flutter', proficiency: 93, proficiency_label: 'Expert', years_experience: 2.5, portfolio_count: 4, completed_jobs_count: 3, verified_github: true },
      { student_id: 'student-5', skill_id: 'skill-firebase', skill_name: 'Firebase', proficiency: 88, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 3, verified_github: true },

      // Sneha (student-6)
      { student_id: 'student-6', skill_id: 'skill-pandas', skill_name: 'Pandas', proficiency: 86, proficiency_label: 'Advanced', years_experience: 1.5, portfolio_count: 2, completed_jobs_count: 2, verified_github: false },
      { student_id: 'student-6', skill_id: 'skill-sql', skill_name: 'SQL', proficiency: 84, proficiency_label: 'Advanced', years_experience: 1.5, portfolio_count: 2, completed_jobs_count: 2, verified_github: false },

      // Kabir (student-7)
      { student_id: 'student-7', skill_id: 'skill-content', skill_name: 'Content Writing', proficiency: 92, proficiency_label: 'Expert', years_experience: 2.5, portfolio_count: 4, completed_jobs_count: 4, verified_github: false },
      { student_id: 'student-7', skill_id: 'skill-seo', skill_name: 'SEO', proficiency: 86, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 3, verified_github: false },

      // Meera (student-8)
      { student_id: 'student-8', skill_id: 'skill-canva', skill_name: 'Canva', proficiency: 95, proficiency_label: 'Expert', years_experience: 3.0, portfolio_count: 4, completed_jobs_count: 4, verified_github: false },
      { student_id: 'student-8', skill_id: 'skill-branding', skill_name: 'Branding', proficiency: 90, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 3, verified_github: false },
      { student_id: 'student-8', skill_id: 'skill-illustrator', skill_name: 'Illustrator', proficiency: 85, proficiency_label: 'Advanced', years_experience: 2.0, portfolio_count: 3, completed_jobs_count: 2, verified_github: false }
    ];

    // 4. Portfolio Projects (Evidence)
    const portfolioProjects: PortfolioProject[] = [
      // Alex's portfolio
      {
        id: 'port-alex-1',
        student_id: 'student-1',
        title: 'FitPulse - Fitness & Membership Web App',
        description: 'Responsive React landing page and member portal with interactive workout scheduling, pricing tables, and testimonial carousels.',
        technologies: ['React', 'Tailwind CSS', 'TypeScript', 'Responsive Design'],
        project_url: 'https://fitpulse-preview.vercel.app',
        github_url: 'https://github.com/alexmehta-dev/fitpulse-web',
        image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
        created_at: new Date(Date.now() - 40 * 86400000).toISOString()
      },
      {
        id: 'port-alex-2',
        student_id: 'student-1',
        title: 'CampusConnect Student Portal',
        description: 'Modern university community portal connecting student clubs, event calendars, and departmental announcements with real-time UI.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'HTML/CSS'],
        project_url: 'https://campusconnect-iitd.vercel.app',
        github_url: 'https://github.com/alexmehta-dev/campus-connect',
        image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
        created_at: new Date(Date.now() - 55 * 86400000).toISOString()
      },
      {
        id: 'port-alex-3',
        student_id: 'student-1',
        title: 'BrewCraft Café & Roasters Storefront',
        description: 'Artisanal coffee house online ordering interface with interactive menu filtering, cart drawer, and mobile-first animations.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Responsive Design'],
        project_url: 'https://brewcraft-cafe.vercel.app',
        github_url: 'https://github.com/alexmehta-dev/brewcraft-storefront',
        image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
        created_at: new Date(Date.now() - 25 * 86400000).toISOString()
      },
      {
        id: 'port-alex-4',
        student_id: 'student-1',
        title: 'FinMetrics - SaaS Analytics Dashboard',
        description: 'High-performance interactive financial analytics console featuring SVG charts, KPI gauges, and dark mode toggling.',
        technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
        project_url: 'https://finmetrics-demo.vercel.app',
        github_url: 'https://github.com/alexmehta-dev/finmetrics-dashboard',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
        created_at: new Date(Date.now() - 15 * 86400000).toISOString()
      },

      // Priya's portfolio
      {
        id: 'port-priya-1',
        student_id: 'student-2',
        title: 'Zenith Health & Wellness Mobile Design',
        description: 'Complete 30-screen iOS design system crafted in Figma covering habit tracking, mindful audio journeys, and wellness analytics.',
        technologies: ['Figma', 'UI/UX Design', 'Design Systems'],
        project_url: 'https://figma.com/@priyasharma/zenith-health',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80',
        created_at: new Date(Date.now() - 40 * 86400000).toISOString()
      },
      {
        id: 'port-priya-2',
        student_id: 'student-2',
        title: 'Gourmet Bistro Responsive Website UI',
        description: 'Visual redesign for an upscale dining establishment featuring luxury dark typography, micro-interactions, and table reservation flows.',
        technologies: ['Figma', 'UI/UX Design', 'Responsive Design', 'HTML/CSS'],
        project_url: 'https://gourmet-bistro.framer.website',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80',
        created_at: new Date(Date.now() - 20 * 86400000).toISOString()
      },

      // Rohan's portfolio
      {
        id: 'port-rohan-1',
        student_id: 'student-3',
        title: 'PriceWatch: Multi-Store Price Tracker',
        description: 'Automated Python web scraper monitoring prices across 4 major e-commerce platforms with automated Slack & email alerts.',
        technologies: ['Python', 'Automation', 'REST APIs'],
        github_url: 'https://github.com/rohanv-data/pricewatch-scraper',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
        created_at: new Date(Date.now() - 35 * 86400000).toISOString()
      }
    ];

    // 5. Freelance Projects (10 realistic opportunities)
    const freelanceProjects: FreelanceProject[] = [
      {
        id: 'proj-1',
        client_id: 'client-1',
        client_name: 'FitZone Gyms & Fitness',
        client_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80',
        client_organization: 'FitZone Fitness Pvt Ltd',
        title: 'Modern Landing Page for Local Gym',
        description: 'We need a high-converting, modern landing page for our new premium gym branch in Bandra. Requirements include responsive layout across desktop and mobile, trainer profiles, class schedule grid, Google Maps integration, and an inquiry contact form. Clean React code with Tailwind CSS preferred.',
        category: 'Web Development',
        budget_min: 8000,
        budget_max: 12000,
        deadline: '5 days',
        deadline_days: 5,
        difficulty: 'Intermediate',
        status: 'posted',
        applicants_count: 3,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'proj-2',
        client_id: 'client-2',
        client_name: 'The Chai Story & Roasters',
        client_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80',
        client_organization: 'The Chai Story Hospitality',
        title: 'Restaurant Menu & Online Ordering UI',
        description: 'Looking for a talented student developer to craft a lightning-fast digital menu and click-and-collect ordering interface for our 3 café outlets. Must be mobile-optimized with intuitive categorization (Chai, Snacks, Bakery, Combos) and clean cart management.',
        category: 'Web Development',
        budget_min: 10000,
        budget_max: 16000,
        deadline: '7 days',
        deadline_days: 7,
        difficulty: 'Intermediate',
        status: 'posted',
        applicants_count: 2,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'proj-3',
        client_id: 'client-3',
        client_name: 'CloudScale Ventures',
        client_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        client_organization: 'CloudScale Tech Incubator',
        title: 'Python E-Commerce Price Tracker & Automation',
        description: 'Build an automated Python background job that fetches daily pricing and stock availability for a catalogue of 200 electronics items, logs fluctuations to a local database or Google Sheet, and triggers Discord webhook notifications on price drops.',
        category: 'Python & Data Automation',
        budget_min: 6000,
        budget_max: 10000,
        deadline: '4 days',
        deadline_days: 4,
        difficulty: 'Intermediate',
        status: 'posted',
        applicants_count: 2,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: 'proj-4',
        client_id: 'client-3',
        client_name: 'CloudScale Ventures',
        client_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        client_organization: 'CloudScale Tech Incubator',
        title: 'Campus Hackathon Mobile Guide App with Flutter',
        description: 'Need a sleek, cross-platform Flutter application for our upcoming 1,000-student collegiate hackathon. Includes live schedule countdown, mentor directory, project submission links, and push notification alerts using Firebase.',
        category: 'Mobile App Development',
        budget_min: 16000,
        budget_max: 24000,
        deadline: '10 days',
        deadline_days: 10,
        difficulty: 'Advanced',
        status: 'posted',
        applicants_count: 1,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 'proj-5',
        client_id: 'client-2',
        client_name: 'The Chai Story & Roasters',
        client_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80',
        client_organization: 'The Chai Story Hospitality',
        title: 'Instagram Content Package & Festival Creatives',
        description: 'Seeking a creative graphic designer to design a 15-post carousel package for Instagram highlighting monsoon specials, artisan blends, and customer stories. Deliverables in Figma or Canva with source assets and export presets.',
        category: 'UI/UX & Graphic Design',
        budget_min: 4000,
        budget_max: 7000,
        deadline: '3 days',
        deadline_days: 3,
        difficulty: 'Beginner',
        status: 'posted',
        applicants_count: 2,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'proj-6',
        client_id: 'client-3',
        client_name: 'CloudScale Ventures',
        client_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        client_organization: 'CloudScale Tech Incubator',
        title: 'Financial Analytics Dashboard UI in React',
        description: 'Create a responsive React & Tailwind financial metrics dashboard displaying MRR growth, churn rates, user cohort retention charts, and downloadable CSV exports. Dummy mock API will be supplied.',
        category: 'Web Development',
        budget_min: 12000,
        budget_max: 18000,
        deadline: '8 days',
        deadline_days: 8,
        difficulty: 'Advanced',
        status: 'posted',
        applicants_count: 1,
        created_at: new Date(Date.now() - 6 * 86400000).toISOString()
      },
      {
        id: 'proj-7',
        client_id: 'client-3',
        client_name: 'CloudScale Ventures',
        client_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        client_organization: 'CloudScale Tech Incubator',
        title: 'Technical Documentation & SEO Writing for Developer API',
        description: 'Write 4 comprehensive developer tutorials and getting-started guides for a new REST API tool. Target audience is junior to mid-level web developers. Must include code snippets in curl and JavaScript.',
        category: 'Content & Writing',
        budget_min: 3500,
        budget_max: 6000,
        deadline: '4 days',
        deadline_days: 4,
        difficulty: 'Beginner',
        status: 'posted',
        applicants_count: 1,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'proj-8',
        client_id: 'client-1',
        client_name: 'FitZone Gyms & Fitness',
        client_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80',
        client_organization: 'FitZone Fitness Pvt Ltd',
        title: 'Member Attendance & Retention Data Cleaning Script',
        description: 'We have 6 months of raw biometric check-in data in CSV format with duplicates and formatting discrepancies. Need a Python script to clean, validate, and compute monthly churn and peak hour utilization statistics.',
        category: 'Python & Data Automation',
        budget_min: 8000,
        budget_max: 13000,
        deadline: '5 days',
        deadline_days: 5,
        difficulty: 'Intermediate',
        status: 'posted',
        applicants_count: 1,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 'proj-9',
        client_id: 'client-2',
        client_name: 'The Chai Story & Roasters',
        client_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80',
        client_organization: 'The Chai Story Hospitality',
        title: 'Visual Identity & Packaging Redesign for Chai Boxes',
        description: 'Design contemporary packaging box artwork for 3 premium tea blends. Needs vector source files in Adobe Illustrator with print-ready CMYK color profiles, die cut outlines, and typography guidance.',
        category: 'UI/UX & Graphic Design',
        budget_min: 5000,
        budget_max: 9000,
        deadline: '4 days',
        deadline_days: 4,
        difficulty: 'Intermediate',
        status: 'posted',
        applicants_count: 2,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 'proj-10',
        client_id: 'client-3',
        client_name: 'CloudScale Ventures',
        client_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        client_organization: 'CloudScale Tech Incubator',
        title: 'Express REST API for Student Hackathon Portal',
        description: 'Develop an authenticated Express & PostgreSQL backend service with endpoints for student team registration, project idea submissions, and score tallying with JWT tokens and role verification.',
        category: 'Web Development',
        budget_min: 9000,
        budget_max: 15000,
        deadline: '6 days',
        deadline_days: 6,
        difficulty: 'Intermediate',
        status: 'posted',
        applicants_count: 1,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      },

      // Completed Projects (reputation loop)
      {
        id: 'proj-completed-1',
        client_id: 'client-1',
        client_name: 'FitZone Gyms & Fitness',
        client_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80',
        client_organization: 'FitZone Fitness Pvt Ltd',
        title: 'FitZone Trainer Booking Portal MVP',
        description: 'Single-page React web interface for booking personal training slots with time slot selection and WhatsApp confirmation.',
        category: 'Web Development',
        budget_min: 9000,
        budget_max: 12000,
        deadline: '5 days',
        deadline_days: 5,
        difficulty: 'Intermediate',
        status: 'completed',
        hired_student_id: 'student-1',
        hired_student_name: 'Alex Mehta',
        created_at: new Date(Date.now() - 25 * 86400000).toISOString()
      },
      {
        id: 'proj-completed-2',
        client_id: 'client-2',
        client_name: 'The Chai Story & Roasters',
        client_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80',
        client_organization: 'The Chai Story Hospitality',
        title: 'Artisanal Tea Menu Digital UI Design',
        description: 'Figma interactive prototype of the seasonal winter tea menu with dietary allergen badges and ingredient cards.',
        category: 'UI/UX & Graphic Design',
        budget_min: 7000,
        budget_max: 10000,
        deadline: '4 days',
        deadline_days: 4,
        difficulty: 'Intermediate',
        status: 'completed',
        hired_student_id: 'student-2',
        hired_student_name: 'Priya Sharma',
        created_at: new Date(Date.now() - 35 * 86400000).toISOString()
      },
      {
        id: 'proj-completed-3',
        client_id: 'client-3',
        client_name: 'CloudScale Ventures',
        client_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        client_organization: 'CloudScale Tech Incubator',
        title: 'Automated Tech Jobs Daily Scraper',
        description: 'Python script scraping open junior developer roles from university job boards and filtering by keyword.',
        category: 'Python & Data Automation',
        budget_min: 8000,
        budget_max: 11000,
        deadline: '4 days',
        deadline_days: 4,
        difficulty: 'Intermediate',
        status: 'completed',
        hired_student_id: 'student-3',
        hired_student_name: 'Rohan Verma',
        created_at: new Date(Date.now() - 40 * 86400000).toISOString()
      }
    ];

    // 6. Project Requirements
    const projectRequirements: ProjectRequirement[] = [
      // proj-1 (Gym Landing Page) -> Alex is top match (94%!)
      { id: 'req-1-1', project_id: 'proj-1', skill_id: 'skill-react', skill_name: 'React', importance: 'high', required_level: 85 },
      { id: 'req-1-2', project_id: 'proj-1', skill_id: 'skill-html-css', skill_name: 'HTML/CSS', importance: 'high', required_level: 85 },
      { id: 'req-1-3', project_id: 'proj-1', skill_id: 'skill-responsive', skill_name: 'Responsive Design', importance: 'high', required_level: 85 },

      // proj-2 (Restaurant Menu)
      { id: 'req-2-1', project_id: 'proj-2', skill_id: 'skill-react', skill_name: 'React', importance: 'high', required_level: 80 },
      { id: 'req-2-2', project_id: 'proj-2', skill_id: 'skill-tailwind', skill_name: 'Tailwind CSS', importance: 'high', required_level: 75 },
      { id: 'req-2-3', project_id: 'proj-2', skill_id: 'skill-uiux', skill_name: 'UI/UX Design', importance: 'high', required_level: 80 },

      // proj-3 (Python Price Tracker) -> Rohan Verma is top match!
      { id: 'req-3-1', project_id: 'proj-3', skill_id: 'skill-python', skill_name: 'Python', importance: 'high', required_level: 85 },
      { id: 'req-3-2', project_id: 'proj-3', skill_id: 'skill-automation', skill_name: 'Automation', importance: 'high', required_level: 80 },
      { id: 'req-3-3', project_id: 'proj-3', skill_id: 'skill-api', skill_name: 'REST APIs', importance: 'medium', required_level: 75 },

      // proj-4 (Mobile App Flutter) -> Devansh Patel is top match!
      { id: 'req-4-1', project_id: 'proj-4', skill_id: 'skill-flutter', skill_name: 'Flutter', importance: 'high', required_level: 85 },
      { id: 'req-4-2', project_id: 'proj-4', skill_id: 'skill-firebase', skill_name: 'Firebase', importance: 'high', required_level: 80 },

      // proj-5 (Instagram Package) -> Meera Nair is top match!
      { id: 'req-5-1', project_id: 'proj-5', skill_id: 'skill-canva', skill_name: 'Canva', importance: 'high', required_level: 80 },
      { id: 'req-5-2', project_id: 'proj-5', skill_id: 'skill-branding', skill_name: 'Branding', importance: 'high', required_level: 75 },

      // proj-6 (Financial Dashboard)
      { id: 'req-6-1', project_id: 'proj-6', skill_id: 'skill-react', skill_name: 'React', importance: 'high', required_level: 85 },
      { id: 'req-6-2', project_id: 'proj-6', skill_id: 'skill-ts', skill_name: 'TypeScript', importance: 'high', required_level: 80 },
      { id: 'req-6-3', project_id: 'proj-6', skill_id: 'skill-responsive', skill_name: 'Responsive Design', importance: 'medium', required_level: 75 },

      // proj-7 (Technical Writing) -> Kabir Verma is top match!
      { id: 'req-7-1', project_id: 'proj-7', skill_id: 'skill-content', skill_name: 'Content Writing', importance: 'high', required_level: 85 },
      { id: 'req-7-2', project_id: 'proj-7', skill_id: 'skill-seo', skill_name: 'SEO', importance: 'medium', required_level: 75 },

      // proj-8 (Data Cleaning) -> Sneha Rao is top match!
      { id: 'req-8-1', project_id: 'proj-8', skill_id: 'skill-pandas', skill_name: 'Pandas', importance: 'high', required_level: 80 },
      { id: 'req-8-2', project_id: 'proj-8', skill_id: 'skill-sql', skill_name: 'SQL', importance: 'high', required_level: 75 },

      // proj-9 (Branding Chai Boxes)
      { id: 'req-9-1', project_id: 'proj-9', skill_id: 'skill-branding', skill_name: 'Branding', importance: 'high', required_level: 80 },
      { id: 'req-9-2', project_id: 'proj-9', skill_id: 'skill-illustrator', skill_name: 'Illustrator', importance: 'high', required_level: 80 },

      // proj-10 (Express Backend) -> Ananya Singh is top match!
      { id: 'req-10-1', project_id: 'proj-10', skill_id: 'skill-node', skill_name: 'Node.js', importance: 'high', required_level: 85 },
      { id: 'req-10-2', project_id: 'proj-10', skill_id: 'skill-express', skill_name: 'Express', importance: 'high', required_level: 80 },
      { id: 'req-10-3', project_id: 'proj-10', skill_id: 'skill-sql', skill_name: 'SQL', importance: 'medium', required_level: 75 }
    ];

    // 7. Seed Applications (for proj-1, so client can immediately view applicants!)
    const applications: Application[] = [
      {
        id: 'app-1',
        project_id: 'proj-1',
        project_title: 'Modern Landing Page for Local Gym',
        student_id: 'student-1',
        student_name: 'Alex Mehta',
        student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&auto=format&fit=crop&q=80',
        student_rating: 4.8,
        student_completed_count: 6,
        proposal: 'Hi Vikram! I have built 4 production React & Tailwind landing pages, including a member portal for FitPulse with responsive class schedules and Google Maps integration. I can deliver a clean, fast-loading responsive landing page in 4 days.',
        proposed_price: 10000,
        estimated_days: 4,
        status: 'pending',
        match_score: 94,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'app-2',
        project_id: 'proj-1',
        project_title: 'Modern Landing Page for Local Gym',
        student_id: 'student-2',
        student_name: 'Priya Sharma',
        student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180&auto=format&fit=crop&q=80',
        student_rating: 4.9,
        student_completed_count: 7,
        proposal: 'Hello! I specialize in high-converting UI/UX and responsive layouts. I can provide complete high-fidelity Figma components followed by responsive HTML/CSS/React code with subtle micro-animations.',
        proposed_price: 11500,
        estimated_days: 5,
        status: 'pending',
        match_score: 82,
        created_at: new Date(Date.now() - 1.5 * 86400000).toISOString()
      },
      {
        id: 'app-3',
        project_id: 'proj-1',
        project_title: 'Modern Landing Page for Local Gym',
        student_id: 'student-4',
        student_name: 'Ananya Singh',
        student_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=180&auto=format&fit=crop&q=80',
        student_rating: 4.8,
        student_completed_count: 3,
        proposal: 'I can build the landing page and configure a lightweight Node.js/Express contact form email forwarder.',
        proposed_price: 8500,
        estimated_days: 5,
        status: 'pending',
        match_score: 64,
        created_at: new Date(Date.now() - 1.8 * 86400000).toISOString()
      }
    ];

    // 8. Reviews & Ratings (10 realistic reviews)
    const reviews: Review[] = [
      {
        id: 'rev-1',
        project_id: 'proj-completed-1',
        project_title: 'FitZone Trainer Booking Portal MVP',
        student_id: 'student-1',
        client_id: 'client-1',
        client_name: 'Vikram Malhotra',
        client_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80',
        quality_rating: 5,
        communication_rating: 5,
        deadline_rating: 5,
        professionalism_rating: 5,
        overall_rating: 5.0,
        comment: 'Alex did an exceptional job building our trainer booking portal! The React code was modular, clean, and delivered 1 full day ahead of deadline. Highly recommended!',
        created_at: new Date(Date.now() - 20 * 86400000).toISOString()
      },
      {
        id: 'rev-2',
        project_id: 'proj-completed-2',
        project_title: 'Artisanal Tea Menu Digital UI Design',
        student_id: 'student-2',
        client_id: 'client-2',
        client_name: 'Sunita Rao',
        client_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&auto=format&fit=crop&q=80',
        quality_rating: 5,
        communication_rating: 5,
        deadline_rating: 5,
        professionalism_rating: 5,
        overall_rating: 5.0,
        comment: 'Priya is one of the most talented designers we have collaborated with. The typography, color harmony, and accessibility considerations were top tier.',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: 'rev-3',
        project_id: 'proj-completed-3',
        project_title: 'Automated Tech Jobs Daily Scraper',
        student_id: 'student-3',
        client_id: 'client-3',
        client_name: 'Arjun Deshmukh',
        client_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=180&auto=format&fit=crop&q=80',
        quality_rating: 4.8,
        communication_rating: 4.5,
        deadline_rating: 5,
        professionalism_rating: 4.8,
        overall_rating: 4.8,
        comment: 'Rohan set up our scraping pipeline seamlessly. Very solid Python skills and thoughtful error handling for rate limits.',
        created_at: new Date(Date.now() - 35 * 86400000).toISOString()
      }
    ];

    // 9. Notifications
    const notifications: Notification[] = [
      {
        id: 'notif-1',
        user_id: 'student-1',
        type: 'application',
        title: 'Project Match Available',
        message: 'New project "Modern Landing Page for Local Gym" matches 94% of your verified React & Tailwind skills.',
        link: '/projects/proj-1',
        read: false,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'notif-2',
        user_id: 'student-1',
        type: 'review',
        title: '5-Star Review Received',
        message: 'Vikram Malhotra rated you 5.0 ★ for completing "FitZone Trainer Booking Portal MVP".',
        link: '/profile/student-1',
        read: true,
        created_at: new Date(Date.now() - 86400000 * 20).toISOString()
      },
      {
        id: 'notif-3',
        user_id: 'client-1',
        type: 'application',
        title: 'New Applicant on Gym Landing Page',
        message: 'Alex Mehta (94% Match) applied for "Modern Landing Page for Local Gym".',
        link: '/projects/proj-1/applicants',
        read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];

    this.data = {
      profiles,
      skills,
      student_skills: studentSkills,
      portfolio_projects: portfolioProjects,
      freelance_projects: freelanceProjects,
      project_requirements: projectRequirements,
      applications,
      project_submissions: [],
      reviews,
      notifications,
      ai_analyses: []
    };
  }

  // ==========================================
  // REPOSITORY ACCESSORS & MUTATORS
  // ==========================================

  // Profiles
  public getProfiles(): Profile[] {
    return this.data.profiles;
  }

  public getProfileById(id: string): Profile | undefined {
    return this.data.profiles.find((p) => p.id === id || p.user_id === id);
  }

  public createProfile(profile: Profile): Profile {
    this.data.profiles.push(profile);
    this.save();
    return profile;
  }

  public updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const idx = this.data.profiles.findIndex((p) => p.id === id || p.user_id === id);
    if (idx === -1) return undefined;
    this.data.profiles[idx] = { ...this.data.profiles[idx], ...updates };
    this.save();
    return this.data.profiles[idx];
  }

  // Skills
  public getSkills(): Skill[] {
    return this.data.skills;
  }

  public getStudentSkills(studentId: string): StudentSkill[] {
    return this.data.student_skills.filter((s) => s.student_id === studentId);
  }

  public addStudentSkill(skill: StudentSkill): StudentSkill {
    const existingIdx = this.data.student_skills.findIndex(
      (s) => s.student_id === skill.student_id && s.skill_id === skill.skill_id
    );
    if (existingIdx !== -1) {
      this.data.student_skills[existingIdx] = { ...this.data.student_skills[existingIdx], ...skill };
    } else {
      this.data.student_skills.push(skill);
    }
    this.save();
    return skill;
  }

  // Portfolio
  public getPortfolioProjects(studentId: string): PortfolioProject[] {
    return this.data.portfolio_projects.filter((p) => p.student_id === studentId);
  }

  public addPortfolioProject(project: PortfolioProject): PortfolioProject {
    this.data.portfolio_projects.push(project);
    this.save();
    return project;
  }

  // Freelance Projects
  public getProjects(filters?: { category?: string; difficulty?: string; status?: string; search?: string }): FreelanceProject[] {
    let result = this.data.freelance_projects;

    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.category && filters.category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.difficulty && filters.difficulty !== 'All') {
      result = result.filter((p) => p.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Attach requirements to each project
    return result.map((p) => ({
      ...p,
      requirements: this.data.project_requirements.filter((r) => r.project_id === p.id),
      applicants_count: this.data.applications.filter((a) => a.project_id === p.id).length
    }));
  }

  public getProjectById(id: string): FreelanceProject | undefined {
    const project = this.data.freelance_projects.find((p) => p.id === id);
    if (!project) return undefined;
    return {
      ...project,
      requirements: this.data.project_requirements.filter((r) => r.project_id === project.id),
      applicants_count: this.data.applications.filter((a) => a.project_id === project.id).length
    };
  }

  public createProject(project: FreelanceProject, requirements: Array<{ skill_name: string; importance: 'high' | 'medium' | 'low'; required_level: number }>): FreelanceProject {
    this.data.freelance_projects.unshift(project);

    // Add requirements
    requirements.forEach((req, idx) => {
      let skill = this.data.skills.find((s) => s.name.toLowerCase() === req.skill_name.toLowerCase());
      if (!skill) {
        skill = { id: `skill-${Date.now()}-${idx}`, name: req.skill_name, category: project.category };
        this.data.skills.push(skill);
      }
      this.data.project_requirements.push({
        id: `req-${project.id}-${idx}`,
        project_id: project.id,
        skill_id: skill.id,
        skill_name: req.skill_name,
        importance: req.importance,
        required_level: req.required_level
      });
    });

    this.save();
    return this.getProjectById(project.id)!;
  }

  public updateProjectStatus(id: string, status: FreelanceProject['status'], hiredStudentId?: string, hiredStudentName?: string): FreelanceProject | undefined {
    const idx = this.data.freelance_projects.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.data.freelance_projects[idx].status = status;
    if (hiredStudentId) {
      this.data.freelance_projects[idx].hired_student_id = hiredStudentId;
    }
    if (hiredStudentName) {
      this.data.freelance_projects[idx].hired_student_name = hiredStudentName;
    }
    this.save();
    return this.getProjectById(id);
  }

  // Applications
  public getApplications(filter?: { project_id?: string; student_id?: string }): Application[] {
    let list = this.data.applications;
    if (filter?.project_id) {
      list = list.filter((a) => a.project_id === filter.project_id);
    }
    if (filter?.student_id) {
      list = list.filter((a) => a.student_id === filter.student_id);
    }
    return list;
  }

  public createApplication(app: Application): Application {
    this.data.applications.push(app);

    // Notify client
    const project = this.getProjectById(app.project_id);
    if (project) {
      this.data.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: project.client_id,
        type: 'application',
        title: 'New Project Applicant',
        message: `${app.student_name || 'A student'} applied for "${project.title}" with a proposal of ₹${app.proposed_price.toLocaleString()}.`,
        link: `/projects/${project.id}/applicants`,
        read: false,
        created_at: new Date().toISOString()
      });
    }

    this.save();
    return app;
  }

  public updateApplicationStatus(id: string, status: Application['status']): Application | undefined {
    const idx = this.data.applications.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.data.applications[idx].status = status;
    this.save();
    return this.data.applications[idx];
  }

  // Workspace Submissions
  public getSubmissions(projectId: string): ProjectSubmission[] {
    return this.data.project_submissions.filter((s) => s.project_id === projectId);
  }

  public createSubmission(submission: ProjectSubmission): ProjectSubmission {
    this.data.project_submissions.unshift(submission);

    // Notify client
    const project = this.getProjectById(submission.project_id);
    if (project) {
      this.data.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: project.client_id,
        type: 'submission',
        title: 'Work Deliverable Submitted',
        message: `Student submitted deliverables for "${project.title}". Review their work and approve or request changes.`,
        link: `/workspace/${project.id}`,
        read: false,
        created_at: new Date().toISOString()
      });
    }

    this.save();
    return submission;
  }

  // Reviews & Reputation
  public getReviews(filter?: { student_id?: string; client_id?: string; project_id?: string }): Review[] {
    let list = this.data.reviews;
    if (filter?.student_id) list = list.filter((r) => r.student_id === filter.student_id);
    if (filter?.client_id) list = list.filter((r) => r.client_id === filter.client_id);
    if (filter?.project_id) list = list.filter((r) => r.project_id === filter.project_id);
    return list;
  }

  public createReview(review: Review): Review {
    this.data.reviews.unshift(review);

    // Recalculate student overall rating & completed projects count
    const student = this.getProfileById(review.student_id);
    if (student) {
      const allStudentReviews = this.data.reviews.filter((r) => r.student_id === review.student_id);
      const avg =
        allStudentReviews.reduce((sum, r) => sum + r.overall_rating, 0) / allStudentReviews.length;
      student.overall_rating = Math.round(avg * 10) / 10;
      student.completed_projects += 1;

      const project = this.getProjectById(review.project_id);
      if (project) {
        student.total_earnings += project.budget_max || project.budget_min || 10000;
      }

      this.updateProfile(student.id, {
        overall_rating: student.overall_rating,
        completed_projects: student.completed_projects,
        total_earnings: student.total_earnings
      });

      // Notify student
      this.data.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: student.id,
        type: 'review',
        title: 'New Review & Rating Received! ★',
        message: `${review.client_name || 'Client'} awarded you a ${review.overall_rating} ★ rating: "${review.comment.slice(0, 80)}..."`,
        link: `/profile/${student.id}`,
        read: false,
        created_at: new Date().toISOString()
      });
    }

    this.save();
    return review;
  }

  // Notifications
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications.filter((n) => n.user_id === userId);
  }

  public markNotificationRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(userId: string): boolean {
    this.data.notifications.forEach((n) => {
      if (n.user_id === userId) n.read = true;
    });
    this.save();
    return true;
  }
}

export const db = new DatabaseStore();
