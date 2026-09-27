'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Role } from '@/types';
import {
  Briefcase,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<Role>('SEEKER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, role, password);
    setIsLoading(false);

    if (result.success) {
      if (role === 'RECRUITER') {
        router.push('/dashboard/recruiter');
      } else {
        router.push('/dashboard/seeker');
      }
    } else {
      setError(result.error || 'Registration failed');
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
          Create your account
        </h2>
        <p className="text-xs text-slate-400">
          Join thousands of professionals and high-growth employers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('SEEKER')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'SEEKER'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('RECRUITER')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                role === 'RECRUITER'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Recruiter / Company
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'SEEKER' ? 'Sarah Lin' : 'Marcus Vance'}
                icon={<UserIcon className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Work Email
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Confirm Password
              </label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full justify-center font-bold text-sm py-2.5 mt-2"
              isLoading={isLoading}
            >
              Create {role === 'RECRUITER' ? 'Recruiter' : 'Seeker'} Account
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
              Log in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
