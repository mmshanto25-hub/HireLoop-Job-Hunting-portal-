'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Company } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Building2, CheckCircle2, XCircle, ExternalLink, Globe } from 'lucide-react';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = () => {
    setIsLoading(true);
    fetch('/api/admin/companies')
      .then((r) => r.json())
      .then((data) => setCompanies(data.companies || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSetStatus = async (companyId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, status }),
      });
      if (res.ok) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === companyId ? { ...c, status } : c))
        );
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Company Approvals & Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review registered employer entities. Only approved companies appear on the public marketplace.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-4">Industry & Website</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Submitted Date</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.logo}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-950"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{c.name}</p>
                          <p className="text-[11px] text-slate-400">{c.employeeCount} employees</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-200">{c.industry}</p>
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        {c.website.replace('https://', '')}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{c.location}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          c.status === 'approved'
                            ? 'success'
                            : c.status === 'pending'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {c.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status !== 'approved' && (
                          <Button
                            variant="gradient"
                            size="sm"
                            className="text-[11px] py-1"
                            onClick={() => handleSetStatus(c.id, 'approved')}
                          >
                            Approve
                          </Button>
                        )}
                        {c.status !== 'rejected' && (
                          <Button
                            variant="danger"
                            size="sm"
                            className="text-[11px] py-1"
                            onClick={() => handleSetStatus(c.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        )}
                        <Link href={`/companies/${c.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
