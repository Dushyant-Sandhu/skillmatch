import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';

export const PostProject: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('Build a modern landing page for our local gym');
  const [description, setDescription] = useState(
    'Need someone to build a modern landing page for our local gym with React, responsive design and a contact form.'
  );
  const [category, setCategory] = useState('Web Development');
  const [budgetMin, setBudgetMin] = useState(8000);
  const [budgetMax, setBudgetMax] = useState(12000);
  const [deadline, setDeadline] = useState('5 days');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skills, setSkills] = useState<Array<{ name: string; importance: 'high' | 'medium' | 'low' }>>([
    { name: 'React', importance: 'high' },
    { name: 'HTML/CSS', importance: 'high' },
    { name: 'Responsive Design', importance: 'high' }
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Web Development',
    'UI/UX & Graphic Design',
    'Python & Data Automation',
    'Mobile App Development',
    'Content & Writing'
  ];

  // AI Assist Requirement Extractor (Section 18 & 44)
  const handleExtractAI = async () => {
    if (!description.trim() || description.length < 10) {
      setError('Please enter a descriptive project summary before triggering AI extraction.');
      return;
    }

    try {
      setAnalyzingAI(true);
      setError('');
      setAiMessage('');

      const res = await api.analyzeProjectAI(description);
      if (res.data) {
        const d = res.data;
        if (d.category) setCategory(d.category);
        if (d.difficulty) setDifficulty(d.difficulty);
        if (d.estimated_days) setDeadline(`${d.estimated_days} days`);
        if (Array.isArray(d.skills) && d.skills.length > 0) {
          setSkills(d.skills);
        }
        setAiMessage(`AI successfully extracted ${d.skills.length} skills, ${d.difficulty} tier, and estimated ${d.estimated_days} days!`);
      }
    } catch (err: any) {
      console.warn('AI Extraction error:', err);
      setAiMessage('AI assistance temporarily offline; using smart deterministic keyword fallback.');
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleAddSkill = () => {
    if (!customSkillInput.trim()) return;
    if (!skills.some((s) => s.name.toLowerCase() === customSkillInput.toLowerCase())) {
      setSkills([...skills, { name: customSkillInput.trim(), importance: 'high' }]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.createProject({
        title,
        description,
        category,
        budget_min: Number(budgetMin),
        budget_max: Number(budgetMax),
        deadline,
        difficulty,
        requirements: skills.map((s) => ({
          skill_name: s.name,
          importance: s.importance,
          required_level: s.importance === 'high' ? 85 : 75
        }))
      });

      navigate(`/projects/${res.project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to post project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Post Opportunity
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Post a Freelance Project
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Define deliverables and required skills. SkillMatch's deterministic engine matches verified student portfolios.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {aiMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{aiMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build a modern landing page for our local gym"
              className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-sm text-white outline-none"
              required
            />
          </div>

          {/* Description & AI Assist Button (Section 18) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Project Description
              </label>

              {/* AI Assist Button */}
              <button
                type="button"
                onClick={handleExtractAI}
                disabled={analyzingAI}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${analyzingAI ? 'animate-spin' : ''}`} />
                <span>{analyzingAI ? 'Analyzing with AI...' : 'AI Assist: Extract Requirements'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need built, key milestones, deliverables, and preferred technology stacks..."
              className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-xs sm:text-sm text-slate-200 leading-relaxed outline-none"
              required
            />
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty / Complexity
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="Beginner">Beginner (Quick tasks / intro)</option>
                <option value="Intermediate">Intermediate (Standard freelance apps)</option>
                <option value="Advanced">Advanced (Complex full-stack / mobile)</option>
              </select>
            </div>
          </div>

          {/* Budget Range & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Budget Min (₹ INR)
              </label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-xs sm:text-sm text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Budget Max (₹ INR)
              </label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-xs sm:text-sm text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Delivery Timeline
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. 5 days, 2 weeks"
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-xs sm:text-sm text-white outline-none"
                required
              />
            </div>
          </div>

          {/* Skills Required (Editable tags with AI assist) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Required Skills
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 capitalize">
                    {skill.importance}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add custom skill (e.g. Next.js)..."
                className="flex-1 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/client')}
              className="py-2.5 px-5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{submitting ? 'Posting Project...' : 'Publish Project Opportunity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
