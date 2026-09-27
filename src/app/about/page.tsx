import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Footer } from '@/components/footer/Footer';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  Users,
  Building2,
  TrendingUp,
  Heart,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: 'Alexander Wright',
      role: 'Co-Founder & CEO',
      bio: 'Former VP of Engineering at Stripe and early distributed systems architect at Cloudflare.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    },
    {
      name: 'Elena Rostova',
      role: 'Co-Founder & Head of Product',
      bio: 'Previously Principal Product Designer at Linear and Figma, passionate about keyboard-first UX.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    },
    {
      name: 'Marcus Vance',
      role: 'VP of Talent & Ecosystem',
      bio: 'Spent 10+ years scaling executive and engineering organizations across Silicon Valley.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
    {
      name: 'Maya Patel',
      role: 'Chief AI Architect',
      bio: 'PhD in Machine Learning from Stanford; leads research into semantic matching and talent graphs.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
    },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'The Inception',
      desc: 'Founded by senior engineers frustrated with noisy recruiters, blind salary negotiations, and outdated job boards.',
    },
    {
      year: '2025',
      title: 'Rapid Scaling',
      desc: 'Reached 500+ verified tech employers, $150M+ in offered compensation, and launched real-time application pipelines.',
    },
    {
      year: '2026',
      title: 'HireLoop 2.0',
      desc: 'Launched AI semantic matchmaking, SOC-2 Type II enterprise compliance, and native global payments.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="bg-radial from-slate-900/60 via-slate-950 to-slate-950 border-b border-slate-900 py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Badge variant="cyan">Our Mission & Story</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Building the Infrastructure for <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              High-Velocity Modern Recruitment
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            HireLoop was created with a straightforward premise: career discovery should be transparent, respectful of candidate time, and fast.
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="border-b border-slate-900 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-cyan-400">14,250+</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Active Positions</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-white">1,280+</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Vetted Companies</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-cyan-400">85,000+</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Active Professionals</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-emerald-400">&lt; 48 hrs</div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400">Avg. Initial Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="cyan">Purpose Driven</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Why Traditional Job Hunting is Broken — And How We Fix It
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Legacy job platforms treat candidates like ad impressions and hiring teams like lead spammers. Applications vanish into opaque applicant tracking systems, salaries are concealed behind multiple rounds of interviews, and qualified talent is overlooked.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                HireLoop flips this model. We mandate transparent compensation ranges, enforce direct communication channels between candidates and verified hiring managers, and provide real-time status progression from application to offer.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Verified compensation on 100% of listings</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Real-time status updates at every stage</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Zero recruiter spam or ghost listings</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Our Core Values</h3>
                <p className="text-xs text-slate-400">Principles that guide our engineering and company culture.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h4 className="text-sm font-bold text-cyan-400">1. Extreme Craft & Velocity</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Software should feel instantaneous, polished, and delightful. We measure latencies in milliseconds.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h4 className="text-sm font-bold text-violet-400">2. Radically Transparent</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    No opaque compensation bands or hidden qualifications. Both candidates and companies win with honesty.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h4 className="text-sm font-bold text-emerald-400">3. High Agency Respect</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    We empower independent builders, engineers, and designers to direct their own career trajectories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="cyan">Milestones</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Our Journey So Far
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
              >
                <div className="text-2xl font-black text-cyan-400">{m.year}</div>
                <h3 className="text-base font-bold text-white">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="team" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">The Builders</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Meet the Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4 hover:border-slate-700 transition-colors"
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-cyan-500/50"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{t.name}</h4>
                  <p className="text-xs font-semibold text-cyan-400 mt-0.5">{t.role}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-900 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h2 className="text-3xl font-extrabold text-white">Join the HireLoop Movement</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Whether you are searching for your next career chapter or scaling a high-impact team, we are here to help.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/register">
              <Button variant="gradient" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="lg">
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
