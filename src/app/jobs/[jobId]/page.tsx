'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, Company } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplicationModal } from '@/components/jobs/ApplicationModal';
import { Footer } from '@/components/footer/Footer';
import { useAuth } from '@/context/AuthContext';
import { formatSalary, formatDate, formatRelativeTime } from '@/lib/utils';
import {
  MapPin,
  Clock,
  Bookmark,
  Sparkles,
  Share2,
  ChevronLeft,
  Building2,
  ExternalLink,
  Users,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Calendar,
  Wifi,
} from 'lucide-react';

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.jobId;
  const router = useRouter();

  const { savedJobIds, toggleSaveJob } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/jobs/${jobId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setJob(data.job);
        setCompany(data.company);
        setSimilarJobs(data.similarJobs || []);
      })
      .catch(() => {
        setJob(null);
      })
      .finally(() => setIsLoading(false));
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-950">
        <div className="space-y-4 max-w-md w-full">
          <div className="h-8 bg-slate-900 rounded-lg animate-pulse" />
          <div className="h-32 bg-slate-900 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-900 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Job Not Found</h2>
        <p className="text-xs text-slate-400">The role you are looking for may have been closed or removed.</p>
        <Link href="/jobs">
          <Button variant="primary">Browse Open Jobs</Button>
        </Link>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      {/* Top Breadcrumb & Header */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to All Jobs
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-800 bg-slate-950 shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="text-xs sm:text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    {job.companyName}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Posted {formatRelativeTime(job.createdAt)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-sm font-extrabold text-slate-100 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60">
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                    <span className="text-slate-400 font-normal"> / year</span>
                  </span>
                  <Badge variant="cyan">{job.type}</Badge>
                  <Badge variant="secondary">{job.experience}</Badge>
                  {job.remote && (
                    <Badge variant="purple" className="gap-1">
                      <Wifi className="w-3 h-3" /> Remote
                    </Badge>
                  )}
                  {job.featured && (
                    <Badge variant="warning" className="gap-1">
                      <Sparkles className="w-3 h-3" /> Featured Role
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleShare}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isSaved ? 'Saved' : 'Save Job'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <Button
                variant="gradient"
                size="md"
                onClick={() => setIsApplyModalOpen(true)}
                className="px-6 font-bold"
              >
                Apply for this Role
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Right Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Description */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-white">About the Role</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-white">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-white">Qualifications & Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks & Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-white">Perks & Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200"
                    >
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Summary Card */}
            <div className="sticky top-24 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  Job Overview
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Salary Range</span>
                    <span className="font-bold text-slate-100">
                      {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Employment Type</span>
                    <span className="font-bold text-slate-100">{job.type}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Experience Level</span>
                    <span className="font-bold text-slate-100">{job.experience}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Location</span>
                    <span className="font-bold text-slate-100">{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <span className="text-slate-400">Category</span>
                    <span className="font-bold text-cyan-400">{job.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Application Deadline</span>
                    <span className="font-mono text-slate-300">{formatDate(job.deadline)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="gradient"
                  className="w-full justify-center font-bold"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => toggleSaveJob(job.id)}
                >
                  <Bookmark className={`w-4 h-4 mr-1.5 ${isSaved ? 'fill-current text-rose-400' : ''}`} />
                  {isSaved ? 'Saved to Bookmarks' : 'Save for Later'}
                </Button>
              </div>

              {/* Company Profile Widget */}
              {company && (
                <div className="pt-6 border-t border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{company.name}</h4>
                      <p className="text-xs text-slate-400">{company.industry}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {company.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {company.employeeCount}
                    </span>
                    <Link
                      href={`/companies/${company.id}`}
                      className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      View Profile
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        {similarJobs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-900 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Similar Opportunities</h3>
                <p className="text-xs text-slate-400 mt-1">Based on this role and category</p>
              </div>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="text-cyan-400 text-xs">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarJobs.map((simJob) => (
                <JobCard
                  key={simJob.id}
                  job={simJob}
                  viewMode="grid"
                  onApply={(j) => {
                    setJob(j);
                    setIsApplyModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ApplicationModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
