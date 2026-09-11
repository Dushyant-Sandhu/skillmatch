import React, { useState } from 'react';
import { FreelanceProject } from '../../types';
import { api } from '../../services/api';
import { X, Send, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ApplyModalProps {
  project: FreelanceProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ project, isOpen, onClose, onSuccess }) => {
  const [proposal, setProposal] = useState(
    `Hi ${project.client_name || 'there'}! I reviewed your project requirements for "${project.title}". With my demonstrated skills in ${
      project.requirements?.map((r) => r.skill_name).join(', ') || 'this stack'
    }, I can build a high-performance, responsive solution and deliver it ahead of your ${project.deadline} deadline.`
  );
  const [proposedPrice, setProposedPrice] = useState(project.budget_max || project.budget_min || 10000);
  const [estimatedDays, setEstimatedDays] = useState(project.deadline_days || 5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal.trim()) {
      setError('Please provide a brief proposal explaining your approach.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await api.applyToProject(project.id, {
        proposal,
        proposed_price: Number(proposedPrice),
        estimated_days: Number(estimatedDays)
      });
      setSuccessMsg('Application submitted successfully! Your status is now Pending.');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. You might have already applied.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {project.match_score || 94}% Compatibility
            </span>
            <span className="text-xs text-slate-400">• {project.category}</span>
          </div>
          <h2 className="text-xl font-bold text-white">Apply for: {project.title}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Client: <span className="text-slate-200 font-medium">{project.client_name}</span> • Target Budget: ₹{project.budget_min.toLocaleString()} – ₹{project.budget_max.toLocaleString()}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Proposal textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Your Proposal & Delivery Plan
            </label>
            <textarea
              rows={4}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 text-xs text-slate-200 leading-relaxed outline-none transition"
              placeholder="Explain how your demonstrated skills and portfolio projects qualify you to deliver this project..."
              required
            />
          </div>

          {/* Pricing and Days Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Proposed Price (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white outline-none"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Client range: ₹{project.budget_min.toLocaleString()} – ₹{project.budget_max.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Delivery (Days)
              </label>
              <input
                type="number"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white outline-none"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Client deadline: {project.deadline}
              </span>
            </div>
          </div>

          {/* Evidence verification notice */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Evidence-Backed Profile Attached</span>
              <span className="text-[11px] text-slate-400">
                Your verified portfolio projects, GitHub commits, and previous client ratings will be automatically submitted with this proposal.
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
