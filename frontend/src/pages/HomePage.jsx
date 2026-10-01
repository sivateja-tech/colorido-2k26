import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Trophy,
  Calendar,
  Users,
  MapPin,
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
import {
  DoodleUnderline,
  DoodleDoubleUnderline,
  DoodleCircle,
  DoodleHighlight,
  DoodleSparkle,
  DoodleArrow,
  DoodleBrackets,
  DoodleSportsIcon,
  DoodleCulturalIcon,
  DoodleTechnicalIcon,
  DoodleDivider
} from '../components/doodles/DoodleAccents';

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
    { num: '01', label: 'Prize Pool', value: '₹2,50,000+', icon: Trophy, color: 'text-[#E67E22]' },
    { num: '02', label: 'Tournaments', value: '29 Events', icon: Zap, color: 'text-[#2980B9]' },
    { num: '03', label: 'Colleges', value: '50+ Campuses', icon: Award, color: 'text-emerald-400' },
    { num: '04', label: 'Footfall', value: '5,000+ Students', icon: Users, color: 'text-[#ECF0F1]' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ========================================================
          HERO SECTION (Editorial & Custom Typography)
          ======================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#2980B9]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#E67E22]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* Institutional Accreditation Pill with Monospace Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#2C3E50]/80 border border-[#95A5A6]/20 shadow-md backdrop-blur-md">
            <img src="/rvrjc_logo.png" alt={COLLEGE_NAME} className="w-5 h-5 object-contain" />
            <span className="text-xs sm:text-sm font-semibold text-[#ECF0F1]">
              {COLLEGE_NAME} Presents
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
            <span className="text-[11px] font-mono font-bold text-[#95A5A6] uppercase tracking-wider">
              NAAC A+
            </span>
          </div>

          {/* Primary Editorial Display Headline with Hand-Drawn Doodle Language */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-[#ECF0F1] leading-none">
              <span className="relative inline-block">
                <span>COLORIDO</span>
                <DoodleDoubleUnderline
                  color="#E67E22"
                  secondaryColor="#2980B9"
                  className="absolute -bottom-3 sm:-bottom-4 left-0 w-full"
                />
              </span>{' '}
              <span className="relative inline-block text-[#E67E22] ml-2">
                <span>2K26</span>
                <DoodleSparkle
                  color="#FBBF24"
                  size={26}
                  className="absolute -top-3 sm:-top-5 -right-6 sm:-right-8 animate-pulse"
                />
              </span>
            </h1>

            <p className="text-lg sm:text-2xl md:text-3xl font-medium text-[#BDC3C7] max-w-3xl mx-auto tracking-wide leading-relaxed pt-2">
              {FESTIVAL_TAGLINE}
            </p>

            <p className="text-xs sm:text-sm text-[#95A5A6] max-w-xl mx-auto font-sans leading-relaxed">
              South India&apos;s premier national inter-collegiate convergence uniting sports championships, cultural arts, and technical hackathons.
            </p>
          </div>

          {/* Real Countdown Timer */}
          <div className="py-2">
            <CountdownTimer />
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white bg-[#2980B9] hover:bg-[#2471A3] shadow-lg shadow-[#2980B9]/25 transition-all hover:scale-[1.02]"
            >
              <span>Explore Events</span>
              <DoodleArrow color="#FFFFFF" width={22} height={12} className="group-hover:translate-x-1 transition-transform" />
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
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm font-mono text-[#95A5A6]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2980B9]" />
              <span className="text-[#ECF0F1] font-sans font-medium">{FESTIVAL_DATES_DISPLAY}</span>
            </div>
            <span className="text-[#95A5A6]/40">•</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E67E22]" />
              <span className="font-sans">{FESTIVAL_VENUE_DISPLAY}</span>
            </div>
          </div>
        </div>
      </section>

      <DoodleDivider />

      {/* ========================================================
          EDITORIAL FESTIVAL METRICS STRIP
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 sm:p-6 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 backdrop-blur-sm space-y-3 transition-all duration-300 hover:border-[#95A5A6]/50 hover:-translate-y-0.5"
              >
                {/* Index Numeral Treatment */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#95A5A6]">
                  <span className="font-bold text-xs">{item.num}</span>
                  <div className={`p-1.5 rounded-lg bg-[#1a252f] ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#95A5A6]">
                    {item.label}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black font-display tracking-tight ${item.color}`}>
                    {item.value}
                  </div>
                </div>

                {/* Micro Doodle Highlight on Hover */}
                <div className="w-8 h-0.5 bg-[#95A5A6]/20 group-hover:w-16 group-hover:bg-[#E67E22] transition-all duration-500 rounded-full" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          THREE PILLARS: SPORTS, CULTURAL, TECHNICAL
          Editorial Treatment with Hand-Drawn Contextual Accents
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#2980B9] uppercase">
            <span>02. FESTIVAL SPECTRUM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-[#ECF0F1] tracking-tight">
            Three Grand Categories
          </h2>
          <p className="text-sm sm:text-base text-[#95A5A6] max-w-2xl mx-auto leading-relaxed">
            Compete, perform, and engineer solutions across Sports championships, Cultural stage spectacles, and Technical innovation sprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sports Card */}
          <Link
            to="/events/sports"
            className="group relative p-8 rounded-3xl bg-[#2C3E50]/60 border border-[#95A5A6]/20 hover:border-emerald-500/50 transition-all duration-300 shadow-md hover:shadow-2xl space-y-5"
          >
            {/* Header: Contextual Line Illustration & Section Tag */}
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <DoodleSportsIcon color="#10B981" size={28} />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#1a252f] text-emerald-400 border border-emerald-500/30">
                01 • SPORTS
              </span>
            </div>

            {/* Title with Hand-Drawn Underline on Hover */}
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                9 Tournaments
              </span>
              <div className="relative inline-block">
                <h3 className="text-2xl font-bold font-display text-[#ECF0F1] group-hover:text-emerald-400 transition-colors">
                  Sports Championship
                </h3>
                <DoodleUnderline
                  color="#10B981"
                  height="8px"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#95A5A6] leading-relaxed">
              Cricket, Football, Basketball, Volleyball, Badminton, Chess, Kabaddi, Table Tennis, and Track &amp; Field Athletics under floodlights.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 pt-3 border-t border-[#95A5A6]/15">
              <span>View Sports Events</span>
              <DoodleArrow color="#10B981" width={20} height={10} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Cultural Card */}
          <Link
            to="/events/cultural"
            className="group relative p-8 rounded-3xl bg-[#2C3E50]/60 border border-[#95A5A6]/20 hover:border-[#E67E22]/50 transition-all duration-300 shadow-md hover:shadow-2xl space-y-5"
          >
            {/* Header: Contextual Line Illustration & Section Tag */}
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#E67E22]/10 border border-[#E67E22]/20 text-[#E67E22]">
                <DoodleCulturalIcon color="#E67E22" size={28} />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#1a252f] text-[#E67E22] border border-[#E67E22]/30">
                02 • CULTURAL
              </span>
            </div>

            {/* Title with Hand-Drawn Underline on Hover */}
            <div>
              <span className="text-xs font-mono font-bold text-[#E67E22] uppercase tracking-wider block mb-1">
                10 Competitions
              </span>
              <div className="relative inline-block">
                <h3 className="text-2xl font-bold font-display text-[#ECF0F1] group-hover:text-[#E67E22] transition-colors">
                  Cultural Expressions
                </h3>
                <DoodleUnderline
                  color="#E67E22"
                  height="8px"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#95A5A6] leading-relaxed">
              Dance, Singing, Solo &amp; Group Bands, Drama, Fashion Show, Photography, Painting, Quiz, and Parliamentary Debates on open-air mainstage.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-[#E67E22] pt-3 border-t border-[#95A5A6]/15">
              <span>View Cultural Events</span>
              <DoodleArrow color="#E67E22" width={20} height={10} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Technical Card */}
          <Link
            to="/events/technical"
            className="group relative p-8 rounded-3xl bg-[#2C3E50]/60 border border-[#95A5A6]/20 hover:border-[#2980B9]/50 transition-all duration-300 shadow-md hover:shadow-2xl space-y-5"
          >
            {/* Header: Contextual Line Illustration & Section Tag */}
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#2980B9]/10 border border-[#2980B9]/20 text-[#3498DB]">
                <DoodleTechnicalIcon color="#3498DB" size={28} />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#1a252f] text-[#3498DB] border border-[#2980B9]/30">
                03 • TECHNICAL
              </span>
            </div>

            {/* Title with Hand-Drawn Underline on Hover */}
            <div>
              <span className="text-xs font-mono font-bold text-[#3498DB] uppercase tracking-wider block mb-1">
                10 Challenges
              </span>
              <div className="relative inline-block">
                <h3 className="text-2xl font-bold font-display text-[#ECF0F1] group-hover:text-[#3498DB] transition-colors">
                  Technical Arena
                </h3>
                <DoodleUnderline
                  color="#3498DB"
                  height="8px"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#95A5A6] leading-relaxed">
              24H Hackathon, Coding Contest, Debugging Contest, Tech Quiz, Paper Presentation, Project Expo, UI/UX, Web Dev, AI/ML, and Code Relay.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-[#3498DB] pt-3 border-t border-[#95A5A6]/15">
              <span>View Technical Events</span>
              <DoodleArrow color="#3498DB" width={20} height={10} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      <DoodleDivider />

      {/* ========================================================
          FEATURED EVENTS SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#2980B9] uppercase">
              <span>03. SPOTLIGHT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#ECF0F1] mt-1.5">
              Featured Competitions
            </h2>
          </div>
          <Link
            to="/events"
            className="group inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#ECF0F1] hover:text-[#2980B9] transition-colors"
          >
            <span>Browse All 29 Events</span>
            <DoodleArrow color="#2980B9" width={24} height={12} className="group-hover:translate-x-1.5 transition-transform" />
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

      <DoodleDivider />

      {/* ========================================================
          COLLEGE IDENTITY & ACCREDITATION BANNER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#2C3E50]/70 border border-[#95A5A6]/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>NAAC A+ ACCREDITED • ESTD 1985</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#ECF0F1]">
              R V R &amp; J C College of Engineering
            </h2>

            <p className="text-sm text-[#95A5A6] leading-relaxed max-w-2xl font-sans">
              Nestled across 37 lush green acres in Guntur, Andhra Pradesh, RVR&amp;JC stands as a pioneering institution of technical excellence, sportsmanship, and student leadership. COLORIDO 2K26 embodies four decades of collegiate distinction.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold font-mono text-[#ECF0F1] bg-[#1a252f] border border-[#95A5A6]/20 hover:border-[#2980B9]/50 transition-all"
              >
                <span>Read Institutional History</span>
                <DoodleArrow color="#2980B9" width={18} height={10} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="p-6 rounded-3xl bg-[#1a252f] border border-[#95A5A6]/20 text-center space-y-3 max-w-xs shadow-lg">
              <img
                src="/rvrjc_logo.png"
                alt="RVRJC College Emblem"
                className="w-24 h-24 object-contain mx-auto"
              />
              <div>
                <p className="text-sm font-bold font-display text-[#ECF0F1]">Official College Seal</p>
                <p className="text-[11px] font-mono text-[#95A5A6]">Guntur, Andhra Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
