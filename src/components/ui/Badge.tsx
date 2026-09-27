import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'cyan' | 'purple';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    secondary: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    outline: 'border border-slate-700 text-slate-300 bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    destructive: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    purple: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
