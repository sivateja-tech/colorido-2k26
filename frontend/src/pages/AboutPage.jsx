import React from 'react';
import { Award, Shield, MapPin, Building, CheckCircle2, Trophy, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* 1. Header & Vision */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-purple/10 text-brand-purple border border-brand-purple/30">
          <Award className="w-3.5 h-3.5" />
          <span>The Spirit Behind The Festival</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight">
          About COLORIDO 2K26
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          COLORIDO 2K26 is a premium collegiate cultural and athletic symposium crafted to celebrate youthful energy, competitive excellence, and creative mastery across India&apos;s leading universities.
        </p>
      </div>

      {/* 2. Institutional Heritage: RVR & JC College of Engineering */}
      <div className="p-8 sm:p-12 rounded-3xl bg-dark-800/80 border border-white/10 shadow-2xl relative overflow-hidden space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0">
            {/* Untouched Official College Logo */}
            <img
              src="/rvrjc_logo.png"
              alt="R V R & J C College of Engineering"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
            />
          </div>
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider font-bold text-brand-cyan">
              Host Academic Institution
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
              R V R &amp; J C College of Engineering
            </h2>
            <p className="text-sm font-semibold text-slate-300">
              Rayapati Venkata Ranga Rao &amp; Jagarlamudi Chandramouli College of Engineering (Autonomous)
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Approved by AICTE, New Delhi • Affiliated to Acharya Nagarjuna University • Accredited by NAAC with &apos;A+&apos; Grade • All eligible B.Tech programs accredited by NBA • Estd. 1985
            </p>
          </div>
        </div>

        {/* College Metrics & Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="text-2xl font-black font-display text-white">37.41 Acres</div>
            <div className="text-xs text-slate-400">Green Campus at Chowdavaram</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="text-2xl font-black font-display text-emerald-400">NAAC A+</div>
            <div className="text-xs text-slate-400">Autonomous Accreditation</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="text-2xl font-black font-display text-brand-purple">40+ Years</div>
            <div className="text-xs text-slate-400">Academic &amp; Sporting Legacy</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="text-2xl font-black font-display text-amber-400">100% Sports</div>
            <div className="text-xs text-slate-400">World-Class Arena Infrastructure</div>
          </div>
        </div>

        {/* Detailed Narrative */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed pt-2">
          <p>
            Promoted by the Nagarjuna Education Society, R V R &amp; J C College of Engineering stands tall as one of the most respected engineering institutions in Andhra Pradesh. With thousands of alumni across global tech leaders, research institutions, and national sports circuits, the college nurtures both intellectual rigor and sporting prowess.
          </p>
          <p>
            For COLORIDO 2K26, the college opens its prestigious sports arenas — including its lush natural turf cricket stadium, Olympic-grade synthetic athletic track, wooden badminton complex, and the vibrant 5,000-seat Open Air Theatre — to welcome colleges from all over the country.
          </p>
        </div>
      </div>

      {/* 3. Festival Values: Pillars of Excellence */}
      <div className="space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black font-display text-white text-center">
          Core Pillars of COLORIDO 2K26
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-dark-800/60 dark:bg-dark-800/60 light:bg-light-surface border border-white/10 dark:border-white/10 light:border-light-border space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">Athletic Mastery</h4>
            <p className="text-xs text-dark-muted dark:text-dark-muted light:text-light-muted leading-relaxed">
              9 sporting championships officiated by certified referees, arbiters, and state association jury panels.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-800/60 dark:bg-dark-800/60 light:bg-light-surface border border-white/10 dark:border-white/10 light:border-light-border space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">Cultural Expression</h4>
            <p className="text-xs text-dark-muted dark:text-dark-muted light:text-light-muted leading-relaxed">
              10 artistic spectacles spanning classical & western dance, music bands, runway fashion, theater, and fine arts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-800/60 dark:bg-dark-800/60 light:bg-light-surface border border-white/10 dark:border-white/10 light:border-light-border space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">Technical Innovation</h4>
            <p className="text-xs text-dark-muted dark:text-dark-muted light:text-light-muted leading-relaxed">
              10 tech battles: 24h Hackathon, Coding & Debugging Contests, AI/ML sprint, UI/UX challenge, and Project Expo.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-dark-800/60 dark:bg-dark-800/60 light:bg-light-surface border border-white/10 dark:border-white/10 light:border-light-border space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-dark-text dark:text-dark-text light:text-light-text">Safe &amp; Inclusive Campus</h4>
            <p className="text-xs text-dark-muted dark:text-dark-muted light:text-light-muted leading-relaxed">
              First-aid medical booths, 24/7 student emergency helpdesks, and dedicated hospitality teams for all colleges.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Competition Showcase Note */}
      <div className="p-6 rounded-3xl bg-brand-purple/10 border border-brand-purple/30 text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">
          Competition Showcase Note
        </span>
        <p className="text-xs text-slate-300 leading-relaxed">
          This platform was designed and developed for the <strong>Website Design Competition 2026</strong>. It provides full real-time database-driven functionality across React, Node.js, and PostgreSQL.
        </p>
      </div>
    </div>
  );
}
