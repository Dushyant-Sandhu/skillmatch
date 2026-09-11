import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FreelanceProject } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Search, Filter, RotateCcw, Briefcase } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<FreelanceProject[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'budget' | 'recent'>('match');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Web Development',
    'UI/UX & Graphic Design',
    'Python & Data Automation',
    'Mobile App Development',
    'Content & Writing'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search
      });
      let list = res.projects;

      if (sortBy === 'match') {
        list.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      } else if (sortBy === 'budget') {
        list.sort((a, b) => (b.budget_max || 0) - (a.budget_max || 0));
      } else if (sortBy === 'recent') {
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setProjects(list);
    } catch (err) {
      console.error('Error fetching marketplace projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedDifficulty, search, sortBy]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSortBy('match');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/20">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Freelance Marketplace</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Find Your Next Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore curated freelance projects. The match engine computes compatibility in real-time from your verified profile evidence.
        </p>
      </div>

      {/* Search & Filter Bar (Section 14) */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title, keywords, or required stack..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="budget">Budget (Highest)</option>
              <option value="recent">Recently Posted</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Difficulty filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Difficulty:</span>
            <div className="flex items-center gap-1">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition ${
                    selectedDifficulty === diff
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || search) && (
              <button
                onClick={handleClearFilters}
                className="ml-2 flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading matching opportunities...
        </div>
      ) : projects.length === 0 ? (
        /* Empty state (Section 48) */
        <div className="glass-card rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No projects match your filters</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Try adjusting your search terms, changing categories, or clearing active filters to see all available freelance work.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} onApplySuccess={fetchProjects} />
          ))}
        </div>
      )}
    </div>
  );
};
