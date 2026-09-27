'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Company } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  Sparkles,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function RecruiterPostJobPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [type, setType] = useState('Full-time');
  const [experience, setExperience] = useState('Senior');
  const [salaryMin, setSalaryMin] = useState('160000');
  const [salaryMax, setSalaryMax] = useState('210000');
  const [location, setLocation] = useState('San Francisco, CA / Remote');
  const [remote, setRemote] = useState(true);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((data) => {
        const myComp = (data.companies || []).find((c: Company) => c.recruiterId === user?.id || c.name === 'Stripe');
        setCompany(myComp || data.companies?.[0] || null);
      })
      .catch(() => {});
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const responsibilities = responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const requirements = requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const benefits = benefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          companyId: company?.id,
          companyName: company?.name || 'Partner Company',
          companyLogo: company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
          companyLocation: company?.location || location,
          category,
          type,
          experience,
          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),
          currency: 'USD',
          location,
          remote,
          deadline: new Date(deadline).toISOString(),
          description,
          responsibilities: responsibilities.length > 0 ? responsibilities : ['Lead engineering initiatives', 'Collaborate with cross-functional teams'],
          requirements: requirements.length > 0 ? requirements : ['5+ years relevant experience', 'Strong system design skills'],
          benefits: benefits.length > 0 ? benefits : ['Comprehensive Health & Dental', 'Competitive Equity', 'Flexible Remote Policy'],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to publish job requisition');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard/recruiter/jobs');
    } catch {
      setError('Network error occurred.');
      setIsLoading(false);
    }
  };

  const categories = [
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
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Requisitions
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Post a New Requisition
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Publish an opening directly to thousands of verified candidates across the HireLoop network.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Company attribution */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop'}
              alt={company?.name || 'Company'}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800"
            />
            <div>
              <span className="text-xs text-slate-400 block">Posting As Employer</span>
              <span className="text-sm font-bold text-white">{company?.name || 'Stripe'}</span>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
          </span>
        </div>

        {/* Basic Job Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Role Fundamentals</h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Job Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Staff Distributed Systems Engineer"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Seniority Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'].map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Minimum Annual Base ($ USD)
              </label>
              <Input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Maximum Annual Base ($ USD)
              </label>
              <Input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA or Worldwide"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Application Deadline
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={remote}
              onChange={(e) => setRemote(e.target.checked)}
              className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span>This role supports 100% remote flexibility</span>
          </label>
        </div>

        {/* Narrative & Lists */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detailed Description</h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Role Overview & Mission
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the mission, the problem space, and the impact of this hire..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows={3}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              placeholder="Architect core database synchronization pipelines&#10;Mentor senior engineers&#10;Lead incident reviews"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Qualifications & Requirements (One per line)
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="6+ years experience in distributed systems&#10;Mastery of Go or Rust&#10;Deep understanding of Raft or Paxos consensus"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Perks & Benefits (One per line)
            </label>
            <textarea
              rows={2}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              placeholder="100% Medical, Dental, Vision&#10;Equity Package with early exercise&#10;$2,000 Remote Setup Stipend"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
          <Link href="/dashboard/recruiter/jobs">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="gradient" isLoading={isLoading} className="font-bold">
            Publish Job Requisition
          </Button>
        </div>
      </form>
    </div>
  );
}
