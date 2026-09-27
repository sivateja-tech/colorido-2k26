import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Ticket, User, Mail, Phone, Building, BookOpen, Users, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { fetchEvents, registerForEvent } from '../services/api';
import DigitalPass from '../components/DigitalPass';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from '../components/GoogleAuthModal';
import EventSelectDropdown from '../components/EventSelectDropdown';

export default function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedEventId = searchParams.get('event');
  const { user, isAuthenticated } = useAuth();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    eventId: preselectedEventId || '',
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || 'R V R & J C College of Engineering',
    department: 'Computer Science & Engineering',
    year: '3rd Year B.Tech',
    participantType: 'INDIVIDUAL',
    teamName: '',
    teamMembers: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successPass, setSuccessPass] = useState(null);

  // Sync user details when auth state updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: user.email || prev.email,
        college: prev.college || user.college || 'R V R & J C College of Engineering'
      }));
    }
  }, [user]);

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetchEvents({ limit: 100 });
        if (res.data?.success) {
          const list = res.data.data;
          setEvents(list);

          if (!formData.eventId && list.length > 0) {
            const initial = preselectedEventId
              ? list.find(e => e.id === preselectedEventId || e.slug === preselectedEventId)
              : list[0];
            if (initial) {
              setFormData(prev => ({
                ...prev,
                eventId: initial.id,
                participantType: initial.participantType || 'INDIVIDUAL'
              }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load events for registration:', err);
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, [preselectedEventId]);

  const selectedEvent = events.find(e => e.id === formData.eventId);

  const handleEventChange = (e) => {
    const evId = e.target.value;
    const ev = events.find(item => item.id === evId);
    setFormData(prev => ({
      ...prev,
      eventId: evId,
      participantType: ev ? ev.participantType : 'INDIVIDUAL'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Section 76: If guest, prompt for Google Login first
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    if (!formData.eventId || !formData.fullName || !formData.email || !formData.phone || !formData.college) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await registerForEvent(formData);
      if (res.data?.success) {
        setSuccessPass(res.data.data);
      } else {
        setErrorMsg(res.data?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Registration failed. Please check your data and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* If already registered successfully, show digital pass */}
      {successPass ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text">
              Registration Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-dark-text-secondary">
              Your official entry pass for {successPass.event?.title || 'the festival'} has been generated. Save or print this pass for venue verification.
            </p>
          </div>

          <DigitalPass pass={successPass} />

          <div className="flex justify-center gap-4 pt-4">
            <Link
              to="/my-registrations"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover transition-all"
            >
              View My Registrations
            </Link>
            <button
              onClick={() => setSuccessPass(null)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-dark-text bg-dark-elevated border border-dark-border"
            >
              Register for Another Event
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/15 text-brand-purple dark:text-brand-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLORIDO 2K26 Registration</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
              Event Registration Portal
            </h1>
            <p className="text-xs sm:text-sm text-dark-text-secondary max-w-xl mx-auto leading-relaxed">
              Register to participate in the flagship competitions of R V R &amp; J C College of Engineering. Instant digital QR pass issued upon submission.
            </p>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-10 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl space-y-8">
            {/* Notice for guest */}
            {!isAuthenticated && (
              <div className="p-4 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Sign In with Email or Google</p>
                    <p className="text-dark-text-secondary">Sign in with your email to pre-fill your information and save festival passes to your account.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shrink-0 shadow-md shadow-brand-purple/20 transition-all"
                >
                  Sign In / Register
                </button>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-text-secondary">
                    Select Event <span className="text-brand-error">*</span>
                  </label>
                  <span className="text-[11px] text-dark-muted font-medium hidden sm:inline">
                    29 Championships across Sports, Cultural &amp; Technical
                  </span>
                </div>
                <EventSelectDropdown
                  events={events}
                  selectedEventId={formData.eventId}
                  disabled={loadingEvents}
                  onChange={(evId) => {
                    const ev = events.find((item) => item.id === evId);
                    setFormData((prev) => ({
                      ...prev,
                      eventId: evId,
                      participantType: ev ? ev.participantType : 'INDIVIDUAL'
                    }));
                  }}
                />
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-text-secondary">
                    Full Name <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Siva Teja"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-text-secondary">
                    Email Address <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@college.ac.in"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Contact & College Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-text-secondary">
                    Phone Number <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98480 12345"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-text-secondary">
                    College / Institution <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="R V R & J C College of Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-text-secondary">
                    Department / Year <span className="text-brand-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="CSE - 3rd Year"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-xs text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Team fields if applicable */}
              {selectedEvent?.participantType === 'TEAM' && (
                <div className="p-4 rounded-2xl bg-dark-elevated/40 dark:bg-dark-elevated/40 light:bg-light-surface-secondary border border-dark-border space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-purple">
                    <Users className="w-4 h-4" />
                    <span>Team Registration Info ({selectedEvent.minTeamSize || 2}-{selectedEvent.maxTeamSize || 4} Members)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-dark-text-secondary">Team Name</label>
                      <input
                        type="text"
                        value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        placeholder="e.g. Neural Warriors"
                        className="w-full px-4 py-2.5 rounded-xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-dark-text-secondary">Team Member Names &amp; IDs</label>
                      <input
                        type="text"
                        value={formData.teamMembers}
                        onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                        placeholder="e.g. Sai (Y21CS101), Rahul (Y21CS102)"
                        className="w-full px-4 py-2.5 rounded-xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl text-sm font-black text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-brand-purple/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      <span>Confirm Registration &amp; Generate Pass</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setFormData(prev => ({
            ...prev,
            fullName: loggedUser.name || prev.fullName,
            email: loggedUser.email || prev.email,
            college: loggedUser.college || prev.college
          }));
        }}
      />
    </div>
  );
}
