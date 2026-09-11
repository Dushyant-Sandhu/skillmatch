import React from 'react';
import { MatchBreakdown } from '../../types';
import { X, CheckCircle2, Target, Briefcase, Clock, DollarSign, Star, Zap } from 'lucide-react';

interface MatchExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  breakdown?: MatchBreakdown;
  reasons?: string[];
  projectTitle?: string;
}

export const MatchExplanationModal: React.FC<MatchExplanationModalProps> = ({
  isOpen,
  onClose,
  score,
  breakdown = { skills: 95, experience: 90, portfolio: 90, availability: 95, rating: 96, budget: 90 },
  reasons = [
    'You possess verified technical skills required for this deliverable',
    'Your portfolio showcases production applications using these technologies',
    'Your schedule and availability align with the project delivery timeline',
    'Your rate fits within the allocated client budget'
  ],
  projectTitle = 'Freelance Project'
}) => {
  if (!isOpen) return null;

  const factors = [
    { label: 'Skill Compatibility (45%)', value: breakdown.skills, icon: Target, color: 'bg-indigo-500' },
    { label: 'Skill Proficiency / Exp (20%)', value: breakdown.experience, icon: Zap, color: 'bg-violet-500' },
    { label: 'Portfolio Similarity (15%)', value: breakdown.portfolio, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Availability Fit (10%)', value: breakdown.availability, icon: Clock, color: 'bg-emerald-500' },
    { label: 'Rating & Track Record (5%)', value: breakdown.rating, icon: Star, color: 'bg-amber-500' },
    { label: 'Budget Compatibility (5%)', value: breakdown.budget, icon: DollarSign, color: 'bg-teal-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-500 text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/30">
            {score}%
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Deterministic Match Score</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              Why this matches you
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[280px]">
              {projectTitle}
            </p>
          </div>
        </div>

        {/* Reasons Checklist (Section 10) */}
        <div className="mb-6 bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Compatibility Highlights
          </span>
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* 6-Factor Deterministic Breakdown (Section 10 & 43) */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Algorithmic Score Breakdown
          </span>
          <div className="space-y-2.5">
            {factors.map((f, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <div className="flex items-center gap-1.5">
                    <f.icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{f.label}</span>
                  </div>
                  <span className="font-bold text-white">{f.value}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.color} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(5, f.value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
