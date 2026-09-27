'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  LayoutDashboard,
  Search,
  Bookmark,
  FileCheck,
  CreditCard,
  Settings,
  Building2,
  PlusCircle,
  Users,
  ShieldAlert,
  DollarSign,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout, loginAs } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const role = user.role;

  const seekerLinks = [
    { label: 'Overview', href: '/dashboard/seeker', icon: LayoutDashboard },
    { label: 'Browse Jobs', href: '/dashboard/seeker/jobs', icon: Search },
    { label: 'Saved Jobs', href: '/dashboard/seeker/saved', icon: Bookmark },
    { label: 'Applications', href: '/dashboard/seeker/applications', icon: FileCheck },
    { label: 'Billing & Plans', href: '/dashboard/seeker/billing', icon: CreditCard },
    { label: 'Profile & Resume', href: '/dashboard/seeker/settings', icon: Settings },
  ];

  const recruiterLinks = [
    { label: 'Overview', href: '/dashboard/recruiter', icon: LayoutDashboard },
    { label: 'My Company', href: '/dashboard/recruiter/company', icon: Building2 },
    { label: 'Manage Jobs', href: '/dashboard/recruiter/jobs', icon: Briefcase },
    { label: 'Post a Job', href: '/dashboard/recruiter/jobs/new', icon: PlusCircle },
    { label: 'Recruiter Billing', href: '/dashboard/recruiter/billing', icon: CreditCard },
    { label: 'Account Settings', href: '/dashboard/recruiter/settings', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Platform Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Users Moderation', href: '/dashboard/admin/users', icon: Users },
    { label: 'Company Approvals', href: '/dashboard/admin/companies', icon: Building2 },
    { label: 'Job Moderation', href: '/dashboard/admin/jobs', icon: Briefcase },
    { label: 'Revenue & Payments', href: '/dashboard/admin/payments', icon: DollarSign },
    { label: 'Admin Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const links =
    role === 'ADMIN' ? adminLinks : role === 'RECRUITER' ? recruiterLinks : seekerLinks;

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Briefcase className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">
              Hire<span className="text-cyan-400">Loop</span>
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 -mt-0.5">
              {role} Workspace
            </span>
          </div>
        </Link>

        {/* User Card */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/50"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge
                  variant={role === 'ADMIN' ? 'destructive' : role === 'RECRUITER' ? 'purple' : 'cyan'}
                  className="text-[10px] px-1.5 py-0"
                >
                  {role}
                </Badge>
                <span className="text-[10px] text-slate-400 capitalize">
                  {user.subscription?.plan || 'Free'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom controls */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        {/* Quick Role Switcher for instant testing */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <p className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Switch Demo Account:
          </p>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => loginAs('SEEKER')}
              className={`px-1.5 py-1 text-[10px] rounded transition-colors ${
                role === 'SEEKER' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Seeker
            </button>
            <button
              onClick={() => loginAs('RECRUITER')}
              className={`px-1.5 py-1 text-[10px] rounded transition-colors ${
                role === 'RECRUITER' ? 'bg-violet-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Recruiter
            </button>
            <button
              onClick={() => loginAs('ADMIN')}
              className={`px-1.5 py-1 text-[10px] rounded transition-colors ${
                role === 'ADMIN' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Trigger */}
      <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-200 p-2 rounded-lg bg-slate-900 border border-slate-800"
        >
          <Menu className="w-4 h-4 text-cyan-400" />
          <span>{role} Menu</span>
        </button>
        <span className="text-xs text-slate-400">HireLoop Dashboard</span>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-slate-800 z-50 flex flex-col">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/80 min-h-[calc(100vh-4rem)]">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
