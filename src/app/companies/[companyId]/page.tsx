'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Company, Job } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JobCard } from '@/components/jobs/JobCard';
import { ApplicationModal } from '@/components/jobs/ApplicationModal';
import { Footer } from '@/components/footer/Footer';
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Briefcase,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Zap,
} from 'lucide-react';

export default function CompanyProfilePage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.companyId;

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'about' | 'benefits'>('overview');

  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/companies/${companyId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setCompany(data.company);
        setJobs(data.jobs || []);
      })
      .catch(() => {
        setCompany(null);
      })
      .finally(() => setIsLoading(false));
  }, [companyId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-950">
        <div className="space-y-4 max-w-md w-full">
          <div className="h-20 bg-slate-900 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-900 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Company Not Found</h2>
        <p className="text-xs text-slate-400">The requested company profile is not available.</p>
        <Link href="/companies">
          <Button variant="primary">Browse Companies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border-b border-slate-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Companies
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-slate-800 bg-slate-950 shadow-xl"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {company.name}
                  </h1>
                  {company.featured && (
                    <Badge variant="warning" className="text-xs">
                      Verified Leader
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <Badge variant="cyan">{company.industry}</Badge>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {company.employeeCount} team members
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Visit Website
              </a>
              <Button
                variant="gradient"
                size="md"
                onClick={() => setActiveTab('jobs')}
                className="font-bold text-xs"
              >
                View {jobs.length} Open Roles
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mt-8 border-b border-slate-800 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'jobs', label: `Jobs (${jobs.length})` },
              { id: 'about', label: 'About & Culture' },
              { id: 'benefits', label: 'Perks & Benefits' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-2 transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Company Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {company.description}
                </p>
              </div>

              {company.mission && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-3">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Mission & Vision
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    &quot;{company.mission}&quot;
                  </p>
                </div>
              )}

              {/* Open jobs teaser */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Active Positions at {company.name}</h3>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    See all ({jobs.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      viewMode="list"
                      onApply={(j) => {
                        setSelectedJobForApply(j);
                        setIsApplyModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Fast Facts
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Industry</span>
                    <span className="text-slate-200 font-semibold">{company.industry}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Headquarters</span>
                    <span className="text-slate-200 font-semibold">{company.location}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Company Size</span>
                    <span className="text-slate-200 font-semibold">{company.employeeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Open Requisitions</span>
                    <span className="text-cyan-400 font-bold">{jobs.length} jobs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                All Open Roles at {company.name} ({jobs.length})
              </h3>
            </div>

            {jobs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <p className="text-xs text-slate-400">No active job listings right now for this company.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    viewMode="list"
                    onApply={(j) => {
                      setSelectedJobForApply(j);
                      setIsApplyModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-white">Our Engineering & Team Culture</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {company.culture ||
                  `${company.name} values transparency, intellectual rigor, and high agency. We hire exceptional builders and give them full autonomy to solve meaningful problems for customers.`}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="max-w-4xl space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Benefits & Compensation Philosophy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {company.benefits && company.benefits.length > 0 ? (
                company.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3.5"
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{b}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Comprehensive coverage for all full-time employees.</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Standard tech benefits offered.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <ApplicationModal
        job={selectedJobForApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
