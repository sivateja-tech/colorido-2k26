import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Trophy, Mail, Calendar, Plus,
  CheckCircle, CheckCircle2, Clock, Trash2, Search, RefreshCw, AlertCircle,
  ArrowRight, QrCode, Layers, ChevronRight, Zap, X
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
import { getAdminSocket } from '../services/socket';
import LoadingSkeleton from '../components/LoadingSkeleton';

function CircularProgress({ percentage = 0, size = 56, strokeWidth = 5, color = '#10B981', trackColor = 'rgba(255,255,255,0.08)' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-black font-display text-[#ECF0F1] text-xs">
        {percentage}%
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, registrations, events, messages
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time Socket.IO state
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveNotification, setLiveNotification] = useState(null);

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
    demoDate: 'Day 1 (October 15, 2026)',
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
      if (res.data?.success) {
        setDashboardData(res.data.data);
      } else {
        setError(res.data?.message || 'Unable to retrieve dashboard metrics.');
      }
    } catch (err) {
      const raw = err.response?.data?.message || err.message || '';
      const isTechnical = /prisma|findunique|findmany|column|database|syntax error/i.test(raw);
      setError(isTechnical ? 'Database synchronization in progress. Please refresh.' : (raw || 'Failed to fetch dashboard metrics.'));
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

  // Real-time live dashboard sync
  useEffect(() => {
    const socket = getAdminSocket();
    if (!socket) return;

    const handleConnect = () => setIsLiveConnected(true);
    const handleDisconnect = () => setIsLiveConnected(false);

    setIsLiveConnected(socket.connected);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    const handleNewRegistration = (newReg) => {
      // 1. Toast banner
      setLiveNotification({
        id: newReg.id,
        text: `New Registration: ${newReg.fullName} registered for ${newReg.event?.title || 'an event'} (${newReg.registrationId})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });

      setTimeout(() => {
        setLiveNotification(prev => (prev?.id === newReg.id ? null : prev));
      }, 7000);

      // 2. Real-time metrics increment
      setDashboardData(prev => {
        if (!prev) return prev;
        const metrics = prev.metrics || {};
        const cat = newReg.event?.category;

        const updatedMetrics = {
          ...metrics,
          totalRegistrations: (metrics.totalRegistrations || 0) + 1,
          todayRegistrations: (metrics.todayRegistrations || 0) + 1,
          confirmedRegistrations: (metrics.confirmedRegistrations || 0) + (newReg.status === 'CONFIRMED' ? 1 : 0),
          activePasses: (metrics.activePasses || 0) + 1,
          sportsRegistrations: (metrics.sportsRegistrations || 0) + (cat === 'SPORTS' ? 1 : 0),
          culturalRegistrations: (metrics.culturalRegistrations || 0) + (cat === 'CULTURAL' ? 1 : 0),
          technicalRegistrations: (metrics.technicalRegistrations || 0) + (cat === 'TECHNICAL' ? 1 : 0)
        };

        // Prepend to recentRegistrations
        const existingRecent = prev.recentRegistrations || [];
        const isDuplicate = existingRecent.some(r => r.id === newReg.id || r.registrationId === newReg.registrationId);
        const updatedRecent = isDuplicate ? existingRecent : [newReg, ...existingRecent].slice(0, 10);

        return {
          ...prev,
          metrics: updatedMetrics,
          recentRegistrations: updatedRecent
        };
      });
    };

    const handleCheckInUpdate = (data) => {
      setDashboardData(prev => {
        if (!prev) return prev;
        const metrics = prev.metrics || {};
        const newCheckedIn = (metrics.checkedInRegistrations || 0) + 1;
        const total = metrics.totalRegistrations || 1;
        const newRate = Math.round((newCheckedIn / total) * 100);

        const updatedRecent = (prev.recentRegistrations || []).map(r => {
          if (r.id === data.id || r.registrationId === data.registrationId) {
            return { ...r, checkedIn: true, status: 'CHECKED_IN' };
          }
          return r;
        });

        return {
          ...prev,
          metrics: {
            ...metrics,
            checkedInRegistrations: newCheckedIn,
            checkInRate: newRate
          },
          recentRegistrations: updatedRecent
        };
      });
    };

    socket.on('admin:new_registration', handleNewRegistration);
    socket.on('admin:check_in_update', handleCheckInUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('admin:new_registration', handleNewRegistration);
      socket.off('admin:check_in_update', handleCheckInUpdate);
    };
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black font-display text-white">
              Festival Operations Dashboard
            </h1>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
              isLiveConnected
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isLiveConnected ? 'Live Sync' : 'Connecting...'}</span>
            </div>
          </div>
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

      {/* Error Feedback Banner */}
      {error && (
        <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-200">Dashboard Metrics Notice</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadDashboard()}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 transition-colors shrink-0 p-1"
              title="Dismiss notice"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Real-time Registration Toast Banner */}
      {liveNotification && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-palette-blue/20 border-2 border-palette-blue/50 text-white text-xs shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-palette-orange/20 border border-palette-orange/40 flex items-center justify-center text-palette-orange shrink-0">
              <Zap className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="font-bold text-palette-clouds">{liveNotification.text}</span>
              <span className="text-[10px] text-palette-clouds/60 ml-2 font-mono">({liveNotification.time})</span>
            </div>
          </div>
          <button
            onClick={() => setLiveNotification(null)}
            className="p-1 rounded-lg text-palette-clouds/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row with Direct Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. TOTAL EVENTS -> /admin/events */}
        <Link
          to="/admin/events"
          className="p-5 rounded-2xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 hover:border-[#2980B9] hover:bg-[#2C3E50] transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div className="flex items-center justify-between text-[#95A5A6] text-xs font-bold uppercase tracking-wider">
            <span className="group-hover:text-[#ECF0F1] transition-colors">Total Events</span>
            <div className="w-8 h-8 rounded-xl bg-[#2980B9]/15 border border-[#2980B9]/30 flex items-center justify-center text-[#2980B9] group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="py-2">
            <div className="text-3xl font-black font-display text-[#ECF0F1]">
              {metrics.totalEvents || 0}
            </div>
            <p className="text-[11px] text-[#95A5A6] mt-1 font-medium">
              {metrics.sportsEvents || 0} Sports • {metrics.culturalEvents || 0} Cultural • {metrics.technicalEvents || 0} Technical
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2980B9] group-hover:text-[#3498DB] pt-2 border-t border-[#95A5A6]/20">
            <span>Manage event catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 2. TOTAL REGISTRATIONS -> /admin/registrations */}
        <Link
          to="/admin/registrations"
          className="p-5 rounded-2xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 hover:border-[#E67E22] hover:bg-[#2C3E50] transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div className="flex items-center justify-between text-[#95A5A6] text-xs font-bold uppercase tracking-wider">
            <span className="group-hover:text-[#ECF0F1] transition-colors">Total Registrations</span>
            <div className="w-8 h-8 rounded-xl bg-[#E67E22]/15 border border-[#E67E22]/30 flex items-center justify-center text-[#E67E22] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="py-2">
            <div className="text-3xl font-black font-display text-[#ECF0F1]">
              {metrics.totalRegistrations || 0}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">
              {(metrics.activePasses ?? metrics.confirmedRegistrations) || 0} Active Passes ({metrics.checkedInRegistrations || 0} Verified)
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E67E22] group-hover:text-[#F39C12] pt-2 border-t border-[#95A5A6]/20">
            <span>View passes &amp; roster</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 3. GATE CHECK-IN RATE (Circular Progress Bar) -> /admin/registrations */}
        <Link
          to="/admin/registrations"
          className="p-5 rounded-2xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 hover:border-emerald-500 hover:bg-[#2C3E50] transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div className="flex items-center justify-between text-[#95A5A6] text-xs font-bold uppercase tracking-wider">
            <span className="group-hover:text-[#ECF0F1] transition-colors">Gate Check-In Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 py-1">
            <div>
              <div className="text-3xl font-black font-display text-[#ECF0F1]">
                {metrics.checkInRate ?? 0}%
              </div>
              <p className="text-[11px] text-[#95A5A6] mt-1 font-medium">
                {metrics.checkedInRegistrations || 0} of {metrics.totalRegistrations || 0} scanned
              </p>
            </div>
            <CircularProgress
              percentage={metrics.checkInRate ?? 0}
              size={56}
              strokeWidth={5}
              color="#10B981"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300 pt-2 border-t border-[#95A5A6]/20">
            <span>Open check-in scanner</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 4. INQUIRIES & GRIEVANCES -> /admin/messages */}
        <Link
          to="/admin/messages"
          className="p-5 rounded-2xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 hover:border-[#2980B9] hover:bg-[#2C3E50] transition-all cursor-pointer group flex flex-col justify-between shadow-md"
        >
          <div className="flex items-center justify-between text-[#95A5A6] text-xs font-bold uppercase tracking-wider">
            <span className="group-hover:text-[#ECF0F1] transition-colors">Inquiries &amp; Doubts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="py-2">
            <div className="text-3xl font-black font-display text-[#ECF0F1]">
              {metrics.unreadMessages || 0}
            </div>
            <p className="text-[11px] text-rose-400 mt-1 font-medium">
              {metrics.unreadMessages === 1 ? '1 Pending student message' : `${metrics.unreadMessages || 0} Pending student messages`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 group-hover:text-rose-300 pt-2 border-t border-[#95A5A6]/20">
            <span>Open helpdesk inbox</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#95A5A6]/20 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#2980B9] text-white shadow-md'
              : 'text-[#95A5A6] hover:text-[#ECF0F1] hover:bg-[#2C3E50]/50'
          }`}
        >
          Overview &amp; Hub
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'registrations'
              ? 'bg-[#2980B9] text-white shadow-md'
              : 'text-[#95A5A6] hover:text-[#ECF0F1] hover:bg-[#2C3E50]/50'
          }`}
        >
          Passes &amp; Registrations
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-[#2980B9] text-white shadow-md'
              : 'text-[#95A5A6] hover:text-[#ECF0F1] hover:bg-[#2C3E50]/50'
          }`}
        >
          Event Management
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'messages'
              ? 'bg-[#2980B9] text-white shadow-md'
              : 'text-[#95A5A6] hover:text-[#ECF0F1] hover:bg-[#2C3E50]/50'
          }`}
        >
          Helpdesk Messages
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Festival Operations Hub & Quick Links */}
          <div className="p-6 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#95A5A6]/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2980B9]/15 border border-[#2980B9]/30 flex items-center justify-center text-[#2980B9]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#ECF0F1] font-display">
                    Festival Operations Hub
                  </h3>
                  <p className="text-[11px] text-[#95A5A6]">
                    Administrative controls and direct portal links
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                System Active
              </span>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/events"
                className="p-3.5 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 hover:border-[#2980B9] hover:bg-[#1A252F] transition-all group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#2980B9]/15 border border-[#2980B9]/30 flex items-center justify-center text-[#2980B9] shrink-0 group-hover:scale-105 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#ECF0F1] group-hover:text-[#2980B9] flex items-center gap-1">
                    <span>Events Catalog</span>
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-[#95A5A6] mt-0.5">
                    29 Events, rounds &amp; coordinators
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/registrations"
                className="p-3.5 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 hover:border-[#E67E22] hover:bg-[#1A252F] transition-all group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E67E22]/15 border border-[#E67E22]/30 flex items-center justify-center text-[#E67E22] shrink-0 group-hover:scale-105 transition-transform">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#ECF0F1] group-hover:text-[#E67E22] flex items-center gap-1">
                    <span>Gate Scanner</span>
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-[#95A5A6] mt-0.5">
                    QR accreditation &amp; pass check-in
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/schedule"
                className="p-3.5 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 hover:border-[#2980B9] hover:bg-[#1A252F] transition-all group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#2980B9]/15 border border-[#2980B9]/30 flex items-center justify-center text-[#2980B9] shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#ECF0F1] group-hover:text-[#2980B9] flex items-center gap-1">
                    <span>Timeline Matrix</span>
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-[#95A5A6] mt-0.5">
                    Oct 15 - 17, 2026 program slots
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/messages"
                className="p-3.5 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 hover:border-rose-500 hover:bg-[#1A252F] transition-all group flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#ECF0F1] group-hover:text-rose-400 flex items-center gap-1">
                    <span>Helpdesk Inbox</span>
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-[#95A5A6] mt-0.5">
                    {metrics.unreadMessages || 0} Inquiries pending review
                  </p>
                </div>
              </Link>
            </div>

            {/* Category Breakdown Bar */}
            <div className="p-4 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#ECF0F1]">Festival Category Distribution</span>
                <span className="text-[11px] text-[#95A5A6]">
                  {metrics.totalRegistrations || 0} Passes • 29 Events
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#2980B9]/15 border border-[#2980B9]/30">
                  <div className="text-lg font-black text-[#2980B9] font-display">
                    {metrics.sportsRegistrations ?? metrics.registrationsByCategory?.SPORTS ?? 0}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#ECF0F1]">Sports</div>
                  <div className="text-[9px] text-[#95A5A6] mt-0.5">{metrics.sportsEvents || 9} Tournaments</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#E67E22]/15 border border-[#E67E22]/30">
                  <div className="text-lg font-black text-[#E67E22] font-display">
                    {metrics.culturalRegistrations ?? metrics.registrationsByCategory?.CULTURAL ?? 0}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#ECF0F1]">Cultural</div>
                  <div className="text-[9px] text-[#95A5A6] mt-0.5">{metrics.culturalEvents || 10} Stages</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#3498DB]/15 border border-[#3498DB]/30">
                  <div className="text-lg font-black text-[#3498DB] font-display">
                    {metrics.technicalRegistrations ?? metrics.registrationsByCategory?.TECHNICAL ?? 0}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#ECF0F1]">Technical</div>
                  <div className="text-[9px] text-[#95A5A6] mt-0.5">{metrics.technicalEvents || 10} Hackathons</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Pass Issuances Feed */}
          <div className="p-6 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-4 shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#95A5A6]/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E67E22]/15 border border-[#E67E22]/30 flex items-center justify-center text-[#E67E22]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#ECF0F1] font-display">
                      Recent Pass Issuances
                    </h3>
                    <p className="text-[11px] text-[#95A5A6]">
                      Real-time registration feed and verification status
                    </p>
                  </div>
                </div>
                <Link
                  to="/admin/registrations"
                  className="text-[11px] font-bold text-[#2980B9] hover:text-[#3498DB] flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {(!dashboardData?.recentRegistrations || dashboardData.recentRegistrations.length === 0) ? (
                  <div className="p-8 text-center text-xs text-[#95A5A6] bg-[#1A252F]/70 rounded-2xl border border-[#95A5A6]/20">
                    No registrations issued yet.
                  </div>
                ) : (
                  dashboardData.recentRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-3.5 rounded-2xl bg-[#1A252F]/70 border border-[#95A5A6]/20 flex items-center justify-between text-xs hover:border-[#2980B9]/40 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="font-bold font-mono text-[11px] text-[#E67E22]">{reg.registrationId}</div>
                        <div className="font-semibold text-[#ECF0F1] truncate">{reg.fullName}</div>
                        <div className="text-[11px] text-[#95A5A6] truncate">{reg.event?.title}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        reg.status === 'CHECKED_IN' || reg.checkedIn
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#2980B9]/15 text-[#2980B9] border border-[#2980B9]/30'
                      }`}>
                        {reg.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              to="/admin/registrations"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#2980B9] hover:bg-[#2980B9]/90 text-white transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Open Participant Roster &amp; Scanner</span>
            </Link>
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
