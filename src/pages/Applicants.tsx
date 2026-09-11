import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Application, FreelanceProject } from '../types';
import { MatchBadge } from '../components/matching/MatchBadge';
import {
  ShieldCheck,
  Star,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Applicants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<FreelanceProject | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Hiring Confirmation Modal State (Section 20)
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [hiring, setHiring] = useState(false);
  const [hiredSuccess, setHiredSuccess] = useState(false);

  const loadApplicants = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.getProjectApplicants(id);
      setProject(res.project);
      setApplicants(res.applicants);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [id]);

  const handleHireConfirm = async () => {
    if (!selectedApplicant || !project) return;
    try {
      setHiring(true);
      await api.hireStudent(project.id, selectedApplicant.student_id, selectedApplicant.id);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      setHiredSuccess(true);
      setTimeout(() => {
        navigate(`/workspace/${project.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error hiring student:', err);
    } finally {
      setHiring(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500 text-sm">
        Calculating deterministic match scores for applicants...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/client" className="text-xs text-indigo-400 hover:underline">
            Client Portal
          </Link>
          <span className="text-xs text-slate-600">/</span>
          <span className="text-xs text-slate-400">Review Applicants</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Top Student Matches
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Project: <span className="text-white font-semibold">{project?.title}</span> • Sorted by algorithmic match score
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              {applicants.length} Total Applicants
            </span>
          </div>
        </div>
      </div>

      {/* Applicants List (Sorted by match score - Section 19) */}
      <div className="space-y-4">
        {applicants.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-slate-400 text-xs">
            No student applicants yet for this project.
          </div>
        ) : (
          applicants.map((app, index) => {
            const isTopRanked = index === 0 && (app.match_score || 0) >= 85;

            return (
              <div
                key={app.id}
                className={`glass-card rounded-3xl p-6 relative overflow-hidden transition ${
                  isTopRanked ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''
                }`}
              >
                {isTopRanked && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-violet-600 text-white text-[10px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-sm">
                    ★ #1 Algorithmic Match
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Student Info & Match Badge */}
                  <div className="flex items-start gap-4">
                    <img
                      src={app.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180'}
                      alt={app.student_name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{app.student_name}</h3>
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Evidence-Backed
                        </span>
                      </div>

                      {/* Rating & Completed projects */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {app.student_rating || 4.8} ★
                        </span>
                        <span>• {app.student_completed_count || 6} Completed Freelance Jobs</span>
                        <span>• {app.portfolio_count || 4} Portfolio Projects</span>
                      </div>

                      {/* Proposal text preview */}
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        "{app.proposal}"
                      </p>
                    </div>
                  </div>

                  {/* Match Score & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-left lg:text-right">
                      <MatchBadge
                        score={app.match_score || 94}
                        breakdown={app.match_breakdown}
                        reasons={app.match_reasons}
                        projectTitle={project?.title}
                        size="md"
                      />
                      <div className="text-xs text-slate-300 font-bold mt-2">
                        Proposed: <span className="text-emerald-400">₹{app.proposed_price.toLocaleString()}</span> in {app.estimated_days} days
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${app.student_id}`}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Hire Student</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Hiring Confirmation Modal (Section 20) */}
      {selectedApplicant && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-7 space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Confirm Hiring Decision
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Hire {selectedApplicant.student_name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Project status will transition to <strong>IN PROGRESS</strong> and open the collaborative project workspace.
              </p>
            </div>

            {/* Terms Summary (Section 20) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Project Deliverable:</span>
                <span className="text-white font-semibold">{project.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Agreed Price:</span>
                <span className="text-emerald-400 font-bold">₹{selectedApplicant.proposed_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Timeline:</span>
                <span className="text-white font-semibold">{selectedApplicant.estimated_days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Algorithmic Compatibility:</span>
                <span className="text-indigo-400 font-bold">{selectedApplicant.match_score}% Match</span>
              </div>
            </div>

            {hiredSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hired successfully! Opening Project Workspace...</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleHireConfirm}
                disabled={hiring || hiredSuccess}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{hiring ? 'Hiring...' : `Confirm & Hire for ₹${selectedApplicant.proposed_price.toLocaleString()}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
