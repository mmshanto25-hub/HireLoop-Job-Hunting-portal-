'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_RESOURCE_ARTICLES } from '@/lib/seedData';
import { Footer } from '@/components/footer/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BookOpen,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  FileText,
  DollarSign,
  Users,
} from 'lucide-react';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Interview Preparation',
    'Resume Tips',
    'Salary Guides',
    'Hiring Guides',
    'Career Advice',
  ];

  const filteredArticles = INITIAL_RESOURCE_ARTICLES.filter((article) => {
    if (selectedCategory !== 'All' && article.category !== selectedCategory) {
      return false;
    }
    if (
      search &&
      !article.title.toLowerCase().includes(search.toLowerCase()) &&
      !article.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      {/* Header */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="cyan">Career & Hiring Intelligence</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            HireLoop Resource Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Practical, in-depth guides for interviewing at tier-1 tech companies, negotiating compensation, and hiring high-agency talent.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl p-2 shadow-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title or keyword..."
                className="w-full bg-transparent pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-6 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {selectedCategory === 'All' ? 'Latest Publications' : `${selectedCategory} Articles`}
          </h2>
          <span className="text-xs text-slate-400">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <p className="text-xs text-slate-400">No articles matched your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950 relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="cyan">{article.category}</Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.publishedAt}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{article.author.name}</p>
                      <p className="text-[10px] text-slate-400">{article.author.role}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
