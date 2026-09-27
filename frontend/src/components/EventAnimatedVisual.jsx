import React from 'react';
import SportMicroAnimation from './SportMicroAnimation';

/**
 * EventAnimatedVisual wrapper component.
 * Renders high-performance interactive SVG sport and cultural animations.
 */
export default function EventAnimatedVisual({ type = 'cricket', className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <SportMicroAnimation type={type} />
    </div>
  );
}
