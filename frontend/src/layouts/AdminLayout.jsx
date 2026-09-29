import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  Mail,
  ExternalLink,
  LogOut,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, loading, logoutAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Strict client protection: redirect to /auth if not authenticated as admin
  if (!admin) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate('/auth');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Events', path: '/admin/events', icon: Sparkles },
    { label: 'Registrations', path: '/admin/registrations', icon: Users },
    { label: 'Schedule', path: '/admin/schedule', icon: Calendar },
    { label: 'Results', path: '/admin/results', icon: Trophy },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dark-bg light:bg-light-bg text-dark-text dark:text-dark-text light:text-light-text flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border-b border-dark-border dark:border-dark-border light:border-light-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-dark-elevated"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <img src="/rvrjc_logo.png" alt="RVRJC Logo" className="w-8 h-8 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-base sm:text-lg text-dark-text dark:text-dark-text light:text-light-text">
                  COLORIDO <span className="text-brand-purple dark:text-brand-accent">2K26</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E67E22]/15 text-[#E67E22] border border-[#E67E22]/30">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[10px] text-dark-muted hidden sm:block">R V R &amp; J C College of Engineering</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-dark-text dark:text-dark-text light:text-light-text">{admin.name}</span>
              <span className="text-[10px] text-dark-muted font-mono">{admin.email}</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-elevated dark:bg-dark-elevated light:bg-light-surface-secondary border border-dark-border dark:border-dark-border light:border-light-border text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-error/15 hover:bg-brand-error/25 border border-brand-error/30 text-brand-error transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Layout with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar for Desktop & Mobile Overlay */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-dark-surface dark:bg-dark-surface light:bg-light-surface md:bg-transparent md:dark:bg-transparent md:light:bg-transparent border-r md:border-r-0 border-dark-border p-4 md:p-0 transition-transform duration-200 ease-in-out shrink-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1.5 md:sticky md:top-20">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-dark-muted">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'text-white bg-brand-purple shadow-sm'
                        : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-elevated dark:hover:bg-dark-elevated light:hover:bg-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}

        {/* Admin Page Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
