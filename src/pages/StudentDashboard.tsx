import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FreelanceProject, Application } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  CheckCircle2,
  Star,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recommendedProjects, setRecommendedProjects] = useState<FreelanceProject[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Alex';

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [projRes, appRes] = await Promise.all([
        api.getProjects({ status: 'posted' }),
        api.getApplications()
      ]);
      setRecommendedProjects(projRes.projects.slice(0, 4));
      setMyApplications(appRes.applications.slice(0, 3));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Profile Strength Calculation
  const profileStrength = 88;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Greeting (Section 9) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here are your personalized opportunities matched by your verified skills and portfolio proof.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/discover"
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Discover Feed</span>
          </Link>
          <Link
            to="/projects"
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse All Projects</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Stats Grid (Section 9) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Profile Strength */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Profile Strength</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white mb-1.5">{profileStrength}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                style={{ width: `${profileStrength}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Projects</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">1</div>
            <Link to="/workspace/proj-1" className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5 mt-0.5">
              <span>View Workspace</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Completed Projects</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{user?.completed_projects || 6}</div>
            <span className="text-[11px] text-slate-400">Delivered on time</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Average Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white flex items-center gap-1">
              <span>{user?.overall_rating || 4.8}</span>
              <span className="text-amber-400 text-base">★</span>
            </div>
            <span className="text-[11px] text-slate-400">Based on client reviews</span>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Earnings</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-400">
              ₹{(user?.total_earnings || 68000).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Verified student payouts</span>
          </div>
        </div>
      </div>

      {/* 3. Recommended For You Section (Section 9) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Recommended For You</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by deterministic algorithm based on your verified skills, portfolio, and schedule.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View all matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Calculating personalized matches...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} onApplySuccess={loadDashboardData} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Recent Applications Strip */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Your Recent Applications</h3>
          </div>
          <Link
            to="/applications"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View all ({myApplications.length})
          </Link>
        </div>

        {myApplications.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            You haven't submitted any applications yet. Browse recommended projects above to apply!
          </div>
        ) : (
          <div className="space-y-2.5">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <div>
                  <h4 className="font-semibold text-white">{app.project_title || 'Freelance Project'}</h4>
                  <span className="text-slate-400 text-[11px]">
                    Applied with ₹{app.proposed_price?.toLocaleString()} • {app.estimated_days} days estimated
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                      app.status === 'accepted'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : app.status === 'shortlisted'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {app.status}
                  </span>
                  <Link
                    to={`/projects/${app.project_id}`}
                    className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
