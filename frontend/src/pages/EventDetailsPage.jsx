import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Trophy, Users, ShieldAlert, CheckCircle,
  ArrowLeft, ArrowRight, Share2, Sparkles, Clock, AlertCircle, Ticket
} from 'lucide-react';
import { fetchEventById, fetchMyRegistrations } from '../services/api';
import EventVisualCanvas from '../components/EventVisualCanvas';
import { useAuth } from '../context/AuthContext';
import { getCategoryBadge } from '../utils/helpers';
import GoogleAuthModal from '../components/GoogleAuthModal';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRegistration, setUserRegistration] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchEventById(id);
        if (res.data?.success) {
          const ev = res.data.data;
          setEvent(ev);

          // Check if user is registered for this event
          if (isAuthenticated) {
            try {
              const regRes = await fetchMyRegistrations();
              if (regRes.data?.success) {
                const found = regRes.data.data.find((r) => r.eventId === ev.id);
                if (found) setUserRegistration(found);
              }
            } catch (e) {
              // Non-fatal
            }
          }
        } else {
          setError(res.data?.message || 'Event not found');
        }
      } catch (err) {
        setError('Event not found or failed to connect to database.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-dark-muted">Loading competition details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-brand-error mx-auto opacity-70" />
        <h2 className="text-2xl font-bold text-dark-text dark:text-dark-text light:text-light-text">
          Event Not Found
        </h2>
        <p className="text-xs text-dark-text-secondary">
          {error || 'The requested event could not be found or has been removed.'}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const categoryBadge = getCategoryBadge(event.category);
  const capacity = event.capacity || 50;
  const registeredCount = event.registeredCount || 0;
  const percentFilled = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const isFull = registeredCount >= capacity;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-dark-muted hover:text-dark-text dark:hover:text-dark-text light:hover:text-light-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Event Showcase Header with 45-55% Large Animated Visual */}
      <div className="relative rounded-3xl overflow-hidden bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden border-b border-dark-border">
          <EventVisualCanvas
            visualType={event.visualType || event.type || event.slug}
            isHovered={true}
          />

          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${categoryBadge.bg}`}>
              {categoryBadge.label}
            </span>
            {event.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Title & Metadata Strip */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
                {event.title}
              </h1>
              <p className="text-xs sm:text-sm text-dark-muted mt-1">
                Official Category: <span className="font-semibold text-brand-purple">{event.category}</span> • R V R &amp; J C College of Engineering
              </p>
            </div>

            {/* Quick Action button */}
            <div>
              {userRegistration ? (
                <Link
                  to={`/pass/${userRegistration.registrationId || userRegistration.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Registration Pass</span>
                </Link>
              ) : isFull ? (
                <div className="px-6 py-3 rounded-2xl text-xs font-bold text-dark-muted bg-dark-elevated border border-dark-border cursor-not-allowed">
                  Registration Full ({capacity} / {capacity})
                </div>
              ) : isAuthenticated ? (
                <Link
                  to={`/register?event=${event.id}`}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign in to Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details Left, Meta/Registration Box Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Full Description, Rules, Eligibility */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md space-y-3">
            <h2 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text">
              About This Event
            </h2>
            <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Rules & Guidelines */}
          {event.rules && (
            <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md space-y-3">
              <h2 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-purple" />
                <span>Rules &amp; Regulations</span>
              </h2>
              <div className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed whitespace-pre-line bg-dark-elevated/40 dark:bg-dark-elevated/40 light:bg-light-surface-secondary p-4 rounded-2xl border border-dark-border font-mono">
                {event.rules}
              </div>
            </div>
          )}

          {/* Eligibility */}
          {event.eligibility && (
            <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md space-y-3">
              <h2 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-secondary" />
                <span>Eligibility Criteria</span>
              </h2>
              <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed">
                {event.eligibility}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Key Details, Prize Pool, Capacity */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md space-y-6">
            <h3 className="text-lg font-bold font-display text-dark-text dark:text-dark-text light:text-light-text">
              Competition Overview
            </h3>

            {/* Prize Pool Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Trophy className="w-4 h-4" />
                <span>PRIZE POOL</span>
              </div>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {event.prizePool}
              </p>
              {(event.firstPrize || event.secondPrize) && (
                <div className="text-[11px] text-amber-300/80 pt-1 border-t border-amber-500/20 space-y-0.5">
                  {event.firstPrize && <p>1st: {event.firstPrize}</p>}
                  {event.secondPrize && <p>2nd: {event.secondPrize}</p>}
                </div>
              )}
            </div>

            {/* Meta Points */}
            <div className="space-y-3 text-xs text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-brand-secondary shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Date &amp; Schedule</p>
                  <p>{event.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-brand-purple shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Timing</p>
                  <p>{event.startTime} - {event.endTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-error shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Venue</p>
                  <p>{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-brand-success shrink-0" />
                <div>
                  <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Participant Format</p>
                  <p>
                    {event.participantType === 'TEAM'
                      ? `Team (${event.minTeamSize}-${event.maxTeamSize} Members)`
                      : 'Individual Participation'}
                  </p>
                </div>
              </div>
            </div>

            {/* Capacity Meter */}
            <div className="pt-3 border-t border-dark-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-dark-muted">Capacity Status</span>
                <span className="font-mono font-bold text-brand-purple">
                  {registeredCount} / {capacity}
                </span>
              </div>
              <div className="w-full bg-dark-elevated h-2 rounded-full overflow-hidden">
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
              <p className="text-[11px] text-dark-muted">
                {isFull ? 'Capacity reached. Online entries closed.' : `${capacity - registeredCount} slots remaining.`}
              </p>
            </div>

            {/* CTA in Sidebar */}
            <div className="pt-2">
              {userRegistration ? (
                <Link
                  to={`/pass/${userRegistration.registrationId || userRegistration.id}`}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Already Registered — View Pass</span>
                </Link>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-xs font-bold text-dark-muted bg-dark-elevated border border-dark-border cursor-not-allowed opacity-75"
                >
                  Registration Full
                </button>
              ) : isAuthenticated ? (
                <Link
                  to={`/register?event=${event.id}`}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Proceed to Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign in to Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
