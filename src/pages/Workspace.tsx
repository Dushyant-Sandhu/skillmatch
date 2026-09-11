import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FreelanceProject, Profile, ProjectSubmission, Review } from '../types';
import { ReviewModal } from '../components/reviews/ReviewModal';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  Send,
  ExternalLink,
  FileCheck,
  Star,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Github = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Workspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { role } = useAuth();
  const id = projectId || 'proj-1';

  const [project, setProject] = useState<FreelanceProject | null>(null);
  const [hiredStudent, setHiredStudent] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Student deliverable submission form state
  const [submissionUrl, setSubmissionUrl] = useState('https://fitzone-gym-landing.vercel.app');
  const [githubUrl, setGithubUrl] = useState('https://github.com/alexmehta-dev/fitzone-gym-landing');
  const [message, setMessage] = useState(
    'Deliverable complete! All responsive breakpoints (mobile, tablet, desktop) are verified, interactive contact inquiry form is wired up, and Lighthouse performance score is 98.'
  );
  const [submittingWork, setSubmittingWork] = useState(false);

  // Client review modal
  const [reviewOpen, setReviewOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      const res = await api.getWorkspace(id);
      setProject(res.project);
      setHiredStudent(res.hiredStudent || null);
      setSubmissions(res.submissions);
      setReviews(res.reviews);
    } catch (err) {
      console.error('Error loading workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl || !message) return;
    try {
      setSubmittingWork(true);
      await api.submitDeliverable(id, {
        submission_url: submissionUrl,
        github_url: githubUrl,
        message
      });
      setActionSuccess('Deliverables submitted successfully for client review!');
      loadWorkspace();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingWork(false);
    }
  };

  const handleApproveWork = async () => {
    if (!window.confirm('Approve project completion and release rating?')) return;
    try {
      await api.approveDeliverable(id);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      setActionSuccess('Project marked Completed! Please leave a review to complete the reputation loop.');
      loadWorkspace();
      setReviewOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestChanges = async () => {
    const feedback = window.prompt('Please provide change request instructions for the student:');
    if (!feedback) return;
    try {
      await api.requestChanges(id, feedback);
      setActionSuccess('Change request sent to student.');
      loadWorkspace();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500 text-sm">
        Loading project workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h3 className="text-lg font-bold text-white">Project workspace not found</h3>
      </div>
    );
  }

  // 5-Stage Stepper Progress (Section 21)
  // Stages: Project Started ➔ Work In Progress ➔ Submitted ➔ Approved ➔ Completed
  const currentStep =
    project.status === 'completed'
      ? 5
      : submissions.some((s) => s.status === 'approved')
      ? 4
      : submissions.length > 0
      ? 3
      : project.status === 'in_progress'
      ? 2
      : 1;

  const steps = [
    { num: 1, label: 'Project Started' },
    { num: 2, label: 'Work In Progress' },
    { num: 3, label: 'Deliverable Submitted' },
    { num: 4, label: 'Client Approved' },
    { num: 5, label: 'Completed & Reviewed' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Active Project Workspace
            </span>
            <span className="text-xs text-slate-400">• Budget: ₹{project.budget_min.toLocaleString()} – ₹{project.budget_max.toLocaleString()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {project.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              project.status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {project.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 1. PROGRESS TIMELINE STEPPER (Section 21) */}
      <div className="glass-card rounded-3xl p-6 sm:p-7">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Lifecycle Timeline
        </div>

        <div className="relative flex flex-col sm:flex-row justify-between gap-4">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div key={s.num} className="flex-1 flex flex-row sm:flex-col items-center sm:text-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition shadow-md shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white ring-4 ring-indigo-500/30 shadow-indigo-500/30'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {isCompleted ? 'Done' : isCurrent ? 'Active Stage' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN COLLABORATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Submissions & Actions (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deliverables History */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <span>Submitted Deliverables</span>
              </h3>
              <span className="text-xs text-slate-400">{submissions.length} Total</span>
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                No deliverables submitted yet. Student can submit working links and repository code below.
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : sub.status === 'changes_requested'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{sub.message}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
                    {sub.submission_url && (
                      <a
                        href={sub.submission_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Preview / Deliverable</span>
                      </a>
                    )}
                    {sub.github_url && (
                      <a
                        href={sub.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repository Code</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Client Approval Controls (Section 21) */}
            {role === 'client' && project.status !== 'completed' && submissions.length > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-white text-xs block">Client Deliverable Review</span>
                  <span className="text-[11px] text-slate-400">
                    Verify deliverables above. You can approve or request revisions.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRequestChanges}
                    className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 text-xs font-semibold border border-rose-900/40 transition"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={handleApproveWork}
                    className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Completion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Work Submission Form (Section 21) */}
          {role === 'student' && project.status !== 'completed' && (
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                <span>Submit Deliverable or Progress Update</span>
              </h3>

              <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Live Demo / Deliverable URL
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://my-app.vercel.app or Google Drive"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub Codebase URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/my-repo"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notes & Deliverable Description
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Outline completed requirements and instructions to test..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingWork}
                    className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingWork ? 'Submitting...' : 'Submit to Client'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Project Completed Banner & Review Showcase */}
          {project.status === 'completed' && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Project Officially Completed! 🏆</h4>
                  <p className="text-xs text-slate-300">
                    Deliverables were approved and client reviews were posted to student reputation history.
                  </p>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Client Review ({reviews[0].overall_rating} ★)</span>
                    <span className="text-amber-400 font-bold">5.0 / 5.0 Rating</span>
                  </div>
                  <p className="text-slate-300 italic">"{reviews[0].comment}"</p>
                </div>
              ) : role === 'client' ? (
                <button
                  onClick={() => setReviewOpen(true)}
                  className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Leave Rating & Review
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Right Column: Project Summary & Hired Student (1 col) */}
        <div className="space-y-6">
          {/* Hired Student Card */}
          <div className="glass-card rounded-3xl p-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Hired Student Freelancer
            </span>

            {hiredStudent ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={hiredStudent.avatar_url}
                    alt={hiredStudent.full_name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{hiredStudent.full_name}</h4>
                    <span className="text-xs text-slate-400">{hiredStudent.college || 'Engineering'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{hiredStudent.overall_rating} ★</span>
                  </div>
                  <span>• {hiredStudent.completed_projects} completed jobs</span>
                </div>

                <Link
                  to={`/profile/${hiredStudent.id}`}
                  className="block py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold text-center border border-slate-800 transition"
                >
                  View Profile & Evidence
                </Link>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Candidate: <span className="text-white font-semibold">{project.hired_student_name || 'Alex Mehta'}</span>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="glass-card rounded-3xl p-5 space-y-3 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 block">
              Deliverable Summary
            </span>
            <p className="text-slate-300 leading-relaxed">{project.description}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between">
              <span className="text-slate-400">Agreed Timeline:</span>
              <span className="text-white font-semibold">{project.deadline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Agreed Payout:</span>
              <span className="text-emerald-400 font-bold">
                ₹{project.budget_min.toLocaleString()} – ₹{project.budget_max.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewOpen && (
        <ReviewModal
          projectId={project.id}
          studentId={hiredStudent?.id || project.hired_student_id || 'student-1'}
          studentName={hiredStudent?.full_name || project.hired_student_name || 'Student'}
          isOpen={reviewOpen}
          onClose={() => setReviewOpen(false)}
          onSuccess={() => {
            setReviewOpen(false);
            loadWorkspace();
          }}
        />
      )}
    </div>
  );
};
