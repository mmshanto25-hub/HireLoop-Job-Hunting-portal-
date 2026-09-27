'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { formatSalary, formatRelativeTime } from '@/lib/utils';
import {
  MapPin,
  Clock,
  Bookmark,
  Sparkles,
  ArrowUpRight,
  Wifi,
  Briefcase,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  viewMode?: 'list' | 'grid';
  onApply?: (job: Job) => void;
}

export function JobCard({ job, viewMode = 'list', onApply }: JobCardProps) {
  const { savedJobIds, toggleSaveJob } = useAuth();
  const isSaved = savedJobIds.includes(job.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onApply) onApply(job);
  };

  if (viewMode === 'grid') {
    return (
      <div className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-950 group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-xs font-semibold text-cyan-400/90 uppercase tracking-wider block">
                  {job.companyName}
                </span>
                <Link href={`/jobs/${job.id}`}>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                </Link>
              </div>
            </div>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                  : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            <Badge variant="cyan">{job.type}</Badge>
            <Badge variant="secondary">{job.experience}</Badge>
            {job.remote && (
              <Badge variant="purple" className="gap-1">
                <Wifi className="w-3 h-3" /> Remote
              </Badge>
            )}
            {job.featured && (
              <Badge variant="warning" className="gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </Badge>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Footer info & Actions */}
        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-semibold text-slate-200">
              {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              <span className="text-slate-500 font-normal"> / yr</span>
            </span>
            <span className="text-slate-400 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3" /> {job.location}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Details
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApplyClick}
              className="flex-1 text-xs"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List view (Default)
  return (
    <div className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Logo and details */}
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={job.companyLogo}
            alt={job.companyName}
            className="w-13 h-13 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-950 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400/90 tracking-wide uppercase">
                {job.companyName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {job.location}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatRelativeTime(job.createdAt)}
              </span>
            </div>

            <Link href={`/jobs/${job.id}`}>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mt-0.5 flex items-center gap-1.5">
                {job.title}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-xs font-bold text-slate-200 bg-slate-800 px-2.5 py-0.5 rounded-md">
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                <span className="text-slate-400 font-normal"> / yr</span>
              </span>
              <Badge variant="secondary">{job.type}</Badge>
              <Badge variant="outline">{job.experience}</Badge>
              {job.remote && (
                <Badge variant="purple" className="gap-1">
                  <Wifi className="w-3 h-3" /> Remote
                </Badge>
              )}
              {job.featured && (
                <Badge variant="warning" className="gap-1">
                  <Sparkles className="w-3 h-3" /> Featured
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <button
            onClick={handleBookmark}
            className={`p-2.5 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <Link href={`/jobs/${job.id}`}>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs">
              View Role
            </Button>
          </Link>

          <Button
            variant="gradient"
            size="sm"
            onClick={handleApplyClick}
            className="text-xs px-4"
          >
            Quick Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
