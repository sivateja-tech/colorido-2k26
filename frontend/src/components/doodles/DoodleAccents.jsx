import React from 'react';

/**
 * COLORIDO 2K26 Editorial Doodle Language Component Library
 * Minimal, sophisticated, and youthful hand-drawn vector accents.
 * Designed to elevate typography and micro-UI without visual clutter.
 */

// 1. Organic Hand-Drawn Underline with slight curve and imperfect taper
export function DoodleUnderline({
  color = '#E67E22',
  className = '',
  width = '100%',
  height = '12px',
  strokeWidth = 3,
  animated = false
}) {
  return (
    <svg
      viewBox="0 0 240 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible pointer-events-none ${className}`}
      style={{ width, height }}
      preserveAspectRatio="none"
    >
      <path
        d="M 3 13 C 45 6, 115 4, 185 8 C 210 10, 230 13, 237 14 C 215 15, 175 14, 135 15"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'doodle-draw-line' : ''}
      />
    </svg>
  );
}

// 2. Expressive Double-Stroke Hand-Drawn Underline (for COLORIDO Hero title)
export function DoodleDoubleUnderline({
  color = '#E67E22',
  secondaryColor = '#2980B9',
  className = '',
  width = '100%',
  height = '16px'
}) {
  return (
    <svg
      viewBox="0 0 320 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible pointer-events-none ${className}`}
      style={{ width, height }}
      preserveAspectRatio="none"
    >
      {/* Primary Sweeping Stroke */}
      <path
        d="M 4 12 C 60 5, 150 4, 240 7 C 280 9, 310 12, 316 13"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Secondary Accent Flick */}
      <path
        d="M 28 18 C 95 14, 180 15, 260 17"
        stroke={secondaryColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
    </svg>
  );
}

// 3. Loose Hand-Drawn Circle / Oval (wraps numbers or words with an overlapping tail)
export function DoodleCircle({
  color = '#2980B9',
  className = '',
  strokeWidth = 2.2,
  animated = false
}) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full pointer-events-none -m-1.5 overflow-visible ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M 16 32 C 14 16, 32 8, 62 7 C 94 6, 110 18, 108 34 C 106 48, 88 56, 56 55 C 28 54, 10 46, 14 30 C 16 22, 28 14, 46 11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'doodle-draw-circle' : ''}
      />
    </svg>
  );
}

// 4. Subtle Hand-Drawn Marker Highlight Ribbon behind text
export function DoodleHighlight({
  color = 'rgba(230, 126, 34, 0.22)',
  className = '',
  width = '100%',
  height = '14px'
}) {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute bottom-0 left-0 -z-10 pointer-events-none ${className}`}
      style={{ width, height }}
      preserveAspectRatio="none"
    >
      <path
        d="M 2 14 C 40 10, 110 11, 198 8 L 195 18 C 130 19, 60 18, 4 19 Z"
        fill={color}
      />
    </svg>
  );
}

// 5. Minimalist 4-Point Editorial Sparkle / Star (for year '2K26' or prize accents)
export function DoodleSparkle({
  color = '#E67E22',
  size = 18,
  className = ''
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block pointer-events-none ${className}`}
    >
      <path
        d="M 12 1 C 12 7, 7 12, 1 12 C 7 12, 12 17, 12 23 C 12 17, 17 12, 23 12 C 17 12, 12 7, 12 1 Z"
        fill={color}
      />
    </svg>
  );
}

// 6. Sleek Hand-Drawn Arrow indicating direction / call to action
export function DoodleArrow({
  color = '#ECF0F1',
  className = '',
  width = 36,
  height = 20
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block pointer-events-none overflow-visible ${className}`}
    >
      {/* Organic Curved Shaft */}
      <path
        d="M 2 15 C 16 11, 30 11, 44 12"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Hand-Drawn Arrowhead */}
      <path
        d="M 36 6 C 39 9, 43 11, 45 12 C 42 14, 38 17, 35 20"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 7. Editorial Hand-Drawn Corner Brackets for Numbers or Badges
export function DoodleBrackets({
  color = '#95A5A6',
  children,
  className = ''
}) {
  return (
    <span className={`relative inline-flex items-center px-1.5 py-0.5 ${className}`}>
      {/* Left Bracket */}
      <svg
        className="w-2.5 h-4 mr-0.5 text-inherit opacity-70"
        viewBox="0 0 10 20"
        fill="none"
      >
        <path
          d="M 8 2 C 3 2, 2 5, 2 10 C 2 15, 3 18, 8 18"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span>{children}</span>
      {/* Right Bracket */}
      <svg
        className="w-2.5 h-4 ml-0.5 text-inherit opacity-70"
        viewBox="0 0 10 20"
        fill="none"
      >
        <path
          d="M 2 2 C 7 2, 8 5, 8 10 C 8 15, 7 18, 2 18"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// 8. SPORTS: Bespoke Hand-Drawn Line Illustration (Athletic Track Speed Arc & Whistle)
export function DoodleSportsIcon({
  color = '#10B981',
  size = 32,
  className = ''
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      {/* Athletic Track Curves */}
      <path
        d="M 4 28 C 12 18, 22 14, 32 12"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 8 32 C 16 23, 24 20, 32 18"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      {/* Motion Ball with Speed Lines */}
      <circle cx="18" cy="12" r="6" stroke={color} strokeWidth="2.2" />
      <path d="M 18 6 C 18 12, 14 16, 12 17" stroke={color} strokeWidth="1.4" />
      {/* Kinetic Whistle / Spark */}
      <path d="M 26 6 L 31 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 28 10 L 33 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 9. CULTURAL: Bespoke Hand-Drawn Line Illustration (Drama Mask & Acoustic Resonance Wave)
export function DoodleCulturalIcon({
  color = '#E67E22',
  size = 32,
  className = ''
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      {/* Theatrical Mask Curve */}
      <path
        d="M 8 10 C 8 4, 20 4, 20 10 C 20 18, 16 24, 14 26 C 12 24, 8 18, 8 10 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Expressive Arch Eyebrows & Smile */}
      <circle cx="11.5" cy="10" r="1.2" fill={color} />
      <circle cx="16.5" cy="10" r="1.2" fill={color} />
      <path d="M 11 16 Q 14 19 17 16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {/* Musical / Acoustic Resonance Radiating Wave */}
      <path d="M 24 8 C 28 12, 28 20, 24 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 28 6 C 33 11, 33 23, 28 28" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}

// 10. TECHNICAL: Bespoke Hand-Drawn Line Illustration (Terminal Code Brackets & Logic Spark)
export function DoodleTechnicalIcon({
  color = '#2980B9',
  size = 32,
  className = ''
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none ${className}`}
    >
      {/* Code Curly Braces / Tag */}
      <path
        d="M 12 8 L 6 15 L 6 17 L 12 24"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 24 8 L 30 15 L 30 17 L 24 24"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Forward Slash / Divider */}
      <line x1="20" y1="9" x2="16" y2="23" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {/* Logic Spark Node */}
      <circle cx="28" cy="7" r="2.5" fill="#38BDF8" />
    </svg>
  );
}

// 11. Minimalist Editorial Divider with Center Crosshair / Diamond Hand-Drawn Node
export function DoodleDivider({
  color = '#95A5A6',
  className = ''
}) {
  return (
    <div className={`relative flex items-center justify-center my-8 ${className}`}>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#95A5A6]/25 to-transparent" />
      <div className="absolute px-3 bg-dark-bg text-[#95A5A6] flex items-center gap-1 text-[11px] font-mono">
        <span>+</span>
        <span className="w-1.5 h-1.5 rotate-45 border border-[#E67E22] bg-[#E67E22]/30" />
        <span>+</span>
      </div>
    </div>
  );
}
