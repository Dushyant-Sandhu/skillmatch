import React, { useState } from 'react';
import { api } from '../../services/api';
import { Star, X, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

interface ReviewModalProps {
  projectId: string;
  studentId: string;
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  projectId,
  studentId,
  studentName,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { refreshUser } = useAuth();
  const [quality, setQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [deadline, setDeadline] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [comment, setComment] = useState(
    'Outstanding execution! Clean, well-structured code and delivered ahead of schedule. Pleasure to collaborate with.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const averageRating = Math.round(((quality + communication + deadline + professionalism) / 4) * 10) / 10;

  const renderStars = (value: number, setValue: (v: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setValue(star)}
            className="p-1 text-slate-600 hover:text-amber-400 transition"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback about your collaboration.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await api.createReview({
        project_id: projectId,
        student_id: studentId,
        quality_rating: quality,
        communication_rating: communication,
        deadline_rating: deadline,
        professionalism_rating: professionalism,
        comment
      });

      // Confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      await refreshUser();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1 mb-2">
            <Award className="w-3 h-3" />
            Reputation Feedback
          </span>
          <h2 className="text-xl font-bold text-white">Rate {studentName}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Your review will build {studentName}'s verified freelance reputation on SkillMatch.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 4 Multi-dimensional Rating Categories */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Quality of Work</span>
              {renderStars(quality, setQuality)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Communication</span>
              {renderStars(communication, setCommunication)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Deadline Adherence</span>
              {renderStars(deadline, setDeadline)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Professionalism</span>
              {renderStars(professionalism, setProfessionalism)}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">Overall Score</span>
              <span className="text-base font-extrabold text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                {averageRating} / 5.0
              </span>
            </div>
          </div>

          {/* Comment textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Client Testimonial & Review
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 text-xs text-slate-200 leading-relaxed outline-none transition"
              placeholder="Describe the student's problem solving, communication, and work..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit 5★ Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
