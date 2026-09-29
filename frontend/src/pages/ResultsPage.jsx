import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Search, Award, Building, RefreshCw, ArrowRight } from 'lucide-react';
import { fetchResults } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { getCategoryBadge } from '../utils/helpers';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (category !== 'ALL') params.category = category;
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await fetchResults(params);
      if (res.data?.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      setError('Could not load tournament results from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [category, debouncedSearch]);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return {
          icon: <Trophy className="w-4 h-4 text-amber-400" />,
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          label: 'Gold (1st)'
        };
      case 2:
        return {
          icon: <Medal className="w-4 h-4 text-slate-300" />,
          bg: 'bg-slate-400/15 border-slate-400/30 text-slate-300',
          label: 'Silver (2nd)'
        };
      case 3:
        return {
          icon: <Medal className="w-4 h-4 text-amber-600" />,
          bg: 'bg-amber-700/15 border-amber-700/30 text-amber-500',
          label: 'Bronze (3rd)'
        };
      default:
        return {
          icon: <Award className="w-4 h-4 text-brand-purple" />,
          bg: 'bg-brand-purple/15 border-brand-purple/30 text-brand-purple',
          label: `Rank ${rank}`
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Honors &amp; Champions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
            Official Results
          </h1>
          <p className="text-xs sm:text-sm text-dark-text-secondary max-w-xl leading-relaxed">
            Verified scores, medals, and podium standings across Sports, Cultural, and Technical championships.
          </p>
        </div>

        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-sm transition-all shrink-0"
        >
          <span>College Leaderboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {['ALL', 'SPORTS', 'CULTURAL', 'TECHNICAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              {cat === 'ALL' ? 'All Results' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participant or college..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
          <Search className="w-4 h-4 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-center space-y-3">
          <p className="text-xs font-semibold text-brand-error">{error}</p>
          <button
            onClick={loadResults}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-error inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border space-y-2">
          <Trophy className="w-10 h-10 text-dark-muted mx-auto opacity-50" />
          <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
            No published results yet
          </h3>
          <p className="text-xs text-dark-text-secondary">Results are updated immediately after round conclusions.</p>
        </div>
      )}

      {/* Results List */}
      {!loading && !error && results.length > 0 && (
        <div className="space-y-4">
          {results.map((res) => {
            const rankBadge = getRankBadge(res.rank);
            const categoryBadge = getCategoryBadge(res.event?.category || res.category);

            return (
              <div
                key={res.id}
                className="p-6 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-purple/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${rankBadge.bg}`}>
                      {rankBadge.icon}
                      <span>{rankBadge.label}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryBadge.bg}`}>
                      {categoryBadge.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-dark-text dark:text-dark-text light:text-light-text">
                    {res.event?.title || 'Event'}
                  </h3>

                  <div className="space-y-1 text-xs text-dark-text-secondary">
                    <p className="font-semibold text-dark-text dark:text-dark-text light:text-light-text text-sm">
                      {res.participantName} {res.teamName ? `(${res.teamName})` : ''}
                    </p>
                    <p className="flex items-center gap-1.5 text-dark-muted">
                      <Building className="w-3.5 h-3.5 text-dark-muted shrink-0" />
                      <span>{res.college}</span>
                    </p>
                    {res.notes && (
                      <p className="text-dark-text-secondary pt-1 max-w-xl italic">
                        &quot;{res.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {res.score && (
                  <div className="sm:text-right shrink-0 p-3 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border">
                    <span className="block text-[10px] uppercase font-bold text-dark-muted">Official Score</span>
                    <span className="text-base font-black font-mono text-brand-purple dark:text-brand-accent light:text-brand-light-primary">
                      {res.score}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
