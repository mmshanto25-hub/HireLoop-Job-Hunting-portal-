'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggle = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <button
      onClick={toggle}
      title={`Current: ${theme}. Click to toggle.`}
      className={`relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 dark:hover:bg-slate-800/80 transition-all border border-slate-700/50 hover:border-cyan-500/40 ${className}`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
