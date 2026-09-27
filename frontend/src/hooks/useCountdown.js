import { useState, useEffect } from 'react';
import { FESTIVAL_TARGET_TIMESTAMP } from '../utils/constants';

/**
 * Real countdown hook calculating diff against one absolute timestamp.
 * Section 14:
 * - decreases every second
 * - persists across navigation & refresh
 * - never resets
 * - never uses hardcoded remaining seconds
 * - never becomes negative
 * - returns isStarted = true when diff <= 0
 */
export function useCountdown(targetIso = FESTIVAL_TARGET_TIMESTAMP) {
  const targetTime = new Date(targetIso).getTime();

  const calculateTimeLeft = () => {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isStarted: true,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: Math.floor(diff / 1000),
      isStarted: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Immediately sync on mount
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return timeLeft;
}
