import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    // Check if splash screen was already seen in this tab session
    const seen = sessionStorage.getItem('colorido_splash_shown');
    if (seen) {
      setVisible(false);
      return;
    }

    // Mark as seen for subsequent internal navigations
    sessionStorage.setItem('colorido_splash_shown', 'true');

    // Smooth progress steps
    const t1 = setTimeout(() => setProgress(55), 300);
    const t2 = setTimeout(() => setProgress(88), 700);
    const t3 = setTimeout(() => setProgress(100), 1050);

    // Trigger smooth fade-out
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1350);

    // Unmount from DOM after fade-out transition completes
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 300);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#151D24] text-white transition-opacity duration-500 ease-out select-none cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 42%, rgba(41, 128, 185, 0.22) 0%, rgba(21, 29, 36, 0.98) 72%)'
      }}
    >
      <div className="flex flex-col items-center text-center space-y-6 px-6 max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-500">
        {/* Emblem with glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#2980B9]/35 rounded-full blur-2xl transform scale-125" />
          <img
            src="/rvrjc_logo.png"
            alt="RVRJC Logo"
            className="relative w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_25px_rgba(41,128,185,0.45)]"
          />
        </div>

        {/* Festival Branding */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-[#ECF0F1]">
            COLORIDO <span className="text-[#E67E22]">2K26</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#95A5A6] tracking-wide">
            R V R &amp; J C College of Engineering
          </p>
          <p className="text-[11px] font-mono text-[#95A5A6]/80 uppercase tracking-widest pt-0.5">
            National Level Inter-Collegiate Fest
          </p>
        </div>

        {/* Elegant Loading Bar */}
        <div className="w-56 sm:w-64 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-[#2C3E50] rounded-full overflow-hidden p-0.5 border border-[#95A5A6]/20">
            <div
              className="h-full bg-gradient-to-r from-[#2980B9] via-[#E67E22] to-[#2980B9] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-[#95A5A6]/70 px-0.5">
            <span>ENTERING FESTIVAL</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Tap to skip hint */}
        <p className="text-[10px] text-[#95A5A6]/40 font-mono pt-4">
          Tap anywhere to enter
        </p>
      </div>
    </div>
  );
}
