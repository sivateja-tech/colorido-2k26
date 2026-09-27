import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Trophy } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="text-8xl sm:text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-pink-500 to-brand-cyan">
        404
      </div>
      <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
        Lost in the Festival Stadium?
      </h1>
      <p className="text-sm text-slate-400 max-w-md">
        The stage or arena you are looking for doesn&apos;t seem to exist, or may have been relocated in the COLORIDO 2K26 schedule.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-brand-purple hover:bg-purple-600 transition-colors shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/sports"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          <span>Explore Events</span>
        </Link>
      </div>
    </div>
  );
}
