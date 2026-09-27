'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Lock, Building2, CheckCircle2 } from 'lucide-react';

export default function RecruiterSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'company'>('profile');

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, headline, bio, avatar }),
      });
      if (res.ok) {
        setSaved(true);
        await refreshUser();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Recruiter Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your recruiter credentials, company association, and security settings.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes saved.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'profile', label: 'Personal Profile', icon: User },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'company', label: 'Company Profile', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email
              </label>
              <Input value={user?.email || ''} disabled className="opacity-60 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Title / Headline
            </label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Head of Talent & Technical Recruiting"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Bio / Recruiting Philosophy
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short bio explaining what your team builds..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="gradient" isLoading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 max-w-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Update Password</h3>
          <Input type="password" placeholder="Current Password" />
          <Input type="password" placeholder="New Password" />
          <Button variant="gradient" onClick={() => alert('Password updated.')}>
            Save Password
          </Button>
        </div>
      )}

      {activeTab === 'company' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Company Management</h3>
          <p className="text-xs text-slate-400">
            Edit your organization&apos;s brand, mission, perks, and public visibility.
          </p>
          <Link href="/dashboard/recruiter/company">
            <Button variant="primary">Go to Company Profile Page</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
