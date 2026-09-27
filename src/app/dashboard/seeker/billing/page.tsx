'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PaymentRecord } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SeekerBillingPage() {
  const { user, refreshUser } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchPayments = () => {
    setIsLoading(true);
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => setPayments(data.payments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpgrade = async (plan: 'pro' | 'premium') => {
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
        setSuccessMsg(`Upgraded to ${plan.toUpperCase()} tier successfully! Application quota increased.`);
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
        fetchPayments();
      }
    } catch {
      // ignore
    } finally {
      setUpgradingPlan(null);
    }
  };

  const plan = user?.subscription?.plan || 'free';
  const used = user?.subscription?.applicationsUsed || 0;
  const limit = user?.subscription?.applicationsLimit || 3;
  const remaining = Math.max(0, limit - used);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Billing & Quotas
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your subscription tier, track monthly application quotas, and view invoices.
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

      {/* Plan & Usage Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Active Tier
            </span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white capitalize">{plan} Plan</h3>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Renewal date: {formatDate(user?.subscription?.currentPeriodEnd || new Date().toISOString())}
            </p>
          </div>

          <div className="pt-2">
            <span className="text-xs text-slate-300">
              {plan === 'free' ? 'Standard candidate visibility' : 'Priority recruiter visibility enabled'}
            </span>
          </div>
        </div>

        {/* Quota Usage */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Monthly Applications
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">
                {used} / {limit === 9999 ? '∞' : limit}
              </span>
              <span className="text-xs font-semibold text-cyan-400">
                {limit === 9999 ? 'Unlimited' : `${remaining} remaining`}
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all"
                style={{ width: `${limit === 9999 ? 20 : Math.min(100, (used / limit) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Quotas reset on the 1st of every calendar billing month.
          </p>
        </div>

        {/* Upgrade Recommendation */}
        <div className="bg-gradient-to-tr from-cyan-950/40 via-slate-900/80 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Tier Upgrade
            </span>
            <h4 className="text-base font-bold text-white mt-1">Need More Applications?</h4>
            <p className="text-xs text-slate-400 mt-1">
              Upgrade to Pro ($19/mo) or Premium ($39/mo) for instant unlocks.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {plan !== 'pro' && (
              <Button
                variant="gradient"
                size="sm"
                className="flex-1 text-xs"
                isLoading={upgradingPlan === 'pro'}
                onClick={() => handleUpgrade('pro')}
              >
                Pro ($19)
              </Button>
            )}
            {plan !== 'premium' && (
              <Button
                variant={plan === 'pro' ? 'gradient' : 'outline'}
                size="sm"
                className="flex-1 text-xs"
                isLoading={upgradingPlan === 'premium'}
                onClick={() => handleUpgrade('premium')}
              >
                Premium ($39)
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Payment & Billing History</h3>
          <span className="text-xs text-slate-400">{payments.length} transactions</span>
        </div>

        {isLoading ? (
          <div className="h-20 bg-slate-900/40 rounded-xl animate-pulse" />
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No payment transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Plan</th>
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
                        title="Download Invoice PDF"
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
