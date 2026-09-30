import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Ticket, User, Mail, Phone, Building, BookOpen, Users,
  AlertCircle, CheckCircle, ArrowRight, Plus, Trash2, Shield,
  Crown, Edit3, ArrowLeft, Calendar, MapPin, Award
} from 'lucide-react';
import { fetchEvents, registerForEvent } from '../services/api';
import DigitalPass from '../components/DigitalPass';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';
import EventSelectDropdown from '../components/EventSelectDropdown';

export default function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedEventId = searchParams.get('event');
  const { user, isAuthenticated } = useAuth();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Form Step: 'form' | 'summary' | 'success'
  const [step, setStep] = useState('form');

  // Form State
  const [formData, setFormData] = useState({
    eventId: preselectedEventId || '',
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || 'R V R & J C College of Engineering',
    department: user?.department || 'Computer Science & Engineering',
    year: user?.year || '3rd Year',
    participantType: 'INDIVIDUAL',
    teamName: '',
  });

  // Dynamic squad members for GROUP / TEAM
  const [members, setMembers] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [existingRegId, setExistingRegId] = useState(null);
  const [successPass, setSuccessPass] = useState(null);

  // Sync user details when auth state updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: user.email || prev.email,
        phone: prev.phone || user.phone || '',
        college: prev.college || user.college || 'R V R & J C College of Engineering',
        department: prev.department || user.department || 'Computer Science & Engineering',
        year: prev.year || user.year || '3rd Year'
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
              const regType = initial.registrationType || initial.participantType || 'INDIVIDUAL';
              setFormData(prev => ({
                ...prev,
                eventId: initial.id,
                participantType: regType
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

  // Determine effective registration type
  const effectiveType = (
    selectedEvent?.registrationType ||
    selectedEvent?.participantType ||
    formData.participantType ||
    'INDIVIDUAL'
  ).toUpperCase();

  const isGroupOrTeam = effectiveType === 'GROUP' || effectiveType === 'TEAM';
  const minParticipants = selectedEvent?.minTeamSize || (effectiveType === 'TEAM' ? 5 : (effectiveType === 'GROUP' ? 2 : 1));
  const maxParticipants = selectedEvent?.maxTeamSize || (effectiveType === 'TEAM' ? 16 : (effectiveType === 'GROUP' ? 8 : 1));
  const currentTotal = 1 + members.length; // Captain + members

  // Add person to squad
  const handleAddMember = () => {
    if (currentTotal >= maxParticipants) {
      setErrorMsg(`Maximum allowed participants for this event is ${maxParticipants}.`);
      return;
    }
    setErrorMsg(null);
    setMembers(prev => [...prev, { name: '', email: '', phone: '' }]);
  };

  // Remove person from squad
  const handleRemoveMember = (idx) => {
    setMembers(prev => prev.filter((_, i) => i !== idx));
  };

  // Update squad member field
  const handleMemberChange = (idx, field, value) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Validate form and proceed to Summary step
  const handleProceedToSummary = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setExistingRegId(null);

    // If guest, prompt for login first
    if (!isAuthenticated) {
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (!formData.eventId || !formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.college.trim()) {
      setErrorMsg('Please complete all required primary registrant fields.');
      return;
    }

    if (isGroupOrTeam) {
      if (!formData.teamName.trim()) {
        setErrorMsg('Please provide a Team / Group Name.');
        return;
      }

      if (currentTotal < minParticipants) {
        setErrorMsg(`Minimum required participants for ${selectedEvent?.title || 'this event'} is ${minParticipants}. Please click "Add Person" to add more members.`);
        return;
      }

      if (currentTotal > maxParticipants) {
        setErrorMsg(`Maximum allowed participants is ${maxParticipants}. Please remove excess members.`);
        return;
      }

      // Check for empty member names
      for (let i = 0; i < members.length; i++) {
        if (!members[i].name || !members[i].name.trim()) {
          setErrorMsg(`Please enter the name for Participant #${i + 2}.`);
          return;
        }
      }

      // Check for duplicate names
      const allNames = [formData.fullName.trim().toLowerCase(), ...members.map(m => m.name.trim().toLowerCase())];
      const uniqueNames = new Set(allNames);
      if (uniqueNames.size !== allNames.length) {
        setErrorMsg('Duplicate participant names detected within your team. Each participant must have a distinct name.');
        return;
      }
    }

    // Move to summary view
    setStep('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final submission from Summary step
  const handleFinalSubmit = async () => {
    if (submitting) return; // Prevent double click
    setErrorMsg(null);
    setExistingRegId(null);

    try {
      setSubmitting(true);
      const payload = {
        eventId: formData.eventId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        department: formData.department.trim(),
        year: formData.year.trim(),
        participantType: effectiveType,
        registrationType: effectiveType,
        teamName: isGroupOrTeam ? formData.teamName.trim() : null,
        participants: members.map(m => ({
          name: m.name.trim(),
          email: m.email ? m.email.trim() : null,
          phone: m.phone ? m.phone.trim() : null
        }))
      };

      const res = await registerForEvent(payload);
      if (res.data?.success) {
        setSuccessPass(res.data.data);
        setStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(res.data?.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      const data = err.response?.data;
      setErrorMsg(data?.message || err.message || 'Registration failed. Please check your data and retry.');
      if (data?.existingRegistrationId) {
        setExistingRegId(data.existingRegistrationId);
      }
      setStep('form'); // Keep user on form with entered data preserved
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* STEP 3: SUCCESSFUL REGISTRATION PASS */}
      {step === 'success' && successPass ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text">
              Registration Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-dark-text-secondary max-w-md mx-auto">
              Your official digital entry pass for {successPass.event?.title || 'the event'} has been issued. Save or print this pass for venue verification.
            </p>
          </div>

          <DigitalPass pass={successPass} />

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/my-registrations"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover transition-all shadow-md shadow-brand-purple/20"
            >
              View My Registrations
            </Link>
            <button
              onClick={() => {
                setSuccessPass(null);
                setStep('form');
                setMembers([]);
                setFormData(prev => ({ ...prev, teamName: '' }));
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-dark-text bg-dark-elevated border border-dark-border hover:bg-dark-elevated/70"
            >
              Register for Another Event
            </button>
          </div>
        </div>
      ) : step === 'summary' ? (
        /* STEP 2: PRE-SUBMISSION SUMMARY VIEW */
        <div className="space-y-6 sm:space-y-8 animate-in fade-in">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="inline-flex items-center gap-2 text-xs font-bold text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Edit Form</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Step 2 of 2: Review &amp; Confirm
            </span>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/15 text-brand-purple">
              <Shield className="w-3.5 h-3.5" />
              <span>Review Registration Summary</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-dark-text">
              Verify Your Details
            </h1>
            <p className="text-xs sm:text-sm text-dark-text-secondary max-w-lg mx-auto">
              Please double-check your event selection, captain info, and team roster before finalizing your registration.
            </p>
          </div>

          {/* Error banner if submission failed */}
          {errorMsg && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>{errorMsg}</p>
                {existingRegId && (
                  <Link to={`/registrations/pass/${existingRegId}`} className="underline font-bold text-white block mt-1">
                    View Existing Registration Pass &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface border border-dark-border shadow-2xl space-y-6 text-xs text-dark-text">
            {/* Event Header in Summary */}
            <div className="p-4 rounded-2xl bg-dark-elevated border border-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-palette-orange block">
                  {selectedEvent?.category || 'EVENT'} CHAMPIONSHIP
                </span>
                <h3 className="text-lg font-black text-dark-text">{selectedEvent?.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-dark-muted text-[11px] mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-purple" />
                    <span>{selectedEvent?.date || 'October 15-17, 2026'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-purple" />
                    <span>{selectedEvent?.venue || 'Campus Venue'}</span>
                  </span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-brand-purple/20 text-brand-purple font-bold text-xs border border-brand-purple/30 self-start sm:self-auto">
                {effectiveType}
              </div>
            </div>

            {/* Team / Group Name if applicable */}
            {isGroupOrTeam && (
              <div className="p-4 rounded-2xl bg-dark-elevated/40 border border-dark-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-dark-muted block">Team / Group Name</span>
                  <span className="text-base font-black text-palette-orange">{formData.teamName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-dark-muted block">Squad Size</span>
                  <span className="font-bold text-dark-text">{currentTotal} Participants</span>
                </div>
              </div>
            )}

            {/* Captain Details */}
            <div className="p-4 rounded-2xl border border-dark-border space-y-2">
              <div className="flex items-center justify-between border-b border-dark-border pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-palette-orange flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Captain / Primary Contact</span>
                </span>
                <span className="text-[11px] font-mono text-dark-muted">{formData.phone}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-dark-muted block">Name:</span>
                  <span className="font-bold text-dark-text">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-dark-muted block">Email:</span>
                  <span className="font-bold text-brand-purple">{formData.email}</span>
                </div>
                <div>
                  <span className="text-dark-muted block">College:</span>
                  <span className="font-semibold text-dark-text">{formData.college}</span>
                </div>
                <div>
                  <span className="text-dark-muted block">Department &amp; Year:</span>
                  <span className="font-semibold text-dark-text">{formData.department} • {formData.year}</span>
                </div>
              </div>
            </div>

            {/* Roster of Additional Participants */}
            {isGroupOrTeam && members.length > 0 && (
              <div className="p-4 rounded-2xl border border-dark-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-dark-text-secondary">
                    Registered Squad Members ({members.length})
                  </span>
                  <span className="text-[10px] text-dark-muted">Total: {currentTotal} Members</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-dark-elevated border border-dark-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-dark-surface text-[10px] font-bold flex items-center justify-center text-dark-muted">
                          {idx + 2}
                        </span>
                        <div>
                          <p className="font-bold text-dark-text">{m.name}</p>
                          {m.email && <p className="text-[10px] text-dark-muted font-mono">{m.email}</p>}
                        </div>
                      </div>
                      {m.phone && <span className="text-[10px] text-dark-muted font-mono">{m.phone}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmation Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl text-xs font-bold text-dark-text bg-dark-elevated hover:bg-dark-elevated/70 border border-dark-border transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Form Data</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="w-full sm:flex-2 py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-brand-purple/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Issuing Registration Pass...</span>
                  </div>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Confirm &amp; Issue Entry Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 1: FORM INPUTS */
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <BackButton fallback={formData.eventId ? `/events/${formData.eventId}` : '/events'} label={formData.eventId ? "Back to Event" : "Back to Events"} />
            <span className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary">
              Step 1 of 2: Entry Details
            </span>
          </div>

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/15 text-brand-purple dark:text-brand-accent">
              <Ticket className="w-3.5 h-3.5" />
              <span>COLORIDO 2K26 Registration</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
              Event Registration Portal
            </h1>
            <p className="text-xs sm:text-sm text-dark-text-secondary max-w-xl mx-auto leading-relaxed">
              Register to participate in the flagship competitions of R V R &amp; J C College of Engineering. Instant digital pass issued with official verification code upon confirmation.
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
                    <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text">Sign In to Your Account</p>
                    <p className="text-dark-text-secondary">Sign in with your verified email to pre-fill your information and save festival passes to your account.</p>
                  </div>
                </div>
                <Link
                  to={`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shrink-0 shadow-md shadow-brand-purple/20 transition-all"
                >
                  Sign In / Register
                </Link>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-error/15 border border-brand-error/30 text-brand-error text-xs font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>{errorMsg}</p>
                  {existingRegId && (
                    <Link to={`/registrations/pass/${existingRegId}`} className="underline font-bold text-white block mt-1">
                      View Existing Registration Pass &rarr;
                    </Link>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleProceedToSummary} className="space-y-6">
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
                      participantType: ev ? (ev.registrationType || ev.participantType) : 'INDIVIDUAL'
                    }));
                  }}
                />

                {/* Event Registration Type Indicator */}
                {selectedEvent && (
                  <div className="p-3 rounded-xl bg-dark-elevated border border-dark-border flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-purple uppercase">Format:</span>
                      <span className="font-semibold text-dark-text">{effectiveType} EVENT</span>
                    </div>
                    {isGroupOrTeam && (
                      <div className="text-[11px] text-dark-muted">
                        Required Squad: <strong className="text-palette-orange">{minParticipants} to {maxParticipants}</strong> members
                      </div>
                    )}
                    <div className="text-[11px] text-dark-muted">
                      Slots remaining: <strong className="text-emerald-400">{Math.max(0, (selectedEvent.capacity || 50) - (selectedEvent.registeredCount || 0))}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Contact / Captain Details */}
              <div className="space-y-4 pt-2 border-t border-dark-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-dark-text-secondary flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{isGroupOrTeam ? 'Captain / Team Leader Details' : 'Participant Information'} *</span>
                  </label>
                  {isGroupOrTeam && (
                    <span className="text-[10px] text-palette-orange font-bold uppercase tracking-wider">
                      Captain is Squad Member #1
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-dark-text-secondary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Siva Teja"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-dark-text-secondary">
                      Captain Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="captain@college.ac.in"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-dark-text-secondary">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98480 12345"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-dark-text-secondary">
                      College / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      placeholder="R V R & J C College of Engineering"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-dark-text-secondary">
                      Department / Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="CSE - 3rd Year"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>
              </div>

              {/* GROUP / TEAM SQUAD BUILDER SECTION */}
              {isGroupOrTeam && (
                <div className="p-5 rounded-2xl bg-dark-elevated/40 border border-dark-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-purple" />
                      <span className="text-xs font-bold text-dark-text">
                        Squad Configuration ({minParticipants}-{maxParticipants} Members)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-dark-muted">Current Squad:</span>
                      <span className={`px-2 py-0.5 rounded-lg font-bold font-mono ${
                        currentTotal < minParticipants
                          ? 'bg-amber-500/20 text-amber-400'
                          : currentTotal > maxParticipants
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {currentTotal} / {maxParticipants}
                      </span>
                    </div>
                  </div>

                  {/* Team / Group Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-dark-text-secondary">
                      Team / Group Name <span className="text-brand-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      placeholder="e.g. Royal Strikers or AlgoKnights"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  {/* Captain Indicator Card */}
                  <div className="p-3 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-palette-orange/20 text-palette-orange flex items-center justify-center font-bold text-[10px]">
                        1
                      </span>
                      <div>
                        <span className="font-bold text-dark-text">{formData.fullName || 'Captain Name'}</span>
                        <span className="text-[10px] text-palette-orange ml-2 font-bold uppercase">(Captain)</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-dark-muted font-mono">{formData.email}</span>
                  </div>

                  {/* Additional Squad Members Dynamic Rows */}
                  {members.map((member, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-dark-surface border border-dark-border space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-dark-text flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-dark-elevated text-dark-muted text-[10px] font-bold flex items-center justify-center">
                            {idx + 2}
                          </span>
                          <span>Squad Member #{idx + 2}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="p-1 rounded-lg text-red-400 hover:bg-red-500/15 transition-colors"
                          title="Remove person"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1 sm:col-span-1">
                          <label className="text-[11px] text-dark-muted font-semibold">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            placeholder="Player name"
                            className="w-full px-3 py-1.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-1">
                          <label className="text-[11px] text-dark-muted font-semibold">Email (Optional)</label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                            placeholder="player@example.com"
                            className="w-full px-3 py-1.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-1">
                          <label className="text-[11px] text-dark-muted font-semibold">Phone (Optional)</label>
                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                            placeholder="+91 Phone"
                            className="w-full px-3 py-1.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-dark-text focus:outline-none focus:border-brand-purple"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Person Button */}
                  {currentTotal < maxParticipants && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 border border-brand-purple/30 border-dashed transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Person ({currentTotal}/{maxParticipants})</span>
                    </button>
                  )}
                </div>
              )}

              {/* Proceed to Review Summary Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl text-sm font-black text-white bg-brand-purple hover:bg-brand-purple-hover shadow-lg shadow-brand-purple/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Review Registration Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
