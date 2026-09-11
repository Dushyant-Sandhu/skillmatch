import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FreelanceProject } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Compass, TrendingUp, Clock, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Discover: React.FC = () => {
  const [projects, setProjects] = useState<FreelanceProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects()
      .then((res) => setProjects(res.projects))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const topMatches = [...projects].sort((a, b) => (b.match_score || 0) - (a.match_score || 0)).slice(0, 3);
  const trending = [...projects].sort((a, b) => (b.applicants_count || 0) - (a.applicants_count || 0)).slice(0, 3);
  const recentlyPosted = [...projects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/20">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Discovery</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Discover Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore algorithmic recommendations, trending campus projects, and newly opened freelance listings.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Compiling curated discovery feed...
        </div>
      ) : (
        <>
          {/* 1. Best Freelance Matches (Section 25) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Best Freelance Matches</h2>
              </div>
              <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {topMatches.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          {/* 2. Trending Student Opportunities (Section 25) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Trending Student Opportunities</h2>
              </div>
              <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {trending.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          {/* 3. Recently Posted (Section 25) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Recently Posted</h2>
              </div>
              <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentlyPosted.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
