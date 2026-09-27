import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';

export default function EasterEggCelebration({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="p-6 rounded-3xl bg-dark-900/90 border border-brand-purple/50 backdrop-blur-xl shadow-2xl text-center animate-bounce-soft">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-2xl font-black font-display text-white">
          COLORIDO 2K26 SECRET UNLOCKED!
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          Festival vibe mode activated! Welcome to R V R &amp; J C College of Engineering&apos;s grand stage.
        </p>
      </div>
    </div>
  );
}
