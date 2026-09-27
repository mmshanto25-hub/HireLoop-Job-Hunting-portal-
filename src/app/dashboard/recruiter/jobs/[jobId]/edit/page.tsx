'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RecruiterEditJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.jobId;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [experience, setExperience] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState(false);
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.job) {
          const j = data.job;
          setTitle(j.title);
          setCategory(j.category);
          setType(j.type);
          setExperience(j.experience);
          setSalaryMin(j.salaryMin?.toString() || '');
          setSalaryMax(j.salaryMax?.toString() || '');
          setLocation(j.location);
          setRemote(Boolean(j.remote));
          setStatus(j.status);
          setDescription(j.description);
          setResponsibilitiesText((j.responsibilities || []).join('\n'));
          setRequirementsText((j.requirements || []).join('\n'));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const responsibilities = responsibilitiesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const requirements = requirementsText.split('\n').map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          type,
          experience,
          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),
          location,
          remote,
          status,
          description,
          responsibilities,
          requirements,
        }),
      });

      if (res.ok) {
        router.push('/dashboard/recruiter/jobs');
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to update job');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading requisition...</div>;
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Edit Requisition
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Modify compensation, requirement criteria, or active status.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Role Title
          </label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="active">Active (Open)</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Min Salary ($)
            </label>
            <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Max Salary ($)
            </label>
            <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Location
          </label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Responsibilities (One per line)
          </label>
          <textarea
            rows={3}
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
          <Link href="/dashboard/recruiter/jobs">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="gradient" isLoading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
