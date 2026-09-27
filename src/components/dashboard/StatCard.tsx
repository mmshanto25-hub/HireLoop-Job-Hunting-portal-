import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-cyan-400',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={cn('p-2.5 rounded-xl bg-slate-800/60 ring-1 ring-slate-800', iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h4 className="text-2xl font-bold tracking-tight text-white">{value}</h4>
        {change && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold',
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
