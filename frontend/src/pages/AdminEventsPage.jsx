import React, { useState, useEffect } from 'react';
import {
  Sparkles, Plus, Search, Filter, Edit3, Trash2, CheckCircle2,
  XCircle, Star, Eye, EyeOff, AlertCircle, RefreshCw, X, Users,
  MapPin, Calendar, Clock, Award
} from 'lucide-react';
import {
  adminFetchEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  adminTogglePublishEvent,
  adminToggleFeaturedEvent
} from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const defaultFormData = {
    title: '',
    category: 'SPORTS',
    type: 'cricket',
    shortDescription: '',
    fullDescription: '',
    rules: '',
    eligibility: 'Open to all registered undergraduate & postgraduate students.',
    demoDate: 'Day 1 (March 28, 2026)',
    demoTime: '10:00 AM - 01:00 PM',
    venue: 'College Sports Complex / Main Ground',
    prizePool: '₹20,000',
    firstPrize: '₹12,000',
    secondPrize: '₹8,000',
    participantType: 'INDIVIDUAL',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    visualType: 'cricket',
    featured: false,
    published: true,
  };
  const [formData, setFormData] = useState(defaultFormData);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminFetchEvents();
      if (res.data.success) {
        setEvents(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEventId(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title || '',
      category: event.category || 'SPORTS',
      type: event.type || '',
      shortDescription: event.shortDescription || '',
      fullDescription: event.fullDescription || '',
      rules: event.rules || '',
      eligibility: event.eligibility || '',
      demoDate: event.demoDate || '',
      demoTime: event.demoTime || '',
      venue: event.venue || '',
      prizePool: event.prizePool || '',
      firstPrize: event.firstPrize || '',
      secondPrize: event.secondPrize || '',
      participantType: event.participantType || 'INDIVIDUAL',
      minTeamSize: event.minTeamSize || 1,
      maxTeamSize: event.maxTeamSize || 1,
      capacity: event.capacity || 50,
      imageUrl: event.imageUrl || '',
      visualType: event.visualType || 'trophy',
      featured: Boolean(event.featured),
      published: Boolean(event.published),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingEventId) {
        await adminUpdateEvent(editingEventId, formData);
        setSuccessMsg('Event updated successfully.');
      } else {
        await adminCreateEvent(formData);
        setSuccessMsg('New event created successfully.');
      }
      setIsModalOpen(false);
      await loadEvents();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await adminTogglePublishEvent(id);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, published: !e.published } : e))
      );
    } catch (err) {
      setError('Failed to update publish state.');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await adminToggleFeaturedEvent(id);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, featured: !e.featured } : e))
      );
    } catch (err) {
      setError('Failed to update featured state.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteEvent(id);
      setDeleteConfirmId(null);
      setSuccessMsg('Event deleted successfully.');
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  // Filtered Events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title?.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(search.toLowerCase()) ||
      ev.type?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' || ev.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && ev.published) ||
      (statusFilter === 'UNPUBLISHED' && !ev.published) ||
      (statusFilter === 'FEATURED' && ev.featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-6 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-purple" />
            <h1 className="text-xl sm:text-2xl font-display font-black text-dark-text dark:text-dark-text light:text-light-text">
              Festival Events Management
            </h1>
          </div>
          <p className="text-xs text-dark-muted mt-1">
            Manage, publish, feature, or configure all 29 festival events across Sports, Cultural, and Technical pillars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadEvents}
            disabled={loading}
            className="p-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary hover:text-dark-text transition-colors"
            title="Reload Events"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md shadow-brand-purple/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
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
          <button onClick={() => setError(null)} className="ml-auto text-rose-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-4 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, type, venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Categories ({events.length})</option>
            <option value="SPORTS">Sports ({events.filter((e) => e.category === 'SPORTS').length})</option>
            <option value="CULTURAL">Cultural ({events.filter((e) => e.category === 'CULTURAL').length})</option>
            <option value="TECHNICAL">Technical ({events.filter((e) => e.category === 'TECHNICAL').length})</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNPUBLISHED">Unpublished</option>
            <option value="FEATURED">Featured</option>
          </select>
        </div>
      </div>

      {/* Events Table / Cards */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredEvents.length === 0 ? (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-12 text-center rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
          <AlertCircle className="w-10 h-10 mx-auto text-dark-muted mb-3" />
          <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
            No events found
          </h3>
          <p className="text-xs text-dark-muted mt-1">
            Try adjusting your search query or filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary font-semibold uppercase tracking-wider text-[11px] border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Schedule &amp; Venue</th>
                  <th className="py-3 px-3">Capacity</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border dark:divide-dark-border light:divide-light-border">
                {filteredEvents.map((event) => {
                  const capacityPct = Math.round((event.registered / (event.capacity || 1)) * 100);
                  const isFull = event.registered >= event.capacity;

                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-dark-elevated/50 dark:hover:bg-dark-elevated/50 light:hover:bg-slate-50 transition-colors"
                    >
                      {/* Title & Visual */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0 border border-brand-purple/20">
                            <span className="font-mono text-xs font-bold text-brand-purple">
                              {event.type?.substring(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-1.5">
                              {event.title}
                              {event.featured && (
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] text-dark-muted font-mono">
                              Prize: {event.prizePool || 'TBD'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            event.category === 'SPORTS'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : event.category === 'CULTURAL'
                              ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30'
                              : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {event.category}
                        </span>
                      </td>

                      {/* Format */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-dark-text-secondary font-medium">
                          {event.participantType}
                          {event.participantType === 'TEAM' &&
                            ` (${event.minTeamSize}-${event.maxTeamSize})`}
                        </span>
                      </td>

                      {/* Schedule & Venue */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col text-[11px]">
                          <span className="text-dark-text-secondary">{event.demoDate || 'TBD'}</span>
                          <span className="text-dark-muted truncate max-w-[160px]">
                            {event.venue || 'Campus'}
                          </span>
                        </div>
                      </td>

                      {/* Capacity Bar */}
                      <td className="py-3 px-3">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className={isFull ? 'text-rose-400 font-bold' : 'text-dark-text-secondary'}>
                              {event.registered}/{event.capacity}
                            </span>
                            <span className="text-dark-muted">{capacityPct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-dark-border dark:bg-dark-border light:bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFull
                                  ? 'bg-rose-500'
                                  : capacityPct > 80
                                  ? 'bg-amber-500'
                                  : 'bg-brand-purple'
                              }`}
                              style={{ width: `${Math.min(capacityPct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badges & Quick Toggles */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleTogglePublish(event.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              event.published
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/20'
                            }`}
                            title={event.published ? 'Published (Click to Unpublish)' : 'Unpublished (Click to Publish)'}
                          >
                            {event.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(event.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              event.featured
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
                                : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/20'
                            }`}
                            title={event.featured ? 'Featured Event' : 'Not Featured (Click to Feature)'}
                          >
                            <Star className={`w-3.5 h-3.5 ${event.featured ? 'fill-amber-400' : ''}`} />
                          </button>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-1.5 rounded-lg bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text-secondary hover:text-brand-purple transition-colors"
                            title="Edit Event"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(event.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border max-w-sm w-full rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-dark-text dark:text-dark-text light:text-light-text">
              Confirm Event Deletion
            </h3>
            <p className="text-xs text-center text-dark-muted mt-2">
              Are you sure you want to permanently delete this event? This action will remove all attached schedules and records.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-elevated text-dark-text-secondary hover:text-dark-text border border-dark-border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border max-w-2xl w-full rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
                  {editingEventId ? 'Edit Event Details' : 'Create New Festival Event'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    placeholder="e.g. Cricket Championship"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  >
                    <option value="SPORTS">SPORTS</option>
                    <option value="CULTURAL">CULTURAL</option>
                    <option value="TECHNICAL">TECHNICAL</option>
                  </select>
                </div>

                {/* Type / Key */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Slug / Type Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple font-mono"
                    placeholder="e.g. cricket, hackathon, dance"
                  />
                </div>

                {/* Visual Type */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Animated Canvas Theme
                  </label>
                  <input
                    type="text"
                    value={formData.visualType}
                    onChange={(e) => setFormData({ ...formData, visualType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple font-mono"
                    placeholder="e.g. cricket, hackathon, dance, trophy"
                  />
                </div>

                {/* Participant Format */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Participation Format
                  </label>
                  <select
                    value={formData.participantType}
                    onChange={(e) => setFormData({ ...formData, participantType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  >
                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                    <option value="TEAM">TEAM</option>
                  </select>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Participant / Team Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>

                {/* Team Sizes if TEAM */}
                {formData.participantType === 'TEAM' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                        Min Team Size
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.minTeamSize}
                        onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                        Max Team Size
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxTeamSize}
                        onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                      />
                    </div>
                  </>
                )}

                {/* Prize Pool */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Total Prize Pool
                  </label>
                  <input
                    type="text"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    placeholder="e.g. ₹25,000"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    placeholder="e.g. Main Auditorium"
                  />
                </div>

                {/* Demo Date */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Date / Day
                  </label>
                  <input
                    type="text"
                    value={formData.demoDate}
                    onChange={(e) => setFormData({ ...formData, demoDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    placeholder="e.g. Day 1 (October 15, 2026)"
                  />
                </div>

                {/* Demo Time */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={formData.demoTime}
                    onChange={(e) => setFormData({ ...formData, demoTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    placeholder="e.g. 10:00 AM - 01:00 PM"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  placeholder="One sentence teaser description"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  Full Description &amp; Details
                </label>
                <textarea
                  rows="3"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  placeholder="Detailed outline of the event rules, flow, and judging criteria"
                />
              </div>

              {/* Checkboxes for featured & published */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-dark-text">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-dark-border text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Published (Visible to public)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-dark-text">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-dark-border text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Featured (Highlight on Home page)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-elevated text-dark-text-secondary hover:text-dark-text border border-dark-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md shadow-brand-purple/20 disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEventId ? 'Save Changes' : 'Create Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
