import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut, User, Ticket, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import GoogleAuthModal from './GoogleAuthModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, admin, isAdmin, isAuthenticated, logoutUser, logoutAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Results', path: '/results' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-navbar py-3 shadow-md shadow-black/20'
            : 'bg-dark-bg/80 dark:bg-dark-bg/80 light:bg-light-bg/85 backdrop-blur-md py-4 border-b border-dark-border dark:border-dark-border light:border-light-border'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Primary Brand & College Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-xl"
            >
              <img
                src="/rvrjc_logo.png"
                alt="R V R & J C College of Engineering"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-dark-text dark:text-dark-text light:text-light-text group-hover:text-brand-purple transition-colors">
                    COLORIDO
                  </span>
                  <span className="font-display font-black text-lg sm:text-xl text-brand-purple dark:text-brand-accent light:text-brand-light-primary">
                    2K26
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-dark-muted dark:text-dark-muted light:text-light-muted font-medium hidden sm:inline-block">
                  R V R &amp; J C College of Engineering
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-dark-surface/60 dark:bg-dark-surface/60 light:bg-light-surface/80 border border-dark-border dark:border-dark-border light:border-light-border rounded-full px-3 py-1.5 backdrop-blur-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-white bg-brand-purple dark:bg-brand-purple light:bg-brand-light-primary shadow-sm'
                        : 'text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary hover:text-dark-text dark:hover:text-dark-text light:hover:text-light-text hover:bg-dark-elevated dark:hover:bg-dark-elevated light:hover:bg-slate-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Controls */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />

              {/* Admin Link if Admin */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {/* User Dropdown / Sign in */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border hover:border-brand-purple/50 transition-all"
                  >
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-xs">
                        {user?.name?.[0] || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-dark-text dark:text-dark-text light:text-light-text max-w-[100px] truncate">
                      {user?.name || 'Account'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-dark-muted" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border dark:border-dark-border light:border-light-border shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-dark-border dark:border-dark-border light:border-light-border">
                        <p className="text-xs font-bold text-dark-text dark:text-dark-text light:text-light-text truncate">{user?.name}</p>
                        <p className="text-[11px] text-dark-muted truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/my-registrations"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-dark-text dark:text-dark-text light:text-light-text hover:bg-dark-elevated dark:hover:bg-dark-elevated light:hover:bg-slate-100 transition-colors"
                      >
                        <Ticket className="w-4 h-4 text-brand-purple" />
                        <span>My Registrations</span>
                      </Link>

                      <button
                        onClick={() => {
                          logoutUser();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-brand-error hover:bg-brand-error/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-hover dark:bg-brand-purple dark:hover:bg-brand-purple-hover light:bg-brand-light-primary light:hover:bg-brand-light-hover shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-dark-surface dark:bg-dark-surface light:bg-light-surface border border-dark-border text-dark-text dark:text-dark-text light:text-light-text"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 bg-dark-surface dark:bg-dark-surface light:bg-light-surface border-b border-dark-border space-y-3 animate-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-white bg-brand-purple dark:bg-brand-purple light:bg-brand-light-primary'
                        : 'text-dark-text-secondary dark:text-dark-text-secondary light:text-light-text-secondary hover:bg-dark-elevated'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated && (
                <NavLink
                  to="/my-registrations"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-white bg-brand-purple'
                        : 'text-dark-text-secondary hover:bg-dark-elevated'
                    }`
                  }
                >
                  My Registrations
                </NavLink>
              )}

              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
                >
                  Admin Dashboard
                </NavLink>
              )}
            </nav>

            <div className="pt-2 border-t border-dark-border">
              {isAuthenticated ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs">
                    <p className="font-bold text-dark-text">{user?.name}</p>
                    <p className="text-[11px] text-dark-muted">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-brand-error bg-brand-error/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
