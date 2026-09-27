import React from 'react';

export default function LoadingSkeleton({ count = 6, type = 'card' }) {
  if (type === 'table') {
    return (
      <div className="w-full bg-dark-800/80 rounded-2xl border border-white/5 p-4 space-y-3 animate-pulse">
        <div className="h-8 bg-white/5 rounded-lg w-full" />
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-12 bg-white/5 rounded-lg w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-dark-800/80 border border-white/5 overflow-hidden animate-pulse flex flex-col space-y-4 p-4"
        >
          <div className="h-48 bg-white/5 rounded-xl w-full" />
          <div className="h-6 bg-white/5 rounded-md w-3/4" />
          <div className="h-4 bg-white/5 rounded-md w-full" />
          <div className="h-4 bg-white/5 rounded-md w-2/3" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-9 bg-white/5 rounded-xl" />
            <div className="h-9 bg-white/5 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
