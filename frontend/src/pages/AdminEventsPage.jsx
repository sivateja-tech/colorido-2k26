import React, { useState, useEffect } from 'react';
import {
  Layers, Plus, Search, Filter, Edit3, Trash2, CheckCircle2,
  XCircle, Eye, EyeOff, AlertCircle, RefreshCw, X, Users,
  MapPin, Calendar, Clock, Award, Phone, Mail, HelpCircle,
  FileText, ShieldCheck, ChevronRight
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
import BackButton from '../components/BackButton';

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
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'rounds' | 'organizers' | 'rules' | 'prizes_faqs'
  const [editingEventId, setEditingEventId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const defaultFormData = {
    title: '',
    category: 'SPORTS',
    type: '',
    shortDescription: '',
    description: '',
    rules: '',
    eligibility: 'Open to all registered undergraduate & postgraduate students with valid college ID.',
    requirements: 'Valid College ID Card\nProper event attire/equipment\nRegistration Confirmation Pass',
    importantDates: 'Registration Closes: October 13, 2026\nEvent Orientation: October 15, 2026',
    date: 'October 15, 2026',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
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
    rounds: [
      {
        roundNumber: 1,
        title: 'Round 1 – Prelims',
        description: 'Initial qualifier round to evaluate baseline performance.',
        date: 'October 15, 2026',
        time: '10:00 AM - 11:30 AM',
        venue: 'Main Ground',
        duration: '90 Minutes',
        qualificationCriteria: 'Top 50% advance to Round 2.'
      }
    ],
    organizers: [
      {
        name: 'Faculty Convenor',
        role: 'Faculty Coordinator',
        department: 'Physical Education / Engineering',
        phone: '+91 98765 43210',
        email: 'organizer@rvrjc.ac.in'
      }
    ],
    faqs: [
      {
        question: 'Who is eligible to participate?',
        answer: 'Any student currently enrolled in an accredited undergraduate or postgraduate program with valid ID.'
      }
    ]
  };

  const [formData, setFormData] = useState(defaultFormData);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminFetchEvents();
      if (res.data?.success) {
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
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title || '',
      category: event.category || 'SPORTS',
      type: event.type || event.slug || '',
      shortDescription: event.shortDescription || '',
      description: event.description || event.fullDescription || '',
      rules: event.rules || '',
      eligibility: event.eligibility || 'Open to all registered undergraduate & postgraduate students.',
      requirements: event.requirements || '',
      importantDates: event.importantDates || '',
      date: event.date || event.demoDate || 'October 15, 2026',
      startTime: event.startTime || '10:00 AM',
      endTime: event.endTime || '01:00 PM',
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
      rounds: Array.isArray(event.rounds) && event.rounds.length > 0 ? event.rounds : [
        {
          roundNumber: 1,
          title: 'Round 1 – Prelims',
          description: 'Qualifier round for participants.',
          date: event.date || 'October 15, 2026',
          time: event.startTime ? `${event.startTime} - ${event.endTime}` : '10:00 AM - 12:00 PM',
          venue: event.venue || 'Main Venue',
          duration: '2 Hours',
          qualificationCriteria: 'Top qualifiers advance to Finals.'
        }
      ],
      organizers: Array.isArray(event.organizers) && event.organizers.length > 0 ? event.organizers : [
        {
          name: 'Faculty Convenor',
          role: 'Faculty Coordinator',
          department: 'RVR & JC College of Engineering',
          phone: '+91 98765 43210',
          email: 'organizer@rvrjc.ac.in'
        }
      ],
      faqs: Array.isArray(event.faqs) && event.faqs.length > 0 ? event.faqs : [
        {
          question: 'Are spot registrations allowed?',
          answer: 'Subject to available space on event day. Online pre-registration is strongly advised.'
        }
      ]
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        fullDescription: formData.description,
        demoDate: formData.date,
        demoTime: `${formData.startTime} - ${formData.endTime}`
      };

      if (editingEventId) {
        await adminUpdateEvent(editingEventId, payload);
        setSuccessMsg('Event updated successfully with all rounds and organizers.');
      } else {
        await adminCreateEvent(payload);
        setSuccessMsg('New event created successfully with rounds and organizers.');
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
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setSuccessMsg('Event deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to delete event.');
    }
  };

  // Helper methods for dynamic arrays
  const addRound = () => {
    const nextNum = formData.rounds.length + 1;
    setFormData({
      ...formData,
      rounds: [
        ...formData.rounds,
        {
          roundNumber: nextNum,
          title: `Round ${nextNum} – ${nextNum === 2 ? 'Mains' : nextNum === 3 ? 'Finals' : 'Stage ' + nextNum}`,
          description: '',
          date: formData.date || 'October 15, 2026',
          time: '10:00 AM - 12:00 PM',
          venue: formData.venue || 'Campus Venue',
          duration: '2 Hours',
          qualificationCriteria: 'Evaluated on standard scoring matrix.'
        }
      ]
    });
  };

  const updateRound = (index, field, value) => {
    const updated = [...formData.rounds];
    updated[index][field] = value;
    setFormData({ ...formData, rounds: updated });
  };

  const removeRound = (index) => {
    setFormData({
      ...formData,
      rounds: formData.rounds.filter((_, idx) => idx !== index)
    });
  };

  const addOrganizer = () => {
    setFormData({
      ...formData,
      organizers: [
        ...formData.organizers,
        {
          name: '',
          role: 'Student Coordinator',
          department: 'Engineering',
          phone: '+91 ',
          email: ''
        }
      ]
    });
  };

  const updateOrganizer = (index, field, value) => {
    const updated = [...formData.organizers];
    updated[index][field] = value;
    setFormData({ ...formData, organizers: updated });
  };

  const removeOrganizer = (index) => {
    setFormData({
      ...formData,
      organizers: formData.organizers.filter((_, idx) => idx !== index)
    });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [
        ...formData.faqs,
        { question: '', answer: '' }
      ]
    });
  };

  const updateFaq = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const removeFaq = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, idx) => idx !== index)
    });
  };

  // Filtered Events
  const filteredEvents = events.filter((ev) => {
    const matchSearch =
      ev.title?.toLowerCase().includes(search.toLowerCase()) ||
      ev.category?.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || ev.category === categoryFilter;
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && ev.published) ||
      (statusFilter === 'DRAFT' && !ev.published) ||
      (statusFilter === 'FEATURED' && ev.featured);
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-5 sm:p-6 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallback="/admin/dashboard" label="Dashboard" />
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-palette-blue" />
              <h1 className="text-xl sm:text-2xl font-display font-black text-dark-text dark:text-dark-text light:text-light-text">
                Event Management &amp; Structures
              </h1>
            </div>
          </div>
          <p className="text-xs text-dark-muted mt-1">
            Configure multi-round competition structures, event organizers with direct contact, rules, and schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-palette-blue hover:bg-palette-blue/90 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
          <button
            onClick={loadEvents}
            disabled={loading}
            className="p-2.5 rounded-xl bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text-secondary hover:text-dark-text transition-colors"
            title="Reload Events"
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

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-4 rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, category, venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text placeholder:text-dark-muted focus:outline-none focus:border-palette-blue"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-palette-blue"
          >
            <option value="ALL">All Categories</option>
            <option value="SPORTS">SPORTS</option>
            <option value="CULTURAL">CULTURAL</option>
            <option value="TECHNICAL">TECHNICAL</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg dark:bg-dark-bg light:bg-light-bg border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text focus:outline-none focus:border-palette-blue"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Unpublished Only</option>
            <option value="FEATURED">Featured Only</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <LoadingSkeleton type="table" count={6} />
      ) : filteredEvents.length === 0 ? (
        <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-12 text-center rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border">
          <Layers className="w-10 h-10 mx-auto text-dark-muted mb-3" />
          <h3 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">
            No events found
          </h3>
          <p className="text-xs text-dark-muted mt-1">
            Try adjusting your search criteria or create a new event.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE CARDS VIEW (< sm) */}
          <div className="block sm:hidden space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-4 rounded-xl border border-dark-border dark:border-dark-border light:border-light-border space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-palette-orange">
                      {event.category}
                    </span>
                    <h3 className="text-sm font-bold text-dark-text dark:text-dark-text light:text-light-text">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {event.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-palette-orange/20 text-palette-orange border border-palette-orange/40">
                        Featured
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      event.published
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/40'
                    }`}>
                      {event.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-dark-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-palette-blue shrink-0" />
                    <span>{event.date || event.demoDate || 'TBD'} • {event.startTime || event.demoTime || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-palette-orange shrink-0" />
                    <span className="truncate">{event.venue || 'Campus'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-semibold text-palette-blue">Format: {event.participantType}</span>
                    <span className="font-mono text-dark-text">Prize: {event.prizePool || 'TBD'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dark-border dark:border-dark-border light:border-light-border flex items-center justify-between gap-2">
                  <button
                    onClick={() => openEditModal(event)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text text-center hover:text-palette-blue"
                  >
                    Edit Event &amp; Rounds
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(event.id)}
                    className="p-2 rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW (>= sm) */}
          <div className="hidden sm:block bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-2xl border border-dark-border dark:border-dark-border light:border-light-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary font-semibold uppercase tracking-wider text-[11px] border-b border-dark-border">
                  <tr>
                    <th className="py-3 px-4">Event &amp; Details</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Format</th>
                    <th className="py-3 px-3">Schedule &amp; Venue</th>
                    <th className="py-3 px-3 text-center">Structure</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border dark:divide-dark-border light:divide-light-border">
                  {filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-dark-elevated/50 dark:hover:bg-dark-elevated/50 light:hover:bg-slate-50 transition-colors"
                    >
                      {/* Event Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-palette-blue/15 flex items-center justify-center shrink-0 border border-palette-blue/30">
                            <Award className="w-4 h-4 text-palette-blue" />
                          </div>
                          <div>
                            <div className="font-bold text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-1.5">
                              {event.title}
                              {event.featured && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-palette-orange/20 text-palette-orange border border-palette-orange/30">
                                  Featured
                                </span>
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
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            event.category === 'SPORTS'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : event.category === 'CULTURAL'
                              ? 'bg-palette-orange/15 text-palette-orange border border-palette-orange/30'
                              : 'bg-palette-blue/15 text-palette-blue border border-palette-blue/30'
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
                          <span className="text-dark-text-secondary font-medium">{event.date || event.demoDate || 'TBD'}</span>
                          <span className="text-dark-muted truncate max-w-[160px]">
                            {event.venue || 'Campus'}
                          </span>
                        </div>
                      </td>

                      {/* Structure counts */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-dark-elevated text-dark-text-secondary border border-dark-border">
                            {event.rounds?.length || 1} Rounds
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-dark-elevated text-dark-text-secondary border border-dark-border">
                            {event.organizers?.length || 1} Leads
                          </span>
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
                            className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors ${
                              event.featured
                                ? 'bg-palette-orange/15 border-palette-orange/30 text-palette-orange'
                                : 'bg-dark-elevated border-dark-border text-dark-muted hover:text-dark-text'
                            }`}
                            title="Toggle Featured"
                          >
                            {event.featured ? 'Featured' : 'Standard'}
                          </button>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-1.5 rounded-lg bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border text-dark-text-secondary hover:text-palette-blue transition-colors"
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
              Are you sure you want to permanently delete this event? This action will remove all attached schedules, rounds, and organizers.
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT MODAL WITH COMPREHENSIVE TABS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border max-w-3xl w-full rounded-2xl p-5 sm:p-6 shadow-2xl my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-dark-border shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-palette-blue" />
                <h3 className="text-base sm:text-lg font-bold text-dark-text dark:text-dark-text light:text-light-text">
                  {editingEventId ? 'Edit Event & Stage Structures' : 'Create New Event Structure'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-dark-border shrink-0 no-scrollbar">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'rounds', label: `2. Rounds (${formData.rounds.length})` },
                { id: 'organizers', label: `3. Organizers (${formData.organizers.length})` },
                { id: 'rules', label: '4. Rules & Dates' },
                { id: 'prizes_faqs', label: `5. Prizes & FAQs (${formData.faqs.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-palette-blue text-white shadow-sm'
                      : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-muted hover:text-dark-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
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
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
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
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      >
                        <option value="SPORTS">SPORTS</option>
                        <option value="CULTURAL">CULTURAL</option>
                        <option value="TECHNICAL">TECHNICAL</option>
                      </select>
                    </div>

                    {/* Type Identifier */}
                    <div>
                      <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                        Type / Slug Identifier
                      </label>
                      <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue font-mono"
                        placeholder="e.g. cricket, hackathon, dance"
                      />
                    </div>

                    {/* Visual Theme */}
                    <div>
                      <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                        Visual Theme Key
                      </label>
                      <input
                        type="text"
                        value={formData.visualType}
                        onChange={(e) => setFormData({ ...formData, visualType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue font-mono"
                        placeholder="e.g. cricket, hackathon, trophy"
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
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      >
                        <option value="INDIVIDUAL">INDIVIDUAL (Solo)</option>
                        <option value="TEAM">TEAM</option>
                      </select>
                    </div>

                    {/* Venue */}
                    <div>
                      <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                        Main Venue *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                        placeholder="e.g. College Sports Complex / Main Ground"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                        Event Date *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                        placeholder="e.g. October 15, 2026"
                      />
                    </div>

                    {/* Times */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                          Start Time *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                          placeholder="10:00 AM"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                          End Time *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                          placeholder="01:00 PM"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team Sizes if TEAM */}
                  {formData.participantType === 'TEAM' && (
                    <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-dark-elevated/40 border border-dark-border">
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
                    </div>
                  )}

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                      Short Tagline / Teaser
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      placeholder="One-sentence teaser for event cards"
                    />
                  </div>

                  {/* Full Description / About */}
                  <div>
                    <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                      Full Description &amp; About *
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      placeholder="Comprehensive overview of the competition, background, and excitement..."
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-dark-text">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="rounded border-dark-border text-palette-blue focus:ring-palette-blue"
                      />
                      <span>Published (Visible to public)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-dark-text">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded border-dark-border text-palette-orange focus:ring-palette-orange"
                      />
                      <span>Featured (Highlight on Home page)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: DETAILED EVENT STRUCTURES (ROUNDS) */}
              {activeTab === 'rounds' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-dark-border">
                    <div>
                      <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">
                        Stage Rounds &amp; Competition Progression
                      </h4>
                      <p className="text-[11px] text-dark-muted">
                        Define multi-stage rounds (e.g. Round 1 – Prelims, Round 2 – Mains, Round 3 – Finals).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addRound}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-palette-blue text-white hover:bg-palette-blue/90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Round</span>
                    </button>
                  </div>

                  {formData.rounds.map((round, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-dark-elevated/40 border border-dark-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-palette-blue">
                          Round #{idx + 1}
                        </span>
                        {formData.rounds.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRound(idx)}
                            className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Round Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={round.title}
                            onChange={(e) => updateRound(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. Round 1 – Prelims"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={round.duration}
                            onChange={(e) => updateRound(idx, 'duration', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. 90 Minutes, 2 Hours"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Date
                          </label>
                          <input
                            type="text"
                            value={round.date}
                            onChange={(e) => updateRound(idx, 'date', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. October 15, 2026"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Time
                          </label>
                          <input
                            type="text"
                            value={round.time}
                            onChange={(e) => updateRound(idx, 'time', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. 10:00 AM - 12:00 PM"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Venue
                          </label>
                          <input
                            type="text"
                            value={round.venue}
                            onChange={(e) => updateRound(idx, 'venue', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. Mechanical Seminar Hall"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Qualification Criteria
                          </label>
                          <input
                            type="text"
                            value={round.qualificationCriteria}
                            onChange={(e) => updateRound(idx, 'qualificationCriteria', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. Top 8 teams advance to Round 2 Mains"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Round Description &amp; Flow
                          </label>
                          <textarea
                            rows="2"
                            value={round.description}
                            onChange={(e) => updateRound(idx, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="Detailed overview of what participants need to do in this round..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: ORGANIZERS & CONTACTS */}
              {activeTab === 'organizers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-dark-border">
                    <div>
                      <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">
                        Event Organizers &amp; Student Leads
                      </h4>
                      <p className="text-[11px] text-dark-muted">
                        Students can tap Call or Email directly from the event details page to contact them.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addOrganizer}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-palette-blue text-white hover:bg-palette-blue/90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Organizer</span>
                    </button>
                  </div>

                  {formData.organizers.map((org, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-dark-elevated/40 border border-dark-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-palette-orange">
                          Organizer #{idx + 1}
                        </span>
                        {formData.organizers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOrganizer(idx)}
                            className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Organizer Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={org.name}
                            onChange={(e) => updateOrganizer(idx, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. Dr. K. Ravindra / S. Karthik"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Role / Designation *
                          </label>
                          <input
                            type="text"
                            required
                            value={org.role}
                            onChange={(e) => updateOrganizer(idx, 'role', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. Faculty Convenor / Student Coordinator"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Department
                          </label>
                          <input
                            type="text"
                            value={org.department}
                            onChange={(e) => updateOrganizer(idx, 'department', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                            placeholder="e.g. Computer Science / Physical Education"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Phone (for 1-tap Call action) *
                          </label>
                          <input
                            type="text"
                            required
                            value={org.phone}
                            onChange={(e) => updateOrganizer(idx, 'phone', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                            placeholder="+91 98765 43210"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                            Email (for 1-tap Email action) *
                          </label>
                          <input
                            type="email"
                            required
                            value={org.email}
                            onChange={(e) => updateOrganizer(idx, 'email', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                            placeholder="organizer@rvrjc.ac.in"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: RULES, REQUIREMENTS & DATES */}
              {activeTab === 'rules' && (
                <div className="space-y-4">
                  {/* Rules */}
                  <div>
                    <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                      Rules &amp; Guidelines (One rule per line or markdown)
                    </label>
                    <textarea
                      rows="4"
                      value={formData.rules}
                      onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      placeholder="1. All participants must report 30 minutes prior to round start.&#10;2. Proper sports kits and safety equipment required.&#10;3. Referee / Judge decisions are final."
                    />
                  </div>

                  {/* Eligibility */}
                  <div>
                    <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                      Eligibility Criteria
                    </label>
                    <textarea
                      rows="2"
                      value={formData.eligibility}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      placeholder="Open to all registered undergraduate and postgraduate engineering and arts students."
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                      Equipment &amp; Requirements Checklist
                    </label>
                    <textarea
                      rows="3"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      placeholder="Valid College Physical ID Card&#10;Own cricket whites / track pants&#10;Official Festival Digital Pass"
                    />
                  </div>

                  {/* Important Dates */}
                  <div>
                    <label className="block text-xs font-semibold text-dark-text-secondary mb-1">
                      Important Dates &amp; Deadlines
                    </label>
                    <textarea
                      rows="3"
                      value={formData.importantDates}
                      onChange={(e) => setFormData({ ...formData, importantDates: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-dark-bg border border-dark-border text-dark-text focus:outline-none focus:border-palette-blue"
                      placeholder="Registration Closes: October 13, 2026, 11:59 PM&#10;Rounds Schedule Announcement: October 14, 2026&#10;Gate Reporting: October 15, 2026, 08:30 AM"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: PRIZES & FAQS */}
              {activeTab === 'prizes_faqs' && (
                <div className="space-y-4">
                  {/* Prizes Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-dark-elevated/40 border border-dark-border">
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                        Total Prize Pool
                      </label>
                      <input
                        type="text"
                        value={formData.prizePool}
                        onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                        placeholder="₹25,000"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                        1st Place Prize
                      </label>
                      <input
                        type="text"
                        value={formData.firstPrize}
                        onChange={(e) => setFormData({ ...formData, firstPrize: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                        placeholder="₹15,000"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-dark-text-secondary mb-1">
                        2nd Place Prize
                      </label>
                      <input
                        type="text"
                        value={formData.secondPrize}
                        onChange={(e) => setFormData({ ...formData, secondPrize: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text font-mono"
                        placeholder="₹10,000"
                      />
                    </div>
                  </div>

                  {/* FAQs Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-dark-border">
                      <div>
                        <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">
                          Frequently Asked Questions (FAQs)
                        </h4>
                        <p className="text-[11px] text-dark-muted">
                          Address common student inquiries regarding eligibility, kits, and schedule.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addFaq}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-palette-blue text-white hover:bg-palette-blue/90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add FAQ</span>
                      </button>
                    </div>

                    {formData.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-dark-elevated/40 border border-dark-border space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-dark-text-secondary">
                            Question #{idx + 1}
                          </span>
                          {formData.faqs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFaq(idx)}
                              className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text font-medium"
                          placeholder="e.g. Can we register as a mixed-college team?"
                        />
                        <textarea
                          rows="2"
                          required
                          value={faq.answer}
                          onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-xs bg-dark-bg border border-dark-border text-dark-text"
                          placeholder="Clear and informative answer for students..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-border shrink-0">
                <div className="text-[11px] text-dark-muted">
                  Tab {activeTab === 'basic' ? '1' : activeTab === 'rounds' ? '2' : activeTab === 'organizers' ? '3' : activeTab === 'rules' ? '4' : '5'} of 5
                </div>

                <div className="flex items-center gap-3">
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
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-palette-blue hover:bg-palette-blue/90 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingEventId ? 'Save & Sync Event' : 'Create Event'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
