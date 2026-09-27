import React from 'react';
import Link from 'next/link';
import { Company } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Users, Briefcase, ExternalLink, Sparkles } from 'lucide-react';

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <img
              src={company.logo}
              alt={company.name}
              className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-950 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/companies/${company.id}`}>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {company.name}
                  </h3>
                </Link>
                {company.featured && (
                  <Badge variant="warning" className="text-[10px]">
                    Featured
                  </Badge>
                )}
              </div>
              <Badge variant="cyan" className="mt-1">
                {company.industry}
              </Badge>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            {company.openJobsCount || 0} Open {company.openJobsCount === 1 ? 'Job' : 'Jobs'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-4 line-clamp-3 leading-relaxed">
          {company.description}
        </p>

        {/* Benefits preview */}
        {company.benefits && company.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {company.benefits.slice(0, 3).map((b, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {company.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" /> {company.employeeCount}
          </span>
        </div>

        <Link href={`/companies/${company.id}`}>
          <Button variant="outline" size="sm" className="text-xs gap-1 group-hover:border-cyan-500/40">
            View Company
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
