'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplicationModal } from '@/components/jobs/ApplicationModal';
import { Footer } from '@/components/footer/Footer';
import { Job, Company } from '@/types';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  Briefcase,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Award,
  Globe,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');

  useEffect(() => {
    fetch('/api/jobs?limit=8')
      .then((res) => res.json())
      .then((data) => setFeaturedJobs(data.jobs || []))
      .catch(() => {});

    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .catch(() => {});
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleOpenApply = (job: Job) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  const categories = [
    { name: 'Software Engineering', count: '1,420+ jobs', icon: Briefcase, color: 'text-cyan-400' },
    { name: 'AI', count: '890+ jobs', icon: Sparkles, color: 'text-violet-400' },
    { name: 'Design', count: '540+ jobs', icon: Star, color: 'text-pink-400' },
    { name: 'Product Management', count: '410+ jobs', icon: TrendingUp, color: 'text-amber-400' },
    { name: 'DevOps & Security', count: '380+ jobs', icon: ShieldCheck, color: 'text-emerald-400' },
    { name: 'Data Science', count: '490+ jobs', icon: Zap, color: 'text-blue-400' },
    { name: 'Marketing', count: '310+ jobs', icon: Globe, countColor: 'text-purple-400' },
    { name: 'Sales & Solutions', count: '290+ jobs', icon: Award, color: 'text-indigo-400' },
  ];

  const filteredFeatured = selectedCategoryTab === 'All'
    ? featuredJobs.slice(0, 6)
    : featuredJobs.filter((j) => j.category.toLowerCase().includes(selectedCategoryTab.toLowerCase())).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-radial from-slate-900/60 via-slate-950 to-slate-950 border-b border-slate-900">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-violet-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold text-cyan-400">HireLoop 2.0</span>
              <span className="text-slate-500">|</span>
              <span>Next-Gen Talent Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Find the Work That <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Moves You Forward.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover verified engineering, AI, and design roles at category-defining companies. Enjoy transparent salary ranges, direct recruiter access, and zero spam.
            </p>

            {/* SEARCH BOX */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl shadow-cyan-950/20 backdrop-blur-md flex flex-col md:flex-row items-center gap-2 text-left"
            >
              <div className="flex-1 w-full relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, keywords, or company (e.g. Next.js, Stripe, ML)"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="hidden md:block w-px h-8 bg-slate-800" />

              <div className="flex-1 w-full relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or 'Remote'"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="gradient" size="md" className="w-full md:w-auto px-6 font-bold gap-2">
                <Search className="w-4 h-4" />
                Search Jobs
              </Button>
            </form>

            {/* QUICK SEARCH TAGS */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
              <span className="text-slate-400">Trending searches:</span>
              {['Frontend', 'AI Engineer', 'Remote', 'Lead Designer', 'Full-time', 'Distributed Systems'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setKeyword(tag);
                    router.push(`/jobs?keyword=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATISTICS BANNER */}
      <section className="border-b border-slate-900 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">14,250+</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Active Jobs</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">1,280+</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Top Companies</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">85,000+</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Job Seekers</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">18,400+</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Placements</div>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">98.4%</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="py-16 md:py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> Hand-picked Roles
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Career Opportunities
              </h2>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Engineering', 'AI', 'Design'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategoryTab === tab
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Job listings */}
          <div className="space-y-4">
            {filteredFeatured.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                viewMode="list"
                onApply={handleOpenApply}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/jobs">
              <Button variant="outline" size="lg" className="gap-2 border-slate-800 hover:border-cyan-500/50">
                Explore All 32+ Open Roles
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-16 md:py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="cyan" className="mb-2">Explore By Domain</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Popular Career Categories
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Browse thousands of opportunities specialized across modern tech stacks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-slate-800/80 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW HIRELOOP WORKS */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Streamlined Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              How HireLoop Works
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From discovering high-impact roles to signing verified offers, every step is built for speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Create Your Profile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your resume once, configure salary expectations, and showcase your core skills and portfolio links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Discover & Apply in Seconds</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by verified compensation, remote flexibility, and category. Submit applications with one click without repeating forms.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Track & Get Hired</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive real-time notifications as recruiters review your profile, advance you to interviews, and extend offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="cyan" className="mb-2">Platform Capabilities</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Serious Careers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Job Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by exact tech keywords, remote/on-site requirements, salary floor, and seniority levels in real-time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Salary Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every listing displays transparent salary ranges so you never waste time interviewing below market expectations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Top Companies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover comprehensive company profiles, engineering culture statements, benefits, and open requisitions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Saved Jobs Bookmark</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save interesting positions with a single click and organize your application strategy in your private workspace.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Application Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track statuses from Applied, Under Review, Shortlisted, to Offered with interactive analytics and history logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Recruiter Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For employers: track applicant pipelines, monitor view conversion, and manage candidates in a Kanban-style workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP COMPANIES SPOTLIGHT */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Employer Network</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Top Companies Hiring on HireLoop
              </h2>
            </div>
            <Link href="/companies">
              <Button variant="ghost" size="sm" className="gap-1 text-cyan-400">
                Explore All Companies
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companies.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/companies/${c.id}`}
                className="group p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 text-center transition-all hover:shadow-lg flex flex-col items-center justify-between"
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800 group-hover:scale-105 transition-transform"
                />
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {c.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.openJobsCount || 0} Open Roles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Success Stories</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Loved by Engineers & Hiring Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &quot;Within two weeks of setting up my HireLoop profile, I received interviews from Linear and Stripe. The transparent salary bands saved me weeks of awkward negotiation.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                  alt="Sarah Lin"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500"
                />
                <div>
                  <p className="text-xs font-bold text-white">Sarah Lin</p>
                  <p className="text-[10px] text-slate-400">Staff Frontend Engineer</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &quot;The candidate quality on HireLoop is unmatched. We filled two principal distributed systems roles in 18 days without running noisy outbound LinkedIn sequences.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                  alt="Marcus Vance"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-violet-500"
                />
                <div>
                  <p className="text-xs font-bold text-white">Marcus Vance</p>
                  <p className="text-[10px] text-slate-400">Head of Talent @ Stripe</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &quot;The real-time status tracker was a game-changer. I always knew whether my resume was reviewed, shortlisted, or scheduled for a technical presentation.&quot;
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                  alt="David Chen"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500"
                />
                <div>
                  <p className="text-xs font-bold text-white">David Chen</p>
                  <p className="text-[10px] text-slate-400">Staff Backend Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-blue-950/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <Badge variant="cyan">Your Next Big Step</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to make your next career move?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join thousands of world-class engineers, designers, and hiring managers finding their match on HireLoop today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/jobs">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto font-bold px-8">
                Find a Job
              </Button>
            </Link>
            <Link href="/dashboard/recruiter/jobs/new">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 border-slate-700 hover:border-cyan-500/50">
                Start Hiring Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      <ApplicationModal
        job={selectedJobForApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
