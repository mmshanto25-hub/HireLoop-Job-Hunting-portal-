'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PaymentRecord, Job } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CreditCard, Sparkles, CheckCircle2, Download, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecruiterBillingPage() {
  const { user, refreshUser } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/payments').then((r) => r.json()),
      fetch('/api/jobs').then((r) => r.json()),
    ])
      .then(([payData, jobsData]) => {
        setPayments(payData.payments || []);
        const myActive = (jobsData.jobs || []).filter(
          (j: Job) => (j.recruiterId === user?.id || j.companyName === 'Stripe') && j.status === 'active'
        ).length;
        setActiveJobsCount(myActive);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpgrade = async (plan: 'growth' | 'enterprise') => {
    setUpgradingPlan(plan);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingInterval: 'monthly' }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Upgraded to ${plan.toUpperCase()} tier! Requisition slots expanded.`);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
        await refreshUser();
        fetchData();
      }
    } catch {
      // ignore
    } finally {
      setUpgradingPlan(null);
    }
  };

  const plan = user?.subscription?.plan || 'growth';
  const limit = user?.subscription?.activeJobsLimit || 10;
  const remaining = Math.max(0, limit - activeJobsCount);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Recruiter Billing & Job Limits
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your active job slots, manage your company subscription, and view invoicing history.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Plan stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Employer Plan</span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white capitalize">{plan} Plan</h3>
              <Badge variant="purple">Active Tier</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Valid through: {formatDate(user?.subscription?.currentPeriodEnd || new Date().toISOString())}
            </p>
          </div>

          <p className="text-xs text-slate-300">
            {plan === 'enterprise' ? 'Unlimited team seats & featured listings' : 'Standard company talent access'}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Job Postings Usage</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">
                {activeJobsCount} / {limit} Slots
              </span>
              <span className="text-xs font-semibold text-cyan-400">
                {remaining} slots available
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (activeJobsCount / limit) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Closed or archived jobs immediately free up available posting slots.
          </p>
        </div>

        <div className="bg-gradient-to-tr from-violet-950/40 via-slate-900/80 to-slate-900 border border-violet-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High-Scale Hiring
            </span>
            <h4 className="text-base font-bold text-white mt-1">Scale Requisitions</h4>
            <p className="text-xs text-slate-400 mt-1">
              Unlock 50 active job openings with Enterprise ($149/mo).
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {plan !== 'enterprise' ? (
              <Button
                variant="gradient"
                size="sm"
                className="w-full text-xs font-bold"
                isLoading={upgradingPlan === 'enterprise'}
                onClick={() => handleUpgrade('enterprise')}
              >
                Upgrade to Enterprise ($149)
              </Button>
            ) : (
              <Badge variant="cyan" className="w-full justify-center py-1.5 font-bold">
                Enterprise Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Recruiter Payments History */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Payment & Invoice History</h3>
          <span className="text-xs text-slate-400">{payments.length} invoices</span>
        </div>

        {isLoading ? (
          <div className="h-20 bg-slate-900/40 rounded-xl animate-pulse" />
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No payments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-400">{p.transactionId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{p.plan}</td>
                    <td className="py-3 px-4 text-white font-bold">{formatCurrency(p.amount, p.currency)}</td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(p.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" className="capitalize">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Receipt downloaded for ${p.transactionId}`)}
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <Download className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
