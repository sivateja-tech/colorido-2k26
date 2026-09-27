import React, { useState } from 'react';

export default function SportMicroAnimation({ type = 'cricket', className = 'w-12 h-12', interactive = true }) {
  const [isHovered, setIsHovered] = useState(false);
  const normalizedType = type?.toLowerCase() || 'cricket';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* 1. CRICKET */}
      {normalizedType.includes('cricket') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" />
          {/* Bat */}
          <g
            className={`origin-bottom-left transition-transform duration-300 ${
              isHovered ? 'rotate-[-35deg]' : 'rotate-[-10deg]'
            }`}
            style={{ transformOrigin: '30px 75px' }}
          >
            <rect x="28" y="32" width="12" height="42" rx="4" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
            <rect x="32" y="70" width="4" height="20" rx="2" fill="#d97706" />
            {/* Grip stripes */}
            <line x1="32" y1="75" x2="36" y2="75" stroke="#fff" strokeWidth="1" />
            <line x1="32" y1="80" x2="36" y2="80" stroke="#fff" strokeWidth="1" />
          </g>
          {/* Ball & Trajectory */}
          <path
            d="M 38 45 Q 60 20 82 25"
            fill="none"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="2"
            strokeDasharray="4 3"
            className={isHovered ? 'opacity-100' : 'opacity-40'}
          />
          <circle
            cx={isHovered ? '82' : '45'}
            cy={isHovered ? '25' : '40'}
            r="7"
            fill="#ef4444"
            stroke="#991b1b"
            strokeWidth="1.5"
            className="transition-all duration-300 ease-out"
          >
            {/* Seam */}
            <path d="M -4 0 Q 0 -4 4 0" fill="none" stroke="#fff" strokeWidth="1" />
          </circle>
        </svg>
      )}

      {/* 2. FOOTBALL */}
      {normalizedType.includes('football') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />
          {/* Goal Net */}
          <path d="M 68 28 L 90 35 L 90 75 L 68 80 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <line x1="68" y1="45" x2="90" y2="48" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="68" y1="62" x2="90" y2="62" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {/* Ball with spin */}
          <g
            className={`transition-all duration-500 ease-out ${
              isHovered ? 'translate-x-7 -translate-y-2 rotate-[180deg]' : 'translate-x-0 translate-y-0 rotate-0'
            }`}
            style={{ transformOrigin: '40px 52px' }}
          >
            <circle cx="40" cy="52" r="14" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="40,43 45,47 43,53 37,53 35,47" fill="#0f172a" />
            <polygon points="40,61 45,57 43,53 37,53 35,57" fill="#0f172a" />
          </g>
        </svg>
      )}

      {/* 3. BASKETBALL */}
      {normalizedType.includes('basketball') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(249, 115, 22, 0.12)" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="2" />
          {/* Backboard & Hoop */}
          <rect x="74" y="24" width="4" height="34" fill="#e2e8f0" rx="1" />
          <path d="M 52 42 L 74 42" stroke="#ea580c" strokeWidth="3" />
          {/* Net */}
          <path d="M 54 42 L 58 64 L 68 64 L 72 42" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Ball */}
          <g
            className={`transition-all duration-400 ease-in-out ${
              isHovered ? 'translate-x-4 translate-y-[-2px] rotate-45' : 'translate-x-0 translate-y-2'
            }`}
            style={{ transformOrigin: '32px 42px' }}
          >
            <circle cx="32" cy="42" r="13" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
            <line x1="19" y1="42" x2="45" y2="42" stroke="#431407" strokeWidth="1.5" />
            <path d="M 26 31 Q 35 42 26 53" fill="none" stroke="#431407" strokeWidth="1.5" />
            <path d="M 38 31 Q 29 42 38 53" fill="none" stroke="#431407" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {/* 4. BADMINTON */}
      {normalizedType.includes('badminton') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(6, 182, 212, 0.12)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
          {/* Net */}
          <line x1="50" y1="48" x2="50" y2="82" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
          <line x1="45" y1="52" x2="55" y2="52" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          {/* Shuttlecock */}
          <g
            className={`transition-all duration-400 ease-out ${
              isHovered ? 'translate-x-8 -translate-y-5 rotate-[45deg]' : 'translate-x-0 translate-y-0 rotate-[-15deg]'
            }`}
            style={{ transformOrigin: '32px 45px' }}
          >
            {/* Feathers */}
            <polygon points="26,36 38,42 26,48" fill="#f8fafc" opacity="0.9" />
            <polygon points="20,32 36,42 20,52" fill="#e2e8f0" opacity="0.6" />
            {/* Cork */}
            <circle cx="39" cy="42" r="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          </g>
        </svg>
      )}

      {/* 5. CHESS */}
      {normalizedType.includes('chess') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(168, 85, 247, 0.12)" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2" />
          {/* Chess Board Grid line */}
          <line x1="20" y1="76" x2="80" y2="76" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          {/* Knight Piece */}
          <g
            className={`transition-all duration-300 ease-out ${
              isHovered ? '-translate-y-4 scale-105' : 'translate-y-0'
            }`}
            style={{ transformOrigin: '50px 75px' }}
          >
            <path
              d="M 38 74 L 62 74 C 62 74 60 64 56 60 C 58 56 66 52 64 42 C 62 34 52 30 50 30 C 48 30 45 32 44 36 C 41 38 34 42 34 48 C 34 54 40 56 40 56 C 36 62 38 74 38 74 Z"
              fill="#c084fc"
              stroke="#7e22ce"
              strokeWidth="2"
            />
            {/* Knight Eye */}
            <circle cx="53" cy="40" r="2" fill="#fff" />
          </g>
        </svg>
      )}

      {/* 6. DANCE */}
      {normalizedType.includes('dance') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(236, 72, 153, 0.12)" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="2" />
          {/* Rhythm sound ripples */}
          <circle
            cx="50"
            cy="50"
            r={isHovered ? '40' : '32'}
            fill="none"
            stroke="rgba(236, 72, 153, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="transition-all duration-500"
          />
          {/* Dancer Silhouette */}
          <g
            className={`transition-transform duration-300 ${
              isHovered ? 'rotate-[12deg] scale-110' : 'rotate-0 scale-100'
            }`}
            style={{ transformOrigin: '50px 50px' }}
          >
            <circle cx="50" cy="28" r="6" fill="#f43f5e" />
            <path
              d="M 50 34 Q 52 46 48 56 L 36 76 M 48 56 L 62 74 M 50 42 L 32 36 M 50 42 L 68 34"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      )}

      {/* 7. SINGING / MUSIC */}
      {(normalizedType.includes('sing') || normalizedType.includes('voice') || normalizedType.includes('band')) && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(14, 165, 233, 0.12)" stroke="rgba(14, 165, 233, 0.4)" strokeWidth="2" />
          {/* Equalizer Frequency Bars */}
          <rect x="22" y={isHovered ? '40' : '55'} width="4" height={isHovered ? '25' : '10'} rx="2" fill="#38bdf8" className="transition-all duration-200" />
          <rect x="30" y={isHovered ? '30' : '45'} width="4" height={isHovered ? '35' : '20'} rx="2" fill="#38bdf8" className="transition-all duration-300" />
          <rect x="66" y={isHovered ? '32' : '48'} width="4" height={isHovered ? '33' : '17'} rx="2" fill="#38bdf8" className="transition-all duration-250" />
          <rect x="74" y={isHovered ? '42' : '58'} width="4" height={isHovered ? '23' : '8'} rx="2" fill="#38bdf8" className="transition-all duration-350" />
          {/* Microphone */}
          <g
            className={`transition-all duration-300 ${
              isHovered ? 'scale-110 -translate-y-1' : ''
            }`}
            style={{ transformOrigin: '50px 50px' }}
          >
            <rect x="44" y="28" width="12" height="22" rx="6" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2" />
            <path d="M 40 40 C 40 54 60 54 60 40" fill="none" stroke="#0284c7" strokeWidth="2.5" />
            <line x1="50" y1="54" x2="50" y2="70" stroke="#0284c7" strokeWidth="2.5" />
            <line x1="42" y1="70" x2="58" y2="70" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      )}

      {/* 8. KABADDI */}
      {normalizedType.includes('kabaddi') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" />
          {/* Mat center line */}
          <line x1="50" y1="20" x2="50" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          {/* Two Grappling Hands */}
          <g className={`transition-all duration-300 ${isHovered ? 'translate-x-2' : ''}`}>
            <circle cx="36" cy="42" r="5" fill="#f59e0b" />
            <path d="M 36 47 L 36 60 M 36 52 L 48 50" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className={`transition-all duration-300 ${isHovered ? '-translate-x-2' : ''}`}>
            <circle cx="64" cy="42" r="5" fill="#ef4444" />
            <path d="M 64 47 L 64 60 M 64 52 L 52 50" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      )}

      {/* 9. ATHLETICS / SPRINT */}
      {normalizedType.includes('athletics') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />
          {/* Track curves */}
          <path d="M 20 70 Q 50 60 80 70" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          <path d="M 22 78 Q 50 68 78 78" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          {/* Runner */}
          <g
            className={`transition-all duration-300 ${
              isHovered ? 'translate-x-3 -translate-y-1' : ''
            }`}
          >
            <circle cx="48" cy="30" r="5" fill="#10b981" />
            <path
              d="M 48 35 L 44 48 L 56 60 M 44 48 L 34 58 M 46 40 L 36 38 M 46 40 L 58 44"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>
      )}

      {/* 10. DRAMA / THEATRE */}
      {normalizedType.includes('drama') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="2" />
          {/* Comedy Mask */}
          <g
            className={`transition-all duration-300 ${
              isHovered ? 'rotate-[-8deg] translate-y-[-2px]' : ''
            }`}
            style={{ transformOrigin: '38px 48px' }}
          >
            <path d="M 26 32 C 26 26 50 26 50 32 C 50 56 46 64 38 64 C 30 64 26 56 26 32 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="33" cy="38" r="2" fill="#78350f" />
            <circle cx="43" cy="38" r="2" fill="#78350f" />
            <path d="M 33 48 Q 38 54 43 48" fill="none" stroke="#78350f" strokeWidth="2" />
          </g>
          {/* Tragedy Mask */}
          <g
            className={`transition-all duration-300 ${
              isHovered ? 'rotate-[8deg] translate-y-[2px]' : ''
            }`}
            style={{ transformOrigin: '62px 52px' }}
          >
            <path d="M 50 38 C 50 32 74 32 74 38 C 74 62 70 70 62 70 C 54 70 50 62 50 38 Z" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.5" />
            <circle cx="57" cy="44" r="2" fill="#4c1d95" />
            <circle cx="67" cy="44" r="2" fill="#4c1d95" />
            <path d="M 57 56 Q 62 50 67 56" fill="none" stroke="#4c1d95" strokeWidth="2" />
          </g>
        </svg>
      )}

      {/* 11. PHOTOGRAPHY */}
      {normalizedType.includes('photo') && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(6, 182, 212, 0.12)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
          {/* Camera Body */}
          <rect x="25" y="36" width="50" height="34" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
          <path d="M 38 36 L 42 30 L 58 30 L 62 36 Z" fill="#334155" stroke="#06b6d4" strokeWidth="1.5" />
          {/* Shutter lens */}
          <circle cx="50" cy="53" r="11" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <circle
            cx="50"
            cy="53"
            r={isHovered ? '8' : '5'}
            fill={isHovered ? '#38bdf8' : '#0369a1'}
            className="transition-all duration-200"
          />
          {/* Flash sparkle */}
          <polygon
            points="65,26 68,32 74,35 68,38 65,44 62,38 56,35 62,32"
            fill="#facc15"
            className={`transition-opacity duration-300 ${isHovered ? 'opacity-100 scale-125' : 'opacity-0 scale-50'}`}
          />
        </svg>
      )}

      {/* DEFAULT FALLBACK / GENERIC TROPHY */}
      {!['cricket', 'football', 'basketball', 'badminton', 'chess', 'dance', 'sing', 'voice', 'band', 'kabaddi', 'athletics', 'drama', 'photo'].some(t => normalizedType.includes(t)) && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" />
          <g className={`transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} style={{ transformOrigin: '50px 50px' }}>
            <path d="M 32 30 L 68 30 L 62 55 C 62 62 56 66 50 66 C 44 66 38 62 38 55 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <path d="M 32 34 C 22 34 22 48 34 48" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 68 34 C 78 34 78 48 66 48" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <rect x="47" y="66" width="6" height="10" fill="#d97706" />
            <rect x="36" y="76" width="28" height="6" rx="2" fill="#78350f" />
          </g>
        </svg>
      )}
    </div>
  );
}
