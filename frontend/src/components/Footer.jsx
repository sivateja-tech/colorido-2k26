import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Shield, Sparkles } from 'lucide-react';
import {
  FESTIVAL_NAME,
  COLLEGE_NAME,
  COLLEGE_LOCATION,
  FESTIVAL_EMAIL,
  FESTIVAL_PHONE,
  COLLEGE_WEBSITE
} from '../utils/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-bg dark:bg-dark-bg light:bg-light-surface border-t border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: College Identity & Festival Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/rvrjc_logo.png"
                alt={COLLEGE_NAME}
                className="w-12 h-12 object-contain bg-dark-surface dark:bg-dark-surface light:bg-slate-100 p-1 rounded-xl border border-dark-border dark:border-dark-border light:border-light-border"
              />
              <div>
                <h3 className="text-xl font-black font-display text-dark-text dark:text-dark-text light:text-light-text tracking-tight">
                  COLORIDO <span className="text-brand-purple dark:text-brand-accent light:text-brand-light-primary">2K26</span>
                </h3>
                <p className="text-xs font-semibold text-dark-muted dark:text-dark-muted light:text-light-muted">
                  {COLLEGE_NAME}
                </p>
              </div>
            </div>

            <p className="text-sm text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary leading-relaxed max-w-md">
              A premium inter-collegiate sports, cultural and technical experience bringing together collegiate champions, artists, coders, and innovators.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-dark-muted dark:text-dark-muted light:text-light-muted">
              <p className="font-semibold text-dark-text dark:text-dark-text light:text-light-text">
                Autonomous Institution • Affiliated to Acharya Nagarjuna University
              </p>
              <p>Accredited by NAAC with &apos;A+&apos; Grade • NBA Accredited Programs</p>
              <p className="flex items-start gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-brand-error shrink-0 mt-0.5" />
                <span>{COLLEGE_LOCATION}</span>
              </p>
            </div>
          </div>

          {/* Col 3: Events & Hub */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-dark-text dark:text-dark-text light:text-light-text mb-4">
              Explore Events
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="hover:text-brand-purple transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/events/sports" className="hover:text-brand-purple transition-colors">
                  Sports Events (9)
                </Link>
              </li>
              <li>
                <Link to="/events/cultural" className="hover:text-brand-purple transition-colors">
                  Cultural Events (10)
                </Link>
              </li>
              <li>
                <Link to="/events/technical" className="hover:text-brand-purple transition-colors">
                  Technical Events (10)
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-brand-purple transition-colors">
                  Festival Schedule
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-brand-purple transition-colors">
                  Results &amp; Scores
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-brand-purple transition-colors">
                  College Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Helpdesk & Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-dark-text dark:text-dark-text light:text-light-text mb-4">
              College Helpdesk
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-brand-purple transition-colors">
                  About College &amp; Fest
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-brand-purple transition-colors">
                  Festival Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-purple transition-colors">
                  Contact Committee
                </Link>
              </li>
              <li className="flex items-center gap-2 pt-1 text-xs">
                <Phone className="w-3.5 h-3.5 text-brand-secondary" />
                <span>{FESTIVAL_PHONE}</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-brand-purple" />
                <span>{FESTIVAL_EMAIL}</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Globe className="w-3.5 h-3.5 text-brand-success" />
                <a href={COLLEGE_WEBSITE} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  rvrjcce.ac.in
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Portal Access */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-dark-text dark:text-dark-text light:text-light-text mb-4">
              Administration
            </h4>
            <div className="space-y-3">
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-dark-surface dark:bg-dark-surface light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text dark:text-dark-text light:text-light-text hover:border-brand-purple/50 transition-all w-full shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-brand-purple" />
                <span>Admin Login Portal</span>
              </Link>

              <div className="p-3.5 rounded-xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-[11px] space-y-1">
                <p className="font-bold text-dark-text dark:text-dark-text light:text-light-text flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-purple" />
                  <span>College Competition Showcase</span>
                </p>
                <p className="text-dark-muted dark:text-dark-muted light:text-light-muted leading-relaxed">
                  Real database-driven platform with verified Google Auth, isolated passes, live countdown, and custom animated scenes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-dark-border dark:border-dark-border light:border-light-border flex flex-col sm:flex-row items-center justify-between text-xs text-dark-muted dark:text-dark-muted light:text-light-muted gap-3">
          <p>© 2026 COLORIDO 2K26 • {COLLEGE_NAME}, Guntur. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Autonomous Institution • Estd 1985</span>
            <span>•</span>
            <span>NAAC A+ Grade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
