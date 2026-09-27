import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Sparkles, Clock } from 'lucide-react';

export default function CountdownTimer({ className = '' }) {
  const { days, hours, minutes, seconds, isStarted } = useCountdown();

  if (isStarted) {
    return (
      <div className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 text-brand-purple dark:text-brand-accent font-bold tracking-wide shadow-glow-sm ${className}`}>
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-lg uppercase tracking-widest font-black">EVENT STARTED</span>
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: String(days).padStart(2, '0') },
    { label: 'HOURS', value: String(hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(seconds).padStart(2, '0') },
  ];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary">
        <Clock className="w-3.5 h-3.5 text-brand-purple" />
        <span>Festival Starts In</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl min-w-[70px] sm:min-w-[90px] bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md"
          >
            <span className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-dark-text dark:text-dark-text light:text-light-text">
              {unit.value}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-dark-muted dark:text-dark-muted light:text-light-muted mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
