import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Users, ArrowRight, Sparkles } from 'lucide-react';
import EventVisualCanvas from './EventVisualCanvas';
import { useCardGlow } from '../hooks/useCardGlow';
import { getCategoryBadge } from '../utils/helpers';

export default function EventCard({ event }) {
  const [isHovered, setIsHovered] = useState(false);
  const { cardRef, handleMouseMove } = useCardGlow();
  const categoryBadge = getCategoryBadge(event.category);
  const capacity = event.capacity || 50;
  const registeredCount = event.registeredCount || 0;
  const percentFilled = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isFull = registeredCount >= capacity;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-cursor-glow group relative flex flex-col rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border hover:border-brand-purple/60 dark:hover:border-brand-purple/60 light:hover:border-brand-light-primary/60 shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300"
      style={{
        background: `radial-gradient(450px circle at var(--mouse-x, 150px) var(--mouse-y, 150px), rgba(109, 90, 230, 0.07), transparent 45%)`
      }}
    >
      {/* 45-55% Card Height: Large Animated Mini-Scene (Section 25 & 38) */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#0A0C10] border-b border-dark-border dark:border-dark-border light:border-light-border">
        <EventVisualCanvas
          visualType={event.visualType || event.type || event.slug}
          isHovered={isHovered}
        />

        {/* Category & Featured Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${categoryBadge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${categoryBadge.dot}`} />
            {categoryBadge.label}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Featured
            </span>
          )}
        </div>

        {/* Prize Pool Tag */}
        {event.prizePool && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-bg/90 dark:bg-dark-bg/90 light:bg-light-surface/90 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Prize Pool: {event.prizePool}</span>
          </div>
        )}
      </div>

      {/* Card Body & Details */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text group-hover:text-brand-purple dark:group-hover:text-brand-accent light:group-hover:text-brand-light-primary transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2.5 text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary border-t border-dark-border dark:border-dark-border light:border-light-border pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
            <span className="truncate">{event.date} • {event.startTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-error shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-dark-muted dark:text-dark-muted light:text-light-muted" />
              <span>
                {event.participantType === 'TEAM'
                  ? `Team (${event.minTeamSize || 2}-${event.maxTeamSize || 4} members)`
                  : 'Individual / Solo'}
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-brand-purple dark:text-brand-accent light:text-brand-light-primary">
              {registeredCount} / {capacity} Slots
            </span>
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentFilled >= 100
                  ? 'bg-brand-error'
                  : percentFilled > 80
                  ? 'bg-brand-warning'
                  : 'bg-gradient-to-r from-brand-purple to-brand-secondary'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Link
            to={`/events/${event.slug || event.id}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-dark-text dark:text-dark-text light:text-light-text bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary hover:bg-dark-highest dark:hover:bg-dark-highest light:hover:bg-slate-200 border border-dark-border dark:border-dark-border light:border-light-border transition-all"
          >
            <span>View Details</span>
          </Link>

          {isFull ? (
            <button
              disabled
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-dark-muted dark:text-dark-muted light:text-light-muted bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border cursor-not-allowed opacity-70"
            >
              Slots Full
            </button>
          ) : (
            <Link
              to={`/register?event=${event.id}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-brand-purple dark:bg-brand-purple light:bg-brand-light-primary hover:bg-brand-purple-hover dark:hover:bg-brand-purple-hover light:hover:bg-brand-light-hover shadow-sm transition-all"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
