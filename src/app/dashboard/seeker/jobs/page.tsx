'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplicationModal } from '@/components/jobs/ApplicationModal';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Sparkles, Filter } from 'lucide-react';

export default function SeekerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('keyword', search);
    if (category !== 'All') params.set('category', category);

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [search, category]);

  const categories = [
    'All',
    'Software Engineering',
    'AI',
    'Design',
    'Product Management',
    'DevOps & Security',
    'Data Science',
    'Marketing',
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Browse Open Positions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search opportunities across verified tech employers and submit direct applications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, technology (e.g. Next.js, Rust)..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Job list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-xs text-slate-400">No jobs match your query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              viewMode="list"
              onApply={(j) => {
                setSelectedJob(j);
                setIsApplyOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ApplicationModal
        job={selectedJob}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />
    </div>
  );
}
