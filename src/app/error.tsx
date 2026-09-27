'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('HireLoop Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 min-h-[60vh]">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight">Something went wrong</h2>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 mb-6">
        An unexpected error occurred while rendering this interface. Our telemetry has logged the issue.
      </p>
      <Button variant="outline" onClick={() => reset()} className="gap-2">
        <RotateCcw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}
