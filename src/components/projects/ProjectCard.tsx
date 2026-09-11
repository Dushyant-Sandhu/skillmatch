import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FreelanceProject } from '../../types';
import { MatchBadge } from '../matching/MatchBadge';
import { ApplyModal } from '../applications/ApplyModal';
import { Clock, Users, ArrowRight, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProjectCardProps {
  project: FreelanceProject;
  onApplySuccess?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onApplySuccess }) => {
  const { role } = useAuth();
  const [applyOpen, setApplyOpen] = useState(false);

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString()}`;
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 group">
        <div>
          {/* Category & Match Score Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-indigo-300 border border-indigo-900/40">
              <Tag className="w-3 h-3 text-indigo-400" />
              {project.category}
            </span>

            {/* Match score (for students) */}
            {role === 'student' && project.match_score !== undefined && (
              <MatchBadge
                score={project.match_score}
                breakdown={project.match_breakdown}
                reasons={project.match_reasons}
                projectTitle={project.title}
                size="sm"
              />
            )}
          </div>

          {/* Title */}
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-1 mb-2">
              {project.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Skills Required Pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(project.requirements && project.requirements.length > 0
              ? project.requirements.map((r) => r.skill_name)
              : ['React', 'HTML/CSS', 'Responsive Design']
            ).slice(0, 4).map((skillName, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-300 border border-slate-800"
              >
                {skillName}
              </span>
            ))}
          </div>
        </div>

        {/* Project Metrics & Footer Actions */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-4">
            {/* Budget */}
            <div className="flex items-center gap-1 font-semibold text-white">
              <span className="text-emerald-400 font-bold text-sm">
                {formatCurrency(project.budget_min)} – {formatCurrency(project.budget_max)}
              </span>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{project.deadline}</span>
            </div>

            {/* Applicants Count */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{project.applicants_count || 0} applied</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={`/projects/${project.id}`}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold text-center border border-slate-800 transition flex items-center justify-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {role === 'student' && project.status === 'posted' && (
              <button
                onClick={() => setApplyOpen(true)}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20"
              >
                Apply Now
              </button>
            )}

            {role === 'client' && (
              <Link
                to={`/projects/${project.id}/applicants`}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20"
              >
                Applicants ({project.applicants_count || 0})
              </Link>
            )}
          </div>
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
            if (onApplySuccess) onApplySuccess();
          }}
        />
      )}
    </>
  );
};
