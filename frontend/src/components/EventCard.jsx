import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Users, Eye, Clock } from 'lucide-react';
import EventVisualCanvas from './EventVisualCanvas';
import { useCardGlow } from '../hooks/useCardGlow';
import { getCategoryBadge } from '../utils/helpers';
import { DoodleUnderline, DoodleSparkle, DoodleArrow } from './doodles/DoodleAccents';

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { cardRef, handleMouseMove, handleMouseLeave } = useCardGlow();
  const categoryBadge = getCategoryBadge(event.category);

  // IMPORTANT EVENT FLOW: Clicking card ALWAYS opens Event Details page first
  const handleCardClick = () => {
    navigate(`/events/${event.slug || event.id}`);
  };

  const onMouseLeaveCombined = () => {
    setIsHovered(false);
    handleMouseLeave();
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
      onMouseLeave={onMouseLeaveCombined}
      className="card-cursor-glow group relative flex flex-col rounded-3xl cursor-pointer select-none bg-dark-surface dark:bg-dark-surface light:bg-white border border-[#95A5A6]/25 dark:border-[#95A5A6]/20 light:border-slate-200 hover:border-[#2980B9]/80 dark:hover:border-[#2980B9]/80 light:hover:border-[#2980B9]/80 shadow-lg hover:shadow-2xl light:shadow-sm light:hover:shadow-xl active:scale-[0.985] overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-palette-blue"
      title={`Click to view tournament details for ${event.title}`}
      style={{
        background: `radial-gradient(550px circle at var(--mouse-x, 150px) var(--mouse-y, 150px), rgba(41, 128, 185, 0.16), transparent 50%)`
      }}
    >
      {/* Top Radiant Edge Sheen Highlight */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#2980B9]/70 to-transparent pointer-events-none z-20 group-hover:via-[#3498DB] transition-all duration-300" />

      {/* Visual Canvas Scene with Depth & Smooth Interaction */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gradient-to-b from-[#151D24] via-[#1F2C38] to-[#2C3E50] dark:from-[#151D24] dark:via-[#1F2C38] dark:to-[#2C3E50] light:from-[#ECF0F1] light:via-[#E2E8F0] light:to-[#CBD5E1] border-b border-[#95A5A6]/20 dark:border-[#95A5A6]/15 light:border-slate-200">
        
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#2980B9]/20 to-transparent pointer-events-none z-10 transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

        {/* Shimmer Light Ray on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden z-10">
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>

        {/* Canvas Render with Smooth Zoom */}
        <div className="w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <EventVisualCanvas
            visualType={event.visualType || event.type || event.slug}
            isHovered={isHovered}
          />
        </div>

        {/* Bottom Vignette Blur Transition */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-dark-surface dark:from-dark-surface light:from-white via-dark-surface/40 dark:via-dark-surface/40 light:via-white/40 to-transparent pointer-events-none z-10" />

        {/* Editorial Top Badges: Category & Featured */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-20">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border shadow-md ${categoryBadge.bg}`}>
            <span>[ {categoryBadge.label} ]</span>
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/40 backdrop-blur-md shadow-md">
              <DoodleSparkle color="#E67E22" size={11} />
              <span>FEATURED</span>
            </span>
          )}
        </div>

        {/* Format Pill (Solo / Team) on Top Right */}
        <div className="absolute top-3.5 right-3.5 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-semibold bg-dark-bg/90 dark:bg-dark-bg/90 light:bg-white/95 text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-700 border border-[#95A5A6]/25 dark:border-[#95A5A6]/25 light:border-slate-300 backdrop-blur-md shadow-sm">
            <Users className="w-3 h-3 text-[#2980B9]" />
            <span>
              {event.participantType === 'TEAM'
                ? `TEAM (${event.minTeamSize || 2}-${event.maxTeamSize || 4})`
                : 'SOLO'}
            </span>
          </span>
        </div>

        {/* Prize Pool Floating Badge with Sparkle Accent */}
        {event.prizePool && (
          <div className="absolute bottom-3 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-bg/95 dark:bg-dark-bg/95 light:bg-white/95 border border-[#E67E22]/40 text-[#E67E22] text-xs font-mono font-bold backdrop-blur-md shadow-lg">
            <Trophy className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>PRIZE: {event.prizePool}</span>
          </div>
        )}

        {/* Interactive Hover Hint Overlay Pill */}
        <div className="absolute bottom-3 right-3.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-1 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#2980B9] text-white shadow-lg backdrop-blur-sm border border-[#3498DB]/40">
            <Eye className="w-3.5 h-3.5" />
            <span>EXPLORE</span>
          </span>
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="relative inline-block w-full">
            <h3 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-slate-900 group-hover:text-palette-blue dark:group-hover:text-palette-blue light:group-hover:text-palette-blue transition-colors line-clamp-1">
              {event.title}
            </h3>
            <DoodleUnderline
              color="#2980B9"
              height="6px"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <p className="mt-2 text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 line-clamp-2 leading-relaxed font-sans">
            {event.shortDescription || event.description}
          </p>
        </div>

        {/* Meta Info with Monospace Typography */}
        <div className="space-y-2 text-xs font-mono text-dark-text-secondary dark:text-dark-text-secondary light:text-slate-600 border-t border-[#95A5A6]/20 dark:border-[#95A5A6]/15 light:border-slate-200 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#2980B9] shrink-0" />
            <span className="truncate">{event.date || 'OCTOBER 16, 2026'}</span>
            <span className="text-[#95A5A6]">•</span>
            <Clock className="w-3.5 h-3.5 text-[#2980B9] shrink-0" />
            <span className="truncate">{event.startTime || '10:00 AM'}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
            <span className="truncate font-sans">{event.venue || 'RVR & JC Campus'}</span>
          </div>
        </div>

        {/* Action Button: Opens Event Details Page First */}
        <div className="pt-1">
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-white bg-gradient-to-r from-[#2980B9] to-[#2471A3] hover:from-[#3498DB] hover:to-[#2980B9] shadow-md group-hover:shadow-[0_4px_16px_rgba(41,128,185,0.35)] flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span>Inspect Rules &amp; Register</span>
            <DoodleArrow color="#FFFFFF" width={18} height={10} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
