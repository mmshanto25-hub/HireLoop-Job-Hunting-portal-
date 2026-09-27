'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Briefcase, Search, Trash2, Eye, Sparkles } from 'lucide-react';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchJobs = () => {
    setIsLoading(true);
    fetch('/api/admin/jobs')
      .then((r) => r.json())
      .then((data) => setJobs(data.jobs || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to remove this job from the platform?')) return;
    try {
      const res = await fetch(`/api/admin/jobs?jobId=${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch {
      // ignore
    }
  };

  const handleToggleFeature = async (jobId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, featured: !currentFeatured }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, featured: !currentFeatured } : j))
        );
      }
    } catch {
      // ignore
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (categoryFilter !== 'ALL' && j.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && j.status !== statusFilter) return false;
    if (
      search &&
      !j.title.toLowerCase().includes(search.toLowerCase()) &&
      !j.companyName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const categories = [
    'ALL',
    'Software Engineering',
    'AI',
    'Design',
    'Product Management',
    'DevOps & Security',
    'Data Science',
    'Marketing',
    'Sales & Solutions',
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Job Catalog Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review, feature, or delete any listing published across the HireLoop network.
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
            placeholder="Search by role title or company..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'All Categories' : c}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-4 px-6">Role & Employer</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Posted</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={j.companyLogo}
                          alt={j.companyName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{j.title}</p>
                          <p className="text-[11px] text-slate-400">{j.companyName} • {j.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{j.category}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={j.status === 'active' ? 'success' : 'secondary'}>
                          {j.status.toUpperCase()}
                        </Badge>
                        {j.featured && (
                          <Badge variant="warning" className="text-[10px]">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(j.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 text-amber-400 hover:bg-amber-500/10"
                          onClick={() => handleToggleFeature(j.id, Boolean(j.featured))}
                          title={j.featured ? 'Unfeature' : 'Feature on Homepage'}
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                        <Link href={`/jobs/${j.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white" title="View Public Page">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10"
                          onClick={() => handleDelete(j.id)}
                          title="Remove Job"
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
