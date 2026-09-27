'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Job } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { FilterSidebar, FilterState } from '@/components/jobs/FilterSidebar';
import { ApplicationModal } from '@/components/jobs/ApplicationModal';
import { Footer } from '@/components/footer/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  MapPin,
  LayoutList,
  LayoutGrid,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  X,
} from 'lucide-react';

function JobsContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || 'All Categories',
    type: 'All Types',
    experience: 'All Levels',
    remoteOnly: false,
    salaryMin: 0,
  });

  const [sort, setSort] = useState('recent');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filters.keyword) params.set('keyword', filters.keyword);
    if (filters.location) params.set('location', filters.location);
    if (filters.category && filters.category !== 'All Categories') params.set('category', filters.category);
    if (filters.type && filters.type !== 'All Types') params.set('type', filters.type);
    if (filters.experience && filters.experience !== 'All Levels') params.set('experience', filters.experience);
    if (filters.remoteOnly) params.set('remote', 'true');
    if (filters.salaryMin > 0) params.set('salaryMin', filters.salaryMin.toString());
    params.set('sort', sort);

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs || []);
        setCurrentPage(1);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [filters, sort]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      category: 'All Categories',
      type: 'All Types',
      experience: 'All Levels',
      remoteOnly: false,
      salaryMin: 0,
    });
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(jobs.length / itemsPerPage) || 1;
  const paginatedJobs = jobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFiltersCount = [
    filters.keyword ? 1 : 0,
    filters.location ? 1 : 0,
    filters.category !== 'All Categories' ? 1 : 0,
    filters.type !== 'All Types' ? 1 : 0,
    filters.experience !== 'All Levels' ? 1 : 0,
    filters.remoteOnly ? 1 : 0,
    filters.salaryMin > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      {/* Top Search Bar */}
      <section className="bg-slate-900/80 border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explore Verified Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Filter through verified positions across leading technology, design, and AI organizations.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-2 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div className="md:col-span-6 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange({ keyword: e.target.value })}
                placeholder="Search job title, skills, or company..."
                className="w-full bg-transparent pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              {filters.keyword && (
                <button
                  onClick={() => handleFilterChange({ keyword: '' })}
                  className="p-1 mr-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="md:col-span-4 relative flex items-center border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange({ location: e.target.value })}
                placeholder="Location (e.g. San Francisco, Remote)"
                className="w-full bg-transparent pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              {filters.location && (
                <button
                  onClick={() => handleFilterChange({ location: '' })}
                  className="p-1 mr-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="md:col-span-2 flex items-center justify-end">
              <Button
                variant="gradient"
                size="sm"
                className="w-full h-full py-2.5 font-bold text-xs"
                onClick={() => {}}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Job Results Area */}
          <div className="flex-1 w-full space-y-5">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
                </span>

                {activeFiltersCount > 0 && (
                  <Badge variant="cyan" className="cursor-pointer" onClick={handleResetFilters}>
                    {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''} • Clear
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  Filters ({activeFiltersCount})
                </button>

                {/* Sort */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="salary_high">Highest Salary</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title="List View"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"
                  />
                ))}
              </div>
            ) : paginatedJobs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No jobs matched your criteria</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search terms, removing filters, or resetting your salary constraints.
                </p>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    viewMode="grid"
                    onApply={handleApplyClick}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    viewMode="list"
                    onApply={handleApplyClick}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-xs text-slate-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, jobs.length)} of {jobs.length} jobs
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        currentPage === i + 1
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-slate-950 border-l border-slate-800 p-6 z-50 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
            <Button
              variant="gradient"
              className="w-full mt-4"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters ({jobs.length} Results)
            </Button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      <ApplicationModal
        job={selectedJobForApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading jobs catalog...</div>}>
      <JobsContent />
    </Suspense>
  );
}
