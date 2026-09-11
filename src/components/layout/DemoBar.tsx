import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, RotateCcw, Sparkles, Palette } from 'lucide-react';
import { api } from '../../services/api';

export const DemoBar: React.FC = () => {
  const { user, switchPersona, refreshUser } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [resetting, setResetting] = useState(false);

  const personas = [
    { id: 'student-1', name: 'Alex Mehta', role: 'Student (React Specialist)', icon: '👨‍💻' },
    { id: 'student-2', name: 'Priya Sharma', role: 'Student (UI/UX Designer)', icon: '🎨' },
    { id: 'student-3', name: 'Rohan Verma', role: 'Student (Python & Data)', icon: '🐍' },
    { id: 'client-1', name: 'Vikram Malhotra (FitZone)', role: 'Client (Gym Owner)', icon: '🏋️' },
    { id: 'client-2', name: 'Sunita Rao (Chai Story)', role: 'Client (Hospitality)', icon: '☕' },
  ];

  const handleReset = async () => {
    if (window.confirm('Reset demo database to fresh pristine state?')) {
      setResetting(true);
      try {
        await api.resetDemo();
        await refreshUser();
        window.location.reload();
      } catch (err) {
        console.error('Reset failed:', err);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="bg-slate-950/90 border-b border-indigo-900/40 text-xs py-2 px-4 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Persona Switcher */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Active Persona:</span>
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
            {personas.map((p) => {
              const active = user?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => switchPersona(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition font-medium ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/30 border border-indigo-400/40'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                  }`}
                  title={`Switch to ${p.name}`}
                >
                  <span>{p.icon}</span>
                  <span className="truncate max-w-[120px]">{p.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75">
                    ({p.role.startsWith('Student') ? 'Student' : 'Client'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Demo Guide, Shader Demo & Reset */}
        <div className="flex items-center gap-2">
          <Link
            to="/demo"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 transition font-medium"
            title="Open Interactive Shader Design Demo"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Shader Demo</span>
          </Link>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">60s Demo Guide</span>
          </button>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
            title="Reset database to seed"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset Data'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Demo Guide Drawer */}
      {showGuide && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-2 text-slate-300">
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
            <div className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
              <span>1. Student Profile</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Select <strong>Alex Mehta</strong>. View Skill Proof (React 92%, 4 portfolio projects, GitHub verified).
            </p>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
            <div className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
              <span>2. 94% Match & Apply</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Open "Landing Page for Local Gym". Inspect the deterministic 6-factor score breakdown & submit proposal.
            </p>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
            <div className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
              <span>3. Client Hire</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Switch to <strong>Vikram (FitZone)</strong>. View applicants ranked by match score. Click <strong>Hire</strong>.
            </p>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
            <div className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
              <span>4. Workspace & Submit</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Return to Alex. Open <code>/workspace/proj-1</code>. Submit live demo URL & deliverables.
            </p>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
            <div className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
              <span>5. Review & Reputation</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Switch to Vikram. Approve completion & submit 5★ review. See Alex's rating update in real-time!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
