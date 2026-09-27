'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { ApplicationAnalyticsChart } from '@/components/charts/ApplicationAnalyticsChart';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Application, Job } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Bookmark,
  FileCheck,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  Building2,
  User,
  AlertCircle,
} from 'lucide-react';

export default function SeekerDashboardOverview() {
  const { user, notifications } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .catch(() => {});

    fetch('/api/saved-jobs')
      .then((res) => res.json())
      .then((data) => setSavedJobsCount(data.savedJobs ? data.savedJobs.length : 0))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const totalApplied = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const offeredCount = applications.filter((a) => a.status === 'Offered').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const chartData = [
    { status: 'Applied', count: totalApplied, color: '#38bdf8' },
    { status: 'Under Review', count: underReviewCount, color: '#f59e0b' },
    { status: 'Shortlisted', count: shortlistedCount, color: '#a855f7' },
    { status: 'Offered', count: offeredCount, color: '#10b981' },
    { status: 'Rejected', count: rejectedCount, color: '#f43f5e' },
  ];

  // Calculate profile completion score
  const completionScore = [
    user?.name ? 20 : 0,
    user?.headline ? 20 : 0,
    user?.bio ? 20 : 0,
    user?.skills && user.skills.length > 0 ? 20 : 0,
    user?.resumeUrl ? 20 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Candidate Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-cyan-400 font-semibold">{user?.name}</span>. Here is your current application activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/seeker/jobs">
            <Button variant="gradient" size="sm" className="gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Explore Open Roles
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Saved Jobs"
          value={savedJobsCount}
          icon={Bookmark}
          iconColor="text-rose-400"
          change="+2 this week"
        />
        <StatCard
          label="Applications"
          value={totalApplied}
          icon={FileCheck}
          iconColor="text-cyan-400"
          change="3 active"
        />
        <StatCard
          label="Interviews / Shortlist"
          value={shortlistedCount}
          icon={CheckCircle2}
          iconColor="text-violet-400"
          change="Top 5%"
        />
        <StatCard
          label="Offers Extended"
          value={offeredCount}
          icon={Award}
          iconColor="text-emerald-400"
          change="Active"
        />
      </div>

      {/* Middle Row: Profile Card & Application Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Completion Card */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Status</span>
              <Badge variant="cyan">{completionScore}% Complete</Badge>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces'}
                alt={user?.name || 'User'}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/50"
              />
              <div>
                <h3 className="text-base font-bold text-white">{user?.name}</h3>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {user?.subscription?.plan.toUpperCase()} TIER
                </Badge>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {user?.headline || 'Senior Full Stack & Frontend Engineer | React, Next.js, TypeScript'}
            </p>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {completionScore === 100
                  ? 'All profile details verified. You receive maximum recruiter visibility.'
                  : 'Add your portfolio links and resume to reach 100% profile score.'}
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/dashboard/seeker/settings">
              <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                Edit Profile & Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Application Analytics Chart */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Application Pipeline Funnel</h3>
              <p className="text-xs text-slate-400">Progression across your active candidacies</p>
            </div>
            <Link href="/dashboard/seeker/applications">
              <Button variant="ghost" size="sm" className="text-cyan-400 text-xs">
                View Tracker
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <ApplicationAnalyticsChart data={chartData} />
        </div>
      </div>

      {/* Bottom Row: Recent Applications & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Applications Table */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Applications</h3>
            <Link
              href="/dashboard/seeker/applications"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              All Applications ({applications.length})
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No applications submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Role & Company</th>
                    <th className="pb-3">Applied</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.slice(0, 4).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.companyLogo}
                            alt={app.companyName}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-800 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white line-clamp-1">{app.jobTitle}</p>
                            <p className="text-[11px] text-slate-400">{app.companyName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-400 whitespace-nowrap">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            app.status === 'Offered'
                              ? 'success'
                              : app.status === 'Shortlisted'
                              ? 'purple'
                              : app.status === 'Under Review'
                              ? 'warning'
                              : app.status === 'Rejected'
                              ? 'destructive'
                              : 'cyan'
                          }
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link href="/dashboard/seeker/applications">
                          <Button variant="ghost" size="sm" className="text-xs p-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Notifications / Activity Feed */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No activity records yet.
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-200">{n.title}</p>
                    <span className="text-[10px] text-slate-500">{formatRelativeTime(n.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
