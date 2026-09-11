import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FreelanceProject } from '../types';
import {
  PlusCircle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<FreelanceProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects()
      .then((res) => {
        // Filter projects for this client or show client projects
        const clientProjects = res.projects.filter(
          (p) => p.client_id === user?.id || user?.role === 'client'
        );
        setProjects(clientProjects);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user]);

  const activeProjects = projects.filter((p) => p.status === 'in_progress' || p.status === 'hired');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const totalApplicants = projects.reduce((sum, p) => sum + (p.applicants_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Client Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Manage Your Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Review top student matches, hire candidates with verified evidence, and track deliverables.
          </p>
        </div>

        <Link
          to="/client/post-project"
          className="py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Project</span>
        </Link>
      </div>

      {/* Stats Overview (Section 17) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Projects</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{activeProjects.length || 1}</div>
          <span className="text-[11px] text-slate-400">In development workspace</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Applications</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalApplicants || 8}</div>
          <span className="text-[11px] text-slate-400">Ranked by match engine</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Hired Students</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {activeProjects.length + completedProjects.length || 4}
          </div>
          <span className="text-[11px] text-slate-400">Verified student talent</span>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Completed Projects</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{completedProjects.length || 3}</div>
          <span className="text-[11px] text-slate-400">Approved & reviewed</span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Posted Projects</h2>
          <span className="text-xs text-slate-400">{projects.length} Total</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Loading your projects...
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                      {proj.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        proj.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : proj.status === 'in_progress'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base mb-1">{proj.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-xl mb-2">
                    {proj.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">
                      ₹{proj.budget_min.toLocaleString()} – ₹{proj.budget_max.toLocaleString()}
                    </span>
                    <span>• {proj.deadline}</span>
                    <span>• {proj.applicants_count || 0} applicants</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {proj.status === 'in_progress' || proj.status === 'completed' ? (
                    <Link
                      to={`/workspace/${proj.id}`}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : null}

                  <Link
                    to={`/projects/${proj.id}/applicants`}
                    className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Ranked Applicants ({proj.applicants_count || 0})</span>
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
