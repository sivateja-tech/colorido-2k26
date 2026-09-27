import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export function useEasterEggs() {
  const [triggered, setTriggered] = useState(false);
  const [typedKeys, setTypedKeys] = useState('');

  const fireFestivalConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981']
    });
  };

  const fireGrandFinale = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      const char = e.key.toLowerCase();
      if (/^[a-z0-9]$/.test(char)) {
        const next = (typedKeys + char).slice(-8);
        setTypedKeys(next);
        if (next.includes('colorido')) {
          setTriggered(true);
          fireGrandFinale();
          setTimeout(() => setTriggered(false), 5000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedKeys]);

  return { triggered, fireFestivalConfetti, fireGrandFinale };
}
