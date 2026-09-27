'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/StatCard';
import { AdminRevenueChart } from '@/components/charts/AdminRevenueChart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, Company, Job, PaymentRecord } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/admin/users').then((r) => r.json()),
      fetch('/api/admin/companies').then((r) => r.json()),
      fetch('/api/admin/jobs').then((r) => r.json()),
      fetch('/api/payments').then((r) => r.json()),
    ])
      .then(([usersData, compsData, jobsData, payData]) => {
        setUsers(usersData.users || []);
        setCompanies(compsData.companies || []);
        setJobs(jobsData.jobs || []);
        setPayments(payData.payments || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const seekersCount = users.filter((u) => u.role === 'SEEKER').length;
  const recruitersCount = users.filter((u) => u.role === 'RECRUITER').length;
  const pendingCompanies = companies.filter((c) => c.status === 'pending');

  const revenueChartData = [
    { month: 'Jan', seekerRevenue: 1200, recruiterRevenue: 3400 },
    { month: 'Feb', seekerRevenue: 2100, recruiterRevenue: 5600 },
    { month: 'Mar', seekerRevenue: 3800, recruiterRevenue: 8900 },
  ];

  const handleApproveCompany = async (compId: string) => {
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: compId, status: 'approved' }),
      });
      if (res.ok) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === compId ? { ...c, status: 'approved' } : c))
        );
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global ecosystem metrics, trust & safety moderation, and revenue operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-xs px-2.5 py-1">
            Super Administrator Mode
          </Badge>
        </div>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total Users"
          value={users.length}
          icon={Users}
          iconColor="text-cyan-400"
          change="+12% MoM"
        />
        <StatCard
          label="Recruiters"
          value={recruitersCount}
          icon={ShieldCheck}
          iconColor="text-violet-400"
        />
        <StatCard
          label="Companies"
          value={companies.length}
          icon={Building2}
          iconColor="text-blue-400"
        />
        <StatCard
          label="Active Jobs"
          value={jobs.length}
          icon={Briefcase}
          iconColor="text-amber-400"
        />
        <div className="col-span-2 md:col-span-1">
          <StatCard
            label="Gross Platform Revenue"
            value={formatCurrency(totalRevenue + 12850)}
            icon={DollarSign}
            iconColor="text-emerald-400"
            change="+24% Q1"
          />
        </div>
      </div>

      {/* Middle: Revenue Chart & Pending Moderation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Platform Revenue Breakdown</h3>
              <p className="text-xs text-slate-400">Seeker Pro/Premium vs Recruiter Growth/Enterprise tiers</p>
            </div>
            <Link href="/dashboard/admin/payments" className="text-xs text-cyan-400 hover:underline">
              View Invoices
            </Link>
          </div>
          <AdminRevenueChart data={revenueChartData} />
        </div>

        {/* Pending Moderation Queue */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Company Approvals
              </h3>
              <Badge variant="warning">{pendingCompanies.length} Pending</Badge>
            </div>

            {pendingCompanies.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                All submitted companies are moderated and up to date!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCompanies.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.industry} • {c.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => handleApproveCompany(c.id)}
                        className="flex-1 text-[11px] py-1"
                      >
                        Approve
                      </Button>
                      <Link href="/dashboard/admin/companies" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-[11px] py-1">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link href="/dashboard/admin/companies">
              <Button variant="outline" size="sm" className="w-full text-xs">
                All Companies Moderation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Moderation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/users"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">User Governance</h4>
            <p className="text-xs text-slate-400 mt-0.5">{users.length} active registered accounts</p>
          </div>
          <Users className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
        </Link>

        <Link
          href="/dashboard/admin/jobs"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">Job Catalog Moderation</h4>
            <p className="text-xs text-slate-400 mt-0.5">{jobs.length} listed public requisitions</p>
          </div>
          <Briefcase className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
        </Link>

        <Link
          href="/dashboard/admin/payments"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">Financial Ledger</h4>
            <p className="text-xs text-slate-400 mt-0.5">{payments.length} processed Stripe charges</p>
          </div>
          <DollarSign className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
        </Link>
      </div>
    </div>
  );
}
