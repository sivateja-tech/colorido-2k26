import React from 'react';
import { SearchX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No events found',
  description = 'Try adjusting your search criteria, category filters, or explore all festival events.',
  actionLabel = 'View All Events',
  actionLink = '/sports',
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-dark-800/40 border border-white/5 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white font-display">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-sm">{description}</p>
      {onAction ? (
        <button
          onClick={onAction}
          type="button"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-purple hover:bg-purple-600 transition-colors shadow-md"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-purple hover:bg-purple-600 transition-colors shadow-md"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null}
    </div>
  );
}
