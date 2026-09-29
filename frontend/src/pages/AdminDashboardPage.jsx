import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Trophy, Mail, Calendar, Plus,
  CheckCircle, Clock, Trash2, Search, RefreshCw, AlertCircle
} from 'lucide-react';
import {
  fetchAdminDashboard,
  fetchRegistrations,
  updateRegistrationStatus,
  fetchContactMessages,
  updateContactStatus,
  createEvent,
  deleteEvent
} from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, registrations, events, messages
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regSearch, setRegSearch] = useState('');

  // Messages state
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);

  // New Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'SPORTS',
    type: 'cricket',
    shortDescription: '',
    fullDescription: '',
    rules: '',
    eligibility: '',
    demoDate: 'Day 1 (March 28, 2026)',
    demoTime: '10:00 AM - 02:00 PM',
    venue: 'College Sports Pavilion',
    prizePool: '₹25,000',
    firstPrize: '₹15,000',
    secondPrize: '₹10,000',
    participantType: 'TEAM',
    teamMinSize: 5,
    teamMaxSize: 10,
    capacity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    featured: false
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdminDashboard();
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    try {
      setRegLoading(true);
      const res = await fetchRegistrations({ search: regSearch, limit: 50 });
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setRegLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      setMsgLoading(true);
      const res = await fetchContactMessages({ limit: 50 });
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'registrations') loadRegistrations();
    if (activeTab === 'messages') loadMessages();
  }, [activeTab]);

  const handleStatusUpdate = async (regId, status) => {
    try {
      await updateRegistrationStatus(regId, status);
      loadRegistrations();
      loadDashboard();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleMessageStatus = async (msgId, status) => {
    try {
      await updateContactStatus(msgId, status);
      loadMessages();
      loadDashboard();
    } catch (err) {
      alert('Failed to update inquiry status');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await createEvent(newEvent);
      if (res.data.success) {
        setShowEventModal(false);
        loadDashboard();
        alert('New Event Created Successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also remove associated registrations.')) return;
    try {
      await deleteEvent(eventId);
      loadDashboard();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-white">
            Festival Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management for COLORIDO 2K26 tournaments, passes, and inquiries.
          </p>
        </div>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-dark-border text-slate-200 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-purple" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Events</span>
            <Trophy className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="text-3xl font-black font-display text-white">{metrics.totalEvents || 0}</div>
          <p className="text-[11px] text-slate-400">
            {metrics.sportsEvents || 0} Sports • {metrics.culturalEvents || 0} Cultural • {metrics.technicalEvents || 0} Technical
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Registrations</span>
            <Users className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-3xl font-black font-display text-white">{metrics.totalRegistrations || 0}</div>
          <p className="text-[11px] text-emerald-400">
            {metrics.confirmedRegistrations || 0} Confirmed Passes
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Capacity Utilized</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-display text-amber-400">{metrics.capacityPercent || 0}%</div>
          <p className="text-[11px] text-slate-400">
            Across {metrics.totalCapacity || 0} total festival capacity
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-surface border border-dark-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Inquiries</span>
            <Mail className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black font-display text-white">{metrics.unreadMessages || 0}</div>
          <p className="text-[11px] text-rose-400">
            Pending student inquiries
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-dark-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview &amp; Slot Matrix
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'registrations' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Passes &amp; Registrations
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Event Management
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'messages' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Helpdesk Messages
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Capacity Fill Stats */}
          <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border space-y-4">
            <h3 className="text-lg font-bold text-white font-display">
              Live Tournament Capacity Utilisation
            </h3>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {dashboardData?.eventStats?.map((ev) => {
                const percent = Math.min(100, Math.round((ev.registeredCount / ev.capacity) * 100));
                return (
                  <div key={ev.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[220px]">{ev.title}</span>
                      <span className="font-mono text-brand-purple">{ev.registeredCount} / {ev.capacity} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-purple rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Registrations Feed */}
          <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border space-y-4">
            <h3 className="text-lg font-bold text-white font-display">
              Recent Pass Issuances
            </h3>
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {dashboardData?.recentRegistrations?.map((reg) => (
                <div key={reg.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white font-mono text-[11px] text-amber-400">{reg.registrationId}</div>
                    <div className="font-medium text-slate-200">{reg.fullName}</div>
                    <div className="text-[11px] text-slate-400">{reg.event?.title}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {reg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">All Issued Registrations</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by Pass ID, Name, College..."
                value={regSearch}
                onChange={e => setRegSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-dark-950 border border-dark-border text-xs text-white focus:outline-none focus:border-brand-purple w-full sm:w-64"
              />
              <button
                onClick={loadRegistrations}
                className="p-2 rounded-xl bg-brand-purple text-white text-xs font-bold"
              >
                Search
              </button>
            </div>
          </div>

          {regLoading ? (
            <LoadingSkeleton count={4} type="table" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Pass ID</th>
                    <th className="p-3">Participant</th>
                    <th className="p-3">College</th>
                    <th className="p-3">Event</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-mono font-bold text-amber-400">{reg.registrationId}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{reg.fullName}</div>
                        <div className="text-[10px] text-slate-400">{reg.phone}</div>
                      </td>
                      <td className="p-3 text-slate-300 truncate max-w-[150px]">{reg.college}</td>
                      <td className="p-3 text-slate-200">{reg.event?.title}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reg.status === 'ATTENDED' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={reg.status}
                          onChange={e => handleStatusUpdate(reg.id, e.target.value)}
                          className="px-2 py-1 rounded bg-dark-800 border border-dark-border text-[10px] text-slate-200"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="ATTENDED">ATTENDED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EVENT MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Event Catalog</h3>
            <button
              onClick={() => setShowEventModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-purple-600 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Event</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Event Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Venue</th>
                  <th className="p-3">Prize Pool</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dashboardData?.eventStats?.map(ev => (
                  <tr key={ev.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-semibold text-white">{ev.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.category === 'SPORTS' ? 'text-emerald-400 bg-emerald-500/10' : 'text-brand-purple bg-brand-purple/10'
                      }`}>
                        {ev.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{ev.venue}</td>
                    <td className="p-3 text-amber-400 font-mono">₹20,000+</td>
                    <td className="p-3 font-mono">{ev.registeredCount} / {ev.capacity}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="p-6 rounded-3xl bg-dark-surface border border-dark-border space-y-4">
          <h3 className="text-lg font-bold text-white">Student Inquiries</h3>

          {msgLoading ? (
            <LoadingSkeleton count={3} type="table" />
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{msg.name} ({msg.email})</span>
                    <button
                      onClick={() => handleMessageStatus(msg.id, msg.status === 'UNREAD' ? 'REPLIED' : 'UNREAD')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.status === 'UNREAD' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {msg.status}
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-brand-cyan">{msg.subject}</p>
                  <p className="text-xs text-slate-300 whitespace-pre-line">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Festival Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  >
                    <option value="SPORTS">SPORTS</option>
                    <option value="CULTURAL">CULTURAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Type / Sport</label>
                  <input
                    type="text"
                    required
                    value={newEvent.type}
                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={newEvent.shortDescription}
                  onChange={e => setNewEvent({ ...newEvent, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue}
                    onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    required
                    value={newEvent.prizePool}
                    onChange={e => setNewEvent({ ...newEvent, prizePool: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={newEvent.demoDate}
                    onChange={e => setNewEvent({ ...newEvent, demoDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newEvent.demoTime}
                    onChange={e => setNewEvent({ ...newEvent, demoTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={e => setNewEvent({ ...newEvent, capacity: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Participant Type</label>
                  <select
                    value={newEvent.participantType}
                    onChange={e => setNewEvent({ ...newEvent, participantType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-950 border border-dark-border text-white"
                  >
                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                    <option value="TEAM">TEAM</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-purple text-white font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
