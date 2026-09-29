import React from 'react';

/**
 * EventVisualCanvas Component
 * Renders large, rich, animated mini-scenes occupying 45-55% of the event card.
 * Implements Sections 25-37 of COLORIDO 2K26 specification.
 * Uses performant SVG, CSS transforms, and respectful reduced motion.
 */
export default function EventVisualCanvas({ visualType = 'cricket', isHovered = false, className = '' }) {
  const type = visualType?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'cricket';

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#2C3E50] to-[#1A252F] dark:from-[#131722] dark:to-[#0D1017] light:from-[#F0F2F7] light:to-[#E5E9F0] ${className}`}>
      {/* Dynamic ambient backdrop grid & glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2980B9_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* ============================================================
          SPORTS ANIMATIONS (Sections 26 - 34)
          ============================================================ */}

      {/* 1. CRICKET (Section 26): pitch, stumps, bat, ball (approaches -> swings -> travels) */}
      {(type.includes('cricket')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <defs>
            <linearGradient id="cricketPitch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {/* Turf field & pitch */}
          <ellipse cx="200" cy="180" rx="180" ry="35" fill="url(#grassGrad)" />
          <path d="M 120 185 L 280 185 L 270 165 L 130 165 Z" fill="#92400E" opacity="0.3" />
          <line x1="140" y1="185" x2="140" y2="165" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <line x1="260" y1="185" x2="260" y2="165" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />

          {/* Stumps (Wickets) */}
          <g transform="translate(138, 125)">
            <rect x="0" y="0" width="3" height="42" rx="1.5" fill="#FBBF24" />
            <rect x="5" y="0" width="3" height="42" rx="1.5" fill="#FBBF24" />
            <rect x="10" y="0" width="3" height="42" rx="1.5" fill="#FBBF24" />
            {/* Bails */}
            <rect x="-1" y="-3" width="7" height="2" rx="1" fill="#F59E0B" />
            <rect x="7" y="-3" width="7" height="2" rx="1" fill="#F59E0B" />
          </g>

          {/* Bat with swinging motion */}
          <g
            className="transition-transform duration-500 ease-out origin-bottom-left"
            style={{
              transformOrigin: '210px 150px',
              transform: isHovered ? 'rotate(-42deg) translate(-10px, -8px)' : 'rotate(-12deg)'
            }}
          >
            {/* Bat blade */}
            <path d="M 200 80 Q 208 80 212 90 L 210 145 L 195 145 L 196 90 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
            <line x1="203" y1="90" x2="203" y2="140" stroke="#B45309" strokeWidth="1.5" />
            {/* Bat handle & grip */}
            <rect x="201" y="52" width="4" height="28" rx="2" fill="#E2E8F0" />
            <line x1="201" y1="58" x2="205" y2="58" stroke="#475569" strokeWidth="1" />
            <line x1="201" y1="66" x2="205" y2="66" stroke="#475569" strokeWidth="1" />
            <line x1="201" y1="74" x2="205" y2="74" stroke="#475569" strokeWidth="1" />
          </g>

          {/* Ball trajectory & Ball */}
          <path
            d="M 330 80 Q 220 150 120 40"
            fill="none"
            stroke="rgba(239, 68, 68, 0.4)"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <g
            className="transition-all duration-700 ease-in-out"
            style={{
              transform: isHovered ? 'translate(-190px, -90px)' : 'translate(0px, 0px)'
            }}
          >
            <circle cx="310" cy="115" r="9" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5">
              <animate attributeName="cy" values="115;105;115" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Seam */}
            <path d="M 304 115 Q 310 110 316 115" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.8" />
          </g>
        </svg>
      )}

      {/* 2. FOOTBALL (Section 27): pitch, goal, ball, player/foot, net reaction */}
      {(type.includes('football')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Pitch & Penalty Arc */}
          <path d="M 20 195 L 380 195 L 340 145 L 60 145 Z" fill="#065F46" opacity="0.25" />
          <ellipse cx="200" cy="170" rx="45" ry="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="60" y1="145" x2="340" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Goal Post & Reactive Net */}
          <g transform="translate(260, 60)">
            {/* Goal Net */}
            <path
              d={isHovered ? "M 0 0 L 85 20 L 85 110 L 0 100 Z" : "M 0 0 L 70 20 L 70 110 L 0 100 Z"}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            {/* Crossbar & Posts */}
            <line x1="0" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <line x1="0" y1="0" x2="80" y2="20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="20" x2="80" y2="110" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Player Cleat / Striker Leg */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '90px 140px',
              transform: isHovered ? 'rotate(35deg) translate(15px, -10px)' : 'rotate(0deg)'
            }}
          >
            {/* Leg */}
            <path d="M 70 80 L 95 130 L 115 142 L 85 142 Z" fill="#3B82F6" opacity="0.9" />
            {/* Cleat boot */}
            <path d="M 90 135 L 125 140 L 122 148 L 88 146 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
            <circle cx="120" cy="148" r="1.5" fill="#FFFFFF" />
            <circle cx="112" cy="148" r="1.5" fill="#FFFFFF" />
            <circle cx="104" cy="148" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Football approaching goal */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transformOrigin: '140px 135px',
              transform: isHovered ? 'translate(155px, -45px) rotate(420deg)' : 'translate(0px, 0px) rotate(0deg)'
            }}
          >
            <circle cx="140" cy="135" r="15" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <polygon points="140,126 145,131 143,138 137,138 135,131" fill="#0F172A" />
            <polygon points="140,144 146,141 144,136 136,136 134,141" fill="#0F172A" />
          </g>
        </svg>
      )}

      {/* 3. BASKETBALL (Section 28): court, hoop, backboard, ball bounce/shoot, net */}
      {(type.includes('basketball')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Hardwood court surface */}
          <path d="M 30 190 L 370 190 L 340 145 L 60 145 Z" fill="#B45309" opacity="0.25" />
          <ellipse cx="200" cy="170" rx="55" ry="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

          {/* Backboard & Hoop */}
          <g transform="translate(290, 40)">
            <rect x="18" y="0" width="6" height="75" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Target square on backboard */}
            <rect x="12" y="32" width="6" height="25" fill="none" stroke="#EF4444" strokeWidth="1.5" />
            {/* Rim bracket */}
            <line x1="0" y1="57" x2="18" y2="57" stroke="#EA580C" strokeWidth="4" />
            {/* Net with gentle flex */}
            <path
              d={isHovered ? "M 0 57 L 4 88 L 14 88 L 18 57" : "M 0 57 L 3 82 L 15 82 L 18 57"}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              className="transition-all duration-300"
            />
          </g>

          {/* Basketball arc shooting into rim */}
          <path d="M 90 140 Q 190 20 295 85" fill="none" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="2" strokeDasharray="4 3" />
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(205px, -60px) rotate(360deg)' : 'translate(0px, 0px) rotate(0deg)',
              transformOrigin: '90px 140px'
            }}
          >
            <circle cx="90" cy="140" r="16" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
            <line x1="74" y1="140" x2="106" y2="140" stroke="#431407" strokeWidth="1.8" />
            <path d="M 82 126 Q 94 140 82 154" fill="none" stroke="#431407" strokeWidth="1.8" />
            <path d="M 98 126 Q 86 140 98 154" fill="none" stroke="#431407" strokeWidth="1.8" />
          </g>
        </svg>
      )}

      {/* 4. VOLLEYBALL (Section 29): court, net, ball crosses net */}
      {(type.includes('volleyball')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Court lines */}
          <path d="M 50 185 L 350 185 L 320 135 L 80 135 Z" fill="#1E3A8A" opacity="0.25" />
          <line x1="200" y1="185" x2="200" y2="135" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* Center Net */}
          <g transform="translate(198, 55)">
            <rect x="0" y="0" width="4" height="110" rx="2" fill="#E2E8F0" />
            {/* Net mesh */}
            <path d="M -40 20 L 40 20 L 40 80 L -40 80 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="-40" y1="20" x2="40" y2="20" stroke="#FFFFFF" strokeWidth="3" />
          </g>

          {/* Volleyball with high trajectory arc */}
          <path d="M 100 130 Q 200 30 300 130" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="2" strokeDasharray="4 3" />
          <g
            className="transition-all duration-700 ease-in-out"
            style={{
              transform: isHovered ? 'translate(200px, 0px) rotate(360deg)' : 'translate(0px, 0px) rotate(0deg)',
              transformOrigin: '100px 130px'
            }}
          >
            <circle cx="100" cy="130" r="15" fill="#FEF08A" stroke="#1E3A8A" strokeWidth="2" />
            <path d="M 85 130 Q 100 115 115 130" stroke="#2563EB" strokeWidth="2" fill="none" />
            <path d="M 85 130 Q 100 145 115 130" stroke="#2563EB" strokeWidth="2" fill="none" />
            <line x1="100" y1="115" x2="100" y2="145" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {/* 5. BADMINTON (Section 30): court, net, racket, shuttle crosses */}
      {(type.includes('badminton')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Court */}
          <path d="M 40 185 L 360 185 L 330 140 L 70 140 Z" fill="#047857" opacity="0.25" />
          {/* Net */}
          <g transform="translate(198, 75)">
            <rect x="0" y="0" width="4" height="90" rx="2" fill="#E2E8F0" />
            <rect x="-35" y="15" width="70" height="40" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="-35" y1="15" x2="35" y2="15" stroke="#FFFFFF" strokeWidth="3" />
          </g>

          {/* Badminton Racket */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '90px 145px',
              transform: isHovered ? 'rotate(-35deg) translate(10px, -15px)' : 'rotate(0deg)'
            }}
          >
            {/* Oval frame */}
            <ellipse cx="90" cy="85" rx="16" ry="22" fill="rgba(59, 130, 246, 0.1)" stroke="#3B82F6" strokeWidth="2" />
            {/* Mesh strings */}
            <line x1="82" y1="65" x2="82" y2="105" stroke="#93C5FD" strokeWidth="0.8" opacity="0.7" />
            <line x1="90" y1="63" x2="90" y2="107" stroke="#93C5FD" strokeWidth="0.8" opacity="0.7" />
            <line x1="98" y1="65" x2="98" y2="105" stroke="#93C5FD" strokeWidth="0.8" opacity="0.7" />
            <line x1="75" y1="85" x2="105" y2="85" stroke="#93C5FD" strokeWidth="0.8" opacity="0.7" />
            {/* Shaft & Handle */}
            <line x1="90" y1="107" x2="90" y2="145" stroke="#CBD5E1" strokeWidth="2.5" />
            <rect x="88" y="145" width="4" height="25" rx="2" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
          </g>

          {/* Shuttlecock trajectory */}
          <path d="M 120 90 Q 200 40 280 110" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(160px, 20px) rotate(45deg)' : 'translate(0px, 0px) rotate(-35deg)',
              transformOrigin: '120px 90px'
            }}
          >
            {/* Shuttle cone & cork */}
            <polygon points="110,85 125,80 120,95" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" opacity="0.9" />
            <circle cx="123" cy="92" r="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          </g>
        </svg>
      )}

      {/* 6. CHESS (Section 31): board, recognizable pieces, elegant piece movement */}
      {(type.includes('chess')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Isometric / 3D Chessboard */}
          <g transform="translate(110, 50)">
            {/* Board Base */}
            <polygon points="90,10 180,60 90,110 0,60" fill="#334155" stroke="#64748B" strokeWidth="2" />
            {/* Grid squares */}
            <polygon points="90,10 135,35 90,60 45,35" fill="#64748B" opacity="0.6" />
            <polygon points="135,35 180,60 135,85 90,60" fill="#1E293B" opacity="0.8" />
            <polygon points="45,35 90,60 45,85 0,60" fill="#1E293B" opacity="0.8" />
            <polygon points="90,60 135,85 90,110 45,85" fill="#64748B" opacity="0.6" />

            {/* Chess Pieces: King/Queen & Knight */}
            {/* Static King on left square */}
            <g transform="translate(38, 20)">
              <rect x="4" y="24" width="10" height="4" rx="1" fill="#F8FAFC" />
              <path d="M 6 24 L 7 12 L 11 12 L 12 24 Z" fill="#F8FAFC" />
              <circle cx="9" cy="8" r="3" fill="#F8FAFC" />
              <line x1="9" y1="2" x2="9" y2="6" stroke="#F8FAFC" strokeWidth="1.5" />
              <line x1="7" y1="4" x2="11" y2="4" stroke="#F8FAFC" strokeWidth="1.5" />
            </g>

            {/* Animated Knight moving gracefully */}
            <g
              className="transition-all duration-700 ease-out"
              style={{
                transform: isHovered ? 'translate(45px, 25px)' : 'translate(0px, 0px)'
              }}
            >
              <g transform="translate(82, 35)">
                <rect x="2" y="24" width="14" height="4" rx="1" fill="#2980B9" />
                {/* Horse profile */}
                <path d="M 4 24 Q 2 12 8 8 Q 12 6 15 10 Q 17 14 13 18 L 14 24 Z" fill="#2980B9" stroke="#E67E22" strokeWidth="1" />
                <circle cx="9" cy="11" r="1" fill="#FFFFFF" />
              </g>
            </g>
          </g>
        </svg>
      )}

      {/* 7. KABADDI (Section 32): court, player silhouettes, raider movement */}
      {(type.includes('kabaddi')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Mat Court & Baulk lines */}
          <path d="M 30 185 L 370 185 L 330 135 L 70 135 Z" fill="#831843" opacity="0.25" />
          <line x1="200" y1="185" x2="200" y2="135" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="130" y1="185" x2="130" y2="135" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="270" y1="185" x2="270" y2="135" stroke="#F59E0B" strokeWidth="1.5" />

          {/* Defenders Chain on right */}
          <g transform="translate(260, 95)" opacity="0.85">
            {/* Defender 1 */}
            <circle cx="20" cy="15" r="7" fill="#3B82F6" />
            <path d="M 15 22 L 25 22 L 23 45 L 17 45 Z" fill="#3B82F6" />
            {/* Defender 2 holding hands */}
            <circle cx="50" cy="15" r="7" fill="#3B82F6" />
            <path d="M 45 22 L 55 22 L 53 45 L 47 45 Z" fill="#3B82F6" />
            {/* Hand chain */}
            <line x1="24" y1="26" x2="46" y2="26" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Raider lunging across midline */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(95px, 5px)' : 'translate(0px, 0px)'
            }}
          >
            <g transform="translate(100, 100)">
              {/* Raider head & body in athletic crouch */}
              <circle cx="28" cy="10" r="7" fill="#EC4899" />
              <path d="M 12 18 L 32 16 L 38 32 L 25 38 Z" fill="#EC4899" />
              {/* Reaching arm */}
              <line x1="30" y1="20" x2="48" y2="22" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
              {/* Legs */}
              <line x1="22" y1="38" x2="10" y2="52" stroke="#DB2777" strokeWidth="3" strokeLinecap="round" />
              <line x1="32" y1="36" x2="38" y2="52" stroke="#DB2777" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      )}

      {/* 8. TABLE TENNIS (Section 33): table, net, paddles, ball moves between sides */}
      {(type.includes('tabletennis')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* 3D Stag Table */}
          <g transform="translate(90, 65)">
            <polygon points="110,15 220,55 110,95 0,55" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
            {/* White boundary lines */}
            <line x1="110" y1="15" x2="110" y2="95" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Table Legs */}
            <line x1="20" y1="62" x2="20" y2="95" stroke="#334155" strokeWidth="4" />
            <line x1="200" y1="62" x2="200" y2="95" stroke="#334155" strokeWidth="4" />
            <line x1="110" y1="95" x2="110" y2="125" stroke="#334155" strokeWidth="4" />

            {/* Table Tennis Net */}
            <line x1="110" y1="0" x2="110" y2="30" stroke="#E2E8F0" strokeWidth="2.5" />
            <rect x="95" y="5" width="30" height="22" fill="rgba(255,255,255,0.2)" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 1" />

            {/* Left Paddle */}
            <g transform="translate(30, 30)">
              <ellipse cx="10" cy="10" rx="10" ry="12" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
              <rect x="9" y="21" width="3" height="12" rx="1" fill="#D97706" />
            </g>

            {/* Right Paddle */}
            <g transform="translate(175, 40)">
              <ellipse cx="10" cy="10" rx="10" ry="12" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
              <rect x="9" y="21" width="3" height="12" rx="1" fill="#D97706" />
            </g>

            {/* Ping-pong ball bouncing back and forth */}
            <g
              className="transition-all duration-700 ease-in-out"
              style={{
                transform: isHovered ? 'translate(130px, 10px)' : 'translate(0px, 0px)'
              }}
            >
              <circle cx="45" cy="35" r="4.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            </g>
          </g>
        </svg>
      )}

      {/* 9. ATHLETICS (Section 34): track, lanes, runner moving smoothly */}
      {(type.includes('athletics')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Synthetic Running Track Curved Lanes */}
          <path d="M 0 170 C 140 170 260 170 400 170" fill="none" stroke="#DC2626" strokeWidth="32" opacity="0.6" />
          <path d="M 0 154 C 140 154 260 154 400 154" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />
          <path d="M 0 186 C 140 186 260 186 400 186" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />
          <line x1="320" y1="140" x2="320" y2="200" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* Athletic Sprinter in sprint drive */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(180px, 0px)' : 'translate(0px, 0px)'
            }}
          >
            <g transform="translate(80, 110)">
              {/* Head */}
              <circle cx="26" cy="10" r="7" fill="#F59E0B" />
              {/* Torso forward lean */}
              <path d="M 12 18 L 30 16 L 25 36 L 15 36 Z" fill="#2980B9" />
              {/* Pumping Arms */}
              <line x1="16" y1="20" x2="4" y2="30" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              <line x1="28" y1="18" x2="40" y2="26" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              {/* Powerful Stride Legs */}
              <line x1="18" y1="36" x2="8" y2="52" stroke="#2980B9" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="24" y1="36" x2="38" y2="44" stroke="#2980B9" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="38" y1="44" x2="34" y2="54" stroke="#2980B9" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      )}

      {/* ============================================================
          CULTURAL ANIMATIONS (Section 35)
          ============================================================ */}

      {/* 10. DANCE: dancer silhouette */}
      {(type.includes('dance')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <ellipse cx="200" cy="185" rx="120" ry="25" fill="#2980B9" opacity="0.2" />
          <g
            className="transition-transform duration-500 ease-out origin-bottom"
            style={{
              transformOrigin: '200px 180px',
              transform: isHovered ? 'scale(1.08) rotate(4deg)' : 'scale(1) rotate(0deg)'
            }}
          >
            <g transform="translate(180, 50)">
              {/* Dancer head & bun */}
              <circle cx="20" cy="15" r="7" fill="#EC4899" />
              <circle cx="20" cy="7" r="3" fill="#F472B6" />
              {/* Elegant torso & flowing ghagra/attire */}
              <path d="M 16 23 L 24 23 L 26 45 L 14 45 Z" fill="#EC4899" />
              <path d="M 12 45 Q 20 50 28 45 L 38 85 Q 20 95 2 85 Z" fill="url(#danceGrad, #DB2777)" opacity="0.9" />
              {/* Graceful mudra arms */}
              <path d="M 16 26 Q 5 15 2 2" fill="none" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 24 26 Q 35 15 38 2" fill="none" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      )}

      {/* 11. SINGING: microphone + sound waves */}
      {(type.includes('singing') || type.includes('voice')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Spotlight cone */}
          <polygon points="120,0 280,0 340,220 60,220" fill="rgba(109, 90, 230, 0.08)" />

          {/* Center Stage Studio Mic */}
          <g transform="translate(185, 60)">
            {/* Stand */}
            <line x1="15" y1="75" x2="15" y2="135" stroke="#94A3B8" strokeWidth="3" />
            <ellipse cx="15" cy="135" rx="20" ry="6" fill="#334155" />
            {/* Mic body & grille */}
            <rect x="8" y="25" width="14" height="40" rx="7" fill="#1E293B" stroke="#2980B9" strokeWidth="2" />
            <circle cx="15" cy="22" r="11" fill="#475569" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Grille lines */}
            <line x1="7" y1="20" x2="23" y2="20" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="7" y1="24" x2="23" y2="24" stroke="#CBD5E1" strokeWidth="1" />
          </g>

          {/* Sound waves pulsing outwards */}
          <g transform="translate(200, 82)">
            <circle cx="0" cy="0" r={isHovered ? "35" : "24"} fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" className="transition-all duration-300" />
            <circle cx="0" cy="0" r={isHovered ? "55" : "38"} fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.4" className="transition-all duration-500" />
            <circle cx="0" cy="0" r={isHovered ? "78" : "52"} fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.3" className="transition-all duration-700" />
          </g>
        </svg>
      )}

      {/* 12. SOLO PERFORMANCE: performer + stage spotlight */}
      {(type.includes('soloperformance') || type.includes('solo')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <ellipse cx="200" cy="180" rx="90" ry="20" fill="#F59E0B" opacity="0.25" />
          <g
            className="transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)', transformOrigin: '200px 140px' }}
          >
            <g transform="translate(185, 80)">
              <circle cx="15" cy="15" r="8" fill="#F59E0B" />
              <path d="M 8 26 L 22 26 L 20 65 L 10 65 Z" fill="#2980B9" />
              {/* Acoustic Guitar */}
              <ellipse cx="28" cy="46" rx="10" ry="14" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              <line x1="28" y1="46" x2="38" y2="20" stroke="#E2E8F0" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )}

      {/* 13. GROUP PERFORMANCE: multiple performers / band */}
      {(type.includes('groupperformance') || type.includes('group') || type.includes('band')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <ellipse cx="200" cy="180" rx="140" ry="25" fill="#4D7CFE" opacity="0.2" />
          {/* Drummer back center */}
          <g transform="translate(180, 75)" opacity="0.85">
            <circle cx="20" cy="10" r="6" fill="#94A3B8" />
            <circle cx="10" cy="30" r="10" fill="#334155" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="30" cy="30" r="10" fill="#334155" stroke="#CBD5E1" strokeWidth="1.5" />
          </g>
          {/* Left Singer */}
          <g
            className="transition-transform duration-500"
            style={{ transform: isHovered ? 'translate(-8px, -4px)' : 'translate(0, 0)' }}
          >
            <g transform="translate(130, 95)">
              <circle cx="15" cy="10" r="7" fill="#F472B6" />
              <path d="M 10 20 L 20 20 L 18 55 L 12 55 Z" fill="#DB2777" />
            </g>
          </g>
          {/* Right Lead Guitarist */}
          <g
            className="transition-transform duration-500"
            style={{ transform: isHovered ? 'translate(8px, -4px)' : 'translate(0, 0)' }}
          >
            <g transform="translate(240, 95)">
              <circle cx="15" cy="10" r="7" fill="#60A5FA" />
              <path d="M 10 20 L 20 20 L 18 55 L 12 55 Z" fill="#2563EB" />
              <line x1="8" y1="35" x2="32" y2="20" stroke="#F59E0B" strokeWidth="2.5" />
            </g>
          </g>
        </svg>
      )}

      {/* 14. DRAMA: theatrical masks + curtain */}
      {(type.includes('drama')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Velvet Curtains draped on sides */}
          <path d="M 0 0 C 60 40 40 140 10 220 L 0 220 Z" fill="#881337" opacity="0.6" />
          <path d="M 400 0 C 340 40 360 140 390 220 L 400 220 Z" fill="#881337" opacity="0.6" />

          {/* Tragedy Mask on left */}
          <g
            className="transition-all duration-500"
            style={{ transform: isHovered ? 'translate(-10px, -5px) rotate(-6deg)' : 'translate(0, 0)' }}
          >
            <g transform="translate(130, 65)">
              <ellipse cx="25" cy="35" rx="22" ry="28" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
              {/* Sad eyes & mouth */}
              <ellipse cx="17" cy="28" rx="4" ry="2.5" fill="#1E293B" />
              <ellipse cx="33" cy="28" rx="4" ry="2.5" fill="#1E293B" />
              <path d="M 18 48 Q 25 40 32 48" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>

          {/* Comedy Mask on right */}
          <g
            className="transition-all duration-500"
            style={{ transform: isHovered ? 'translate(10px, -5px) rotate(6deg)' : 'translate(0, 0)' }}
          >
            <g transform="translate(220, 65)">
              <ellipse cx="25" cy="35" rx="22" ry="28" fill="#F8FAFC" stroke="#2980B9" strokeWidth="2" />
              {/* Happy eyes & smile */}
              <path d="M 14 26 Q 18 22 22 26" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M 28 26 Q 32 22 36 26" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              <path d="M 17 40 Q 25 52 33 40 Z" fill="#1E293B" />
            </g>
          </g>
        </svg>
      )}

      {/* 15. FASHION SHOW: runway + walking silhouette */}
      {(type.includes('fashionshow') || type.includes('fashion')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Perspective Runway with LED side strips */}
          <polygon points="175,70 225,70 290,220 110,220" fill="#181D26" stroke="#475569" strokeWidth="1" />
          <line x1="175" y1="70" x2="110" y2="220" stroke="#E67E22" strokeWidth="2" opacity="0.8" />
          <line x1="225" y1="70" x2="290" y2="220" stroke="#E67E22" strokeWidth="2" opacity="0.8" />

          {/* Model silhouette strutting forward */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transformOrigin: '200px 170px',
              transform: isHovered ? 'translate(0, 15px) scale(1.15)' : 'translate(0, 0) scale(1)'
            }}
          >
            <g transform="translate(190, 50)">
              <circle cx="10" cy="12" r="5" fill="#E2E8F0" />
              <path d="M 6 18 L 14 18 L 16 38 L 4 38 Z" fill="#A855F7" />
              {/* Flowing runway cape / dress */}
              <polygon points="4,38 16,38 24,75 -4,75" fill="#C084FC" opacity="0.85" />
              {/* Long legs in high heel strides */}
              <line x1="6" y1="75" x2="4" y2="105" stroke="#E2E8F0" strokeWidth="2" />
              <line x1="14" y1="75" x2="17" y2="100" stroke="#E2E8F0" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )}

      {/* 16. PHOTOGRAPHY: camera + flash */}
      {(type.includes('photography')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Flash burst effect on hover */}
          <circle
            cx="245"
            cy="70"
            r={isHovered ? "45" : "0"}
            fill="url(#flashRadial, #FFFFFF)"
            opacity={isHovered ? "0.85" : "0"}
            className="transition-all duration-300"
          />

          {/* DSLR Pro Camera Body */}
          <g transform="translate(135, 60)">
            <rect x="0" y="25" width="130" height="85" rx="14" fill="#1E2430" stroke="#2980B9" strokeWidth="2.5" />
            {/* Viewfinder hump */}
            <path d="M 45 25 L 55 10 L 75 10 L 85 25 Z" fill="#11151C" stroke="#2980B9" strokeWidth="2" />
            {/* Shutter button */}
            <rect x="18" y="16" width="14" height="9" rx="2" fill="#E05D65" />
            {/* Large Lens with reflections */}
            <circle cx="65" cy="68" r="32" fill="#0A0C10" stroke="#2980B9" strokeWidth="4" />
            <circle cx="65" cy="68" r="22" fill="#181D26" stroke="#4D7CFE" strokeWidth="2" />
            <circle cx="65" cy="68" r="12" fill="#0F172A" />
            {/* Glass glint */}
            <path d="M 55 60 Q 65 52 75 60" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          </g>
        </svg>
      )}

      {/* 17. PAINTING: brush + animated stroke */}
      {(type.includes('painting')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          {/* Artist easel board */}
          <rect x="110" y="30" width="180" height="130" rx="8" fill="#1E2430" stroke="#475569" strokeWidth="2" />
          {/* Palette with color blobs */}
          <path d="M 70 145 C 50 145 50 185 85 185 C 105 185 115 165 95 150 Z" fill="#D97706" opacity="0.8" />
          <circle cx="65" cy="160" r="4" fill="#EF4444" />
          <circle cx="75" cy="172" r="4" fill="#3B82F6" />
          <circle cx="85" cy="162" r="4" fill="#10B981" />

          {/* Fluid vibrant paint stroke */}
          <path
            d="M 130 95 C 170 55 210 135 260 85"
            fill="none"
            stroke="#E67E22"
            strokeWidth={isHovered ? "8" : "4"}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Paintbrush following stroke */}
          <g
            className="transition-all duration-500 ease-out"
            style={{
              transform: isHovered ? 'translate(45px, -15px) rotate(15deg)' : 'translate(0, 0)'
            }}
          >
            <g transform="translate(210, 50)">
              <rect x="0" y="0" width="6" height="55" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="1" />
              <rect x="-1" y="55" width="8" height="12" fill="#CBD5E1" />
              <path d="M -1 67 L 7 67 L 4 80 L 1 80 Z" fill="#E67E22" />
            </g>
          </g>
        </svg>
      )}

      {/* 18. QUIZ: question -> answer check */}
      {(type.includes('quiz') && !type.includes('tech')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(100, 45)">
            {/* Card screen */}
            <rect x="0" y="0" width="200" height="120" rx="12" fill="#181D26" stroke="#475569" strokeWidth="2" />
            {/* Question mark or Check mark */}
            <text x="100" y="55" textAnchor="middle" fill="#E67E22" fontSize="36" fontWeight="bold" fontFamily="sans-serif">
              {isHovered ? "CORRECT!" : "Q & A"}
            </text>
            {/* Buzzer button */}
            <rect x="30" y="75" width="140" height="28" rx="6" fill={isHovered ? "#35B779" : "#2980B9"} className="transition-colors duration-300" />
            <text x="100" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
              {isHovered ? "✓ 100 POINTS" : "PRESS BUZZER"}
            </text>
          </g>
        </svg>
      )}

      {/* 19. LITERARY EVENTS: book + turning pages */}
      {(type.includes('literary')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(120, 55)">
            {/* Open Book Spine & Covers */}
            <path d="M 0 30 Q 80 15 80 100 Q 0 115 0 30 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            <path d="M 160 30 Q 80 15 80 100 Q 160 115 160 30 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            {/* Text lines */}
            <line x1="15" y1="50" x2="65" y2="45" stroke="#94A3B8" strokeWidth="2" />
            <line x1="15" y1="65" x2="65" y2="60" stroke="#94A3B8" strokeWidth="2" />
            <line x1="15" y1="80" x2="55" y2="75" stroke="#94A3B8" strokeWidth="2" />

            <line x1="95" y1="45" x2="145" y2="50" stroke="#94A3B8" strokeWidth="2" />
            <line x1="95" y1="60" x2="145" y2="65" stroke="#94A3B8" strokeWidth="2" />
            <line x1="95" y1="75" x2="135" y2="80" stroke="#94A3B8" strokeWidth="2" />

            {/* Feather Quill */}
            <g
              className="transition-transform duration-500 ease-out"
              style={{
                transform: isHovered ? 'translate(-15px, -15px) rotate(-15deg)' : 'translate(0, 0)'
              }}
            >
              <path d="M 130 10 Q 155 -15 170 10 Q 140 25 125 50 Z" fill="#2980B9" />
              <line x1="125" y1="50" x2="110" y2="70" stroke="#CBD5E1" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )}

      {/* ============================================================
          TECHNICAL ANIMATIONS (Section 36)
          ============================================================ */}

      {/* 20. HACKATHON: laptop + code typing */}
      {(type.includes('hackathon')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(110, 35)">
            {/* Laptop Display */}
            <rect x="20" y="10" width="140" height="95" rx="8" fill="#0A0C10" stroke="#475569" strokeWidth="2.5" />
            {/* Code lines */}
            <rect x="30" y="22" width="55" height="4" rx="2" fill="#4D7CFE" />
            <rect x="30" y="32" width="75" height="4" rx="2" fill="#35B779" />
            <rect x="40" y="42" width="60" height="4" rx="2" fill="#E5A93D" />
            <rect x="40" y="52" width="45" height="4" rx="2" fill="#E67E22" />
            {/* Animated typing cursor */}
            <rect
              x={isHovered ? "88" : "30"}
              y="62"
              width="4"
              height="8"
              fill="#35B779"
              className="animate-pulse"
            />
            {/* Laptop Base & Trackpad */}
            <polygon points="5,105 175,105 190,125 -10,125" fill="#1E2430" stroke="#334155" strokeWidth="1.5" />
            <rect x="70" y="110" width="40" height="8" rx="2" fill="#0F172A" />
          </g>
        </svg>
      )}

      {/* 21. CODING CONTEST: code editor + blinking cursor */}
      {(type.includes('coding')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(90, 35)">
            {/* IDE Window Frame */}
            <rect x="0" y="0" width="220" height="135" rx="8" fill="#11151C" stroke="#334155" strokeWidth="2" />
            {/* Mac titlebar dots */}
            <circle cx="16" cy="14" r="4" fill="#E05D65" />
            <circle cx="28" cy="14" r="4" fill="#E5A93D" />
            <circle cx="40" cy="14" r="4" fill="#35B779" />
            <line x1="0" y1="28" x2="220" y2="28" stroke="#1E2430" strokeWidth="1.5" />

            {/* Line numbers and code */}
            <text x="14" y="48" fill="#737C8C" fontSize="10" fontFamily="monospace">01</text>
            <text x="32" y="48" fill="#E67E22" fontSize="10" fontFamily="monospace">int solve(int n) &#123;</text>

            <text x="14" y="65" fill="#737C8C" fontSize="10" fontFamily="monospace">02</text>
            <text x="44" y="65" fill="#4D7CFE" fontSize="10" fontFamily="monospace">dp[n] = dp[n-1] + ...;</text>

            <text x="14" y="82" fill="#737C8C" fontSize="10" fontFamily="monospace">03</text>
            <text x="44" y="82" fill="#35B779" fontSize="10" fontFamily="monospace">return dp[n];</text>

            <text x="14" y="99" fill="#737C8C" fontSize="10" fontFamily="monospace">04</text>
            <text x="32" y="99" fill="#E67E22" fontSize="10" fontFamily="monospace">&#125;</text>

            {/* Dynamic cursor */}
            <rect x={isHovered ? "115" : "55"} y="90" width="6" height="12" fill="#35B779" className="animate-pulse" />
          </g>
        </svg>
      )}

      {/* 22. DEBUGGING: error -> fixed */}
      {(type.includes('debugging')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(95, 40)">
            <rect x="0" y="0" width="210" height="125" rx="8" fill="#11151C" stroke="#334155" strokeWidth="2" />
            {/* Terminal Top bar */}
            <rect x="0" y="0" width="210" height="24" rx="8" fill="#181D26" />
            <text x="12" y="16" fill="#A9B1BF" fontSize="11" fontFamily="monospace">gdb - debugger</text>

            {/* Error or Fixed notification */}
            <g
              className="transition-all duration-500"
              style={{ transform: isHovered ? 'translate(0, 0)' : 'translate(0, 0)' }}
            >
              <rect
                x="20"
                y="45"
                width="170"
                height="48"
                rx="6"
                fill={isHovered ? "rgba(53, 183, 121, 0.15)" : "rgba(224, 93, 101, 0.15)"}
                stroke={isHovered ? "#35B779" : "#E05D65"}
                strokeWidth="1.5"
              />
              <text
                x="105"
                y="74"
                textAnchor="middle"
                fill={isHovered ? "#35B779" : "#E05D65"}
                fontSize="13"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {isHovered ? "✓ 0 ERRORS [FIXED]" : "⚠ SEGMENTATION FAULT"}
              </text>
            </g>
          </g>
        </svg>
      )}

      {/* 23. TECH QUIZ: question -> answer */}
      {(type.includes('techquiz')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(100, 40)">
            <rect x="0" y="0" width="200" height="125" rx="10" fill="#181D26" stroke="#4D7CFE" strokeWidth="2" />
            <text x="100" y="45" textAnchor="middle" fill="#F5F7FA" fontSize="13" fontWeight="bold">
              Which protocol is stateless?
            </text>
            {/* Choices */}
            <rect x="25" y="65" width="70" height="26" rx="5" fill="#11151C" stroke="#475569" />
            <text x="60" y="82" textAnchor="middle" fill="#A9B1BF" fontSize="11">A) TCP</text>

            <rect x="105" y="65" width="70" height="26" rx="5" fill={isHovered ? "#35B779" : "#11151C"} stroke={isHovered ? "#35B779" : "#475569"} className="transition-colors duration-300" />
            <text x="140" y="82" textAnchor="middle" fill={isHovered ? "#FFFFFF" : "#A9B1BF"} fontSize="11" fontWeight="bold">B) HTTP</text>
          </g>
        </svg>
      )}

      {/* 24. PAPER PRESENTATION: document / slides */}
      {(type.includes('paper')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(125, 35)">
            {/* Presentation Slide Frame */}
            <rect x="0" y="0" width="150" height="110" rx="6" fill="#1E2430" stroke="#2980B9" strokeWidth="2" />
            <rect x="15" y="18" width="120" height="12" rx="3" fill="#2980B9" />
            {/* Chart in slide */}
            <rect x="25" y="70" width="14" height="25" fill="#4D7CFE" />
            <rect x="45" y="55" width="14" height="40" fill="#35B779" />
            <rect x="65" y="45" width="14" height="50" fill="#E67E22" />
            <rect x="85" y="35" width="14" height="60" fill="#E5A93D" />
            {/* Slide stand */}
            <line x1="75" y1="110" x2="75" y2="150" stroke="#64748B" strokeWidth="3" />
            <line x1="50" y1="150" x2="100" y2="150" stroke="#64748B" strokeWidth="3" />
          </g>
        </svg>
      )}

      {/* 25. PROJECT EXPO: demo screen */}
      {(type.includes('projectexpo') || type.includes('expo') || type.includes('project')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(100, 35)">
            {/* Expo Display Tablet / Monitor */}
            <rect x="0" y="0" width="200" height="120" rx="8" fill="#0A0C10" stroke="#35B779" strokeWidth="2" />
            {/* Live gauge meters */}
            <circle cx="60" cy="55" r="28" fill="none" stroke="#1E2430" strokeWidth="6" />
            <circle
              cx="60"
              cy="55"
              r="28"
              fill="none"
              stroke="#35B779"
              strokeWidth="6"
              strokeDasharray={isHovered ? "140 180" : "90 180"}
              className="transition-all duration-700"
            />
            <text x="60" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">98%</text>

            <text x="135" y="50" fill="#A9B1BF" fontSize="11" fontFamily="sans-serif">IOT SENSORS</text>
            <text x="135" y="68" fill="#35B779" fontSize="12" fontWeight="bold">ACTIVE</text>
            <text x="135" y="86" fill="#4D7CFE" fontSize="10">24.5°C | 60Hz</text>
          </g>
        </svg>
      )}

      {/* 26. UI/UX DESIGN CHALLENGE: wireframe layout */}
      {(type.includes('uiux') || type.includes('design')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(110, 30)">
            {/* Mobile Wireframe */}
            <rect x="0" y="0" width="85" height="150" rx="14" fill="#11151C" stroke="#E67E22" strokeWidth="2" />
            {/* Notch */}
            <rect x="25" y="6" width="35" height="5" rx="2.5" fill="#334155" />
            {/* Wireframe blocks */}
            <rect x="10" y="22" width="65" height="24" rx="4" fill="#1E2430" />
            <circle cx="24" cy="65" r="10" fill="#2980B9" />
            <circle cx="60" cy="65" r="10" fill="#4D7CFE" />
            <rect x="10" y="88" width="65" height="42" rx="4" fill="#181D26" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />

            {/* Cursor selector */}
            <g
              className="transition-transform duration-500 ease-out"
              style={{
                transform: isHovered ? 'translate(50px, 60px)' : 'translate(100px, 30px)'
              }}
            >
              <polygon points="0,0 0,16 5,12 12,18 15,15 8,9 14,9" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
            </g>
          </g>
        </svg>
      )}

      {/* 27. WEB DEVELOPMENT CHALLENGE: browser + code */}
      {(type.includes('webdev') || type.includes('web')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(85, 35)">
            {/* Browser window */}
            <rect x="0" y="0" width="230" height="135" rx="8" fill="#11151C" stroke="#4D7CFE" strokeWidth="2" />
            <rect x="0" y="0" width="230" height="25" rx="8" fill="#181D26" />
            <circle cx="15" cy="12" r="3.5" fill="#E05D65" />
            <circle cx="26" cy="12" r="3.5" fill="#E5A93D" />
            <circle cx="37" cy="12" r="3.5" fill="#35B779" />
            {/* URL bar */}
            <rect x="52" y="5" width="130" height="14" rx="3" fill="#0A0C10" />
            <text x="60" y="16" fill="#737C8C" fontSize="9" fontFamily="monospace">https://colorido2k26.dev</text>

            {/* Rendered elements in browser */}
            <rect x="20" y="40" width="80" height="35" rx="4" fill="#2980B9" opacity="0.8" />
            <rect x="110" y="40" width="100" height="8" rx="2" fill="#CBD5E1" />
            <rect x="110" y="54" width="85" height="6" rx="2" fill="#64748B" />
            <rect x="110" y="65" width="60" height="6" rx="2" fill="#64748B" />

            <rect x="20" y="90" width="190" height="28" rx="4" fill="#181D26" stroke="#334155" strokeWidth="1" />
          </g>
        </svg>
      )}

      {/* 28. AI/ML CHALLENGE: subtle neural data nodes */}
      {(type.includes('aiml') || type.includes('ai') || type.includes('neural')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(90, 45)">
            {/* Network Connections */}
            <line x1="30" y1="20" x2="110" y2="40" stroke="#2980B9" strokeWidth="1.5" opacity="0.6" />
            <line x1="30" y1="65" x2="110" y2="40" stroke="#2980B9" strokeWidth="1.5" opacity="0.6" />
            <line x1="30" y1="110" x2="110" y2="90" stroke="#2980B9" strokeWidth="1.5" opacity="0.6" />

            <line x1="110" y1="40" x2="190" y2="65" stroke="#4D7CFE" strokeWidth="1.5" opacity="0.6" />
            <line x1="110" y1="90" x2="190" y2="65" stroke="#4D7CFE" strokeWidth="1.5" opacity="0.6" />

            {/* Input layer nodes */}
            <circle cx="30" cy="20" r="9" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />
            <circle cx="30" cy="65" r="9" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />
            <circle cx="30" cy="110" r="9" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />

            {/* Hidden layer nodes */}
            <circle
              cx="110"
              cy="40"
              r={isHovered ? "13" : "10"}
              fill="#4D7CFE"
              stroke="#93C5FD"
              strokeWidth="2"
              className="transition-all duration-300"
            />
            <circle
              cx="110"
              cy="90"
              r={isHovered ? "13" : "10"}
              fill="#4D7CFE"
              stroke="#93C5FD"
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Output Node */}
            <circle cx="190" cy="65" r="12" fill="#35B779" stroke="#A7F3D0" strokeWidth="2" />
          </g>
        </svg>
      )}

      {/* 29. CODE RELAY: code blocks moving in handoff */}
      {(type.includes('coderelay') || type.includes('relay')) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <g transform="translate(80, 50)">
            {/* Relay track */}
            <line x1="20" y1="60" x2="220" y2="60" stroke="#334155" strokeWidth="4" strokeDasharray="6 4" />

            {/* Block 1 (Left) */}
            <g transform="translate(30, 30)">
              <rect x="0" y="0" width="45" height="60" rx="6" fill="#181D26" stroke="#4D7CFE" strokeWidth="2" />
              <text x="22" y="35" textAnchor="middle" fill="#4D7CFE" fontSize="12" fontWeight="bold">DEV 1</text>
            </g>

            {/* Block 2 (Handoff Baton in Motion) */}
            <g
              className="transition-all duration-700 ease-in-out"
              style={{
                transform: isHovered ? 'translate(90px, 0px)' : 'translate(0px, 0px)'
              }}
            >
              <g transform="translate(95, 20)">
                <rect x="0" y="0" width="50" height="75" rx="8" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />
                <text x="25" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">BATON</text>
                <text x="25" y="58" textAnchor="middle" fill="#CBD5E1" fontSize="9">&lt;/&gt;</text>
              </g>
            </g>

            {/* Block 3 (Right) */}
            <g transform="translate(175, 30)">
              <rect x="0" y="0" width="45" height="60" rx="6" fill="#181D26" stroke="#35B779" strokeWidth="2" />
              <text x="22" y="35" textAnchor="middle" fill="#35B779" fontSize="12" fontWeight="bold">DEV 2</text>
            </g>
          </g>
        </svg>
      )}

      {/* Fallback visual for custom / generic events */}
      {(![
        'cricket', 'football', 'basketball', 'volleyball', 'badminton', 'chess', 'kabaddi', 'tabletennis', 'athletics',
        'dance', 'singing', 'voice', 'soloperformance', 'solo', 'groupperformance', 'group', 'band', 'drama', 'fashionshow', 'fashion', 'photography', 'painting', 'quiz', 'literary',
        'hackathon', 'coding', 'debugging', 'techquiz', 'paper', 'projectexpo', 'expo', 'project', 'uiux', 'design', 'webdev', 'web', 'aiml', 'ai', 'neural', 'coderelay', 'relay'
      ].some(k => type.includes(k))) && (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <circle cx="200" cy="110" r="45" fill="none" stroke="#2980B9" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="200" cy="110" r="25" fill="#181D26" stroke="#E67E22" strokeWidth="2" />
          <text x="200" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">COLORIDO</text>
        </svg>
      )}
    </div>
  );
}
