import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, Search, Trophy, Sparkles, Code2, Check,
  Users, MapPin, Calendar, Clock, AlertCircle
} from 'lucide-react';

export default function EventSelectDropdown({
  events = [],
  selectedEventId,
  onChange,
  disabled = false,
  error = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Filtering
  const filteredEvents = events.filter((ev) => {
    const matchesCategory =
      categoryFilter === 'ALL' || ev.category === categoryFilter;
    const matchesSearch =
      ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'SPORTS':
        return <Trophy className="w-3.5 h-3.5 text-emerald-400" />;
      case 'CULTURAL':
        return <Sparkles className="w-3.5 h-3.5 text-brand-gold" />;
      case 'TECHNICAL':
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Trophy className="w-3.5 h-3.5 text-brand-purple" />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'SPORTS':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'CULTURAL':
        return 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30';
      case 'TECHNICAL':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
      default:
        return 'bg-brand-purple/15 text-brand-purple border border-brand-purple/30';
    }
  };

  const handleSelect = (event) => {
    onChange(event.id);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Trigger Box */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-2xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border transition-all text-left flex items-center justify-between gap-3 focus:outline-none ${
          error
            ? 'border-brand-error'
            : isOpen
            ? 'border-brand-purple ring-2 ring-brand-purple/20'
            : 'border-dark-border dark:border-dark-border light:border-light-border hover:border-brand-purple/50'
        }`}
      >
        {selectedEvent ? (
          <div className="flex items-center gap-3 min-w-0">
            {/* Category Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${getCategoryBadgeClass(
                selectedEvent.category
              )}`}
            >
              {getCategoryIcon(selectedEvent.category)}
              <span>{selectedEvent.category}</span>
            </span>

            {/* Event Title */}
            <span className="font-bold text-xs sm:text-sm text-dark-text dark:text-dark-text light:text-light-text truncate">
              {selectedEvent.title}
            </span>

            {/* Live Capacity Tag */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-dark-bg dark:bg-dark-bg light:bg-slate-200 text-dark-text-secondary shrink-0 border border-dark-border/60">
              <Users className="w-3 h-3 text-dark-muted" />
              <span>
                {selectedEvent.registeredCount || selectedEvent.registered || 0} / {selectedEvent.capacity} slots
              </span>
            </span>
          </div>
        ) : (
          <span className="text-dark-muted text-xs">Select a festival event...</span>
        )}

        <ChevronDown
          className={`w-4 h-4 text-dark-muted shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-purple' : ''
          }`}
        />
      </button>

      {/* Dropdown Floating Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-dark-border dark:border-dark-border light:border-light-border space-y-2 bg-dark-elevated/40 dark:bg-dark-elevated/40 light:bg-light-surface-secondary/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search among 29 festival events..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {[
                { id: 'ALL', label: 'All (29)' },
                { id: 'SPORTS', label: 'Sports (9)' },
                { id: 'CULTURAL', label: 'Cultural (10)' },
                { id: 'TECHNICAL', label: 'Technical (10)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    categoryFilter === tab.id
                      ? 'bg-brand-purple text-white shadow-sm'
                      : 'bg-dark-bg dark:bg-dark-bg light:bg-slate-200 text-dark-text-secondary hover:text-dark-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Events List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-dark-border/40 dark:divide-dark-border/40 light:divide-slate-200/60 p-1.5">
            {filteredEvents.length === 0 ? (
              <div className="p-6 text-center text-xs text-dark-muted">
                No events match &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredEvents.map((ev) => {
                const isSelected = ev.id === selectedEventId;
                const registered = ev.registeredCount || ev.registered || 0;
                const isFull = registered >= ev.capacity;

                return (
                  <div
                    key={ev.id}
                    onClick={() => handleSelect(ev)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-purple/15 dark:bg-brand-purple/15 light:bg-purple-50 text-dark-text'
                        : 'hover:bg-dark-elevated dark:hover:bg-dark-elevated light:hover:bg-slate-100 text-dark-text-secondary hover:text-dark-text'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-2">
                      {/* Category Icon Badge */}
                      <div className="mt-0.5 shrink-0">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${getCategoryBadgeClass(
                            ev.category
                          )}`}
                        >
                          {getCategoryIcon(ev.category)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-dark-text dark:text-dark-text light:text-light-text truncate">
                            {ev.title}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${getCategoryBadgeClass(
                              ev.category
                            )}`}
                          >
                            {ev.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-dark-muted mt-0.5 truncate">
                          <span>{ev.date || 'Day 1'}</span>
                          <span>•</span>
                          <span className="truncate">{ev.venue || 'Campus Arena'}</span>
                          <span>•</span>
                          <span>Format: {ev.participantType || 'INDIVIDUAL'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Capacity & Check */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isFull
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : registered > ev.capacity * 0.8
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {registered}/{ev.capacity} slots
                      </span>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
