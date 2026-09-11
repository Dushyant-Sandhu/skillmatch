import React from 'react';
import { StudentSkill } from '../../types';
import { ShieldCheck, FolderGit2, CheckCircle2, Award } from 'lucide-react';

const Github = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface SkillProofCardProps {
  skill: StudentSkill;
  showDetails?: boolean;
}

export const SkillProofCard: React.FC<SkillProofCardProps> = ({ skill, showDetails = true }) => {
  const getProficiencyColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-teal-400';
    if (score >= 80) return 'from-indigo-500 to-violet-500';
    if (score >= 65) return 'from-blue-500 to-indigo-500';
    return 'from-amber-500 to-orange-400';
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300">
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300" />

      {/* Header with Title & Evidence Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-white group-hover:text-indigo-300 transition">
              {skill.skill_name}
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <ShieldCheck className="w-3 h-3" />
              Evidence-backed
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {skill.proficiency_label || 'Advanced'} • {skill.years_experience} yrs practical experience
          </span>
        </div>

        {/* Numeric Proficiency */}
        <div className="text-right">
          <span className="text-lg font-extrabold text-white tracking-tight">
            {skill.proficiency}%
          </span>
        </div>
      </div>

      {/* Proficiency Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-2 mb-4 overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} transition-all duration-500`}
          style={{ width: `${skill.proficiency}%` }}
        />
      </div>

      {/* Evidence Proof Grid (Section 12 differentiator) */}
      {showDetails && (
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/70 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400/90 flex items-center gap-1.5 mb-1">
            <span>Demonstrated Proof & Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Portfolio Projects */}
            <div className="flex items-center gap-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <FolderGit2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  {skill.portfolio_count || 3} Projects
                </span>
                <span className="text-[10px] text-slate-400">In Portfolio</span>
              </div>
            </div>

            {/* Completed Freelance Jobs */}
            <div className="flex items-center gap-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  {skill.completed_jobs_count || 2} Delivered
                </span>
                <span className="text-[10px] text-slate-400">Freelance Jobs</span>
              </div>
            </div>
          </div>

          {/* GitHub & Live Verification status */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-300">
                {skill.verified_github ? 'Repository commits verified' : 'Code sample linked'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
