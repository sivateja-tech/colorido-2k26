import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Trophy, Filter, RefreshCw } from 'lucide-react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { CATEGORIES } from '../utils/constants';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category')?.toUpperCase() || 'ALL';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (category !== 'ALL') params.category = category;
      if (search.trim()) params.search = search.trim();

      const res = await fetchEvents(params);
      if (res.data?.success) {
        setEvents(res.data.data);
      } else {
        setError(res.data?.message || 'Failed to load events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Unable to connect to events server. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEvents();
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCat.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/15 text-brand-purple dark:text-brand-accent text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          <span>Competitions &amp; Tournaments</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text">
          COLORIDO 2K26 Events
        </h1>
        <p className="text-sm sm:text-base text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed">
          Browse all 29 official sports tournaments, cultural stage competitions, and technical hackathons. Click any card to inspect rules, prize pools, and register.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => handleCategoryChange('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === 'ALL'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            All Events ({events.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat.id
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, venue..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
          <Search className="w-4 h-4 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Error State with Retry */}
      {error && (
        <div className="p-8 text-center rounded-2xl bg-brand-error/10 border border-brand-error/20 space-y-3">
          <p className="text-sm font-semibold text-brand-error">{error}</p>
          <button
            onClick={loadEvents}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-error hover:bg-brand-error/80 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
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
            No events found
          </h3>
          <p className="text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category tab.
          </p>
          <button
            onClick={() => {
              setSearch('');
              handleCategoryChange('ALL');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-elevated text-dark-text"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Events Grid with 45-55% Animated Scene Cards */}
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
