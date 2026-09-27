'use client';

import React, { useState, useEffect } from 'react';
import { Company } from '@/types';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { Footer } from '@/components/footer/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, MapPin, Building2, Filter, Users, X } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');

  const industries = [
    'All',
    'Fintech',
    'AI',
    'Developer Tools',
    'SaaS',
    'Design',
    'E-Commerce',
    'Healthcare',
    'Education',
  ];

  const companySizes = ['All', '10-50', '50-100', '100-500', '500-1000', '1000+'];

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedIndustry !== 'All') params.set('industry', selectedIndustry);
    if (search) params.set('search', search);

    fetch(`/api/companies?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [selectedIndustry, search]);

  const filteredCompanies = companies.filter((c) => {
    if (selectedSize !== 'All') {
      if (!c.employeeCount.includes(selectedSize) && selectedSize !== '1000+') {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      {/* Header */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-6">
            <Badge variant="cyan" className="mb-2">Top Employers</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Discover Category-Defining Teams
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore leading companies, inspect engineering culture, and find teams building the future of software.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl relative flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-2 shadow-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name or keyword..."
              className="w-full bg-transparent pl-11 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="p-1 mr-2 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Industry Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedIndustry === ind
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-white">
            {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Company' : 'Companies'} Listed
          </span>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Size:</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {companySizes.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Sizes' : `${s} employees`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-60 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No companies found</h3>
            <p className="text-xs text-slate-400">Try selecting a different industry or clearing your search query.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedIndustry('All');
                setSearch('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
