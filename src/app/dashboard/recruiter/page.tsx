'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecruiterAnalyticsChart } from '@/components/charts/RecruiterAnalyticsChart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Job, Application, Company } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  Building2,
  ExternalLink,
  ChevronRight,
  Eye,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function RecruiterDashboardOverview() {
  const { user, notifications } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/jobs').then((r) => r.json()),
      fetch('/api/applications').then((r) => r.json()),
      fetch('/api/companies').then((r) => r.json()),
    ])
      .then(([jobsData, appsData, compsData]) => {
        const recruiterJobs = (jobsData.jobs || []).filter(
          (j: Job) => j.recruiterId === user?.id || j.companyName === 'Stripe'
        );
        setJobs(recruiterJobs);
        setApplications(appsData.applications || []);
        if (user?.companyId) {
          const comp = (compsData.companies || []).find((c: Company) => c.id === user.companyId);
          setCompany(comp || compsData.companies?.[0] || null);
        } else {
          setCompany(compsData.companies?.[0] || null);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  const activeJobs = jobs.filter((j) => j.status === 'active');
  const closedJobs = jobs.filter((j) => j.status === 'closed');
  const totalApplicants = applications.length;

  const chartData = [
    { week: 'Week 1', applicants: 12, views: 180 },
    { week: 'Week 2', applicants: 24, views: 320 },
    { week: 'Week 3', applicants: 38, views: 490 },
    { week: 'Week 4', applicants: 52, views: 720 },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Employer & Recruiter Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Managing requisitions for{' '}
            <strong className="text-cyan-400">{company?.name || 'Your Company'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/recruiter/company">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Building2 className="w-3.5 h-3.5" />
              Company Details
            </Button>
          </Link>
          <Link href="/dashboard/recruiter/jobs/new">
            <Button variant="gradient" size="sm" className="gap-1.5 font-bold text-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              Post New Role
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requisitions"
          value={jobs.length}
          icon={Briefcase}
          iconColor="text-cyan-400"
          change="+1 this month"
        />
        <StatCard
          label="Active Openings"
          value={activeJobs.length}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          change="Publicly visible"
        />
        <StatCard
          label="Total Applicants"
          value={totalApplicants}
          icon={Users}
          iconColor="text-violet-400"
          change="+18% vs last month"
        />
        <StatCard
          label="Filled / Closed"
          value={closedJobs.length}
          icon={TrendingUp}
          iconColor="text-amber-400"
        />
      </div>

      {/* Middle Row: Analytics Chart & Company Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Requisition Performance & Views</h3>
              <p className="text-xs text-slate-400">Impression to application conversion trends</p>
            </div>
            <Badge variant="cyan">Last 30 Days</Badge>
          </div>
          <RecruiterAnalyticsChart data={chartData} />
        </div>

        {/* Company Quick Status */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Verification</span>
              <Badge variant={company?.status === 'approved' ? 'success' : 'warning'}>
                {company?.status === 'approved' ? 'Approved' : 'Pending Review'}
              </Badge>
            </div>

            <div className="flex items-center gap-3.5 pt-2">
              <img
                src={company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop'}
                alt={company?.name || 'Company'}
                className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-800"
              />
              <div>
                <h4 className="text-base font-bold text-white">{company?.name || 'Register Company'}</h4>
                <p className="text-xs text-slate-400">{company?.industry || 'Technology'}</p>
                <p className="text-[11px] text-cyan-400 mt-0.5">{company?.location || 'Remote'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan Slot Usage:</span>
                <span className="font-bold text-slate-200">
                  {activeJobs.length} / {user?.subscription?.activeJobsLimit || 10} Active Jobs
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (activeJobs.length / (user?.subscription?.activeJobsLimit || 10)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/dashboard/recruiter/billing">
              <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                Manage Recruiter Tier
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom: Recent Applicants Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Candidate Submissions</h3>
            <p className="text-xs text-slate-400">Direct applicants across your posted roles</p>
          </div>
          <Link href="/dashboard/recruiter/jobs" className="text-xs text-cyan-400 hover:underline">
            Manage All Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No applicants received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role Applied</th>
                  <th className="py-3 px-4">Date Applied</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.seekerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'}
                          alt={app.seekerName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500"
                        />
                        <div>
                          <p className="font-bold text-white">{app.seekerName}</p>
                          <p className="text-[11px] text-slate-400">{app.seekerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{app.jobTitle}</td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{formatDate(app.appliedAt)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          app.status === 'Offered'
                            ? 'success'
                            : app.status === 'Shortlisted'
                            ? 'purple'
                            : app.status === 'Under Review'
                            ? 'warning'
                            : 'cyan'
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/dashboard/recruiter/jobs/${app.jobId}/applicants`}>
                        <Button variant="ghost" size="sm" className="text-xs text-cyan-400">
                          Review Applicant
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
    </div>
  );
}
