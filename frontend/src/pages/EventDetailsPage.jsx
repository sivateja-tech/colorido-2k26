import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Trophy, Users, ShieldAlert, CheckCircle,
  ArrowLeft, ArrowRight, Share2, LogIn, Clock, AlertCircle, Ticket,
  Phone, Mail, HelpCircle, FileText, Layers, ListChecks, Award,
  Check, ChevronDown, ChevronUp, Copy, ExternalLink, UserCheck
} from 'lucide-react';
import { fetchEventById, fetchMyRegistrations } from '../services/api';
import EventVisualCanvas from '../components/EventVisualCanvas';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';
import { getCategoryBadge } from '../utils/helpers';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRegistration, setUserRegistration] = useState(null);
  const [activeTab, setActiveTab] = useState('rounds'); // 'rounds', 'about', 'rules', 'requirements', 'prizes', 'organizers', 'faqs'
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchEventById(id);
        if (res.data?.success) {
          const ev = res.data.data;
          setEvent(ev);

          // Check if current user has registered for this event
          if (isAuthenticated) {
            try {
              const regRes = await fetchMyRegistrations();
              if (regRes.data?.success) {
                const found = regRes.data.data.find((r) => r.eventId === ev.id);
                if (found) setUserRegistration(found);
              }
            } catch (e) {
              // Non-fatal
            }
          }
        } else {
          setError(res.data?.message || 'Event not found');
        }
      } catch (err) {
        setError('Event not found or failed to connect to database.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isAuthenticated]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#2980B9] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#95A5A6] uppercase tracking-wider">
          Loading Event Details &amp; Tournament Structure...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto opacity-80" />
        <h2 className="text-2xl font-bold text-[#ECF0F1]">Event Not Found</h2>
        <p className="text-xs sm:text-sm text-[#95A5A6]">
          {error || 'The requested competition could not be located in the festival registry.'}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All 29 Events</span>
        </Link>
      </div>
    );
  }

  const categoryBadge = getCategoryBadge(event.category);
  const capacity = event.capacity || 50;
  const registeredCount = event.registeredCount || 0;
  const isFull = registeredCount >= capacity;

  // Fallback defaults if event has no nested rounds/organizers/faqs yet
  const rounds = (event.rounds && event.rounds.length > 0) ? event.rounds : [
    {
      roundNumber: 1,
      title: 'Round 1 – Prelims & Screening',
      description: 'Initial assessment round evaluating core fundamentals and tournament eligibility.',
      date: event.date,
      time: `${event.startTime} - 01:00 PM`,
      venue: event.venue,
      duration: '2 Hours',
      qualificationCriteria: 'Top scoring entries qualify directly for Round 2.'
    },
    {
      roundNumber: 2,
      title: 'Round 2 – Grand Finals',
      description: 'Championship showdown before faculty convenors and external referees.',
      date: event.date,
      time: '02:00 PM - ' + event.endTime,
      venue: event.venue,
      duration: '3 Hours',
      qualificationCriteria: 'Highest aggregate score wins 1st Place Gold and Championship Trophy.'
    }
  ];

  const organizers = (event.organizers && event.organizers.length > 0) ? event.organizers : [
    {
      name: 'Dr. G. Rama Mohan Rao',
      role: 'Faculty Convenor',
      department: 'Department of ' + (event.category === 'TECHNICAL' ? 'Computer Science & Engineering' : event.category === 'SPORTS' ? 'Physical Education' : 'Humanities'),
      phone: '+91 94402 58190',
      email: 'convenor.' + (event.category.toLowerCase()) + '@rvrjc.ac.in'
    },
    {
      name: 'K. Sai Krishna',
      role: 'Student Coordinator',
      department: 'Student Affairs Council',
      phone: '+91 98481 23419',
      email: 'coordinator@colorido2k26.com'
    }
  ];

  const faqs = (event.faqs && event.faqs.length > 0) ? event.faqs : [
    {
      question: 'Who is eligible to participate in this event?',
      answer: event.eligibility || 'All regular undergraduate and postgraduate students from recognized colleges and universities with valid college ID.'
    },
    {
      question: 'What are the reporting time and venue check-in requirements?',
      answer: `Participants must report to ${event.venue} at least 30 minutes before the scheduled start time (${event.startTime}) with their digital QR pass and physical college ID.`
    },
    {
      question: 'Will participation certificates be awarded?',
      answer: 'Yes! All registered participants who attend and participate in the tournament will receive official COLORIDO 2K26 digital certificates signed by college authorities.'
    }
  ];

  const tabs = [
    { id: 'rounds', label: 'Rounds & Schedule', icon: Layers, count: rounds.length },
    { id: 'about', label: 'About Event', icon: FileText },
    { id: 'rules', label: 'Rules & Guidelines', icon: CheckCircle },
    { id: 'requirements', label: 'Requirements & Dates', icon: ListChecks },
    { id: 'prizes', label: 'Prizes & Rewards', icon: Trophy },
    { id: 'organizers', label: 'Organizers & Contact', icon: Users, count: organizers.length },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, count: faqs.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Bar: Back & Share (Mobile-optimized) */}
      <div className="flex items-center justify-between gap-2">
        <BackButton fallback="/events" label="Back to Events" />

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#ECF0F1] bg-[#2C3E50] hover:bg-[#34495E] border border-[#95A5A6]/20 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#2980B9]" />
                <span className="hidden sm:inline">Share Event</span>
              </>
            )}
          </button>

          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#95A5A6] hover:text-[#ECF0F1] bg-[#1a252f] border border-[#95A5A6]/20 transition-colors"
          >
            <span>All Events</span>
          </Link>
        </div>
      </div>

      {/* Main Event Showcase Banner Card */}
      <div className="rounded-3xl overflow-hidden bg-[#2C3E50]/80 border border-[#95A5A6]/20 shadow-2xl">
        {/* Animated Visual Canvas */}
        <div className="relative h-48 sm:h-72 md:h-80 w-full overflow-hidden border-b border-[#95A5A6]/20">
          <EventVisualCanvas
            visualType={event.visualType || event.type || event.slug}
            isHovered={true}
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-2 z-10">
            <span className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${categoryBadge.bg}`}>
              {categoryBadge.label}
            </span>
            {event.featured && (
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#E67E22]/25 text-[#E67E22] border border-[#E67E22]/40 backdrop-blur-md">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Hero Title & Primary Action Area */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-[#ECF0F1] tracking-tight">
                {event.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#95A5A6] flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>R V R &amp; J C College of Engineering</span>
                <span>•</span>
                <span className="text-[#2980B9] font-bold">{event.category} Championship</span>
                <span>•</span>
                <span>{rounds.length} Structured Rounds</span>
              </p>
            </div>

            {/* Main Call to Action Button */}
            <div className="shrink-0 w-full sm:w-auto">
              {userRegistration ? (
                <Link
                  to={`/pass/${userRegistration.registrationId || userRegistration.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Registration Pass</span>
                </Link>
              ) : isFull ? (
                <div className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-[#95A5A6] bg-[#1a252f] border border-[#95A5A6]/20 text-center cursor-not-allowed">
                  Registration Closed
                </div>
              ) : isAuthenticated ? (
                <Link
                  to={`/register?event=${event.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/25 transition-all hover:scale-[1.02]"
                >
                  <span>Register for Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to={`/auth?redirect=/events/${event.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/25 transition-all hover:scale-[1.02]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Register</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip (Mobile friendly 2x2 grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
            <div className="p-3 sm:p-4 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#95A5A6] uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-[#E67E22]" />
                <span>Prize Pool</span>
              </div>
              <p className="text-base sm:text-lg font-black font-display text-[#E67E22]">{event.prizePool}</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#95A5A6] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#2980B9]" />
                <span>Date</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#ECF0F1] truncate">{event.date}</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#95A5A6] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Time</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#ECF0F1] truncate">{event.startTime} - {event.endTime}</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#95A5A6] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Venue</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#ECF0F1] truncate">{event.venue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Mobile Touch-Friendly Horizontal Scroll) */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2 min-w-max p-1.5 rounded-2xl bg-[#1a252f] border border-[#95A5A6]/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2980B9] text-white shadow-md'
                    : 'text-[#95A5A6] hover:text-[#ECF0F1] hover:bg-[#2C3E50]/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#2C3E50] text-[#95A5A6]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area Based on Active Tab */}
      <div className="space-y-6">

        {/* 1. TOURNAMENT ROUNDS SECTION */}
        {activeTab === 'rounds' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display text-[#ECF0F1]">
                  Tournament Structure &amp; Progression
                </h2>
                <p className="text-xs sm:text-sm text-[#95A5A6]">
                  {rounds.length} sequential competition rounds with official timing, venues, and qualification criteria.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {rounds.map((round, idx) => (
                <div
                  key={round.id || idx}
                  className="p-5 sm:p-7 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-4 transition-all hover:border-[#2980B9]/40 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#95A5A6]/15 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-[#2980B9]/20 text-[#2980B9] border border-[#2980B9]/30">
                        Stage {round.roundNumber || idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#ECF0F1]">
                        {round.title}
                      </h3>
                    </div>

                    {round.duration && (
                      <span className="self-start sm:self-auto text-[11px] font-semibold text-[#95A5A6] px-2.5 py-1 rounded-lg bg-[#1a252f] border border-[#95A5A6]/20">
                        Duration: {round.duration}
                      </span>
                    )}
                  </div>

                  {round.description && (
                    <p className="text-xs sm:text-sm text-[#ECF0F1]/90 leading-relaxed">
                      {round.description}
                    </p>
                  )}

                  {/* Round Logistics Meta Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#95A5A6]">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/15">
                      <Calendar className="w-3.5 h-3.5 text-[#2980B9] shrink-0" />
                      <span className="truncate">{round.date || event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/15">
                      <Clock className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                      <span className="truncate">{round.time || `${event.startTime} - ${event.endTime}`}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1a252f] border border-[#95A5A6]/15">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{round.venue || event.venue}</span>
                    </div>
                  </div>

                  {/* Qualification Criteria Callout */}
                  {round.qualificationCriteria && (
                    <div className="p-3.5 rounded-2xl bg-[#2980B9]/10 border border-[#2980B9]/25 text-xs text-[#ECF0F1] space-y-1">
                      <p className="font-bold text-[#2980B9] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-[#2980B9]" />
                        <span>Advancement &amp; Qualification Criteria:</span>
                      </p>
                      <p className="text-xs text-[#ECF0F1]/90 leading-relaxed pl-5">
                        {round.qualificationCriteria}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ABOUT & DETAILS SECTION */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-4">
              <h2 className="text-xl font-bold font-display text-[#ECF0F1]">
                About {event.title}
              </h2>
              <div className="text-xs sm:text-sm text-[#ECF0F1]/90 leading-relaxed whitespace-pre-line space-y-3">
                {event.description}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-[#1a252f] border border-[#95A5A6]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2980B9]">
                  <Users className="w-4 h-4" />
                  <span>Participant Format</span>
                </div>
                <p className="text-sm font-semibold text-[#ECF0F1]">
                  {event.participantType === 'TEAM'
                    ? `Team Competition (${event.minTeamSize || 2} - ${event.maxTeamSize || 4} Members)`
                    : 'Solo / Individual Competition'}
                </p>
                <p className="text-xs text-[#95A5A6]">
                  {event.participantType === 'TEAM'
                    ? 'All squad members must be bonafide students of the same enrolled college.'
                    : 'Individual participant representing their institution.'}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#1a252f] border border-[#95A5A6]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E67E22]">
                  <Award className="w-4 h-4" />
                  <span>Institutional Accreditation</span>
                </div>
                <p className="text-sm font-semibold text-[#ECF0F1]">
                  R V R &amp; J C College of Engineering
                </p>
                <p className="text-xs text-[#95A5A6]">
                  NAAC A+ Accredited Institution • Official faculty convenorship and authorized collegiate certificates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. RULES & GUIDELINES SECTION */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#2980B9]" />
                <h2 className="text-xl font-bold font-display text-[#ECF0F1]">
                  Official Rules &amp; Tournament Regulations
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-[#ECF0F1]/90 leading-relaxed whitespace-pre-line bg-[#1a252f] p-5 sm:p-6 rounded-2xl border border-[#95A5A6]/20 font-sans space-y-2">
                {event.rules || 'Standard inter-collegiate tournament guidelines and AICTE/Association codes apply.'}
              </div>
            </div>

            {event.eligibility && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#E67E22]" />
                  <h3 className="text-lg font-bold font-display text-[#ECF0F1]">
                    Eligibility &amp; Code of Conduct
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#95A5A6] leading-relaxed whitespace-pre-line">
                  {event.eligibility}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. REQUIREMENTS & IMPORTANT DATES */}
        {activeTab === 'requirements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-4">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-[#2980B9]" />
                <h2 className="text-lg sm:text-xl font-bold font-display text-[#ECF0F1]">
                  Mandatory Requirements
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-[#ECF0F1]/90 leading-relaxed whitespace-pre-line bg-[#1a252f] p-5 rounded-2xl border border-[#95A5A6]/20">
                {event.requirements || (
                  `• Bonafide student ID card & festival QR entry pass\n• Reporting to ${event.venue} 30 mins prior to event start\n• Appropriate gear/equipment as mandated by event convenor`
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E67E22]" />
                <h2 className="text-lg sm:text-xl font-bold font-display text-[#ECF0F1]">
                  Important Dates &amp; Milestones
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-[#ECF0F1]/90 leading-relaxed whitespace-pre-line bg-[#1a252f] p-5 rounded-2xl border border-[#95A5A6]/20">
                {event.importantDates || (
                  `• Online Registration Closes: October 13, 2026 (11:59 PM)\n• Spot Desk Verification: October 15, 2026 (08:00 AM)\n• Tournament Schedule Release: October 14, 2026\n• Grand Valedictory Ceremony: October 17, 2026 (06:00 PM)`
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. PRIZES & AWARDS */}
        {activeTab === 'prizes' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-[#ECF0F1]">
                Championship Prizes &amp; Recognitions
              </h2>
              <p className="text-xs sm:text-sm text-[#95A5A6] mt-1">
                Official awards distributed during the grand valedictory ceremony at RVR&amp;JC Central Amphitheatre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold text-xl">
                  🥇
                </div>
                <h3 className="font-bold text-sm text-amber-300">1st Place (Winner)</h3>
                <p className="text-2xl font-black font-mono text-amber-400">
                  {event.firstPrize || '₹12,000'}
                </p>
                <p className="text-[11px] text-amber-300/80">Gold Medals + Rolling Trophy + Merit Certificate</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-400/10 border border-slate-400/30 space-y-2 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-400/20 text-slate-300 mx-auto flex items-center justify-center font-bold text-xl">
                  🥈
                </div>
                <h3 className="font-bold text-sm text-slate-200">2nd Place (Runner Up)</h3>
                <p className="text-2xl font-black font-mono text-slate-300">
                  {event.secondPrize || '₹8,000'}
                </p>
                <p className="text-[11px] text-slate-400">Silver Medals + Runner Trophy + Merit Certificate</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#2980B9]/10 border border-[#2980B9]/30 space-y-2 text-center">
                <div className="w-12 h-12 rounded-full bg-[#2980B9]/20 text-[#2980B9] mx-auto flex items-center justify-center font-bold text-xl">
                  🏆
                </div>
                <h3 className="font-bold text-sm text-[#2980B9]">Total Pool Value</h3>
                <p className="text-2xl font-black font-mono text-[#ECF0F1]">
                  {event.prizePool}
                </p>
                <p className="text-[11px] text-[#95A5A6]">Official Institutional Recognition by College Principal</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. EVENT ORGANIZERS (WITH 1-TAP CALL & EMAIL) */}
        {activeTab === 'organizers' && (
          <div className="space-y-4">
            <div className="p-1">
              <h2 className="text-xl sm:text-2xl font-black font-display text-[#ECF0F1]">
                Event Organizers &amp; Faculty Leads
              </h2>
              <p className="text-xs sm:text-sm text-[#95A5A6]">
                Have questions regarding rules, schedules, or kit requirements? Contact the event team directly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizers.map((org, idx) => (
                <div
                  key={org.id || idx}
                  className="p-5 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 space-y-4 shadow-md transition-all hover:border-[#2980B9]/40"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2980B9]/20 text-[#2980B9] border border-[#2980B9]/30">
                      {org.role}
                    </span>
                    <h3 className="text-base font-bold text-[#ECF0F1]">
                      {org.name}
                    </h3>
                    <p className="text-xs text-[#95A5A6] line-clamp-1">
                      {org.department}
                    </p>
                  </div>

                  {/* 1-Tap Action Buttons (Mobile-first large targets) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#95A5A6]/15">
                    <a
                      href={`tel:${org.phone}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`mailto:${org.email}?subject=COLORIDO 2K26: Inquiry regarding ${encodeURIComponent(event.title)}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#ECF0F1] bg-[#1a252f] hover:bg-[#243342] border border-[#95A5A6]/25 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#E67E22]" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. FAQS SECTION */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div className="p-1">
              <h2 className="text-xl sm:text-2xl font-black font-display text-[#ECF0F1]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#95A5A6]">
                Common queries regarding participation, tournament logistics, and certificates.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={faq.id || idx}
                    className="rounded-2xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#ECF0F1] hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#2980B9] shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#95A5A6] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#95A5A6] shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#95A5A6] leading-relaxed border-t border-[#95A5A6]/10 animate-in fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Registration Callout Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-palette-midnight via-palette-midnight to-palette-blue/20 border border-palette-blue/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-palette-orange">Official Championship Entry</span>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">Ready to Compete in {event.title}?</h3>
          <p className="text-xs text-palette-clouds/70 max-w-xl">
            Registrations are open across 50+ colleges. Review the rounds and guidelines above, then secure your official digital pass.
          </p>
        </div>
        <div className="shrink-0">
          {userRegistration ? (
            <Link
              to={`/pass/${userRegistration.registrationId || userRegistration.id}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>View Registration Pass</span>
            </Link>
          ) : isFull ? (
            <div className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-dark-muted bg-dark-bg border border-dark-border text-center cursor-not-allowed">
              Registration Closed
            </div>
          ) : isAuthenticated ? (
            <Link
              to={`/register?event=${event.id}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-palette-blue hover:bg-palette-blue/90 shadow-lg shadow-palette-blue/25 transition-all hover:scale-[1.02]"
            >
              <span>Register for Event</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to={`/auth?redirect=/events/${event.id}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-palette-blue hover:bg-palette-blue/90 shadow-lg shadow-palette-blue/25 transition-all hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Register</span>
            </Link>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile (< sm) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#2C3E50]/95 backdrop-blur-md border-t border-[#95A5A6]/20 p-3 px-4 flex items-center justify-between shadow-2xl">
        <div className="truncate pr-2">
          <div className="text-xs font-bold text-white truncate">{event.title}</div>
          <div className="text-[10px] text-palette-orange font-bold font-mono">Prize: {event.prizePool}</div>
        </div>
        <div className="shrink-0">
          {userRegistration ? (
            <Link
              to={`/pass/${userRegistration.registrationId || userRegistration.id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md inline-flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>View Pass</span>
            </Link>
          ) : isFull ? (
            <span className="px-3 py-2 text-xs font-bold text-palette-clouds/50">Full</span>
          ) : isAuthenticated ? (
            <Link
              to={`/register?event=${event.id}`}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-palette-blue hover:bg-palette-blue/90 shadow-md inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/auth?redirect=/events/${event.id}`}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-palette-blue hover:bg-palette-blue/90 shadow-md inline-flex items-center gap-1.5 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
