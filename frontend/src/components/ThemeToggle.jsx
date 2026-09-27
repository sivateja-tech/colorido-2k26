import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle dark/light theme"
      className={`relative p-2 rounded-xl transition-all duration-300 border border-white/10 hover:border-brand-purple/50 bg-dark-800/80 hover:bg-dark-700 text-slate-300 hover:text-white ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-90 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-brand-purple transition-transform hover:-rotate-12 duration-300" />
      )}
    </button>
  );
}
