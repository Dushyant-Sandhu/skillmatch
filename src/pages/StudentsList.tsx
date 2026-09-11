import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Star, ArrowRight } from 'lucide-react';

export const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudents(search)
      .then((res) => setStudents(res.students))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
          Talent Directory
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Browse Evidence-Backed Student Talent
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hire high-performing collegiate engineers and designers backed by verified GitHub commits, deployed apps, and peer reviews.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, college, or skills..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading student directory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((s) => (
            <div key={s.id} className="glass-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <img
                    src={s.avatar_url}
                    alt={s.full_name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{s.full_name}</h3>
                    <span className="text-xs text-slate-400 block">{s.college}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-1 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{s.overall_rating} ★</span>
                      <span className="text-slate-500 font-normal">({s.completed_projects} jobs delivered)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {s.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {(s.skills || []).slice(0, 4).map((sk: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-xs bg-slate-900 text-indigo-300 border border-slate-800 font-medium"
                    >
                      {sk.skill_name} ({sk.proficiency}%)
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-semibold">
                  ₹{s.hourly_rate || 650}/hr
                </span>
                <Link
                  to={`/profile/${s.id}`}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1"
                >
                  <span>View Skill Proof</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
