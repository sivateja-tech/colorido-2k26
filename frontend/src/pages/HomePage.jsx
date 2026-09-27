import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Trophy,
  Calendar,
  Users,
  Sparkles,
  MapPin,
  Flame,
  Shield,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import CountdownTimer from '../components/CountdownTimer';
import EventVisualCanvas from '../components/EventVisualCanvas';
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
  const [activeInteractiveVisual, setActiveInteractiveVisual] = useState('cricket');

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

  const interactiveShowcases = [
    { id: 'cricket', name: 'Cricket', category: 'SPORTS' },
    { id: 'football', name: 'Football', category: 'SPORTS' },
    { id: 'basketball', name: 'Basketball', category: 'SPORTS' },
    { id: 'badminton', name: 'Badminton', category: 'SPORTS' },
    { id: 'hackathon', name: 'Hackathon', category: 'TECHNICAL' },
    { id: 'coding', name: 'Coding', category: 'TECHNICAL' },
    { id: 'dance', name: 'Dance', category: 'CULTURAL' },
    { id: 'singing', name: 'Singing', category: 'CULTURAL' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ========================================================
          HERO SECTION (Section 13)
          Main heading: COLORIDO 2K26
          Supporting text: A premium inter-collegiate sports, cultural and technical experience.
          Buttons: Explore Events, Register
          ======================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-purple/10 dark:bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-brand-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-surface/80 dark:bg-dark-surface/80 light:bg-light-surface/90 border border-dark-border dark:border-dark-border light:border-light-border shadow-md backdrop-blur-md">
            <img src="/rvrjc_logo.png" alt={COLLEGE_NAME} className="w-5 h-5 object-contain" />
            <span className="text-xs sm:text-sm font-semibold text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary">
              {COLLEGE_NAME} Presents
            </span>
          </div>

          {/* Primary Display Headline (Strictly COLORIDO 2K26) */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-dark-text dark:text-dark-text light:text-light-text">
              COLORIDO <span className="text-brand-purple dark:text-brand-accent light:text-brand-light-primary">2K26</span>
            </h1>

            <p className="text-lg sm:text-2xl md:text-3xl font-medium text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary max-w-3xl mx-auto tracking-wide leading-relaxed">
              {FESTIVAL_TAGLINE}
            </p>
          </div>

          {/* Real Countdown Timer (Section 14) */}
          <div className="py-2">
            <CountdownTimer />
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white bg-brand-purple hover:bg-brand-purple-hover dark:bg-brand-purple dark:hover:bg-brand-purple-hover light:bg-brand-light-primary light:hover:bg-brand-light-hover shadow-lg hover:shadow-brand-purple/25 transition-all hover:scale-[1.02]"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-dark-text dark:text-dark-text light:text-light-text bg-dark-surface dark:bg-dark-surface light:bg-light-surface hover:bg-dark-elevated dark:hover:bg-dark-elevated light:hover:bg-slate-100 border border-dark-border dark:border-dark-border light:border-light-border shadow-md transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-brand-purple dark:text-brand-accent" />
              <span>Register</span>
            </Link>
          </div>

          {/* Quick Festival Info Pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-dark-muted dark:text-dark-muted light:text-light-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-secondary" />
              <span>{FESTIVAL_DATES_DISPLAY}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-error" />
              <span>{FESTIVAL_VENUE_DISPLAY}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          THREE PILLARS: SPORTS, CULTURAL, TECHNICAL
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <p className="text-xs uppercase font-extrabold tracking-widest text-brand-purple dark:text-brand-accent light:text-brand-light-primary">
            Festival Spectrum
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-dark-text dark:text-dark-text light:text-light-text">
            Three Grand Categories
          </h2>
          <p className="text-sm sm:text-base text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary max-w-2xl mx-auto">
            Compete, perform, and build with 29 database-driven events backed by official faculty convenors and collegiate referees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sports Card */}
          <Link
            to="/events/sports"
            className="group relative p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border hover:border-emerald-500/50 transition-all duration-300 shadow-md hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xl">
              ⚽
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                9 Tournaments
              </span>
              <h3 className="text-2xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text group-hover:text-emerald-400 transition-colors">
                Sports Championship
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed">
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
            className="group relative p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border hover:border-purple-500/50 transition-all duration-300 shadow-md hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-xl">
              🎭
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                10 Competitions
              </span>
              <h3 className="text-2xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text group-hover:text-purple-400 transition-colors">
                Cultural Expressions
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed">
              Dance, Singing, Solo &amp; Group Bands, Drama, Fashion Show, Photography, Painting, Quiz, and Parliamentary Debates on open-air mainstage.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 pt-2">
              <span>View Cultural Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Technical Card */}
          <Link
            to="/events/technical"
            className="group relative p-8 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border hover:border-blue-500/50 transition-all duration-300 shadow-md hover:shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                10 Challenges
              </span>
              <h3 className="text-2xl font-bold font-display text-dark-text dark:text-dark-text light:text-light-text group-hover:text-blue-400 transition-colors">
                Technical Arena
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed">
              24H Hackathon, Coding Contest, Debugging Contest, Tech Quiz, Paper Presentation, Project Expo, UI/UX, Web Dev, AI/ML, and Code Relay.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 pt-2">
              <span>View Technical Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================
          INTERACTIVE ANIMATED VISUALS SHOWCASE (Sections 25-36)
          Demonstrates the large animated scenes
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase font-extrabold tracking-widest text-brand-purple dark:text-brand-accent">
                Motion Showcase
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-dark-text dark:text-dark-text light:text-light-text mt-1">
                Custom Animated Event Scenes
              </h2>
              <p className="text-xs sm:text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary mt-1">
                Hover or select an event below to experience the responsive SVG physics and animation engine.
              </p>
            </div>

            {/* Showcase Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {interactiveShowcases.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveInteractiveVisual(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeInteractiveVisual === s.id
                      ? 'bg-brand-purple text-white shadow-sm'
                      : 'bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary text-dark-text-secondary hover:text-dark-text'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-dark-border shadow-inner">
            <EventVisualCanvas
              visualType={activeInteractiveVisual}
              isHovered={true}
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED EVENTS SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-brand-purple dark:text-brand-accent">
              Flagship Highlights
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-dark-text dark:text-dark-text light:text-light-text mt-1">
              Featured Competitions
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple dark:text-brand-accent hover:underline"
          >
            <span>Browse All 29 Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border animate-pulse" />
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
        <div className="p-8 sm:p-12 rounded-3xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>NAAC A+ Accredited Institution • Estd 1985</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-dark-text dark:text-dark-text light:text-light-text">
              R V R &amp; J C College of Engineering
            </h2>

            <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed max-w-2xl">
              Nestled across 37 lush green acres in Guntur, Andhra Pradesh, RVR&amp;JC stands as a pioneering institution of technical excellence, sportsmanship, and student leadership. COLORIDO 2K26 embodies four decades of collegiate distinction.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-dark-text dark:text-dark-text light:text-light-text bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border hover:border-brand-purple/50 transition-all"
              >
                <span>Read Institutional History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="p-6 rounded-3xl bg-dark-elevated/50 dark:bg-dark-elevated/50 light:bg-slate-100 border border-dark-border text-center space-y-3 max-w-xs">
              <img
                src="/rvrjc_logo.png"
                alt="RVRJC College Emblem"
                className="w-24 h-24 object-contain mx-auto"
              />
              <div>
                <p className="text-sm font-bold text-dark-text dark:text-dark-text light:text-light-text">Official College Seal</p>
                <p className="text-[11px] text-dark-muted">Guntur, Andhra Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
