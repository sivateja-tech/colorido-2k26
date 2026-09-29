import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Users, ArrowRight, Sparkles } from 'lucide-react';
import EventVisualCanvas from './EventVisualCanvas';
import { useCardGlow } from '../hooks/useCardGlow';
import { getCategoryBadge } from '../utils/helpers';

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { cardRef, handleMouseMove } = useCardGlow();
  const categoryBadge = getCategoryBadge(event.category);
  const capacity = event.capacity || 50;
  const registeredCount = event.registeredCount || 0;
  const percentFilled = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isFull = registeredCount >= capacity;

  // Clicking anywhere on the card navigates directly to register
  const handleCardClick = () => {
    if (isFull) {
      navigate(`/events/${event.slug || event.id}`);
    } else {
      navigate(`/register?event=${event.id}`);
    }
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-cursor-glow group relative flex flex-col rounded-3xl cursor-pointer select-none bg-dark-surface dark:bg-dark-surface light:bg-white border border-dark-border dark:border-dark-border light:border-slate-200 hover:border-brand-purple/70 dark:hover:border-brand-purple/70 light:hover:border-brand-light-primary/70 shadow-lg hover:shadow-2xl light:shadow-sm light:hover:shadow-xl hover:-translate-y-1.5 overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
      title={`Click anywhere to register for ${event.title}`}
      style={{
        background: `radial-gradient(450px circle at var(--mouse-x, 150px) var(--mouse-y, 150px), rgba(109, 90, 230, 0.08), transparent 45%)`
      }}
    >
      {/* Visual Canvas Scene */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#0A0C10] dark:bg-[#0A0C10] light:bg-[#F1F3F7] border-b border-dark-border dark:border-dark-border light:border-slate-200">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 light:bg-amber-100 light:text-amber-800 border border-amber-500/40 light:border-amber-300 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400 light:text-amber-600" />
              Featured
            </span>
          )}
        </div>

        {/* Prize Pool Tag */}
        {event.prizePool && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-bg/90 dark:bg-dark-bg/90 light:bg-white/95 border border-amber-500/30 light:border-amber-300 text-amber-400 light:text-amber-800 text-xs font-bold backdrop-blur-md shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400 light:text-amber-600" />
            <span>Prize Pool: {event.prizePool}</span>
          </div>
        )}

        {/* Hover Hint Overlay Pill */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-purple/90 light:bg-brand-light-primary text-white shadow-md backdrop-blur-sm">
            <span>Click to Register</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-slate-900 group-hover:text-brand-purple dark:group-hover:text-brand-accent light:group-hover:text-brand-light-primary transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2.5 text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 border-t border-dark-border dark:border-dark-border light:border-slate-200 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-secondary light:text-brand-light-secondary shrink-0" />
            <span className="truncate">{event.date} • {event.startTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-error shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-dark-muted dark:text-dark-muted light:text-slate-400" />
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
          <div className="w-full bg-dark-elevated dark:bg-dark-elevated light:bg-slate-100 h-2 rounded-full overflow-hidden">
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
          {/* View Details button (stops propagation so user can view details specifically) */}
          <Link
            to={`/events/${event.slug || event.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-dark-text dark:text-dark-text light:text-slate-800 bg-dark-elevated dark:bg-dark-elevated light:bg-slate-100 hover:bg-dark-highest dark:hover:bg-dark-highest light:hover:bg-slate-200 border border-dark-border dark:border-dark-border light:border-slate-300 transition-all"
          >
            <span>View Details</span>
          </Link>

          {/* Register CTA (also triggers on card click) */}
          {isFull ? (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-dark-muted dark:text-dark-muted light:text-slate-400 bg-dark-elevated dark:bg-dark-elevated light:bg-slate-100 border border-dark-border light:border-slate-200 cursor-not-allowed opacity-70"
            >
              Slots Full
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-brand-purple dark:bg-brand-purple light:bg-brand-light-primary hover:bg-brand-purple-hover dark:hover:bg-brand-purple-hover light:hover:bg-brand-light-hover group-hover:bg-brand-purple-hover dark:group-hover:bg-brand-purple-hover light:group-hover:bg-brand-light-hover shadow-md transition-all"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
