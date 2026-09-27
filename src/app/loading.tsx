import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950 min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="text-xs text-slate-400 mt-3 font-medium">Loading HireLoop...</p>
    </div>
  );
}
