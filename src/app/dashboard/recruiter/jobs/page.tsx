'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  Briefcase,
  Users,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function RecruiterManageJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = () => {
    setIsLoading(true);
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        const myJobs = (data.jobs || []).filter(
          (j: Job) => j.recruiterId === user?.id || j.companyName === 'Stripe'
        );
        setJobs(myJobs);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: newStatus as any } : j))
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch {
      // ignore
    }
  };

  const activeCount = jobs.filter((j) => j.status === 'active').length;
  const limit = user?.subscription?.activeJobsLimit || 10;
  const isLimitReached = activeCount >= limit;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manage Job Requisitions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish openings, review applicant pools, and manage role lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isLimitReached ? (
            <Link href="/dashboard/recruiter/billing">
              <Button variant="outline" size="sm" className="text-xs border-amber-500/40 text-amber-400">
                Upgrade to Post More ({activeCount}/{limit})
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/recruiter/jobs/new">
              <Button variant="gradient" size="sm" className="gap-1.5 font-bold text-xs">
                <PlusCircle className="w-3.5 h-3.5" />
                Post New Job
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Plan quota banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Active Plan Allocation</span>
            <span className="text-xs text-slate-400">
              {activeCount} of {limit} active job slots currently in use
            </span>
          </div>
        </div>

        <div className="w-48 hidden sm:block">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isLimitReached ? 'bg-amber-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (activeCount / limit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No active job listings</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first requisition to start receiving vetted candidate applications.
          </p>
          <Link href="/dashboard/recruiter/jobs/new">
            <Button variant="primary" size="sm">
              Post a Role Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Applicants</th>
                  <th className="py-4 px-4">Date Posted</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{job.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {job.category} • {job.location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                        {job.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/dashboard/recruiter/jobs/${job.id}/applicants`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/10 text-cyan-400 font-bold transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {job.applicationsCount || 0} Candidates
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/jobs/${job.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white" title="View Public Listing">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link href={`/dashboard/recruiter/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-cyan-400" title="Edit Requisition">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className={`p-1.5 ${
                            job.status === 'active' ? 'text-amber-400 hover:bg-amber-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                          title={job.status === 'active' ? 'Close Opening' : 'Reopen Opening'}
                        >
                          {job.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
