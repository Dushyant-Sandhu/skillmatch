import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShaderBackground from '../components/ui/hero-shader';
import { ProjectCard } from '../components/projects/ProjectCard';
import { api } from '../services/api';
import { FreelanceProject } from '../types';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  Code2,
  Star
} from 'lucide-react';

export const Landing: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<FreelanceProject[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    api.getProjects({ status: 'posted' })
      .then((res) => setFeaturedProjects(res.projects.slice(0, 3)))
      .catch((e) => console.error(e));

    api.getStudents()
      .then((res) => setStudents(res.students.slice(0, 3)))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION WITH SHADER BACKGROUND */}
      <ShaderBackground className="relative min-h-[92vh] flex items-center justify-center pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto text-center z-10">
          {/* Eyebrow Pill with Glass Effect from the design */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6 backdrop-blur-md animate-in fade-in duration-500 shadow-lg relative"
            style={{ filter: "url(#glass-effect)" }}
          >
            <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-white text-xs font-medium relative z-10">
              Student talent deserves better opportunities
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            <span className="italic font-serif">Work.</span> Collaborate.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-200 to-fuchsia-300">
              Grow.
            </span>
          </h1>

          {/* Subtitle & Supporting text */}
          <p className="text-lg sm:text-xl text-indigo-100/90 font-medium max-w-2xl mx-auto mb-4">
            A freelance marketplace built for student talent.
          </p>
          <p className="text-sm sm:text-base text-slate-300/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Find real projects, prove your skills with evidence, build your reputation, and turn what you know into verified opportunities.
          </p>

          {/* Primary & Secondary CTAs matching the design */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/projects"
              className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm shadow-xl hover:bg-white/90 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Find Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/client/post-project"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-300" />
              <span>Hire Student Talent</span>
            </Link>
          </div>

          {/* Differentiator Highlight Strip */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Demonstrated Proof</div>
              <p className="text-[11px] text-slate-400">Not just claimed skills</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <Target className="w-5 h-5 text-indigo-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Deterministic Match</div>
              <p className="text-[11px] text-slate-400">6-factor scoring engine</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <Zap className="w-5 h-5 text-amber-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Project Workspace</div>
              <p className="text-[11px] text-slate-400">Deliverables & approval</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
              <Award className="w-5 h-5 text-fuchsia-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Verified Reputation</div>
              <p className="text-[11px] text-slate-400">Multi-dimensional reviews</p>
            </div>
          </div>
        </div>
      </ShaderBackground>

      {/* 2. HOW IT WORKS (Section 8) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            The Marketplace Loop
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            How SkillMatch Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A frictionless workflow taking students from skills to verified project deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Build Profile',
              desc: 'Add college, background, and expected rates.',
              icon: Users
            },
            {
              step: '02',
              title: 'Prove Skills',
              desc: 'Connect portfolio projects and GitHub repositories as evidence.',
              icon: ShieldCheck
            },
            {
              step: '03',
              title: 'Smart Matching',
              desc: 'Discover tailored opportunities with transparent match percentages.',
              icon: Target
            },
            {
              step: '04',
              title: 'Complete Work',
              desc: 'Collaborate in the project workspace and submit live deliverables.',
              icon: Code2
            },
            {
              step: '05',
              title: 'Build Reputation',
              desc: 'Earn 5★ multi-category client reviews that unlock better opportunities.',
              icon: Award
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/40 transition"
            >
              <div className="text-2xl font-extrabold text-slate-800 group-hover:text-indigo-900/60 transition mb-3">
                {item.step}
              </div>
              <item.icon className="w-6 h-6 text-indigo-400 mb-3" />
              <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY SKILLMATCH (Section 8) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              The Fundamental Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
              Traditional platforms list freelancers. <br />
              <span className="text-indigo-400">SkillMatch proves fit with evidence.</span>
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Traditional freelance sites are saturated with generic claims and bidding wars. SkillMatch evaluates demonstrated work: deployed projects, live codebases, and verified performance.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { title: 'Student-focused opportunities', desc: 'Projects designed for student availability (₹3k–₹25k).' },
                { title: 'Skill-based deterministic matching', desc: '45% skill compatibility, 20% experience, 15% portfolio similarity.' },
                { title: 'Portfolio-driven profiles', desc: 'Every skill is linked to living code and delivered applications.' },
                { title: 'Transparent reputation loop', desc: 'Quality, Communication, Deadline, and Professionalism ratings.' }
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{point.title}</h4>
                    <p className="text-xs text-slate-400">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Skill Proof visual card demo */}
          <div className="glass-card rounded-3xl p-6 border-indigo-500/30 relative">
            <div className="text-xs uppercase font-bold text-indigo-400 mb-3 flex items-center justify-between">
              <span>Skill Proof Demonstration</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">Live Component</span>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">React & TypeScript</h4>
                  <span className="text-xs text-slate-400">Advanced Proficiency</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-indigo-400">92%</span>
                </div>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 w-[92%]" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Portfolio Projects</span>
                  <span className="text-sm font-bold text-white">4 Verified Apps</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Delivered Freelance Jobs</span>
                  <span className="text-sm font-bold text-white">2 Completed</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center justify-between">
                <span>GitHub Repositories Connected</span>
                <span className="text-emerald-400 font-bold">✓ 34 Commits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED OPPORTUNITIES (Section 8) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              Live Projects
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Featured Opportunities
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Browse all projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* 5. STUDENT TALENT SHOWCASE (Section 8) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              Student Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Top Evidence-Backed Talent
            </h2>
          </div>
          <Link
            to="/students"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore all students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {students.map((s) => (
            <div key={s.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={s.avatar_url}
                    alt={s.full_name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base leading-snug">{s.full_name}</h4>
                    <span className="text-xs text-slate-400 block">{s.college}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-1 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{s.overall_rating} ★</span>
                      <span className="text-slate-500 font-normal">({s.completed_projects} jobs)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {s.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(s.skills || []).slice(0, 3).map((sk: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-xs bg-slate-900 text-indigo-300 border border-slate-800"
                    >
                      {sk.skill_name} ({sk.proficiency}%)
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={`/profile/${s.id}`}
                className="py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold text-center border border-slate-800 transition"
              >
                View Profile & Skill Proof
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL CTA BANNER (Section 8) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Turn your skills into opportunities.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Join SkillMatch to prove your skills with evidence, connect with real clients, and establish your reputation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/projects"
                className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
              >
                <span>Find Your Next Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
