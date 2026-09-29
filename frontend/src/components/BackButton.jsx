import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable BackButton Component
 * Supports smart browser history navigation with safe fallback.
 * Strictly adheres to COLORIDO 2K26 design system and touch guidelines.
 */
export default function BackButton({
  fallback = '/events',
  label = 'Back',
  className = '',
  iconOnly = false
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    // If user has previous navigation history in the app, use browser history
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-dark-text dark:text-dark-text light:text-light-text bg-dark-surface/90 dark:bg-dark-surface/90 light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border hover:border-palette-blue/50 hover:bg-dark-elevated dark:hover:bg-dark-elevated light:hover:bg-slate-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 min-h-[44px] cursor-pointer select-none ${className}`}
      title={label}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 text-palette-blue group-hover:-translate-x-1 transition-transform duration-200 shrink-0" />
      {!iconOnly && <span className="tracking-wide">{label}</span>}
    </button>
  );
}
