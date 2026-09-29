import React, { useState, useEffect } from 'react';
import {
  Trophy, Plus, Search, Filter, Edit3, Trash2, Eye, EyeOff,
  CheckCircle2, AlertCircle, RefreshCw, X, Award, Medal,
  Building
} from 'lucide-react';
import {
  adminFetchResults,
  adminCreateResult,
  adminUpdateResult,
  adminDeleteResult,
  adminTogglePublishResult,
  adminFetchEvents
} from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import BackButton from '../components/BackButton';

export default function AdminResultsPage() {
  const [results, setResults] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [rankFilter, setRankFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const defaultFormData = {
    eventId: '',
    rank: 1,
    winnerName: '',
    college: 'R V R & J C College of Engineering',
    score: '',
    points: 10,
    prizeMoney: '₹10,000',
    published: true,
  };
  const [formData, setFormData] = useState(defaultFormData);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resData, evData] = await Promise.all([
        adminFetchResults(),
        adminFetchEvents()
      ]);
      if (resData.data.success) {
        setResults(resData.data.data || []);
      }
      if (evData.data.success) {
        setEvents(evData.data.data || []);
        if (evData.data.data.length > 0 && !defaultFormData.eventId) {
          defaultFormData.eventId = evData.data.data[0].id;
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...defaultFormData,
      eventId: events[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (result) => {
    setEditingId(result.id);
    setFormData({
      eventId: result.eventId || '',
      rank: result.rank || 1,
      winnerName: result.winnerName || '',
      college: result.college || '',
      score: result.score || '',
      points: result.points || 0,
      prizeMoney: result.prizeMoney || '',
      published: Boolean(result.published),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await adminUpdateResult(editingId, formData);
        setSuccessMsg('Result updated.');
      } else {
        await adminCreateResult(formData);
        setSuccessMsg('New result published.');
      }
      setIsModalOpen(false);
      await loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save result.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await adminTogglePublishResult(id);
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, published: !r.published } : r))
      );
    } catch (err) {
      setError('Failed to update result publish state.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteResult(id);
      setDeleteConfirmId(null);
      setSuccessMsg('Result record deleted.');
      setResults((prev) => prev.filter((r) => r.id !== id));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete result.');
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Medal className="w-3 h-3 text-amber-400" /> 1st Place (Gold)
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-400/15 text-slate-300 border border-slate-400/30">
          <Medal className="w-3 h-3 text-slate-300" /> 2nd Place (Silver)
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-700/15 text-amber-600 border border-amber-700/30">
          <Medal className="w-3 h-3 text-amber-600" /> 3rd Place (Bronze)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-dark-elevated text-dark-text-secondary border border-dark-border">
        Rank {rank}
      </span>
    );
  };

  // Filtered
  const filtered = results.filter((r) => {
    const matchesSearch =
      r.winnerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.college?.toLowerCase().includes(search.toLowerCase()) ||
      r.event?.title?.toLowerCase().includes(search.toLowerCase());

    const matchesEvent = eventFilter === 'ALL' || r.eventId === eventFilter;
    const matchesRank = rankFilter === 'ALL' || r.rank.toString() === rankFilter;

    return matchesSearch && matchesEvent && matchesRank;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-6 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallback="/admin/dashboard" label="Dashboard" />
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-palette-orange" />
              <h1 className="text-xl sm:text-2xl font-display font-black text-dark-text dark:text-dark-text light:text-light-text">
                Winners &amp; Results Management
              </h1>
            </div>
          </div>
          <p className="text-xs text-dark-muted mt-1">
            Publish event champions, points allocations for college championship, and prize distributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary hover:text-dark-text transition-colors"
            title="Reload Results"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md shadow-brand-purple/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Result</span>
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
            placeholder="Search by winner, college, or event..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-brand-purple"
          />
        </div>

        <div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Events ({events.length})</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Ranks</option>
            <option value="1">1st Place Only</option>
            <option value="2">2nd Place Only</option>
            <option value="3">3rd Place Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filtered.length === 0 ? (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-12 text-center rounded-2xl border border-dark-border">
          <Trophy className="w-10 h-10 mx-auto text-dark-muted mb-3" />
          <h3 className="text-base font-bold text-dark-text">No Results Found</h3>
          <p className="text-xs text-dark-muted mt-1">
            Publish event outcomes and award winners to build the college leaderboard.
          </p>
        </div>
      ) : (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-2xl border border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary font-semibold uppercase tracking-wider text-[11px] border-b border-dark-border">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Winner / Team</th>
                  <th className="py-3 px-3">College</th>
                  <th className="py-3 px-3">Points / Score</th>
                  <th className="py-3 px-3">Prize</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filtered.map((result) => (
                  <tr
                    key={result.id}
                    className="hover:bg-dark-elevated/50 transition-colors"
                  >
                    {/* Event */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark-text">
                          {result.event?.title || 'Unknown Event'}
                        </span>
                        <span className="text-[10px] text-dark-muted">
                          {result.event?.category}
                        </span>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getRankBadge(result.rank)}
                    </td>

                    {/* Winner */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-dark-text">
                        {result.winnerName}
                      </span>
                    </td>

                    {/* College */}
                    <td className="py-3 px-3">
                      <span className="text-dark-text-secondary truncate max-w-xs block">
                        {result.college}
                      </span>
                    </td>

                    {/* Points & Score */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-brand-purple">
                          +{result.points} Pts
                        </span>
                        {result.score && (
                          <span className="text-[10px] text-dark-muted font-mono">
                            {result.score}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Prize */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-emerald-400 font-semibold font-mono">
                        {result.prizeMoney || '—'}
                      </span>
                    </td>

                    {/* Publish Toggle */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(result.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          result.published
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/20'
                        }`}
                        title={result.published ? 'Published (Click to Unpublish)' : 'Unpublished (Click to Publish)'}
                      >
                        {result.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(result)}
                          className="p-1.5 rounded-lg bg-dark-elevated border border-dark-border text-dark-text-secondary hover:text-brand-purple transition-colors"
                          title="Edit Result"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(result.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Delete Result"
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

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-dark-border max-w-sm w-full rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-dark-text">
              Delete Result Record?
            </h3>
            <p className="text-xs text-center text-dark-muted mt-2">
              Are you sure? This will adjust college leaderboard points accordingly.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-elevated text-dark-text border border-dark-border"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-surface border border-dark-border max-w-lg w-full rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-gold" />
                <h3 className="text-base font-bold text-dark-text">
                  {editingId ? 'Edit Winner Result' : 'Publish New Result'}
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
              {/* Event */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  Event *
                </label>
                <select
                  required
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                >
                  <option value="">Select Event</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Rank */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Rank Position *
                  </label>
                  <select
                    value={formData.rank}
                    onChange={(e) => {
                      const rankVal = parseInt(e.target.value);
                      const defaultPts = rankVal === 1 ? 10 : rankVal === 2 ? 7 : rankVal === 3 ? 5 : 2;
                      setFormData({
                        ...formData,
                        rank: rankVal,
                        points: defaultPts
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  >
                    <option value={1}>1st Place (Gold)</option>
                    <option value={2}>2nd Place (Silver)</option>
                    <option value={3}>3rd Place (Bronze)</option>
                    <option value={4}>4th Place</option>
                    <option value={5}>5th Place</option>
                  </select>
                </div>

                {/* Points */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Championship Points *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text font-mono focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Winner Name */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  Winner / Winning Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.winnerName}
                  onChange={(e) => setFormData({ ...formData, winnerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  placeholder="e.g. Rahul Sharma or Team ByteForge"
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                  College / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                  placeholder="e.g. R V R & J C College of Engineering"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Score */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Score / Performance Note
                  </label>
                  <input
                    type="text"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text font-mono focus:outline-none focus:border-brand-purple"
                    placeholder="e.g. 98/100 or 14.2s"
                  />
                </div>

                {/* Prize Money */}
                <div>
                  <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                    Prize Money Awarded
                  </label>
                  <input
                    type="text"
                    value={formData.prizeMoney}
                    onChange={(e) => setFormData({ ...formData, prizeMoney: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-brand-purple"
                    placeholder="e.g. ₹15,000"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-dark-text">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-dark-border text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Published on Leaderboard &amp; Results pages</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-elevated text-dark-text border border-dark-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover shadow-md shadow-brand-purple/20 disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Publish Result'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
