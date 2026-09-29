import { useRef, useCallback } from 'react';

/**
 * useCardGlow Hook
 * Calculates cursor coordinates for radial lighting and subtle 3D tilt.
 * Resets smoothly when the cursor leaves the card.
 */
export function useCardGlow() {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle 3D tilt (max 4.5 degrees) for sleek depth without distortion
    const tiltY = Number(((x - centerX) / centerX) * 4.5).toFixed(2);
    const tiltX = Number(-((y - centerY) / centerY) * 4.5).toFixed(2);

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
    cardRef.current.style.setProperty('--card-lift', '-6px');
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
    cardRef.current.style.setProperty('--card-lift', '0px');
  }, []);

  return { cardRef, handleMouseMove, handleMouseLeave };
}

