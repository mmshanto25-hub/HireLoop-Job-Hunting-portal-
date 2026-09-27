'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  FileText,
  Lock,
  Bell,
  CheckCircle2,
  Trash2,
  Upload,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

export default function SeekerSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'skills' | 'security' | 'notifications'>('profile');

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Skills state
  const [skills, setSkills] = useState<string[]>(user?.skills || ['React', 'Next.js', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  // Resume state
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || 'Candidate_Resume.pdf');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '/sample-resumes/sarah-lin-resume.pdf');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          headline,
          bio,
          avatar,
          skills,
          resumeFileName,
          resumeUrl,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        await refreshUser();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSimulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      setResumeUrl('/sample-resumes/sarah-lin-resume.pdf');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Candidate Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal profile, credentials, uploaded resume, and job alerts.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile preferences saved successfully.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile Information', icon: User },
          { id: 'resume', label: 'Resume / CV', icon: FileText },
          { id: 'skills', label: 'Skills & Tech Stack', icon: Sparkles },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces'}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500"
            />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Profile Photo</h4>
              <p className="text-xs text-slate-400">Paste an image URL or use your existing avatar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <Input value={user?.email || ''} disabled className="opacity-60 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Headline
            </label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer | React, Next.js, TypeScript"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Bio & Summary
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your professional background and accomplishments..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="gradient" isLoading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* Resume Tab */}
      {activeTab === 'resume' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div>
            <h3 className="text-base font-bold text-white">Resume Management</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Your default resume is automatically attached during 1-click job applications.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-800 text-cyan-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{resumeFileName}</p>
                <p className="text-xs text-slate-400">PDF Document • Ready for applications</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:bg-slate-800"
              >
                View
              </a>
              <button
                onClick={() => {
                  setResumeFileName('No resume uploaded');
                  setResumeUrl('');
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400"
                title="Delete resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Upload new */}
          <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 text-center space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Click to upload or drag and drop</p>
              <p className="text-[11px] text-slate-500">PDF files up to 10MB supported</p>
            </div>
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleSimulateResumeUpload}
              />
              <Button variant="outline" size="sm" type="button" className="pointer-events-none text-xs">
                Select File
              </Button>
            </label>
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div>
            <h3 className="text-base font-bold text-white">Skills & Keywords</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recruiters filter candidates by verified technical skills.
            </p>
          </div>

          <form onSubmit={addSkill} className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. GraphQL, Tailwind CSS, Kubernetes)..."
            />
            <Button type="submit" variant="secondary" size="md">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSaveProfile} variant="gradient">
              Save Skills
            </Button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div>
            <h3 className="text-base font-bold text-white">Security & Password</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your account credentials and manage session devices.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>

            <Button
              variant="gradient"
              onClick={() => {
                alert('Password updated successfully.');
                setCurrentPassword('');
                setNewPassword('');
              }}
            >
              Update Password
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div>
            <h3 className="text-base font-bold text-white">Alert Preferences</h3>
            <p className="text-xs text-slate-400 mt-0.5">Control what notifications you receive via email.</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Application status changes', desc: 'Notify me when an employer moves my application status.' },
              { label: 'Direct recruiter messages', desc: 'Instant alerts when a talent team sends an interview invitation.' },
              { label: 'Matching role alerts', desc: 'Weekly digest of newly published jobs matching your skills.' },
            ].map((pref, i) => (
              <label
                key={i}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{pref.label}</span>
                  <span className="text-[11px] text-slate-400">{pref.desc}</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
