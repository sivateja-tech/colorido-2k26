import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, RefreshCw, CheckCircle2, XCircle,
  Clock, AlertCircle, Eye, Download, X, ExternalLink, Ticket,
  Building, Mail, Phone, Hash, ShieldCheck
} from 'lucide-react';
import {
  adminFetchRegistrations,
  adminUpdateRegistrationStatus,
  adminFetchEvents
} from '../services/api';
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

      if (regRes.data.success) {
        setRegistrations(regRes.data.data || []);
      }
      if (evRes.data.success) {
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
      'Registration No',
      'Event',
      'Category',
      'Participant Name',
      'Email',
      'Phone',
      'College',
      'Roll Number',
      'Status',
      'Pass ID',
      'Team Name',
      'Date'
    ];

    const rows = registrations.map((r) => [
      `"${r.registrationNo}"`,
      `"${r.event?.title || 'Unknown'}"`,
      `"${r.event?.category || 'Unknown'}"`,
      `"${r.participantName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.collegeName}"`,
      `"${r.rollNumber}"`,
      `"${r.status}"`,
      `"${r.passId}"`,
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> CONFIRMED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-6 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-purple" />
            <h1 className="text-xl sm:text-2xl font-display font-black text-dark-text dark:text-dark-text light:text-light-text">
              Festival Registrations &amp; Passes
            </h1>
          </div>
          <p className="text-xs text-dark-muted mt-1">
            Real-time participant rosters, pass verification states, and attendance validation.
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
            placeholder="Search by participant name, reg #, email, roll #..."
            className="w-full pl-10 pr-20 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-[10px] font-bold bg-brand-purple text-white hover:bg-brand-purple-hover"
          >
            Search
          </button>
        </form>

        {/* Filter by Event */}
        <div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
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
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PENDING">PENDING</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
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
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary font-semibold uppercase tracking-wider text-[11px] border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">Reg No / Pass</th>
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
                    {/* Reg No & Pass */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-brand-purple">
                          {reg.registrationNo}
                        </span>
                        <span className="text-[10px] text-dark-muted font-mono truncate max-w-[120px]">
                          {reg.passId?.substring(0, 10)}...
                        </span>
                      </div>
                    </td>

                    {/* Participant & College */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark-text dark:text-dark-text light:text-light-text">
                          {reg.participantName}
                        </span>
                        <span className="text-[11px] text-dark-muted">
                          {reg.collegeName} ({reg.rollNumber})
                        </span>
                        <span className="text-[10px] text-dark-muted font-mono">
                          {reg.email}
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
                      {getStatusBadge(reg.status)}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-dark-muted text-[11px]">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="p-1.5 rounded-lg bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text-secondary hover:text-brand-purple transition-colors"
                          title="View Registration Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Status Dropdown */}
                        <select
                          value={reg.status}
                          disabled={updatingId === reg.id}
                          onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text cursor-pointer focus:outline-none focus:border-brand-purple"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
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
      )}

      {/* Details & Team Roster Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border max-w-xl w-full rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-purple" />
                <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
                  Registration #{selectedReg.registrationNo}
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
                <div>{getStatusBadge(selectedReg.status)}</div>
              </div>

              {/* Primary Participant Information */}
              <div className="p-4 rounded-xl border border-dark-border space-y-2">
                <h4 className="font-bold text-dark-text-secondary uppercase tracking-wider text-[11px]">
                  Primary Registrant / Team Leader
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-dark-muted block">Full Name:</span>
                    <span className="font-semibold text-dark-text">{selectedReg.participantName}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Roll Number:</span>
                    <span className="font-semibold text-dark-text font-mono">{selectedReg.rollNumber}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Email:</span>
                    <span className="font-semibold text-dark-text">{selectedReg.email}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Phone:</span>
                    <span className="font-semibold text-dark-text">{selectedReg.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-dark-muted block">College / Institution:</span>
                    <span className="font-semibold text-dark-text">{selectedReg.collegeName}</span>
                  </div>
                </div>
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
                            <span className="font-mono text-dark-text">{member.rollNumber}</span>
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
              <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-brand-purple">
                    Unique Pass ID
                  </div>
                  <div className="font-mono text-xs font-bold text-dark-text">
                    {selectedReg.passId}
                  </div>
                </div>
                <a
                  href={`/pass/${selectedReg.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-purple text-white hover:bg-brand-purple-hover transition-colors"
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
