'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Application } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Building2,
  ExternalLink,
  Eye,
  FileText,
  MessageSquare,
  AlertCircle,
  Award,
} from 'lucide-react';

export default function SeekerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredApps = applications.filter((app) => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadgeVariant = (status: Application['status']) => {
    switch (status) {
      case 'Offered':
        return 'success';
      case 'Shortlisted':
        return 'purple';
      case 'Under Review':
        return 'warning';
      case 'Rejected':
        return 'destructive';
      default:
        return 'cyan';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track real-time review progress, recruiter feedback, and formal interview invitations.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Applied', 'Under Review', 'Shortlisted', 'Offered', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No applications in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore active openings across our network and apply in seconds.
          </p>
          <Link href="/dashboard/seeker/jobs">
            <Button variant="primary" size="sm">
              Discover Open Roles
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-4 px-6">Job & Company</th>
                  <th className="py-4 px-4">Applied Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Last Update</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={app.companyLogo}
                          alt={app.companyName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-sm">
                            {app.jobTitle}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {app.companyName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(app.updatedAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-cyan-400 hover:text-cyan-300 group-hover:bg-cyan-500/10"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Info
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      <Modal
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        description={selectedApp ? `${selectedApp.jobTitle} • ${selectedApp.companyName}` : undefined}
        maxWidth="xl"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Status Header Banner */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Current Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(selectedApp.status)} className="text-sm px-3 py-1 font-bold">
                    {selectedApp.status}
                  </Badge>
                  {selectedApp.status === 'Offered' && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Award className="w-4 h-4" /> Official offer in progress!
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right text-xs text-slate-400">
                <span>Applied: {formatDate(selectedApp.appliedAt)}</span>
                <span className="block text-[10px] text-slate-500">
                  Last updated {formatRelativeTime(selectedApp.updatedAt)}
                </span>
              </div>
            </div>

            {/* Recruiter Notes if any */}
            {selectedApp.notes && (
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Note from Hiring Team
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedApp.notes}</p>
              </div>
            )}

            {/* Submitted Resume Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Submitted Resume
              </label>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {selectedApp.resumeFileName || 'Candidate_Resume.pdf'}
                    </p>
                    <p className="text-[11px] text-slate-400">PDF Document • Attached to application</p>
                  </div>
                </div>
                <a
                  href={selectedApp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  Download / View
                </a>
              </div>
            </div>

            {/* Submitted Cover Letter */}
            {selectedApp.coverLetter && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Cover Note to Hiring Manager
                </label>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
              <Link href={`/jobs/${selectedApp.jobId}`}>
                <Button variant="outline" size="sm">
                  View Job Listing
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
