'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ApplicationModal } from '@/components/jobs/ApplicationModal';
import { formatSalary } from '@/lib/utils';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  MapPin,
  Sparkles,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

export default function SeekerSavedJobsPage() {
  const { toggleSaveJob } = useAuth();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const fetchSaved = () => {
    setIsLoading(true);
    fetch('/api/saved-jobs')
      .then((res) => res.json())
      .then((data) => setSavedJobs(data.savedJobs || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (jobId: string) => {
    await toggleSaveJob(jobId);
    setSavedJobs((prev) => prev.filter((s) => s.jobId !== jobId));
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Saved Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review bookmarked positions, compare compensation packages, and submit applications.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No saved jobs yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the bookmark icon on any job card while browsing to save roles you want to consider later.
            </p>
          </div>
          <Link href="/dashboard/seeker/jobs">
            <Button variant="primary" size="sm">
              Discover Open Roles
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map(({ job }) => {
            if (!job) return null;
            return (
              <div
                key={job.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-950 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        {job.companyName}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    </div>

                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                        {job.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs font-bold text-slate-200">
                        {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                      <Badge variant="cyan">{job.type}</Badge>
                      <Badge variant="secondary">{job.experience}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    onClick={() => handleRemove(job.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-slate-800"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </Link>

                  <Button
                    variant="gradient"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedJobForApply(job);
                      setIsApplyModalOpen(true);
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ApplicationModal
        job={selectedJobForApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
