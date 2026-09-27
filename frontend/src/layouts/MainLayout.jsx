import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg dark:bg-dark-bg light:bg-light-bg text-dark-text dark:text-dark-text light:text-light-text selection:bg-brand-purple selection:text-white transition-colors">
      <Navbar />
      <main className="flex-1 pt-[72px] sm:pt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
