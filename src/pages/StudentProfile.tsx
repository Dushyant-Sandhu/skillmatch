import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Profile, StudentSkill, PortfolioProject, Review } from '../types';
import { SkillProofCard } from '../components/matching/SkillProofCard';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  ShieldCheck,
  FolderGit2,
  ExternalLink,
  Award,
  Clock,
  MapPin,
  GraduationCap,
  Plus
} from 'lucide-react';

const Github = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const profileId = id || currentUser?.id || 'student-1';

  const [student, setStudent] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profileStrength, setProfileStrength] = useState(88);
  const [loading, setLoading] = useState(true);

  // Add Skill Modal State
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState(85);

  // Add Portfolio Modal State
  const [addPortOpen, setAddPortOpen] = useState(false);
  const [portTitle, setPortTitle] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portTech, setPortTech] = useState('');
  const [portLive, setPortLive] = useState('');
  const [portGit, setPortGit] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getStudent(profileId);
      setStudent(res.student);
      setSkills(res.skills);
      setPortfolio(res.portfolio);
      setReviews(res.reviews);
      setProfileStrength(res.profile_strength || 88);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await api.addSkill(profileId, {
        skill_name: newSkillName,
        proficiency: Number(newSkillProf),
        years_experience: 2
      });
      setAddSkillOpen(false);
      setNewSkillName('');
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle.trim() || !portDesc.trim()) return;
    try {
      await api.addPortfolio(profileId, {
        title: portTitle,
        description: portDesc,
        technologies: portTech.split(',').map((t) => t.trim()),
        project_url: portLive || undefined,
        github_url: portGit || undefined
      });
      setAddPortOpen(false);
      setPortTitle('');
      setPortDesc('');
      setPortTech('');
      setPortLive('');
      setPortGit('');
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const isOwner = currentUser?.id === profileId;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500 text-sm">
        Loading student profile & verified skill proof...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h3 className="text-lg font-bold text-white">Student profile not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Profile Banner (Section 11) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={student.avatar_url}
              alt={student.full_name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {student.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Student
                </span>
              </div>

              {/* College & Course */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 mb-2">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  {student.college || 'IIT Delhi'} • {student.course || 'CS & Eng'} ({student.year || '3rd Year'})
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {student.location || 'New Delhi, India'}
                </span>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{student.overall_rating} ★</span>
                  <span className="text-slate-400 font-normal">({student.completed_projects} jobs completed)</span>
                </div>

                <div className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{student.availability || 'Available 20 hrs/week'}</span>
                </div>

                {student.github_connected && (
                  <div className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    <span>@{student.github_username || 'dev'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Strength Widget (Section 47) */}
          <div className="w-full md:w-56 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>Profile Strength</span>
              <span className="text-indigo-400 font-bold">{profileStrength}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                style={{ width: `${profileStrength}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {profileStrength >= 80 ? '✓ Evidence-backed profile' : 'Add 1 more portfolio to boost score +10%'}
            </span>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {student.bio}
            </p>
          </div>
        )}
      </div>

      {/* 2. SKILL PROOF SHOWCASE (Section 12 - THE PRIMARY DIFFERENTIATOR) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Demonstrated Skill Proof</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Skills backed by actual portfolio projects, deployed apps, and verified client deliverables.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setAddSkillOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillProofCard key={skill.skill_id} skill={skill} />
          ))}
        </div>
      </div>

      {/* 3. PORTFOLIO GALLERY (Section 13) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Verified Portfolio Projects</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production apps and repositories used by the deterministic matching engine.
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setAddPortOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {portfolio.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between">
              {item.image_url && (
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-xs bg-slate-900 text-indigo-300 border border-slate-800 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                  {item.project_url && (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. COMPLETED PROJECTS & CLIENT REVIEWS (Section 23 & 24) */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Delivered Projects & Reputation</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified client evaluations across Quality, Communication, Deadline, and Professionalism.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-xs">
            No client reviews recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.client_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180'}
                      alt={rev.client_name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{rev.client_name}</h4>
                      <span className="text-[11px] text-slate-400">{rev.project_title}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{rev.overall_rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  "{rev.comment}"
                </p>

                {/* Breakdown pills */}
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                  <div className="p-1 rounded bg-slate-900 text-slate-300">
                    Quality: <span className="font-bold text-amber-400">{rev.quality_rating}★</span>
                  </div>
                  <div className="p-1 rounded bg-slate-900 text-slate-300">
                    Comm: <span className="font-bold text-amber-400">{rev.communication_rating}★</span>
                  </div>
                  <div className="p-1 rounded bg-slate-900 text-slate-300">
                    Deadline: <span className="font-bold text-amber-400">{rev.deadline_rating}★</span>
                  </div>
                  <div className="p-1 rounded bg-slate-900 text-slate-300">
                    Prof: <span className="font-bold text-amber-400">{rev.professionalism_rating}★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {addSkillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Evidence-Backed Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js, Flutter, Docker"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proficiency ({newSkillProf}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={newSkillProf}
                  onChange={(e) => setNewSkillProf(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddSkillOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {addPortOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Portfolio Project</h3>
            <form onSubmit={handleAddPortfolio} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={portTitle}
                  onChange={(e) => setPortTitle(e.target.value)}
                  placeholder="e.g. FitPulse Web App"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={portDesc}
                  onChange={(e) => setPortDesc(e.target.value)}
                  placeholder="Describe architecture and key features..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={portTech}
                  onChange={(e) => setPortTech(e.target.value)}
                  placeholder="React, TypeScript, Tailwind CSS"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={portLive}
                  onChange={(e) => setPortLive(e.target.value)}
                  placeholder="https://my-app.vercel.app"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={portGit}
                  onChange={(e) => setPortGit(e.target.value)}
                  placeholder="https://github.com/my-username/repo"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddPortOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
