import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, RefreshCw, CheckCircle2, XCircle,
  Clock, AlertCircle, Eye, Download, X, ExternalLink, Ticket,
  Building, Mail, Phone, Hash, ShieldCheck, UserCheck, Check,
  QrCode, Calendar, MapPin
} from 'lucide-react';
import {
  adminFetchRegistrations,
  adminUpdateRegistrationStatus,
  adminFetchEvents,
  fetchPassById,
  adminCheckInParticipant
} from '../services/api';
import BackButton from '../components/BackButton';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');

  // Detail Modal
  const [selectedReg, setSelectedReg] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Gate Check-in Portal State
  const [checkInId, setCheckInId] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInVerifiedReg, setCheckInVerifiedReg] = useState(null);
  const [checkInMsg, setCheckInMsg] = useState(null);
  const [checkInError, setCheckInError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [regRes, evRes] = await Promise.all([
        adminFetchRegistrations({
          search: search || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          eventId: eventFilter !== 'ALL' ? eventFilter : undefined,
          limit: 100,
        }),
        adminFetchEvents()
      ]);

      if (regRes.data?.success) {
        setRegistrations(regRes.data.data || []);
      }
      if (evRes.data?.success) {
        setEvents(evRes.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, eventFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Quick verify participant from ID
  const handleVerifyLookup = async (e) => {
    if (e) e.preventDefault();
    if (!checkInId.trim()) return;

    try {
      setCheckInLoading(true);
      setCheckInError(null);
      setCheckInMsg(null);
      setCheckInVerifiedReg(null);

      const res = await fetchPassById(checkInId.trim());
      if (res.data?.success && res.data.data) {
        setCheckInVerifiedReg(res.data.data);
      } else {
        setCheckInError('Participant pass not found. Please verify the Registration ID or QR code.');
      }
    } catch (err) {
      setCheckInError(err.response?.data?.message || 'Participant not found. Please check Registration ID.');
    } finally {
      setCheckInLoading(false);
    }
  };

  // Check in participant
  const handleCheckIn = async (regToUse) => {
    const regIdToSubmit = regToUse?.registrationId || regToUse?.id || checkInId.trim();
    if (!regIdToSubmit) return;

    try {
      setCheckInLoading(true);
      setCheckInError(null);
      const res = await adminCheckInParticipant(regIdToSubmit);

      if (res.data?.success) {
        const updated = res.data.data;
        setCheckInVerifiedReg(updated);
        setCheckInMsg({
          type: res.data.alreadyCheckedIn ? 'info' : 'success',
          text: res.data.message || `Participant checked in successfully!`
        });

        // Update list in real time
        setRegistrations((prev) =>
          prev.map((r) =>
            (r.id === updated.id || r.registrationId === updated.registrationId)
              ? { ...r, ...updated, checkedIn: true, status: 'CHECKED_IN' }
              : r
          )
        );
      } else {
        setCheckInError(res.data?.message || 'Check-in failed.');
      }
    } catch (err) {
      setCheckInError(err.response?.data?.message || 'Failed to check in participant.');
    } finally {
      setCheckInLoading(false);
    }
  };

  const resetCheckInPortal = () => {
    setCheckInId('');
    setCheckInVerifiedReg(null);
    setCheckInMsg(null);
    setCheckInError(null);
  };

  const handleStatusChange = async (regId, newStatus) => {
    try {
      setUpdatingId(regId);
      await adminUpdateRegistrationStatus(regId, newStatus);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: newStatus } : r))
      );
      if (selectedReg && selectedReg.id === regId) {
        setSelectedReg((prev) => ({ ...prev, status: newStatus }));
      }
      setSuccessMsg(`Status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update registration status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      'Registration ID',
      'Event',
      'Category',
      'Participant Name',
      'Email',
      'Phone',
      'College',
      'Department',
      'Year',
      'Status',
      'Checked In',
      'Checked In At',
      'Team Name',
      'Date'
    ];

    const rows = registrations.map((r) => [
      `"${r.registrationId || r.registrationNo || r.id}"`,
      `"${r.event?.title || 'Unknown'}"`,
      `"${r.event?.category || 'Unknown'}"`,
      `"${r.fullName || r.participantName || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.college || r.collegeName || ''}"`,
      `"${r.department || ''}"`,
      `"${r.year || ''}"`,
      `"${r.status}"`,
      `"${r.checkedIn ? 'YES' : 'NO'}"`,
      `"${r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : 'N/A'}"`,
      `"${r.teamName || 'N/A'}"`,
      `"${new Date(r.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `colorido_2k26_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status, checkedIn) => {
    if (checkedIn || status === 'CHECKED_IN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <UserCheck className="w-3 h-3" /> CHECKED IN
        </span>
      );
    }
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-palette-blue/20 text-palette-blue border border-palette-blue/40">
            <CheckCircle2 className="w-3 h-3" /> CONFIRMED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-palette-orange/20 text-palette-orange border border-palette-orange/40">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-palette-concrete/20 text-palette-concrete border border-palette-concrete/40">
            <XCircle className="w-3 h-3" /> CANCELLED
          </span>
        );
      default:
        return <span className="text-[10px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-5 sm:p-6 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallback="/admin/dashboard" label="Dashboard" />
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-palette-blue" />
              <h1 className="text-xl sm:text-2xl font-display font-black text-dark-text dark:text-dark-text light:text-light-text">
                Festival Registrations &amp; Passes
              </h1>
            </div>
          </div>
          <p className="text-xs text-dark-muted mt-1">
            Real-time participant rosters, mobile check-in terminal, and pass validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={registrations.length === 0}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary hover:text-dark-text transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary hover:text-dark-text transition-colors"
            title="Reload Roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOBILE ADMIN CHECK-IN PORTAL / GATE SCANNER FLOW */}
      <div className="bg-gradient-to-br from-palette-midnight via-palette-midnight to-palette-blue/20 p-5 sm:p-6 rounded-2xl border-2 border-palette-blue/40 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-palette-blue/20 border border-palette-blue/50 flex items-center justify-center text-palette-blue shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Mobile Check-In &amp; Gate Verification Portal
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-palette-orange text-white">
                  Fast Track
                </span>
              </h2>
              <p className="text-xs text-palette-clouds/70">
                Scan or enter Registration ID to verify participant and mark attendance on gate entry.
              </p>
            </div>
          </div>

          {checkInVerifiedReg && (
            <button
              onClick={resetCheckInPortal}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-palette-clouds border border-white/20 transition-colors"
            >
              Clear / Next Participant
            </button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerifyLookup} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <QrCode className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-palette-clouds/60" />
            <input
              type="text"
              value={checkInId}
              onChange={(e) => setCheckInId(e.target.value)}
              placeholder="Enter Registration ID (e.g. COL26-XXXXX or paste Pass Code)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-palette-midnight/90 border border-palette-blue/50 text-white placeholder:text-palette-clouds/50 focus:outline-none focus:border-palette-blue font-mono uppercase"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={checkInLoading || !checkInId.trim()}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-palette-blue hover:bg-palette-blue/90 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              {checkInLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Verify ID</span>
            </button>

            <button
              type="button"
              onClick={() => handleCheckIn({ registrationId: checkInId.trim() })}
              disabled={checkInLoading || !checkInId.trim()}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-palette-orange hover:bg-palette-orange/90 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Direct Check-In</span>
            </button>
          </div>
        </form>

        {/* Error message */}
        {checkInError && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{checkInError}</span>
          </div>
        )}

        {/* Success / Info message */}
        {checkInMsg && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            checkInMsg.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-palette-blue/20 border-palette-blue/40 text-palette-clouds'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-semibold">{checkInMsg.text}</span>
          </div>
        )}

        {/* Verified Participant Card */}
        {checkInVerifiedReg && (
          <div className="p-4 sm:p-5 rounded-xl bg-palette-midnight/80 border border-palette-blue/30 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-palette-clouds/60">
                  Registration Verified
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  {checkInVerifiedReg.registrationId || checkInVerifiedReg.registrationNo || checkInVerifiedReg.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(checkInVerifiedReg.status, checkInVerifiedReg.checkedIn)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[11px] text-palette-clouds/60 block">Participant Name:</span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {checkInVerifiedReg.fullName || checkInVerifiedReg.participantName}
                </span>
                <span className="text-[11px] text-palette-clouds/80 font-mono mt-0.5 block">
                  {checkInVerifiedReg.email}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[11px] text-palette-clouds/60 block">Event &amp; Category:</span>
                <span className="text-sm font-bold text-palette-orange block mt-0.5">
                  {checkInVerifiedReg.event?.title || 'Unknown Event'}
                </span>
                <span className="text-[11px] text-palette-clouds/80 block mt-0.5">
                  Category: {checkInVerifiedReg.event?.category || 'General'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[11px] text-palette-clouds/60 block">College / Department:</span>
                <span className="text-xs font-semibold text-white block mt-0.5">
                  {checkInVerifiedReg.college || checkInVerifiedReg.collegeName || 'N/A'}
                </span>
                <span className="text-[11px] text-palette-clouds/80 block mt-0.5">
                  {checkInVerifiedReg.department} • Year {checkInVerifiedReg.year}
                </span>
              </div>
            </div>

            {/* Team details if present */}
            {checkInVerifiedReg.teamName && (
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[11px] text-palette-clouds/60 block">Team:</span>
                <span className="text-xs font-bold text-palette-blue">
                  {checkInVerifiedReg.teamName}
                </span>
              </div>
            )}

            {/* Check-In Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-palette-clouds/70">
                {checkInVerifiedReg.checkedIn ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Entry Approved • Checked in at{' '}
                    {checkInVerifiedReg.checkedInAt
                      ? new Date(checkInVerifiedReg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Earlier today'}
                  </span>
                ) : (
                  <span>Ready for gate admission. Confirm physical presence before marking.</span>
                )}
              </div>

              {!checkInVerifiedReg.checkedIn && (
                <button
                  type="button"
                  onClick={() => handleCheckIn(checkInVerifiedReg)}
                  disabled={checkInLoading || checkInVerifiedReg.status === 'REJECTED' || checkInVerifiedReg.status === 'CANCELLED'}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verify &amp; Mark as Checked In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-4 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by participant name, reg ID, email, college..."
            className="w-full pl-10 pr-20 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-palette-blue"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-[10px] font-bold bg-palette-blue text-white hover:bg-palette-blue/90"
          >
            Search
          </button>
        </form>

        {/* Filter by Event */}
        <div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-palette-blue"
          >
            <option value="ALL">All Events ({events.length})</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.category})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-palette-blue"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CHECKED_IN">CHECKED_IN</option>
            <option value="PENDING">PENDING</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Roster Section: Mobile Cards (< sm) & Desktop Table (>= sm) */}
      {loading ? (
        <LoadingSkeleton type="table" count={6} />
      ) : registrations.length === 0 ? (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-12 text-center rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
          <Users className="w-10 h-10 mx-auto text-dark-muted mb-3" />
          <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
            No registrations found
          </h3>
          <p className="text-xs text-dark-muted mt-1">
            No participants match your search criteria.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE CARDS VIEW (Visible only on mobile screens < 640px) */}
          <div className="block sm:hidden space-y-3">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-4 rounded-xl border border-dark-border dark:border-dark-border light:border-light-border space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-palette-blue block">
                      {reg.registrationId || reg.registrationNo}
                    </span>
                    <h3 className="font-bold text-sm text-dark-text dark:text-dark-text light:text-light-text mt-0.5">
                      {reg.fullName || reg.participantName}
                    </h3>
                  </div>
                  <div>
                    {getStatusBadge(reg.status, reg.checkedIn)}
                  </div>
                </div>

                <div className="text-xs space-y-1 text-dark-muted">
                  <div className="flex items-center gap-1.5 text-dark-text-secondary">
                    <span className="font-semibold text-palette-orange">{reg.event?.title || 'Unknown Event'}</span>
                    <span>• {reg.event?.category}</span>
                  </div>
                  <div>{reg.college || reg.collegeName} ({reg.department || reg.year || 'N/A'})</div>
                  <div className="font-mono text-[11px]">{reg.phone} • {reg.email}</div>
                  {reg.teamName && (
                    <div className="text-palette-blue font-semibold">Team: {reg.teamName}</div>
                  )}
                  {reg.checkedInAt && (
                    <div className="text-emerald-400 text-[11px]">
                      Checked In: {new Date(reg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-dark-border dark:border-dark-border light:border-light-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedReg(reg)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text text-center hover:text-palette-blue"
                  >
                    View Details
                  </button>

                  {!reg.checkedIn && reg.status !== 'REJECTED' && reg.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCheckIn(reg)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Check In</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW (Visible on sm and up) */}
          <div className="hidden sm:block bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary font-semibold uppercase tracking-wider text-[11px] border-b border-dark-border">
                  <tr>
                    <th className="py-3 px-4">Reg ID</th>
                    <th className="py-3 px-3">Participant &amp; College</th>
                    <th className="py-3 px-3">Event</th>
                    <th className="py-3 px-3">Team</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border dark:divide-dark-border light:divide-light-border">
                  {registrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover:bg-dark-elevated/50 dark:hover:bg-dark-elevated/50 light:hover:bg-slate-50 transition-colors"
                    >
                      {/* Reg No */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-palette-blue">
                            {reg.registrationId || reg.registrationNo}
                          </span>
                          {reg.checkedIn ? (
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Gate Entered
                            </span>
                          ) : (
                            <span className="text-[10px] text-dark-muted font-mono">
                              Pass Valid
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Participant & College */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-dark-text dark:text-dark-text light:text-light-text">
                            {reg.fullName || reg.participantName}
                          </span>
                          <span className="text-[11px] text-dark-muted">
                            {reg.college || reg.collegeName} ({reg.department || reg.year || 'N/A'})
                          </span>
                          <span className="text-[10px] text-dark-muted font-mono">
                            {reg.email} • {reg.phone}
                          </span>
                        </div>
                      </td>

                      {/* Event */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-dark-text dark:text-dark-text light:text-light-text">
                            {reg.event?.title || 'Unknown Event'}
                          </span>
                          <span className="text-[10px] text-dark-muted">
                            {reg.event?.category}
                          </span>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="py-3 px-3">
                        {reg.teamName ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-dark-text-secondary">
                              {reg.teamName}
                            </span>
                            <span className="text-[10px] text-dark-muted">
                              {Array.isArray(reg.teamMembers) ? `${reg.teamMembers.length + 1} members` : 'Team'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-dark-muted">Solo</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getStatusBadge(reg.status, reg.checkedIn)}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-dark-muted text-[11px]">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Tap Quick Check In Button if not yet checked in */}
                          {!reg.checkedIn && reg.status !== 'REJECTED' && reg.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCheckIn(reg)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors"
                              title="Mark as Checked In"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Check In</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-1.5 rounded-lg bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text-secondary hover:text-palette-blue transition-colors"
                            title="View Registration Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Status Dropdown */}
                          <select
                            value={reg.status}
                            disabled={updatingId === reg.id}
                            onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text cursor-pointer focus:outline-none focus:border-palette-blue"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CHECKED_IN">CHECKED_IN</option>
                            <option value="PENDING">PENDING</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Details & Team Roster Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border max-w-xl w-full rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-palette-blue" />
                <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
                  Registration #{selectedReg.registrationId || selectedReg.registrationNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Event & Status Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border">
                <div>
                  <div className="font-bold text-dark-text text-sm">
                    {selectedReg.event?.title}
                  </div>
                  <div className="text-dark-muted text-[11px]">
                    Category: {selectedReg.event?.category}
                  </div>
                </div>
                <div>{getStatusBadge(selectedReg.status, selectedReg.checkedIn)}</div>
              </div>

              {/* Primary Participant Information */}
              <div className="p-4 rounded-xl border border-dark-border space-y-2">
                <h4 className="font-bold text-dark-text-secondary uppercase tracking-wider text-[11px]">
                  Primary Registrant / Team Leader
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-dark-muted block">Full Name:</span>
                    <span className="font-semibold text-dark-text">{selectedReg.fullName || selectedReg.participantName}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Department / Year:</span>
                    <span className="font-semibold text-dark-text font-mono">
                      {selectedReg.department || 'N/A'} {selectedReg.year ? `• Year ${selectedReg.year}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Email:</span>
                    <a href={`mailto:${selectedReg.email}`} className="font-semibold text-palette-blue hover:underline">
                      {selectedReg.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Phone:</span>
                    <a href={`tel:${selectedReg.phone}`} className="font-semibold text-palette-blue hover:underline">
                      {selectedReg.phone}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-dark-muted block">College / Institution:</span>
                    <span className="font-semibold text-dark-text">{selectedReg.college || selectedReg.collegeName}</span>
                  </div>
                </div>
              </div>

              {/* Check-In Status Detail */}
              <div className="p-4 rounded-xl border border-dark-border bg-dark-elevated/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-dark-muted block">Gate Check-In Status</span>
                  {selectedReg.checkedIn ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" /> Checked in at{' '}
                      {selectedReg.checkedInAt ? new Date(selectedReg.checkedInAt).toLocaleString() : 'Today'}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-palette-orange mt-0.5 block">
                      Not yet checked in at venue
                    </span>
                  )}
                </div>

                {!selectedReg.checkedIn && selectedReg.status !== 'REJECTED' && selectedReg.status !== 'CANCELLED' && (
                  <button
                    onClick={() => {
                      handleCheckIn(selectedReg);
                      setSelectedReg(prev => ({ ...prev, checkedIn: true, status: 'CHECKED_IN', checkedInAt: new Date() }));
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Check In Now</span>
                  </button>
                )}
              </div>

              {/* Team Information if Team Event */}
              {selectedReg.teamName && (
                <div className="p-4 rounded-xl border border-dark-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-dark-text-secondary uppercase tracking-wider text-[11px]">
                      Team Name: {selectedReg.teamName}
                    </h4>
                  </div>
                  {Array.isArray(selectedReg.teamMembers) && selectedReg.teamMembers.length > 0 ? (
                    <div className="space-y-2">
                      {selectedReg.teamMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-dark-bg border border-dark-border grid grid-cols-2 gap-1 text-[11px]"
                        >
                          <div>
                            <span className="text-dark-muted">Member #{idx + 2}: </span>
                            <span className="font-bold text-dark-text">{member.name}</span>
                          </div>
                          <div>
                            <span className="text-dark-muted">Roll: </span>
                            <span className="font-mono text-dark-text">{member.rollNumber || member.roll || 'N/A'}</span>
                          </div>
                          <div className="text-dark-muted truncate">{member.email}</div>
                          <div className="text-dark-muted">{member.phone}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-dark-muted italic">No additional team members listed.</p>
                  )}
                </div>
              )}

              {/* Pass ID and Verification Link */}
              <div className="p-4 rounded-xl bg-palette-blue/10 border border-palette-blue/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-palette-blue">
                    Festival Pass ID
                  </div>
                  <div className="font-mono text-xs font-bold text-dark-text">
                    {selectedReg.registrationId || selectedReg.registrationNo}
                  </div>
                </div>
                <a
                  href={`/pass/${selectedReg.registrationId || selectedReg.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-palette-blue text-white hover:bg-palette-blue/90 transition-colors"
                >
                  <span>Open Pass</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-dark-border">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-elevated text-dark-text hover:text-white border border-dark-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
