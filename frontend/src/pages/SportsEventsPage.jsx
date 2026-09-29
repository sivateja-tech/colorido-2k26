import React, { useState, useEffect } from 'react';
import { Search, Trophy, RefreshCw } from 'lucide-react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { useDebounce } from '../hooks/useDebounce';

export default function SportsEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const loadSports = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { category: 'SPORTS' };
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await fetchEvents(params);
      if (res.data?.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching sports:', err);
      setError('Could not connect to sports festival database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSports();
  }, [debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Trophy className="w-3.5 h-3.5" />
          <span>Inter-Collegiate Athletics &amp; Games</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
          Sports Tournaments
        </h1>
        <p className="text-sm sm:text-base text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary max-w-2xl leading-relaxed">
          Compete in 9 premier collegiate championships across turf cricket, floodlit football, hardwood basketball, volleyball, badminton, rapid chess, kabaddi, table tennis, and athletics.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md">
        <div className="text-xs font-semibold text-dark-muted">
          Showing <span className="font-bold text-dark-text dark:text-dark-text light:text-light-text">{events.length}</span> Sports Championships
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sports events..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
          <Search className="w-4 h-4 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-8 text-center rounded-2xl bg-brand-error/10 border border-brand-error/20 space-y-3">
          <p className="text-sm font-semibold text-brand-error">{error}</p>
          <button
            onClick={loadSports}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-error"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border space-y-3">
          <Trophy className="w-12 h-12 text-dark-muted mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-dark-text dark:text-dark-text light:text-light-text">
            No sports events match your filter
          </h3>
          <p className="text-xs text-dark-text-secondary">Try searching with a different keyword.</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );
}
