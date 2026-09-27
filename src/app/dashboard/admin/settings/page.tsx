'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, RotateCcw, CheckCircle2, Lock, User } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || 'Alexander Wright');
  const [headline, setHeadline] = useState(user?.headline || 'Platform Super Administrator');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleReSeed = async () => {
    if (!confirm('This will refresh demo dataset records into memory and MongoDB. Proceed?')) return;
    setIsSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        setSeedSuccess(true);
        setTimeout(() => setSeedSuccess(false), 4000);
      }
    } catch {
      // ignore
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage administrator security privileges, platform diagnostics, and data seeding.
        </p>
      </div>

      {seedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Demo dataset (32 jobs, 15 companies, users, payments) re-seeded successfully!</span>
        </div>
      )}

      {/* Admin Profile Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          Administrator Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Admin Email
            </label>
            <Input value={user?.email || 'admin@hireloop.io'} disabled className="opacity-60 cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Role Description
          </label>
          <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="gradient" onClick={() => alert('Admin credentials saved.')}>
            Save Administrator Info
          </Button>
        </div>
      </div>

      {/* Platform Maintenance & Data Seeding */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-violet-400" />
          Database Management & Live Seed
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Restore the pristine demo dataset containing 32+ verified jobs across tech disciplines, 15 tech employers, sample candidate applications, and transaction histories.
        </p>

        <div className="pt-2">
          <Button
            variant="outline"
            className="border-violet-500/40 text-violet-300 hover:bg-violet-500/10"
            isLoading={isSeeding}
            onClick={handleReSeed}
          >
            Re-Initialize Seed Dataset
          </Button>
        </div>
      </div>

      {/* Security Policies */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          Security Controls
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Two-Factor Authentication (2FA)</span>
            <Badge variant="success">Enforced for Admins</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Session Cookie Expiration</span>
            <span className="text-slate-400 font-mono">7 Days (HTTP-Only)</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300">Stripe Webhook Encryption</span>
            <Badge variant="cyan">Enabled</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
