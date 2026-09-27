'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Company } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function RecruiterCompanyPage() {
  const { user, refreshUser } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Fintech');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [employeeCount, setEmployeeCount] = useState('50-200');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => {
        const myComp = (data.companies || []).find((c: Company) => c.recruiterId === user?.id || c.name === 'Stripe');
        if (myComp) {
          setCompany(myComp);
          setName(myComp.name);
          setIndustry(myComp.industry);
          setWebsite(myComp.website);
          setLocation(myComp.location);
          setEmployeeCount(myComp.employeeCount);
          setLogo(myComp.logo);
          setDescription(myComp.description);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const url = company ? `/api/companies/${company.id}` : '/api/companies';
      const method = company ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          industry,
          website,
          location,
          employeeCount,
          logo: logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
          description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCompany(data.company);
        setMessage({
          type: 'success',
          text: company
            ? 'Company details updated successfully!'
            : 'Company profile created! Submitted to administrator moderation queue.',
        });
        await refreshUser();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save company.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error saving company.' });
    } finally {
      setSaving(false);
    }
  };

  const industries = ['Fintech', 'AI', 'Developer Tools', 'SaaS', 'Design', 'E-Commerce', 'Healthcare', 'Education'];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Employer Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your verified company presence, logo, benefits, and platform moderation status.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Moderation Status Banner */}
      {company && (
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={company.logo}
              alt={company.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{company.name}</h3>
                <Badge
                  variant={
                    company.status === 'approved'
                      ? 'success'
                      : company.status === 'pending'
                      ? 'warning'
                      : 'destructive'
                  }
                >
                  {company.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {company.status === 'approved'
                  ? 'Your company is verified and visible on the public HireLoop platform.'
                  : 'Your company profile is under review by HireLoop administrators.'}
              </p>
            </div>
          </div>

          {company.status === 'approved' && (
            <a
              href={`/companies/${company.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors shrink-0"
            >
              Public Profile
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          )}
        </div>
      )}

      {/* Registration / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold text-white">
          {company ? 'Edit Company Information' : 'Register New Company'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Company Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stripe, Linear"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Industry Domain
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Website URL
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.com"
              icon={<Globe className="w-4 h-4" />}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Headquarters Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA or Remote"
              icon={<MapPin className="w-4 h-4" />}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Employee Count
            </label>
            <Input
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              placeholder="e.g. 50-200"
              icon={<Users className="w-4 h-4" />}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Logo Image URL
            </label>
            <Input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            About Company & Culture
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what your company builds, engineering mission, and what makes your team exceptional..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="gradient" isLoading={saving}>
            {company ? 'Save Company Changes' : 'Submit for Moderation'}
          </Button>
        </div>
      </form>
    </div>
  );
}
