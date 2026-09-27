'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Job } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { FileText, CheckCircle2, AlertCircle, Sparkles, Building2, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onAppliedSuccess?: () => void;
}

export function ApplicationModal({ job, isOpen, onClose, onAppliedSuccess }: ApplicationModalProps) {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResume, setSelectedResume] = useState('profile_default');
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!confirmed) {
      setError('Please certify that your application information is true and accurate.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          coverLetter,
          resumeUrl: user.resumeUrl || '/sample-resumes/sarah-lin-resume.pdf',
          resumeFileName: user.resumeFileName || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit application');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      if (onAppliedSuccess) onAppliedSuccess();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setError(null);
    setCoverLetter('');
    setConfirmed(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={isSuccess ? 'Application Submitted!' : `Apply to ${job.title}`}
      description={isSuccess ? undefined : `${job.companyName} • ${job.location}`}
      maxWidth="xl"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white">You are all set!</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your application has been received by <strong className="text-cyan-400">{job.companyName}</strong>. You can monitor the real-time review status directly in your Seeker dashboard.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <Button variant="outline" onClick={resetAndClose}>
              Browse More Jobs
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                resetAndClose();
                window.location.href = '/dashboard/seeker/applications';
              }}
            >
              Track in Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Job summary card */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-800"
              />
              <div>
                <p className="text-sm font-semibold text-white">{job.title}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {job.companyName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Resume / CV</span>
              <span className="text-[11px] text-cyan-400 font-normal">PDF format required</span>
            </label>

            <div
              onClick={() => setSelectedResume('profile_default')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                selectedResume === 'profile_default'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    {user?.resumeFileName || 'Sarah_Lin_Staff_Frontend_Resume_2026.pdf'}
                  </p>
                  <p className="text-[10px] text-slate-400">Default profile resume • Updated recently</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-cyan-400">Selected</span>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Cover Letter / Note to Hiring Manager</span>
              <span className="text-[11px] text-slate-500 font-normal">Optional</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Highlight key achievements, relevant experience, and why you are excited to join this company..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 pt-1">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span>
              I agree to submit my profile, contact information, and resume to {job.companyName} for review regarding this opening.
            </span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" isLoading={isLoading} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
