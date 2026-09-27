'use client';

import React, { useState, useEffect } from 'react';
import { PaymentRecord } from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { DollarSign, CreditCard, Users, ShieldCheck, Download } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/payments')
      .then((r) => r.json())
      .then((data) => setPayments(data.payments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const totalRev = payments.reduce((sum, p) => sum + p.amount, 0);
  const seekerRev = payments.filter((p) => p.role === 'SEEKER').reduce((sum, p) => sum + p.amount, 0);
  const recruiterRev = payments.filter((p) => p.role === 'RECRUITER').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Financial Ledger & Payments
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time transaction tracking across Stripe payment intents and recurring subscriptions.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Processed"
          value={formatCurrency(totalRev)}
          icon={DollarSign}
          iconColor="text-emerald-400"
          change="+18% vs last month"
        />
        <StatCard
          label="Monthly Run Rate"
          value={formatCurrency(totalRev * 1.25)}
          icon={CreditCard}
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Seeker Revenue"
          value={formatCurrency(seekerRev)}
          icon={Users}
          iconColor="text-blue-400"
          change="Pro & Premium"
        />
        <StatCard
          label="Employer Revenue"
          value={formatCurrency(recruiterRev)}
          icon={ShieldCheck}
          iconColor="text-violet-400"
          change="Growth & Enterprise"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-xs text-slate-400">No payment records found.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-4 px-6">User & Email</th>
                  <th className="py-4 px-4">Plan & Role</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Transaction ID</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white">{p.userName}</p>
                      <p className="text-[11px] text-slate-400">{p.userEmail}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-200">{p.plan}</p>
                      <Badge variant={p.role === 'SEEKER' ? 'cyan' : 'purple'} className="text-[9px] mt-0.5">
                        {p.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-black text-white text-sm">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="py-4 px-4 font-mono text-cyan-400 text-[11px]">
                      {p.transactionId}
                    </td>
                    <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                      <div>{formatDate(p.createdAt)}</div>
                      <span className="text-[10px] text-slate-500">{formatRelativeTime(p.createdAt)}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Badge variant="success" className="capitalize">
                        {p.status}
                      </Badge>
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
