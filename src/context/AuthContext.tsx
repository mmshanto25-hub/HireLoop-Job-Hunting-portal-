'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Notification, Role } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  savedJobIds: string[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAs: (role: Role) => Promise<void>;
  register: (name: string, email: string, role: Role, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleSaveJob: (jobId: string) => Promise<boolean>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user) {
          fetchSavedJobs();
          fetchNotifications();
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('/api/saved-jobs');
      if (res.ok) {
        const data = await res.json();
        setSavedJobIds(data.savedJobs.map((s: { jobId: string }) => s.jobId));
      }
    } catch {
      // ignore
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (email: string, password = 'password123') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to login' };
      }
      setUser(data.user);
      await fetchSavedJobs();
      await fetchNotifications();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const loginAs = async (role: Role) => {
    let email = 'sarah@example.com';
    let target = '/dashboard/seeker';

    if (role === 'RECRUITER') {
      email = 'marcus@stripe.com';
      target = '/dashboard/recruiter';
    } else if (role === 'ADMIN') {
      email = 'admin@hireloop.io';
      target = '/dashboard/admin';
    }

    const res = await login(email, 'password123');
    if (res.success) {
      router.push(target);
    }
  };

  const register = async (name: string, email: string, role: Role, password = 'password123') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setSavedJobIds([]);
      setNotifications([]);
      router.push('/');
    } catch {
      setUser(null);
    }
  };

  const toggleSaveJob = async (jobId: string): Promise<boolean> => {
    if (!user) {
      router.push('/login');
      return false;
    }

    try {
      const res = await fetch('/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.isSaved) {
        setSavedJobIds((prev) => [...prev, jobId]);
      } else {
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
      }
      return data.isSaved;
    } catch {
      return false;
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const refreshUser = async () => {
    await fetchSession();
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        savedJobIds,
        notifications,
        unreadNotificationsCount,
        login,
        loginAs,
        register,
        logout,
        toggleSaveJob,
        markNotificationRead,
        markAllNotificationsRead,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
