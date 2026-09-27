import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function SixEasterEgg({ children = '6' }) {
  const [active, setActive] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setActive(true);

    // Multi-stage cricket six celebration
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4']
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4']
    });

    setTimeout(() => {
      setActive(false);
    }, 2500);
  };

  return (
    <span
      onClick={handleClick}
      title="Click me for a surprise!"
      className="relative inline-block cursor-pointer transition-transform hover:scale-125 select-none"
    >
      <span className="relative z-10">{children}</span>
      {active && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-amber-500 text-dark-950 font-black text-xs rounded-full shadow-xl animate-bounce tracking-widest z-50">
          MAXIMUM! IT&apos;S A 6! 🏏
        </span>
      )}
    </span>
  );
}
