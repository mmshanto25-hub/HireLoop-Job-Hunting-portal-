'use client';

import React, { useState, useEffect } from 'react';
import { User, Role, UserStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  UserCheck,
  UserX,
  Sparkles,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchUsers = () => {
    setIsLoading(true);
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (userId: string, updates: { role?: Role; status?: UserStatus }) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
        );
      }
    } catch {
      // ignore
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User Governance & Roles
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage candidate and employer accounts, modify role permissions, and enforce suspensions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Roles</option>
          <option value="SEEKER">Job Seekers</option>
          <option value="RECRUITER">Recruiters</option>
          <option value="ADMIN">Administrators</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
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
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Joined Date</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          u.role === 'ADMIN'
                            ? 'destructive'
                            : u.role === 'RECRUITER'
                            ? 'purple'
                            : 'cyan'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={u.status === 'active' ? 'success' : 'destructive'}>
                        {u.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.role !== 'RECRUITER' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] text-violet-400 hover:bg-violet-500/10"
                            onClick={() => handleUpdateUser(u.id, { role: 'RECRUITER' })}
                          >
                            Set Recruiter
                          </Button>
                        )}
                        {u.role !== 'SEEKER' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] text-cyan-400 hover:bg-cyan-500/10"
                            onClick={() => handleUpdateUser(u.id, { role: 'SEEKER' })}
                          >
                            Set Seeker
                          </Button>
                        )}
                        {u.status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] text-rose-400 hover:bg-rose-500/10"
                            onClick={() => handleUpdateUser(u.id, { status: 'suspended' })}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] text-emerald-400 hover:bg-emerald-500/10"
                            onClick={() => handleUpdateUser(u.id, { status: 'active' })}
                          >
                            Activate
                          </Button>
                        )}
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
