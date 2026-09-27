'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Application, Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import {
  Users,
  ChevronLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Download,
} from 'lucide-react';

export default function JobApplicantsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.jobId;

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      fetch(`/api/jobs/${jobId}`).then((r) => r.json()),
      fetch(`/api/applications?jobId=${jobId}`).then((r) => r.json()),
    ])
      .then(([jobData, appsData]) => {
        setJob(jobData.job);
        setApplicants(appsData.applications || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (appId: string, newStatus: Application['status'], notes?: string) => {
    setUpdatingId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });
      if (res.ok) {
        setApplicants((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus, notes: notes || a.notes } : a))
        );
        if (selectedCandidate && selectedCandidate.id === appId) {
          setSelectedCandidate((prev) => (prev ? { ...prev, status: newStatus, notes: notes || prev.notes } : null));
        }
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to All Jobs
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Applicant Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Reviewing candidates for <strong className="text-cyan-400">{job?.title || 'Job Opening'}</strong>
          </p>
        </div>

        <Badge variant="cyan" className="text-xs px-3 py-1 font-bold">
          {applicants.length} Total Submissions
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No applicants yet</h3>
          <p className="text-xs text-slate-400">
            This opening has not received submissions yet. Verified candidates will appear here as soon as they apply.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-4">Date Applied</th>
                  <th className="py-4 px-4">Resume</th>
                  <th className="py-4 px-4">Stage & Status</th>
                  <th className="py-4 px-6 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.seekerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'}
                          alt={app.seekerName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{app.seekerName}</p>
                          <p className="text-[11px] text-slate-400">{app.seekerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 hover:text-cyan-300 font-semibold text-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        PDF Resume
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as Application['status'])
                        }
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border focus:outline-none cursor-pointer ${
                          app.status === 'Offered'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : app.status === 'Shortlisted'
                            ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                            : app.status === 'Under Review'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        }`}
                      >
                        <option value="Applied" className="bg-slate-900 text-white">Applied</option>
                        <option value="Under Review" className="bg-slate-900 text-white">Under Review</option>
                        <option value="Shortlisted" className="bg-slate-900 text-white">Shortlisted</option>
                        <option value="Offered" className="bg-slate-900 text-white">Offered</option>
                        <option value="Rejected" className="bg-slate-900 text-white">Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCandidate(app)}
                        className="text-xs"
                      >
                        Candidate Dossier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Dossier Modal */}
      <Modal
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        title="Candidate Dossier"
        description={selectedCandidate ? `${selectedCandidate.seekerName} • ${selectedCandidate.jobTitle}` : undefined}
        maxWidth="xl"
      >
        {selectedCandidate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <img
                src={selectedCandidate.seekerAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces'}
                alt={selectedCandidate.seekerName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500"
              />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{selectedCandidate.seekerName}</h4>
                <p className="text-xs text-slate-400">{selectedCandidate.seekerEmail}</p>
                <p className="text-xs text-cyan-400 font-semibold">{selectedCandidate.seekerHeadline}</p>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Application Stage:</span>
              <div className="flex items-center gap-2">
                {['Applied', 'Under Review', 'Shortlisted', 'Offered'].map((st) => (
                  <button
                    key={st}
                    onClick={() =>
                      handleStatusChange(selectedCandidate.id, st as Application['status'])
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCandidate.status === st
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover letter */}
            {selectedCandidate.coverLetter && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Cover Note
                </label>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedCandidate.coverLetter}
                </div>
              </div>
            )}

            {/* Feedback / Private Hiring Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Internal Hiring Team Note (Candidate Can See This)
              </label>
              <textarea
                rows={3}
                defaultValue={selectedCandidate.notes || ''}
                placeholder="e.g. Completed screen; invited to technical interview on Friday..."
                onBlur={(e) =>
                  handleStatusChange(selectedCandidate.id, selectedCandidate.status, e.target.value)
                }
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Auto-saved when you click outside.</p>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              <a
                href={selectedCandidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold hover:underline"
              >
                <Download className="w-4 h-4" />
                Download Attached Resume
              </a>

              <Button variant="primary" size="sm" onClick={() => setSelectedCandidate(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
