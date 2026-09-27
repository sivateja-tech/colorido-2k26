import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to fetch the latest festival data from server. Please check your network connection and retry.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-rose-950/20 border border-rose-500/20 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white font-display">{title}</h3>
      <p className="mt-2 text-sm text-slate-300 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
