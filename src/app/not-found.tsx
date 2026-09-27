import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Briefcase, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 min-h-[60vh]">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-4">
        <Briefcase className="w-6 h-6 stroke-[2.5]" />
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">404 — Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2 mb-6">
        The destination you navigated to does not exist or may have been relocated.
      </p>
      <Link href="/">
        <Button variant="gradient" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Return to HireLoop Home
        </Button>
      </Link>
    </div>
  );
}
