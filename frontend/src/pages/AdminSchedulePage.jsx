import React, { useState, useEffect } from 'react';
import {
  Calendar, Plus, Search, Filter, Edit3, Trash2, Eye, EyeOff,
  Radio, CheckCircle2, AlertCircle, RefreshCw, X, MapPin, Clock
} from 'lucide-react';
import {
  adminFetchSchedule,
  adminCreateSchedule,
  adminUpdateSchedule,
  adminDeleteSchedule,
  adminTogglePublishSchedule,
  adminFetchEvents
} from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import BackButton from '../components/BackButton';

export default function AdminSchedulePage() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [dayFilter, setDayFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const defaultFormData = {
    title: '',
    eventId: '',
    day: 'Day 1',
    time: '10:00 AM - 01:00 PM',
    venue: 'College Sports Pavilion',
    category: 'SPORTS',
    description: '',
    isLive: false,
    published: true,
  };
  const [formData, setFormData] = useState(defaultFormData);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [schRes, evRes] = await Promise.all([
        adminFetchSchedule(),
        adminFetchEvents()
      ]);
      if (schRes.data.success) {
        setScheduleItems(schRes.data.data || []);
      }
      if (evRes.data.success) {
        setEvents(evRes.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      eventId: item.eventId || '',
      day: item.day || 'Day 1',
      time: item.time || '',
      venue: item.venue || '',
      category: item.category || 'SPORTS',
      description: item.description || '',
      isLive: Boolean(item.isLive),
      published: Boolean(item.published),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await adminUpdateSchedule(editingId, formData);
        setSuccessMsg('Schedule item updated.');
      } else {
        await adminCreateSchedule(formData);
        setSuccessMsg('New schedule item added.');
      }
      setIsModalOpen(false);
      await loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save schedule.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await adminTogglePublishSchedule(id);
      setScheduleItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, published: !item.published } : item))
      );
    } catch (err) {
      setError('Failed to update publish state.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteSchedule(id);
      setDeleteConfirmId(null);
      setSuccessMsg('Schedule item deleted.');
      setScheduleItems((prev) => prev.filter((item) => item.id !== id));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete schedule item.');
    }
  };

  // Filtered
  const filtered = scheduleItems.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.venue?.toLowerCase().includes(search.toLowerCase());
    const matchesDay = dayFilter === 'ALL' || item.day === dayFilter;
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesDay && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-6 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallback="/admin/dashboard" label="Dashboard" />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-purple" />
              <h1 className="text-xl sm:text-2xl font-display font-black text-dark-text dark:text-dark-text light:text-light-text">
                Festival Program Schedule
              </h1>
            </div>
          </div>
          <p className="text-xs text-dark-muted mt-1">
            Organize multi-day program timelines, stage allocations, and live active indicators for COLORIDO 2K26.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary hover:text-dark-text transition-colors"
            title="Reload Schedule"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md shadow-brand-purple/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event Slot</span>
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

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-4 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schedule by title, venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
        </div>

        <div>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Days</option>
            <option value="Day 1">Day 1</option>
            <option value="Day 2">Day 2</option>
            <option value="Day 3">Day 3</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Categories</option>
            <option value="SPORTS">SPORTS</option>
            <option value="CULTURAL">CULTURAL</option>
            <option value="TECHNICAL">TECHNICAL</option>
          </select>
        </div>
      </div>

      {/* Schedule Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filtered.length === 0 ? (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-12 text-center rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
          <Calendar className="w-10 h-10 mx-auto text-dark-muted mb-3" />
          <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
            No schedule items found
          </h3>
          <p className="text-xs text-dark-muted mt-1">
            Try adjusting your search query or add a new program slot.
          </p>
        </div>
      ) : (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary font-semibold uppercase tracking-wider text-[11px] border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">Day &amp; Time</th>
                  <th className="py-3 px-3">Program / Event</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Venue</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border dark:divide-dark-border light:divide-light-border">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-dark-elevated/50 dark:hover:bg-dark-elevated/50 light:hover:bg-slate-50 transition-colors"
                  >
                    {/* Day & Time */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-purple">
                          {item.day}
                        </span>
                        <span className="text-[11px] text-dark-muted font-mono">
                          {item.time}
                        </span>
                      </div>
                    </td>

                    {/* Program */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-1.5">
                          {item.title}
                          {item.isLive && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
                              <Radio className="w-2.5 h-2.5" /> LIVE
                            </span>
                          )}
                        </span>
                        {item.description && (
                          <span className="text-[11px] text-dark-muted truncate max-w-xs">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.category === 'SPORTS'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : item.category === 'CULTURAL'
                            ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30'
                            : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Venue */}
                    <td className="py-3 px-3">
                      <span className="text-dark-text-secondary text-[11px]">
                        {item.venue}
                      </span>
                    </td>

                    {/* Status & Publish */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          item.published
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/20'
                        }`}
                        title={item.published ? 'Published (Click to Unpublish)' : 'Unpublished (Click to Publish)'}
                      >
                        {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text-secondary hover:text-brand-purple transition-colors"
                          title="Edit Schedule Slot"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete Schedule Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border max-w-sm w-full rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-dark-text">
              Delete Schedule Item?
            </h3>
            <p className="text-xs text-center text-dark-muted mt-2">
              Are you sure you want to remove this schedule slot from the festival program?
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-elevated text-dark-text-secondary border border-dark-border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border max-w-lg w-full rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-purple" />
                <h3 className="text-base font-bold text-dark-text">
                  {editingId ? 'Edit Schedule Slot' : 'Add Program Slot'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  Program / Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  placeholder="e.g. Cricket Championship - Semifinals"
                />
              </div>

              {/* Connected Event */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  Linked Event (Optional)
                </label>
                <select
                  value={formData.eventId}
                  onChange={(e) => {
                    const selected = events.find((ev) => ev.id === e.target.value);
                    setFormData({
                      ...formData,
                      eventId: e.target.value,
                      category: selected ? selected.category : formData.category,
                      venue: selected?.venue || formData.venue
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                >
                  <option value="">None / Standalone Session</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Day */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Festival Day *
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Day 1">Day 1</option>
                    <option value="Day 2">Day 2</option>
                    <option value="Day 3">Day 3</option>
                  </select>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Time Slot *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text font-mono focus:outline-none focus:border-brand-purple"
                    placeholder="10:00 AM - 01:00 PM"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    placeholder="Auditorium / Ground"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  Description / Note
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  placeholder="Additional context or notes for visitors"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-dark-text">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-dark-border text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-dark-text">
                  <input
                    type="checkbox"
                    checked={formData.isLive}
                    onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                    className="rounded border-dark-border text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Currently Live Now</span>
                </label>
              </div>

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
                  <span>{editingId ? 'Save Changes' : 'Create Slot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
