import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Application } from '../types';
import { MatchBadge } from '../components/matching/MatchBadge';
import { FileText, ArrowRight } from 'lucide-react';

export const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getApplications()
      .then((res) => setApplications(res.applications))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
          Proposals & Submissions
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          My Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track the status of your submitted project proposals and client evaluations.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading your applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <FileText className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="font-bold text-white text-base">You haven't applied to any projects yet</h3>
          <p className="text-xs text-slate-400">
            Browse our curated opportunities matched to your skills to submit your first proposal.
          </p>
          <Link
            to="/projects"
            className="inline-block py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Explore Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="glass-card rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      app.status === 'accepted'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : app.status === 'shortlisted'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>

                <Link to={`/projects/${app.project_id}`}>
                  <h3 className="text-lg font-bold text-white hover:text-indigo-300 transition">
                    {app.project_title || 'Freelance Project'}
                  </h3>
                </Link>

                <p className="text-xs text-slate-300 italic line-clamp-2 max-w-xl my-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  "{app.proposal}"
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">
                    Proposed: ₹{app.proposed_price.toLocaleString()}
                  </span>
                  <span>• {app.estimated_days} days delivery</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <MatchBadge
                  score={app.match_score || 94}
                  breakdown={app.match_breakdown}
                  reasons={app.match_reasons}
                  projectTitle={app.project_title}
                  size="sm"
                />

                <div className="flex items-center gap-2">
                  <Link
                    to={`/projects/${app.project_id}`}
                    className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition"
                  >
                    View Project
                  </Link>

                  {app.status === 'accepted' && (
                    <Link
                      to={`/workspace/${app.project_id}`}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
