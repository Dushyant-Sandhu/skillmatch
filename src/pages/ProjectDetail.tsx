import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FreelanceProject, MatchResult } from '../types';
import { MatchBadge } from '../components/matching/MatchBadge';
import { ApplyModal } from '../components/applications/ApplyModal';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Tag
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<FreelanceProject | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [error, setError] = useState('');

  const loadProject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.getProject(id);
      setProject(res.project);
      setMatch(res.match);
    } catch (err: any) {
      setError(err.message || 'Project not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">{error || 'This opportunity might have expired or been removed.'}</p>
        <Link
          to="/projects"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main Project Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-indigo-900/40 inline-flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                {project.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                {project.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Match Score Badge (for students) */}
          {role === 'student' && match && (
            <div className="shrink-0">
              <MatchBadge
                score={match.score}
                breakdown={match.breakdown}
                reasons={match.reasons}
                projectTitle={project.title}
                size="lg"
              />
            </div>
          )}
        </div>

        {/* Project Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Project Budget</span>
            <span className="text-base font-extrabold text-emerald-400">
              ₹{project.budget_min.toLocaleString()} – ₹{project.budget_max.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Timeline / Deadline</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {project.deadline}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Candidates Applied</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {project.applicants_count || 0} applicants
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Status</span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mt-0.5 block">
              {project.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Project Overview
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Skills Required (Section 15) */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Skills Required
          </h3>
          <div className="flex flex-wrap gap-2">
            {(project.requirements || []).map((req) => (
              <div
                key={req.id}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2"
              >
                <span>{req.skill_name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 capitalize">
                  {req.importance} importance
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Why You're a Match (Section 15) */}
        {role === 'student' && match && (
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Why You're a {match.score}% Match for This Deliverable</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {match.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Card */}
        <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={project.client_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180'}
              alt={project.client_name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-800"
            />
            <div>
              <h4 className="font-bold text-white text-sm">{project.client_name}</h4>
              <span className="text-xs text-slate-400">{project.client_organization || 'Client Partner'}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Client
            </span>
          </div>
        </div>

        {/* Apply CTA Button (Section 15) */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Posted {new Date(project.created_at).toLocaleDateString()}
          </span>

          {role === 'student' && project.status === 'posted' && (
            <button
              onClick={() => setApplyOpen(true)}
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all"
            >
              Apply Now
            </button>
          )}

          {role === 'client' && (
            <Link
              to={`/projects/${project.id}/applicants`}
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all"
            >
              Review Applicants ({project.applicants_count || 0})
            </Link>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {applyOpen && (
        <ApplyModal
          project={project}
          isOpen={applyOpen}
          onClose={() => setApplyOpen(false)}
          onSuccess={() => {
            setApplyOpen(false);
            loadProject();
          }}
        />
      )}
    </div>
  );
};
