import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, RefreshCw } from 'lucide-react';
import { fetchSchedule } from '../services/api';
import { getCategoryBadge } from '../utils/helpers';
import BackButton from '../components/BackButton';

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      const res = await fetchSchedule(params);
      if (res.data?.success) {
        setSchedule(res.data.data);
      }
    } catch (err) {
      setError('Could not load the festival schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduleData();
  }, [selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <BackButton fallback="/" label="Back to Home" />
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/30">
          <Calendar className="w-3.5 h-3.5" />
          <span>Timeline &amp; Schedule Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
          Festival Schedule
        </h1>
        <p className="text-xs sm:text-sm text-dark-text-secondary max-w-2xl leading-relaxed">
          Track official milestones across Sports, Cultural, and Technical categories. All venues and timings are synchronized in real-time.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-sm">
        {['ALL', 'SPORTS', 'CULTURAL', 'TECHNICAL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-brand-purple text-white shadow-sm'
                : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            {cat === 'ALL' ? 'All Schedules' : cat}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-center space-y-3">
          <p className="text-xs font-semibold text-brand-error">{error}</p>
          <button
            onClick={loadScheduleData}
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
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && schedule.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border space-y-2">
          <Calendar className="w-10 h-10 text-dark-muted mx-auto opacity-50" />
          <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
            No schedule events found
          </h3>
          <p className="text-xs text-dark-text-secondary">Try switching the category filter.</p>
        </div>
      )}

      {/* Schedule Timeline Cards */}
      {!loading && !error && schedule.length > 0 && (
        <div className="space-y-4">
          {schedule.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-purple/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {item.stage && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-dark-elevated text-dark-text border border-dark-border">
                        {item.stage}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-dark-text-secondary leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="sm:text-right space-y-1.5 shrink-0 text-xs text-dark-text-secondary border-t sm:border-t-0 pt-3 sm:pt-0 border-dark-border">
                  <div className="flex sm:justify-end items-center gap-1.5 font-bold text-dark-text dark:text-dark-text light:text-light-text">
                    <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex sm:justify-end items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  <div className="flex sm:justify-end items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-error" />
                    <span>{item.venue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
