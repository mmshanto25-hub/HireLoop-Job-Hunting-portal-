'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Filter, Check, DollarSign } from 'lucide-react';

export interface FilterState {
  keyword: string;
  location: string;
  category: string;
  type: string;
  experience: string;
  remoteOnly: boolean;
  salaryMin: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

export function FilterSidebar({ filters, onChange, onReset, className = '' }: FilterSidebarProps) {
  const categories = [
    'All Categories',
    'Software Engineering',
    'AI',
    'Design',
    'Product Management',
    'DevOps & Security',
    'Data Science',
    'Marketing',
    'Sales & Solutions',
    'Finance',
    'Customer Support',
  ];

  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship'];

  const experienceLevels = [
    'All Levels',
    'Entry-level',
    'Mid-level',
    'Senior',
    'Lead',
    'Executive',
  ];

  return (
    <aside className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-6 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* Remote Only Toggle */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-white block">Remote Positions Only</span>
          <span className="text-[11px] text-slate-400">Work anywhere in the world</span>
        </div>
        <button
          type="button"
          onClick={() => onChange({ remoteOnly: !filters.remoteOnly })}
          className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
            filters.remoteOnly ? 'bg-cyan-500' : 'bg-slate-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              filters.remoteOnly ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Job Type
        </label>
        <div className="space-y-1.5">
          {jobTypes.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-1"
            >
              <input
                type="radio"
                name="jobType"
                checked={filters.type === t}
                onChange={() => onChange({ type: t })}
                className="text-cyan-500 focus:ring-cyan-500 rounded border-slate-700"
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {experienceLevels.map((lvl) => (
            <label
              key={lvl}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer py-1"
            >
              <input
                type="radio"
                name="experience"
                checked={filters.experience === lvl}
                onChange={() => onChange({ experience: lvl })}
                className="text-cyan-500 focus:ring-cyan-500 rounded border-slate-700"
              />
              <span>{lvl}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Annual Salary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Min. Salary
          </label>
          <span className="text-xs font-mono font-bold text-cyan-400">
            ${filters.salaryMin.toLocaleString()}/yr
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={250000}
          step={10000}
          value={filters.salaryMin}
          onChange={(e) => onChange({ salaryMin: Number(e.target.value) })}
          className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>$0</span>
          <span>$100k</span>
          <span>$200k+</span>
        </div>
      </div>
    </aside>
  );
}
