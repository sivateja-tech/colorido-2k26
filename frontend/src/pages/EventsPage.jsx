import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Trophy, RefreshCw } from 'lucide-react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import { CATEGORIES } from '../utils/constants';
import {
  DoodleDoubleUnderline,
  DoodleSparkle,
  DoodleSportsIcon,
  DoodleCulturalIcon,
  DoodleTechnicalIcon,
  DoodleDivider
} from '../components/doodles/DoodleAccents';

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

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'SPORTS':
        return <DoodleSportsIcon color="currentColor" size={14} className="shrink-0" />;
      case 'CULTURAL':
        return <DoodleCulturalIcon color="currentColor" size={14} className="shrink-0" />;
      case 'TECHNICAL':
        return <DoodleTechnicalIcon color="currentColor" size={14} className="shrink-0" />;
      default:
        return <Trophy className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#2980B9] uppercase">
          <span>// OFFICIAL COMPETITION SCHEDULE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
          <span className="relative inline-block">
            <span>COLORIDO</span>
            <DoodleDoubleUnderline
              color="#E67E22"
              secondaryColor="#2980B9"
              className="absolute -bottom-2.5 left-0 w-full"
            />
          </span>{' '}
          <span className="relative inline-block text-[#E67E22]">
            2K26
            <DoodleSparkle color="#FBBF24" size={20} className="absolute -top-3 -right-6 animate-pulse" />
          </span>{' '}
          <span>Events</span>
        </h1>

        <p className="text-sm sm:text-base text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed font-sans pt-1">
          Browse all 29 official sports tournaments, cultural stage spectacles, and technical hackathons. Click any card to inspect rules, prize pools, and register.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md">
        {/* Category Tabs with Contextual Micro-Illustrations */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => handleCategoryChange('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              category === 'ALL'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            <span>[ ALL EVENTS // {events.length} ]</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                category === cat.id
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
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
            className="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono text-white bg-brand-error hover:bg-brand-error/80 transition-all"
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

      {/* Events Grid */}
      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-lg font-bold font-display text-dark-text">No events match your criteria</p>
              <button
                onClick={() => {
                  setCategory('ALL');
                  setSearch('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-brand-purple border border-brand-purple/30 hover:bg-brand-purple/10 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
