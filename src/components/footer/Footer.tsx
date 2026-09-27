import React from 'react';
import Link from 'next/link';
import { Briefcase, Heart, ShieldCheck, Zap, Globe, Share2, MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
                <Briefcase className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Hire<span className="text-cyan-400">Loop</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The high-performance job marketplace and talent intelligence platform. Connecting world-class engineers, designers, and leaders with category-defining companies.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> SOC-2 Type II Certified
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-4 h-4" /> 99.99% Uptime SLA
              </span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="GitHub"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="Twitter"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="LinkedIn"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Job Seekers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-cyan-400 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-cyan-400 transition-colors">
                  Explore Companies
                </Link>
              </li>
              <li>
                <Link href="/dashboard/seeker/saved" className="hover:text-cyan-400 transition-colors">
                  Saved Jobs
                </Link>
              </li>
              <li>
                <Link href="/dashboard/seeker/applications" className="hover:text-cyan-400 transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
                  Seeker Pro Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Employers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard/recruiter/jobs/new" className="hover:text-cyan-400 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/dashboard/recruiter" className="hover:text-cyan-400 transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/recruiter/company" className="hover:text-cyan-400 transition-colors">
                  Register Company
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
                  Recruiter Pricing
                </Link>
              </li>
              <li>
                <Link href="/resources/recruiter-playbook-sourcing-top-tier-talent" className="hover:text-cyan-400 transition-colors">
                  Hiring Playbook
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About HireLoop
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-cyan-400 transition-colors">
                  Career Guides & Resources
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="hover:text-cyan-400 transition-colors">
                  Executive Team
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HireLoop Inc. Built for modern high-velocity recruitment.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using Next.js 16, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
