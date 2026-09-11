import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DemoBar } from './components/layout/DemoBar';
import { Navbar } from './components/layout/Navbar';

// Pages
import { Landing } from './pages/Landing';
import { StudentDashboard } from './pages/StudentDashboard';
import { Discover } from './pages/Discover';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Applicants } from './pages/Applicants';
import { Applications } from './pages/Applications';
import { Workspace } from './pages/Workspace';
import { StudentProfile } from './pages/StudentProfile';
import { ClientDashboard } from './pages/ClientDashboard';
import { PostProject } from './pages/PostProject';
import { StudentsList } from './pages/StudentsList';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import DemoOne from './components/ui/demo';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-indigo-500 selection:text-white">
          {/* Top Interactive Demo Bar */}
          <DemoBar />

          {/* Persistent Navbar */}
          <Navbar />

          {/* Main Route Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<DemoOne />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects/:id/applicants" element={<Applicants />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/workspace/:projectId" element={<Workspace />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/profile/:id" element={<StudentProfile />} />
              <Route path="/client" element={<ClientDashboard />} />
              <Route path="/client/post-project" element={<PostProject />} />
              <Route path="/students" element={<StudentsList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">SkillMatch</div>
                  <p className="text-slate-400">Work. Collaborate. Grow. • Student talent deserves better opportunities.</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Deterministic Matching & Evidence Proof
                </span>
                <span>•</span>
                <span>Production MVP Web Application</span>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
