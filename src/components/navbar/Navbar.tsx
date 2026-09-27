'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  Bell,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  Bookmark,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const {
    user,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    loginAs,
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Companies', href: '/companies' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Resources', href: '/resources' },
  ];

  const getDashboardHref = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'RECRUITER') return '/dashboard/recruiter';
    return '/dashboard/seeker';
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-slate-950/60 backdrop-blur-sm border-b border-slate-900/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Hire<span className="text-cyan-400">Loop</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 -mt-1">
                Next-Gen Talent
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">Notifications</span>
                        {unreadNotificationsCount > 0 && (
                          <Badge variant="cyan">{unreadNotificationsCount} new</Badge>
                        )}
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications right now.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3.5 hover:bg-slate-800/60 transition-colors cursor-pointer ${
                              !n.read ? 'bg-cyan-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                {formatRelativeTime(n.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Dashboard Link */}
              <Link href={getDashboardHref()} className="hidden sm:inline-block">
                <Button variant="outline" size="sm" className="gap-1.5 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 border border-slate-800/80 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/50"
                  />
                  <span className="hidden lg:block text-xs font-medium text-slate-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Badge
                          variant={
                            user.role === 'ADMIN'
                              ? 'destructive'
                              : user.role === 'RECRUITER'
                              ? 'purple'
                              : 'cyan'
                          }
                        >
                          {user.role}
                        </Badge>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {user.subscription?.plan || 'Free'} Plan
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href={getDashboardHref()}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                        Main Dashboard
                      </Link>

                      {user.role === 'SEEKER' && (
                        <>
                          <Link
                            href="/dashboard/seeker/saved"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                            Saved Jobs
                          </Link>
                          <Link
                            href="/dashboard/seeker/applications"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            My Applications
                          </Link>
                          <Link
                            href="/dashboard/seeker/billing"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            Billing & Plans
                          </Link>
                          <Link
                            href="/dashboard/seeker/settings"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Settings className="w-3.5 h-3.5 text-slate-400" />
                            Settings & Resume
                          </Link>
                        </>
                      )}

                      {user.role === 'RECRUITER' && (
                        <>
                          <Link
                            href="/dashboard/recruiter/company"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            My Company
                          </Link>
                          <Link
                            href="/dashboard/recruiter/jobs/new"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            Post a Job
                          </Link>
                          <Link
                            href="/dashboard/recruiter/billing"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            Recruiter Billing
                          </Link>
                        </>
                      )}

                      {user.role === 'ADMIN' && (
                        <>
                          <Link
                            href="/dashboard/admin/users"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            User Management
                          </Link>
                          <Link
                            href="/dashboard/admin/companies"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            Company Moderation
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Quick Demo Switcher */}
                    <div className="pt-2 mt-2 border-t border-slate-800 px-3 pb-1">
                      <p className="text-[10px] text-slate-400 font-mono uppercase mb-1">Switch Demo Role:</p>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => loginAs('SEEKER')}
                          className="px-1.5 py-1 text-[10px] rounded bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 transition-colors"
                        >
                          Seeker
                        </button>
                        <button
                          onClick={() => loginAs('RECRUITER')}
                          className="px-1.5 py-1 text-[10px] rounded bg-slate-800 hover:bg-violet-500/20 hover:text-violet-300 text-slate-300 transition-colors"
                        >
                          Recruiter
                        </button>
                        <button
                          onClick={() => loginAs('ADMIN')}
                          className="px-1.5 py-1 text-[10px] rounded bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 transition-colors"
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={getDashboardHref()}>
                  <Button variant="primary" className="w-full justify-center">
                    Go to Dashboard ({user.role})
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout} className="w-full justify-center text-rose-400">
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}

            {/* Quick Demo Switcher Mobile */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-500 font-mono">1-Click Test Demo Login:</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Button size="sm" variant="secondary" onClick={() => loginAs('SEEKER')}>
                  Seeker
                </Button>
                <Button size="sm" variant="secondary" onClick={() => loginAs('RECRUITER')}>
                  Recruiter
                </Button>
                <Button size="sm" variant="secondary" onClick={() => loginAs('ADMIN')}>
                  Admin
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
