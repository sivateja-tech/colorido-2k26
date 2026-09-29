import React from 'react';
import { X, Check } from 'lucide-react';

export default function FilterModal({
  isOpen,
  onClose,
  categories = ['ALL', 'SPORTS', 'CULTURAL'],
  selectedCategory,
  onSelectCategory,
  venues = [],
  selectedVenue,
  onSelectVenue,
  onReset
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-dark-surface border border-dark-border w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white font-display">Filter Events</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mt-5 space-y-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Event Domain
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-brand-purple text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                <span>{cat.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Venues Filter (if provided) */}
        {venues.length > 0 && (
          <div className="mt-6 space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Campus Venue
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => onSelectVenue('')}
                className={`w-full text-left py-2 px-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  !selectedVenue ? 'bg-brand-purple/20 text-brand-purple font-semibold' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>All Venues</span>
                {!selectedVenue && <Check className="w-3.5 h-3.5" />}
              </button>
              {venues.map((venue) => (
                <button
                  key={venue}
                  type="button"
                  onClick={() => onSelectVenue(venue)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedVenue === venue ? 'bg-brand-purple/20 text-brand-purple font-semibold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{venue}</span>
                  {selectedVenue === venue && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reset & Apply Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onReset}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-purple-600 transition-colors shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
