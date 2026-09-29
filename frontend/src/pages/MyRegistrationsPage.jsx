import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ExternalLink, AlertCircle, RefreshCw, LogIn } from 'lucide-react';
import { fetchMyRegistrations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getStatusBadge, getCategoryBadge } from '../utils/helpers';
import BackButton from '../components/BackButton';

export default function MyRegistrationsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRegistrations = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetchMyRegistrations();
      if (res.data?.success) {
        setRegistrations(res.data.data);
      } else {
        setError(res.data?.message || 'Failed to load registrations');
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.response?.data?.message || 'Unable to retrieve registrations. Please sign in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadRegistrations();
    }
  }, [isAuthenticated, authLoading]);

  // If user is guest, show login prompt
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="flex justify-start">
          <BackButton fallback="/events" label="Back to Events" />
        </div>
        <div className="w-16 h-16 rounded-3xl bg-brand-purple/15 text-brand-purple flex items-center justify-center mx-auto">
          <Ticket className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text">
            My Registrations
          </h1>
          <p className="text-xs sm:text-sm text-dark-text-secondary max-w-md mx-auto">
            Please sign in to your account to view your confirmed registrations, festival passes, and entry QR codes.
          </p>
        </div>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Your Account</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <BackButton fallback="/events" label="Back to Events" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/15 text-brand-purple dark:text-brand-accent">
            <Ticket className="w-3.5 h-3.5" />
            <span>Participant Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight mt-1">
            My Event Registrations
          </h1>
          <p className="text-xs sm:text-sm text-dark-text-secondary mt-1">
            Registered as <span className="font-semibold text-dark-text dark:text-dark-text light:text-light-text">{user?.name}</span> ({user?.email})
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover transition-all shrink-0"
        >
          <span>Browse More Events</span>
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-2xl bg-brand-error/15 border border-brand-error/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-brand-error shrink-0" />
            <p className="text-xs font-semibold text-brand-error">{error}</p>
          </div>
          <button
            onClick={loadRegistrations}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-error text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && registrations.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border space-y-4">
          <Ticket className="w-12 h-12 text-dark-muted mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-dark-text dark:text-dark-text light:text-light-text">
              No Registrations Yet
            </h3>
            <p className="text-xs text-dark-text-secondary max-w-sm mx-auto">
              You haven&apos;t registered for any events yet. Explore sports, cultural, or technical competitions and secure your entry pass!
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple"
          >
            <span>Explore Events Now</span>
          </Link>
        </div>
      )}

      {/* Registrations List (Section 47) */}
      {!loading && !error && registrations.length > 0 && (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const ev = reg.event || {};
            const categoryBadge = getCategoryBadge(ev.category);
            const statusClass = getStatusBadge(reg.status);

            return (
              <div
                key={reg.id}
                className="p-6 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-purple/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                      {reg.registrationId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryBadge.bg}`}>
                      {categoryBadge.label}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusClass}`}>
                      {reg.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text">
                      {ev.title || 'Event'}
                    </h3>
                    <p className="text-xs text-dark-muted">
                      Registered on {new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-dark-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
                      <span>{ev.date || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-error" />
                      <span>{ev.venue || 'Campus Arena'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/events/${ev.slug || ev.id}`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-dark-text bg-dark-elevated hover:bg-dark-highest border border-dark-border transition-all"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/pass/${reg.registrationId}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-sm transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View Pass &amp; QR</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
