'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { INITIAL_RESOURCE_ARTICLES } from '@/lib/seedData';
import { Footer } from '@/components/footer/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, Clock, Calendar, ArrowRight, Share2, BookOpen } from 'lucide-react';

export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const article = INITIAL_RESOURCE_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Article Not Found</h2>
        <p className="text-xs text-slate-400">The guide you are looking for does not exist.</p>
        <Link href="/resources">
          <Button variant="primary">Return to Resources Hub</Button>
        </Link>
      </div>
    );
  }

  const related = INITIAL_RESOURCE_ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Breadcrumb */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Resource Hub
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <Badge variant="cyan">{article.category}</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-y border-slate-800/80 py-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/50"
              />
              <div>
                <p className="text-xs font-bold text-white">{article.author.name}</p>
                <p className="text-[11px] text-slate-400">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                {article.publishedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] w-full border border-slate-800 shadow-2xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm sm:text-base space-y-6 pt-4 whitespace-pre-line">
          {article.content}
        </div>

        {/* Tags */}
        <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2">Tags:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-slate-800/80 space-y-6">
            <h3 className="text-xl font-bold text-white">Related Playbooks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/resources/${rel.slug}`}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2 block"
                >
                  <Badge variant="cyan" className="text-[10px]">{rel.category}</Badge>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{rel.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{rel.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
