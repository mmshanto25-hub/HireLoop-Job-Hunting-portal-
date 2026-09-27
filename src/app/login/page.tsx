'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAs } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard/seeker');
    } else {
      setError(result.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Briefcase className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Hire<span className="text-cyan-400">Loop</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome back to HireLoop
        </h2>
        <p className="text-xs text-slate-400">
          Enter your credentials or use a 1-click test profile below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full justify-center font-bold text-sm py-2.5 mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                1-Click Instant Demo Login:
              </span>
              <Badge variant="cyan" className="text-[10px]">Instant Access</Badge>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => loginAs('SEEKER')}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                      Sarah Lin
                    </span>
                    <Badge variant="cyan" className="text-[9px] px-1.5 py-0">Seeker</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Staff Frontend Engineer (Pro Plan)
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => loginAs('RECRUITER')}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-violet-300">
                      Marcus Vance
                    </span>
                    <Badge variant="purple" className="text-[9px] px-1.5 py-0">Recruiter</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Head of Talent @ Stripe (Growth Plan)
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => loginAs('ADMIN')}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-rose-300">
                      Alexander Wright
                    </span>
                    <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Admin</Badge>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Platform Administrator (Super Admin)
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
