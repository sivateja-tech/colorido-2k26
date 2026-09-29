import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Users, ArrowRight, Eye, Sparkles } from 'lucide-react';
import EventVisualCanvas from './EventVisualCanvas';
import { useCardGlow } from '../hooks/useCardGlow';
import { getCategoryBadge } from '../utils/helpers';

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { cardRef, handleMouseMove } = useCardGlow();
  const categoryBadge = getCategoryBadge(event.category);

  // IMPORTANT EVENT FLOW: Clicking card ALWAYS opens Event Details page first
  const handleCardClick = () => {
    navigate(`/events/${event.slug || event.id}`);
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
      className="card-cursor-glow group relative flex flex-col rounded-3xl cursor-pointer select-none bg-dark-surface dark:bg-dark-surface light:bg-white border border-dark-border dark:border-dark-border light:border-slate-200 hover:border-palette-blue/80 dark:hover:border-palette-blue/80 light:hover:border-palette-blue/80 shadow-lg hover:shadow-2xl light:shadow-sm light:hover:shadow-xl hover:-translate-y-2 active:scale-[0.98] overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-palette-blue"
      title={`Click to view tournament details for ${event.title}`}
      style={{
        background: `radial-gradient(450px circle at var(--mouse-x, 150px) var(--mouse-y, 150px), rgba(41, 128, 185, 0.14), transparent 45%)`
      }}
    >
      {/* Visual Canvas Scene with Depth & Smooth Interaction */}
      <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-gradient-to-b from-[#1A252F] to-[#2C3E50] dark:from-[#1A252F] dark:to-[#2C3E50] light:from-[#ECF0F1] light:to-[#D5DBDB] border-b border-dark-border dark:border-dark-border light:border-slate-200">
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-palette-blue/15 to-transparent pointer-events-none z-10 transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

        <div className="w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <EventVisualCanvas
            visualType={event.visualType || event.type || event.slug}
            isHovered={isHovered}
          />
        </div>

        {/* Category & Featured Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${categoryBadge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${categoryBadge.dot}`} />
            {categoryBadge.label}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-palette-orange/20 text-palette-orange border border-palette-orange/40 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-palette-orange animate-pulse" />
              Featured
            </span>
          )}
        </div>

        {/* Prize Pool Tag */}
        {event.prizePool && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-bg/90 dark:bg-dark-bg/90 light:bg-white/95 border border-palette-orange/35 text-palette-orange text-xs font-bold backdrop-blur-md shadow-md">
            <Trophy className="w-3.5 h-3.5 text-palette-orange" />
            <span>Prize: {event.prizePool}</span>
          </div>
        )}

        {/* Hover Hint Overlay Pill */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-y-1 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-palette-blue text-white shadow-lg backdrop-blur-sm">
            <Eye className="w-3 h-3" />
            <span>Explore Event</span>
          </span>
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-slate-900 group-hover:text-palette-blue dark:group-hover:text-palette-blue light:group-hover:text-palette-blue transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2.5 text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 border-t border-dark-border dark:border-dark-border light:border-slate-200 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-palette-blue shrink-0" />
            <span className="truncate font-medium">{event.date || 'March 28, 2026'} • {event.startTime || '10:00 AM'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-palette-orange shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5 text-dark-muted">
            <Users className="w-3.5 h-3.5 text-palette-blue shrink-0" />
            <span className="font-medium">
              {event.participantType === 'TEAM'
                ? `Team Competition (${event.minTeamSize || 2}-${event.maxTeamSize || 4} members)`
                : 'Individual / Solo Competition'}
            </span>
          </div>
        </div>

        {/* Action Button: Opens Event Details Page First */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-palette-blue hover:bg-palette-blue/90 shadow-md group-hover:shadow-palette-blue/25 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span>View Event Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
