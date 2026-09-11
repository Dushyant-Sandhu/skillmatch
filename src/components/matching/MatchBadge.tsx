import React, { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { MatchBreakdown } from '../../types';
import { MatchExplanationModal } from './MatchExplanationModal';

interface MatchBadgeProps {
  score?: number;
  breakdown?: MatchBreakdown;
  reasons?: string[];
  projectTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showWhyButton?: boolean;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({
  score = 88,
  breakdown,
  reasons,
  projectTitle,
  size = 'md',
  showWhyButton = true
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getStyle = (s: number) => {
    if (s >= 90) {
      return {
        bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
        glow: 'shadow-emerald-500/10',
        label: 'Top Match'
      };
    }
    if (s >= 80) {
      return {
        bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
        glow: 'shadow-indigo-500/10',
        label: 'Strong Match'
      };
    }
    return {
      bg: 'bg-slate-800/60 border-slate-700/60 text-slate-300',
      glow: '',
      label: 'Good Match'
    };
  };

  const style = getStyle(score);

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <button
          onClick={() => setModalOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-full font-bold border transition group ${style.bg} ${style.glow} ${
            size === 'sm'
              ? 'px-2.5 py-0.5 text-xs'
              : size === 'lg'
              ? 'px-4 py-1.5 text-base'
              : 'px-3 py-1 text-xs'
          }`}
          title="Click to see why this matches you"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{score}% Match</span>
          {showWhyButton && (
            <span className="text-[10px] opacity-75 font-normal pl-0.5 group-hover:underline flex items-center">
              Why?
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          )}
        </button>
      </div>

      <MatchExplanationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        score={score}
        breakdown={breakdown}
        reasons={reasons}
        projectTitle={projectTitle}
      />
    </>
  );
};
