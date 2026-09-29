import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Trophy,
  Calendar,
  Users,
  MapPin,
  Flame,
  Shield,
  CheckCircle,
  Award,
  Zap,
  Ticket
} from 'lucide-react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import CountdownTimer from '../components/CountdownTimer';
import {
  FESTIVAL_NAME,
  FESTIVAL_TAGLINE,
  COLLEGE_NAME,
  COLLEGE_LOCATION,
  FESTIVAL_DATES_DISPLAY,
  FESTIVAL_VENUE_DISPLAY
} from '../utils/constants';

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchEvents({ featured: 'true', limit: 6 });
        if (res.data?.success) {
          setFeaturedEvents(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load featured events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const stats = [
    { label: 'Prize Pool', value: '₹2,50,000+', icon: Trophy, color: 'text-[#E67E22]' },
    { label: 'Competitions', value: '29 Events', icon: Zap, color: 'text-[#2980B9]' },
    { label: 'Institutions', value: '50+ Colleges', icon: Award, color: 'text-emerald-400' },
    { label: 'Expected Footfall', value: '5,000+ Students', icon: Users, color: 'text-[#ECF0F1]' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ========================================================
          HERO SECTION (Elevated & Refined)
          ======================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#2980B9]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#E67E22]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* Institutional Accreditation Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#2C3E50]/80 border border-[#95A5A6]/20 shadow-md backdrop-blur-md">
            <img src="/rvrjc_logo.png" alt={COLLEGE_NAME} className="w-5 h-5 object-contain" />
            <span className="text-xs sm:text-sm font-semibold text-[#ECF0F1]">
              {COLLEGE_NAME} Presents
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
            <span className="text-[11px] font-bold text-[#95A5A6] uppercase tracking-wider">
              NAAC A+ Accredited
            </span>
          </div>

          {/* Primary Display Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-[#ECF0F1]">
              COLORIDO <span className="text-[#E67E22]">2K26</span>
            </h1>

            <p className="text-lg sm:text-2xl md:text-3xl font-medium text-[#95A5A6] max-w-3xl mx-auto tracking-wide leading-relaxed">
              {FESTIVAL_TAGLINE}
            </p>
            <p className="text-xs sm:text-sm text-[#95A5A6]/80 max-w-xl mx-auto">
              South India's premier national inter-collegiate convergence uniting sports championships, cultural arts, and technical hackathons.
            </p>
          </div>

          {/* Real Countdown Timer */}
          <div className="py-2">
            <CountdownTimer />
          </div>

          {/* Hero Action Buttons (Star-free clean professional CTAs) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/25 transition-all hover:scale-[1.02]"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/auth?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-[#ECF0F1] bg-[#2C3E50] hover:bg-[#34495E] border border-[#95A5A6]/30 shadow-md transition-all hover:scale-[1.02]"
            >
              <Ticket className="w-4 h-4 text-[#E67E22]" />
              <span>Register Now</span>
            </Link>
          </div>

          {/* Quick Festival Info Pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-[#95A5A6]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2980B9]" />
              <span className="text-[#ECF0F1] font-medium">{FESTIVAL_DATES_DISPLAY}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E67E22]" />
              <span>{FESTIVAL_VENUE_DISPLAY}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FESTIVAL METRICS STRIP
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 backdrop-blur-sm space-y-2 text-center sm:text-left transition-all hover:border-[#95A5A6]/40"
              >
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <div className={`p-2 rounded-xl bg-[#1a252f] ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#95A5A6]">
                    {item.label}
                  </span>
                </div>
                <div className={`text-2xl sm:text-3xl font-black font-display ${item.color}`}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          THREE PILLARS: SPORTS, CULTURAL, TECHNICAL
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <p className="text-xs uppercase font-extrabold tracking-widest text-[#2980B9]">
            Festival Spectrum
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#ECF0F1]">
            Three Grand Categories
          </h2>
          <p className="text-sm sm:text-base text-[#95A5A6] max-w-2xl mx-auto">
            Compete, perform, and build across Sports, Cultural, and Technical events, each designed with its own challenges, experiences, and competition formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sports Card */}
          <Link
            to="/events/sports"
            className="group relative p-8 rounded-3xl bg-[#2C3E50]/60 border border-[#95A5A6]/20 hover:border-emerald-500/50 transition-all duration-300 shadow-md hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xl">
              ⚽
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                9 Tournaments
              </span>
              <h3 className="text-2xl font-bold font-display text-[#ECF0F1] group-hover:text-emerald-400 transition-colors">
                Sports Championship
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#95A5A6] leading-relaxed">
              Cricket, Football, Basketball, Volleyball, Badminton, Chess, Kabaddi, Table Tennis, and Track &amp; Field Athletics under floodlights.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 pt-2">
              <span>View Sports Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Cultural Card */}
          <Link
            to="/events/cultural"
            className="group relative p-8 rounded-3xl bg-[#2C3E50]/60 border border-[#95A5A6]/20 hover:border-[#E67E22]/50 transition-all duration-300 shadow-md hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E67E22]/15 text-[#E67E22] flex items-center justify-center font-bold text-xl">
              🎭
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#E67E22] uppercase tracking-wider">
                10 Competitions
              </span>
              <h3 className="text-2xl font-bold font-display text-[#ECF0F1] group-hover:text-[#E67E22] transition-colors">
                Cultural Expressions
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#95A5A6] leading-relaxed">
              Dance, Singing, Solo &amp; Group Bands, Drama, Fashion Show, Photography, Painting, Quiz, and Parliamentary Debates on open-air mainstage.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E67E22] pt-2">
              <span>View Cultural Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Technical Card */}
          <Link
            to="/events/technical"
            className="group relative p-8 rounded-3xl bg-[#2C3E50]/60 border border-[#95A5A6]/20 hover:border-[#2980B9]/50 transition-all duration-300 shadow-md hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#2980B9]/15 text-[#3498DB] flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#3498DB] uppercase tracking-wider">
                10 Challenges
              </span>
              <h3 className="text-2xl font-bold font-display text-[#ECF0F1] group-hover:text-[#3498DB] transition-colors">
                Technical Arena
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#95A5A6] leading-relaxed">
              24H Hackathon, Coding Contest, Debugging Contest, Tech Quiz, Paper Presentation, Project Expo, UI/UX, Web Dev, AI/ML, and Code Relay.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3498DB] pt-2">
              <span>View Technical Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================
          FEATURED EVENTS SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-[#2980B9]">
              Flagship Highlights
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#ECF0F1] mt-1">
              Featured Competitions
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2980B9] hover:underline"
          >
            <span>Browse All 29 Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#2C3E50]/40 border border-[#95A5A6]/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          COLLEGE IDENTITY & ACCREDITATION BANNER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>NAAC A+ Accredited Institution • Estd 1985</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#ECF0F1]">
              R V R &amp; J C College of Engineering
            </h2>

            <p className="text-sm text-[#95A5A6] leading-relaxed max-w-2xl">
              Nestled across 37 lush green acres in Guntur, Andhra Pradesh, RVR&amp;JC stands as a pioneering institution of technical excellence, sportsmanship, and student leadership. COLORIDO 2K26 embodies four decades of collegiate distinction.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#ECF0F1] bg-[#1a252f] border border-[#95A5A6]/20 hover:border-[#2980B9]/50 transition-all"
              >
                <span>Read Institutional History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="p-6 rounded-3xl bg-[#1a252f] border border-[#95A5A6]/20 text-center space-y-3 max-w-xs">
              <img
                src="/rvrjc_logo.png"
                alt="RVRJC College Emblem"
                className="w-24 h-24 object-contain mx-auto"
              />
              <div>
                <p className="text-sm font-bold text-[#ECF0F1]">Official College Seal</p>
                <p className="text-[11px] text-[#95A5A6]">Guntur, Andhra Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
