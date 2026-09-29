import React from 'react';

/**
 * EventVisualCanvas Component
 * Competition-grade animated mini-scenes occupying 45-55% of the event card.
 * Elevated with multi-layered depth, ambient floating motion, and reactive hover kinetics.
 * Adheres strictly to COLORIDO 2K26 palette (#2C3E50, #2980B9, #E67E22, #ECF0F1, #95A5A6).
 * Zero stars, zero sparkles, zero slots.
 */
export default function EventVisualCanvas({ visualType = 'cricket', isHovered = false, className = '' }) {
  const type = visualType?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'cricket';

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#141C24] via-[#1E2B37] to-[#2C3E50] dark:from-[#141C24] dark:via-[#1E2B37] dark:to-[#2C3E50] light:from-[#ECF0F1] light:via-[#E2E8F0] light:to-[#D5DBDB] ${className}`}>
      
      {/* Dynamic ambient backdrop radial glow & geometric matrix grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2980B9_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E67E22]/15 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-125 group-hover:opacity-100 opacity-40 animate-ambient-glow" />
      <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-[#2980B9]/20 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-125 group-hover:opacity-100 opacity-50 animate-ambient-glow" />

      {/* ============================================================
          SPORTS ANIMATIONS (1 to 9)
          ============================================================ */}

      {/* 1. CRICKET: Volumetric pitch, glowing wickets, swinging bat, reactive leather ball */}
      {type.includes('cricket') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <defs>
            <linearGradient id="cricketGrass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="cricketPitch" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B45309" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="cricketBallGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="70%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </radialGradient>
          </defs>

          {/* Stadium Floodlights Beam */}
          <polygon points="160,0 240,0 340,230 60,230" fill="url(#stadiumLights)" opacity="0.4" />

          {/* Turf field & 22-yard pitch */}
          <ellipse cx="200" cy="185" rx="180" ry="38" fill="url(#cricketGrass)" />
          <path d="M 115 190 L 285 190 L 275 162 L 125 162 Z" fill="url(#cricketPitch)" />
          {/* Crease lines */}
          <line x1="140" y1="190" x2="140" y2="162" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.85" />
          <line x1="260" y1="190" x2="260" y2="162" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.85" />

          {/* Stumps & Glowing Fluorescent Bails */}
          <g transform="translate(138, 118)">
            {/* Wicket shadow */}
            <ellipse cx="6" cy="46" rx="14" ry="3" fill="#000000" opacity="0.4" />
            <rect x="0" y="0" width="3.5" height="46" rx="1.5" fill="#FCD34D" />
            <rect x="5.5" y="0" width="3.5" height="46" rx="1.5" fill="#FCD34D" />
            <rect x="11" y="0" width="3.5" height="46" rx="1.5" fill="#FCD34D" />
            {/* Glowing Bails */}
            <rect x="-1" y="-3.5" width="8" height="2.5" rx="1" fill="#EF4444" className={isHovered ? "animate-pulse" : ""} />
            <rect x="7.5" y="-3.5" width="8" height="2.5" rx="1" fill="#EF4444" className={isHovered ? "animate-pulse" : ""} />
          </g>

          {/* Bat with swinging motion */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '215px 155px',
              transform: isHovered ? 'rotate(-44deg) translate(-12px, -10px)' : 'rotate(-12deg)'
            }}
          >
            {/* Shadow under bat */}
            <ellipse cx="205" cy="155" rx="12" ry="4" fill="#000000" opacity="0.35" />
            {/* Bat blade */}
            <path d="M 202 75 Q 212 75 216 86 L 213 150 L 196 150 L 198 86 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.8" />
            <line x1="205" y1="88" x2="205" y2="145" stroke="#92400E" strokeWidth="1.8" />
            {/* Colored Rubber Grip Handle */}
            <rect x="203" y="44" width="4.5" height="32" rx="2" fill="#2980B9" stroke="#1F618D" strokeWidth="1" />
            <line x1="203" y1="52" x2="207.5" y2="52" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            <line x1="203" y1="60" x2="207.5" y2="60" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            <line x1="203" y1="68" x2="207.5" y2="68" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
          </g>

          {/* Trajectory Guide Arc */}
          <path
            d="M 330 75 Q 215 155 110 30"
            fill="none"
            stroke="rgba(239, 68, 68, 0.35)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Match Ball with Ambient Floating & Rocketing Hover */}
          <g
            className="transition-all duration-700 ease-in-out"
            style={{
              transform: isHovered ? 'translate(-205px, -95px) scale(0.85)' : 'translate(0px, 0px)'
            }}
          >
            {/* Ball Ambient Gentle Float */}
            <g className="animate-subtle-float">
              {/* Ball Shadow */}
              <ellipse cx="312" cy="132" rx="8" ry="3" fill="#000000" opacity="0.4" />
              {/* Ball */}
              <circle cx="312" cy="112" r="10.5" fill="url(#cricketBallGlow)" stroke="#7F1D1D" strokeWidth="1.5" />
              {/* White Seam */}
              <path d="M 305 112 Q 312 106 319 112" stroke="#FFFFFF" strokeWidth="1.4" fill="none" opacity="0.9" />
              <line x1="307" y1="109" x2="309" y2="114" stroke="#FFFFFF" strokeWidth="0.8" />
              <line x1="311" y1="107" x2="313" y2="112" stroke="#FFFFFF" strokeWidth="0.8" />
              <line x1="315" y1="109" x2="317" y2="114" stroke="#FFFFFF" strokeWidth="0.8" />
            </g>
          </g>
        </svg>
      )}

      {/* 2. FOOTBALL: Penalty box, realistic 3D goal net with bulge reaction, curved ball */}
      {type.includes('football') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <defs>
            <linearGradient id="footballTurf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#064E3B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#022C22" stopOpacity="0.6" />
            </linearGradient>
            <pattern id="hexNet" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 0 6 L 6 0 L 12 6 L 6 12 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Grass Turf & Markings */}
          <path d="M 15 200 L 385 200 L 345 145 L 55 145 Z" fill="url(#footballTurf)" />
          <ellipse cx="200" cy="172" rx="55" ry="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="55" y1="145" x2="345" y2="145" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <circle cx="200" cy="172" r="3" fill="#FFFFFF" opacity="0.8" />

          {/* 3D Goal Post with Dynamic Bulging Net */}
          <g transform="translate(255, 50)">
            {/* Reactive Net */}
            <path
              d={isHovered ? "M 0 0 L 95 24 L 95 125 L 0 110 Z" : "M 0 0 L 75 20 L 75 120 L 0 110 Z"}
              fill="url(#hexNet)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              className="transition-all duration-300 ease-out"
            />
            {/* White Metal Crossbar & Posts */}
            <line x1="0" y1="0" x2="0" y2="110" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="85" y2="22" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="85" y1="22" x2="85" y2="122" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="110" x2="85" y2="122" stroke="#64748B" strokeWidth="2.5" />
          </g>

          {/* Striker's Kicking Leg */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '95px 145px',
              transform: isHovered ? 'rotate(38deg) translate(18px, -12px)' : 'rotate(0deg)'
            }}
          >
            {/* Athletic Leg in Blue Kit */}
            <path d="M 68 85 L 96 132 L 120 145 L 86 145 Z" fill="#2980B9" />
            {/* Striker Cleat Boot in Flame Orange */}
            <path d="M 92 138 L 132 143 L 128 152 L 88 150 Z" fill="#E67E22" stroke="#D35400" strokeWidth="1.5" />
            {/* Cleat Studs */}
            <circle cx="126" cy="153" r="1.8" fill="#FFFFFF" />
            <circle cx="116" cy="153" r="1.8" fill="#FFFFFF" />
            <circle cx="106" cy="153" r="1.8" fill="#FFFFFF" />
          </g>

          {/* Football Curving into Top Corner */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transformOrigin: '142px 140px',
              transform: isHovered ? 'translate(162px, -52px) rotate(540deg) scale(0.9)' : 'translate(0px, 0px) rotate(0deg)'
            }}
          >
            <g className="animate-subtle-float">
              {/* Drop Shadow */}
              <ellipse cx="142" cy="158" rx="12" ry="4" fill="#000000" opacity="0.35" />
              {/* Outer Ball */}
              <circle cx="142" cy="140" r="16" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
              {/* Pentagonal Panels */}
              <polygon points="142,130 148,135 146,143 138,143 136,135" fill="#1E293B" />
              <polygon points="142,150 149,146 146,141 138,141 135,146" fill="#1E293B" />
              <polygon points="154,136 157,143 152,148 147,144 148,137" fill="#1E293B" opacity="0.8" />
              <polygon points="130,136 127,143 132,148 137,144 136,137" fill="#1E293B" opacity="0.8" />
            </g>
          </g>
        </svg>
      )}

      {/* 3. BASKETBALL: Parquet hardwood, orange rim with net snap, rainbow trajectory arc */}
      {type.includes('basketball') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <defs>
            <linearGradient id="hardwoodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#451A03" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="bballTexture" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="75%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </radialGradient>
          </defs>

          {/* Hardwood Court */}
          <path d="M 20 195 L 380 195 L 340 145 L 60 145 Z" fill="url(#hardwoodGrad)" />
          <ellipse cx="200" cy="170" rx="65" ry="16" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <circle cx="200" cy="170" r="3" fill="#FFFFFF" opacity="0.8" />

          {/* Backboard & Orange Rim */}
          <g transform="translate(295, 35)">
            {/* Tempered Glass Backboard with White Edge */}
            <rect x="18" y="0" width="7" height="85" rx="2" fill="rgba(255,255,255,0.2)" stroke="#E2E8F0" strokeWidth="2" />
            {/* Shooter Target Box */}
            <rect x="12" y="36" width="6" height="28" fill="none" stroke="#EF4444" strokeWidth="2" />
            {/* Steel Orange Rim */}
            <line x1="0" y1="64" x2="18" y2="64" stroke="#E67E22" strokeWidth="4.5" strokeLinecap="round" />
            {/* Net with Swish Reaction on Hover */}
            <path
              d={isHovered ? "M 0 64 L 5 100 L 13 100 L 18 64" : "M 0 64 L 3 92 L 15 92 L 18 64"}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeDasharray="4 2"
              className="transition-all duration-300"
            />
          </g>

          {/* Trajectory Guide */}
          <path d="M 85 145 Q 190 15 300 75" fill="none" stroke="rgba(230, 126, 34, 0.4)" strokeWidth="2.5" strokeDasharray="5 4" />

          {/* Basketball with High Arc & Spin */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transformOrigin: '85px 145px',
              transform: isHovered ? 'translate(218px, -70px) rotate(480deg)' : 'translate(0px, 0px) rotate(0deg)'
            }}
          >
            <g className="animate-subtle-float">
              {/* Ball Drop Shadow */}
              <ellipse cx="85" cy="164" rx="13" ry="4" fill="#000000" opacity="0.4" />
              {/* Ball Body */}
              <circle cx="85" cy="145" r="17" fill="url(#bballTexture)" stroke="#7C2D12" strokeWidth="2" />
              {/* Black Ribbed Channels */}
              <line x1="68" y1="145" x2="102" y2="145" stroke="#1E293B" strokeWidth="2" />
              <path d="M 76 130 Q 90 145 76 160" fill="none" stroke="#1E293B" strokeWidth="2" />
              <path d="M 94 130 Q 80 145 94 160" fill="none" stroke="#1E293B" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )}

      {/* 4. VOLLEYBALL: Blue championship court, mesh antenna net, power spike arc */}
      {type.includes('volleyball') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          {/* Blue Indoor Court */}
          <path d="M 40 190 L 360 190 L 330 135 L 70 135 Z" fill="#1E3A8A" opacity="0.35" />
          <line x1="200" y1="190" x2="200" y2="135" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <line x1="135" y1="190" x2="145" y2="135" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="265" y1="190" x2="255" y2="135" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

          {/* Center Net with Tension Cables & Antenna */}
          <g transform="translate(198, 48)">
            <rect x="0" y="0" width="4" height="120" rx="2" fill="#E2E8F0" />
            {/* Red & White Antenna */}
            <rect x="0" y="-18" width="4" height="18" fill="#EF4444" />
            {/* White Top Tape */}
            <line x1="-50" y1="20" x2="50" y2="20" stroke="#FFFFFF" strokeWidth="3.5" />
            {/* Grid Mesh */}
            <path d="M -50 20 L 50 20 L 50 90 L -50 90 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeDasharray="4 2" />
          </g>

          {/* Spike Trajectory Arc */}
          <path d="M 90 125 Q 198 15 310 145" fill="none" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="2" strokeDasharray="5 3" />

          {/* Tricolor Volleyball with Dynamic Spike Velocity */}
          <g
            className="transition-all duration-700 ease-in-out"
            style={{
              transformOrigin: '95px 125px',
              transform: isHovered ? 'translate(210px, 20px) rotate(420deg)' : 'translate(0px, 0px) rotate(0deg)'
            }}
          >
            <g className="animate-subtle-float">
              <ellipse cx="95" cy="145" rx="11" ry="3.5" fill="#000000" opacity="0.35" />
              <circle cx="95" cy="125" r="16" fill="#FEF08A" stroke="#1E3A8A" strokeWidth="2" />
              <path d="M 80 125 Q 95 110 110 125" stroke="#2563EB" strokeWidth="2.5" fill="none" />
              <path d="M 80 125 Q 95 140 110 125" stroke="#2563EB" strokeWidth="2.5" fill="none" />
              <line x1="95" y1="109" x2="95" y2="141" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )}

      {/* 5. BADMINTON: High-tension racket, airy shuttlecock flight */}
      {type.includes('badminton') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          {/* Green Court */}
          <path d="M 35 190 L 365 190 L 335 140 L 65 140 Z" fill="#065F46" opacity="0.3" />
          <line x1="200" y1="190" x2="200" y2="140" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

          {/* Badminton Net */}
          <g transform="translate(198, 70)">
            <rect x="0" y="0" width="4" height="95" rx="2" fill="#E2E8F0" />
            <line x1="-40" y1="15" x2="40" y2="15" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="-40" y="15" width="80" height="45" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="3 2" />
          </g>

          {/* Badminton Racket */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '90px 150px',
              transform: isHovered ? 'rotate(-38deg) translate(12px, -18px)' : 'rotate(0deg)'
            }}
          >
            {/* Racket Oval Frame */}
            <ellipse cx="90" cy="85" rx="18" ry="24" fill="rgba(41, 128, 185, 0.15)" stroke="#2980B9" strokeWidth="2.5" />
            {/* Strings */}
            <line x1="82" y1="63" x2="82" y2="107" stroke="#93C5FD" strokeWidth="0.8" opacity="0.75" />
            <line x1="90" y1="61" x2="90" y2="109" stroke="#93C5FD" strokeWidth="0.8" opacity="0.75" />
            <line x1="98" y1="63" x2="98" y2="107" stroke="#93C5FD" strokeWidth="0.8" opacity="0.75" />
            <line x1="74" y1="85" x2="106" y2="85" stroke="#93C5FD" strokeWidth="0.8" opacity="0.75" />
            {/* Carbon Fiber Shaft & Grip */}
            <line x1="90" y1="109" x2="90" y2="150" stroke="#CBD5E1" strokeWidth="2.8" />
            <rect x="88" y="150" width="4.5" height="28" rx="2" fill="#E67E22" stroke="#D35400" strokeWidth="1" />
          </g>

          {/* Shuttlecock Flight */}
          <path d="M 120 90 Q 200 35 285 115" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(165px, 25px) rotate(50deg)' : 'translate(0px, 0px) rotate(-30deg)',
              transformOrigin: '120px 90px'
            }}
          >
            <g className="animate-subtle-float">
              <polygon points="108,82 125,78 120,95" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" opacity="0.95" />
              <circle cx="123" cy="91" r="4.5" fill="#F8FAFC" stroke="#E67E22" strokeWidth="1.5" />
            </g>
          </g>
        </svg>
      )}

      {/* 6. CHESS: 3D Isometric grandmaster board, majestic Staunton Knight leaping */}
      {type.includes('chess') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <defs>
            <linearGradient id="boardEdge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* 3D Isometric Chessboard */}
          <g transform="translate(100, 50)">
            {/* Board Base Chamfer */}
            <polygon points="100,10 200,65 100,120 0,65" fill="url(#boardEdge)" stroke="#64748B" strokeWidth="2.5" />
            {/* Checkered Grid Squares */}
            <polygon points="100,10 150,37 100,65 50,37" fill="#64748B" opacity="0.5" />
            <polygon points="150,37 200,65 150,92 100,65" fill="#1E293B" opacity="0.85" />
            <polygon points="50,37 100,65 50,92 0,65" fill="#1E293B" opacity="0.85" />
            <polygon points="100,65 150,92 100,120 50,92" fill="#64748B" opacity="0.5" />

            {/* Glowing Tactical Target Square on Hover */}
            <polygon
              points="150,37 200,65 150,92 100,65"
              fill={isHovered ? "#2980B9" : "transparent"}
              opacity={isHovered ? "0.45" : "0"}
              stroke={isHovered ? "#3498DB" : "transparent"}
              strokeWidth="2"
              className="transition-all duration-500"
            />

            {/* White King Piece (Left) */}
            <g transform="translate(42, 22)">
              <rect x="3" y="26" width="12" height="4" rx="1.5" fill="#F8FAFC" />
              <path d="M 5 26 L 7 13 L 11 13 L 13 26 Z" fill="#F8FAFC" />
              <circle cx="9" cy="9" r="3.5" fill="#F8FAFC" />
              <line x1="9" y1="2" x2="9" y2="7" stroke="#F8FAFC" strokeWidth="2" />
              <line x1="6.5" y1="4.5" x2="11.5" y2="4.5" stroke="#F8FAFC" strokeWidth="2" />
            </g>

            {/* Royal Knight Leaping in Tactical Check */}
            <g
              className="transition-all duration-700 ease-out"
              style={{
                transform: isHovered ? 'translate(52px, 28px)' : 'translate(0px, 0px)'
              }}
            >
              <g className="animate-subtle-float">
                {/* Knight Shadow */}
                <ellipse cx="90" cy="65" rx="8" ry="3" fill="#000000" opacity="0.4" />
                <g transform="translate(82, 32)">
                  <rect x="1" y="26" width="16" height="4.5" rx="1.5" fill="#2980B9" />
                  {/* Horse Profile with Mane & Ears */}
                  <path d="M 3 26 Q 1 12 7 8 Q 11 5 16 9 Q 18 14 14 18 L 16 26 Z" fill="#2980B9" stroke="#E67E22" strokeWidth="1.5" />
                  <circle cx="9" cy="11" r="1.5" fill="#FFFFFF" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      )}

      {/* 7. KABADDI: Pro Kabaddi mat, baulk lines, raider dynamic lunge */}
      {type.includes('kabaddi') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          {/* Mat Court */}
          <path d="M 25 190 L 375 190 L 335 135 L 65 135 Z" fill="#831843" opacity="0.35" />
          <line x1="200" y1="190" x2="200" y2="135" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="5 3" />
          <line x1="130" y1="190" x2="130" y2="135" stroke="#F59E0B" strokeWidth="2" />
          <line x1="270" y1="190" x2="270" y2="135" stroke="#F59E0B" strokeWidth="2" />

          {/* Defenders Chain on right */}
          <g transform="translate(265, 95)" opacity="0.9">
            <circle cx="20" cy="15" r="7.5" fill="#2980B9" />
            <path d="M 14 23 L 26 23 L 24 48 L 16 48 Z" fill="#2980B9" />
            <circle cx="52" cy="15" r="7.5" fill="#2980B9" />
            <path d="M 46 23 L 58 23 L 56 48 L 48 48 Z" fill="#2980B9" />
            {/* Gripped Hands Chain */}
            <line x1="24" y1="28" x2="48" y2="28" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Raider Lunging with Touch Action */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(100px, 8px)' : 'translate(0px, 0px)'
            }}
          >
            <g transform="translate(95, 98)">
              <circle cx="28" cy="10" r="7.5" fill="#E67E22" />
              <path d="M 12 18 L 32 16 L 38 32 L 25 38 Z" fill="#E67E22" />
              {/* Reaching Touch Arm */}
              <line x1="30" y1="20" x2="52" y2="22" stroke="#FDBA74" strokeWidth="3.5" strokeLinecap="round" />
              {/* Touch Blast Indicator on Hover */}
              {isHovered && (
                <circle cx="52" cy="22" r="8" fill="none" stroke="#F59E0B" strokeWidth="2" className="animate-ping" />
              )}
              {/* Athletic Legs */}
              <line x1="22" y1="38" x2="8" y2="54" stroke="#D35400" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="32" y1="36" x2="40" y2="54" stroke="#D35400" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      )}

      {/* 8. TABLE TENNIS: 3D Stag table, dual red/black rubber paddles, ping-pong rally */}
      {type.includes('tabletennis') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(85, 60)">
            {/* Table Surface */}
            <polygon points="115,15 230,55 115,98 0,55" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.8" />
            <line x1="115" y1="15" x2="115" y2="98" stroke="#FFFFFF" strokeWidth="1.8" />
            {/* Heavy Legs */}
            <line x1="20" y1="62" x2="20" y2="102" stroke="#334155" strokeWidth="4.5" />
            <line x1="210" y1="62" x2="210" y2="102" stroke="#334155" strokeWidth="4.5" />
            <line x1="115" y1="98" x2="115" y2="135" stroke="#334155" strokeWidth="4.5" />

            {/* Net */}
            <line x1="115" y1="0" x2="115" y2="30" stroke="#E2E8F0" strokeWidth="3" />
            <rect x="98" y="6" width="34" height="24" fill="rgba(255,255,255,0.25)" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3 1" />

            {/* Left Red Paddle */}
            <g transform="translate(25, 28)">
              <ellipse cx="12" cy="12" rx="12" ry="14" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
              <rect x="10" y="24" width="4" height="14" rx="1.5" fill="#D97706" />
            </g>

            {/* Right Black Paddle */}
            <g transform="translate(185, 38)">
              <ellipse cx="12" cy="12" rx="12" ry="14" fill="#0F172A" stroke="#475569" strokeWidth="2" />
              <rect x="10" y="24" width="4" height="14" rx="1.5" fill="#D97706" />
            </g>

            {/* Ping-Pong Ball Rallying */}
            <g
              className="transition-all duration-700 ease-in-out"
              style={{
                transform: isHovered ? 'translate(142px, 12px)' : 'translate(0px, 0px)'
              }}
            >
              <circle cx="48" cy="38" r="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            </g>
          </g>
        </svg>
      )}

      {/* 9. ATHLETICS: Curved 8-lane tartan track, athletic sprinter drive */}
      {type.includes('athletics') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          {/* Tartan Red Track Lanes */}
          <path d="M 0 175 C 130 175 270 175 400 175" stroke="#B91C1C" strokeWidth="36" opacity="0.65" />
          <path d="M 0 157 C 130 157 270 157 400 157" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="8 6" opacity="0.75" />
          <path d="M 0 193 C 130 193 270 193 400 193" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="8 6" opacity="0.75" />
          {/* Finish Line */}
          <line x1="330" y1="140" x2="330" y2="210" stroke="#FFFFFF" strokeWidth="3" />

          {/* Sprinter Silhouette Surging Forward */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(190px, 0px)' : 'translate(0px, 0px)'
            }}
          >
            <g transform="translate(75, 115)">
              <circle cx="26" cy="10" r="7.5" fill="#F59E0B" />
              <path d="M 12 18 L 30 16 L 25 36 L 15 36 Z" fill="#2980B9" />
              <line x1="16" y1="20" x2="4" y2="30" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="28" y1="18" x2="42" y2="26" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="18" y1="36" x2="8" y2="54" stroke="#2980B9" strokeWidth="3.8" strokeLinecap="round" />
              <line x1="24" y1="36" x2="40" y2="44" stroke="#2980B9" strokeWidth="3.8" strokeLinecap="round" />
              <line x1="40" y1="44" x2="36" y2="56" stroke="#2980B9" strokeWidth="3.8" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      )}

      {/* ============================================================
          CULTURAL ANIMATIONS (10 to 19)
          ============================================================ */}

      {/* 10. DANCE: Stage lighting, mudra dancer silhouette, swirling musical ribbon */}
      {type.includes('dance') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <ellipse cx="200" cy="190" rx="125" ry="26" fill="#2980B9" opacity="0.25" />
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '200px 185px',
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
            }}
          >
            <g transform="translate(180, 52)">
              <circle cx="20" cy="15" r="7.5" fill="#E67E22" />
              <circle cx="20" cy="6" r="3.5" fill="#F39C12" />
              {/* Torso & Attire */}
              <path d="M 15 23 L 25 23 L 27 46 L 13 46 Z" fill="#2980B9" />
              <path d="M 12 46 Q 20 52 28 46 L 40 88 Q 20 98 0 88 Z" fill="#E67E22" opacity="0.9" />
              {/* Mudra Arms */}
              <path d="M 15 27 Q 4 15 0 2" fill="none" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 25 27 Q 36 15 40 2" fill="none" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      )}

      {/* 11. SINGING / VOCAL MUSIC: Studio microphone + multi-layered sonic blast rings */}
      {(type.includes('singing') || type.includes('voice')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <polygon points="120,0 280,0 350,230 50,230" fill="rgba(41, 128, 185, 0.12)" />

          {/* Center Stage Condenser Mic */}
          <g transform="translate(185, 65)">
            <line x1="15" y1="75" x2="15" y2="140" stroke="#94A3B8" strokeWidth="3.5" />
            <ellipse cx="15" cy="140" rx="22" ry="7" fill="#334155" />
            <rect x="7" y="24" width="16" height="44" rx="8" fill="#1E293B" stroke="#2980B9" strokeWidth="2.5" />
            <circle cx="15" cy="22" r="12" fill="#475569" stroke="#E2E8F0" strokeWidth="1.8" />
            <line x1="6" y1="20" x2="24" y2="20" stroke="#CBD5E1" strokeWidth="1.2" />
            <line x1="6" y1="24" x2="24" y2="24" stroke="#CBD5E1" strokeWidth="1.2" />
          </g>

          {/* Expanding Sonic Waves */}
          <g transform="translate(200, 87)">
            <circle cx="0" cy="0" r={isHovered ? "42" : "28"} fill="none" stroke="#2980B9" strokeWidth="2.5" opacity="0.7" className="transition-all duration-300" />
            <circle cx="0" cy="0" r={isHovered ? "68" : "44"} fill="none" stroke="#E67E22" strokeWidth="2" opacity="0.5" className="transition-all duration-500" />
            <circle cx="0" cy="0" r={isHovered ? "96" : "60"} fill="none" stroke="#3498DB" strokeWidth="1.5" opacity="0.35" className="transition-all duration-700" />
          </g>
        </svg>
      )}

      {/* 12. SOLO PERFORMANCE: Acoustic instrument under golden spotlight */}
      {(type.includes('soloperformance') || type.includes('solo')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <ellipse cx="200" cy="185" rx="95" ry="22" fill="#F59E0B" opacity="0.25" />
          <g
            className="transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)', transformOrigin: '200px 145px' }}
          >
            <g transform="translate(182, 75)">
              <circle cx="18" cy="16" r="8.5" fill="#F59E0B" />
              <path d="M 10 28 L 26 28 L 24 70 L 12 70 Z" fill="#2980B9" />
              {/* Acoustic Guitar Body */}
              <ellipse cx="32" cy="50" rx="12" ry="16" fill="#D97706" stroke="#78350F" strokeWidth="1.8" />
              <line x1="32" y1="50" x2="44" y2="20" stroke="#E2E8F0" strokeWidth="2.5" />
            </g>
          </g>
        </svg>
      )}

      {/* 13. GROUP PERFORMANCE / BAND: Dynamic equalizer audio bars */}
      {(type.includes('groupperformance') || type.includes('group') || type.includes('band')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <ellipse cx="200" cy="185" rx="145" ry="26" fill="#2980B9" opacity="0.2" />
          {/* LED Equalizer Towers in Background */}
          <g transform="translate(100, 70)" opacity="0.75">
            <rect x="0" y={isHovered ? "10" : "50"} width="10" height={isHovered ? "70" : "30"} rx="3" fill="#2980B9" className="transition-all duration-300" />
            <rect x="25" y={isHovered ? "0" : "35"} width="10" height={isHovered ? "80" : "45"} rx="3" fill="#3498DB" className="transition-all duration-300" />
            <rect x="50" y={isHovered ? "20" : "60"} width="10" height={isHovered ? "60" : "20"} rx="3" fill="#E67E22" className="transition-all duration-300" />
            <rect x="140" y={isHovered ? "15" : "45"} width="10" height={isHovered ? "65" : "35"} rx="3" fill="#E67E22" className="transition-all duration-300" />
            <rect x="165" y={isHovered ? "0" : "25"} width="10" height={isHovered ? "80" : "55"} rx="3" fill="#3498DB" className="transition-all duration-300" />
            <rect x="190" y={isHovered ? "25" : "55"} width="10" height={isHovered ? "55" : "25"} rx="3" fill="#2980B9" className="transition-all duration-300" />
          </g>

          {/* Drummer Center */}
          <g transform="translate(180, 85)" opacity="0.9">
            <circle cx="20" cy="10" r="7" fill="#94A3B8" />
            <circle cx="10" cy="32" r="11" fill="#334155" stroke="#CBD5E1" strokeWidth="1.8" />
            <circle cx="30" cy="32" r="11" fill="#334155" stroke="#CBD5E1" strokeWidth="1.8" />
          </g>
        </svg>
      )}

      {/* 14. DRAMA: Draped crimson curtains, floating tragedy & comedy masks */}
      {type.includes('drama') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          {/* Heavy Draped Curtains */}
          <path d="M 0 0 C 65 40 45 150 12 230 L 0 230 Z" fill="#881337" opacity="0.75" />
          <path d="M 400 0 C 335 40 355 150 388 230 L 400 230 Z" fill="#881337" opacity="0.75" />

          {/* Tragedy Mask */}
          <g
            className="transition-all duration-500"
            style={{ transform: isHovered ? 'translate(-12px, -6px) rotate(-8deg)' : 'translate(0, 0)' }}
          >
            <g transform="translate(125, 68)">
              <ellipse cx="26" cy="36" rx="24" ry="30" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
              <ellipse cx="18" cy="30" rx="4.5" ry="3" fill="#1E293B" />
              <ellipse cx="34" cy="30" rx="4.5" ry="3" fill="#1E293B" />
              <path d="M 18 50 Q 26 42 34 50" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>

          {/* Comedy Mask */}
          <g
            className="transition-all duration-500"
            style={{ transform: isHovered ? 'translate(12px, -6px) rotate(8deg)' : 'translate(0, 0)' }}
          >
            <g transform="translate(220, 68)">
              <ellipse cx="26" cy="36" rx="24" ry="30" fill="#F8FAFC" stroke="#2980B9" strokeWidth="2.5" />
              <path d="M 15 28 Q 19 24 23 28" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 29 28 Q 33 24 37 28" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 18 42 Q 26 54 34 42 Z" fill="#1E293B" />
            </g>
          </g>
        </svg>
      )}

      {/* 15. FASHION SHOW: Perspective runway with streaming edge LED tracks */}
      {(type.includes('fashionshow') || type.includes('fashion')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <polygon points="175,70 225,70 295,230 105,230" fill="#151D24" stroke="#475569" strokeWidth="1" />
          <line x1="175" y1="70" x2="105" y2="230" stroke="#E67E22" strokeWidth="3" opacity="0.9" />
          <line x1="225" y1="70" x2="295" y2="230" stroke="#E67E22" strokeWidth="3" opacity="0.9" />

          {/* Model Silhouette */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transformOrigin: '200px 175px',
              transform: isHovered ? 'translate(0, 16px) scale(1.18)' : 'translate(0, 0) scale(1)'
            }}
          >
            <g transform="translate(190, 48)">
              <circle cx="10" cy="12" r="5.5" fill="#E2E8F0" />
              <polygon points="4,38 16,38 25,80 -5,80" fill="#2980B9" opacity="0.9" />
              <line x1="6" y1="80" x2="4" y2="112" stroke="#E2E8F0" strokeWidth="2.5" />
              <line x1="14" y1="80" x2="17" y2="108" stroke="#E2E8F0" strokeWidth="2.5" />
            </g>
          </g>
        </svg>
      )}

      {/* 16. PHOTOGRAPHY: Pro DSLR camera with aperture and radial flash bloom */}
      {type.includes('photography') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          {/* Flash Strobe on Hover */}
          <circle
            cx="245"
            cy="70"
            r={isHovered ? "55" : "0"}
            fill="#FFFFFF"
            opacity={isHovered ? "0.9" : "0"}
            className="transition-all duration-300"
          />

          <g transform="translate(130, 60)">
            <rect x="0" y="25" width="140" height="90" rx="16" fill="#1E2430" stroke="#2980B9" strokeWidth="2.8" />
            <path d="M 48 25 L 58 10 L 82 10 L 92 25 Z" fill="#11151C" stroke="#2980B9" strokeWidth="2" />
            <rect x="20" y="16" width="16" height="9" rx="2" fill="#E67E22" />
            {/* Multi-layered Glass Lens */}
            <circle cx="70" cy="70" r="34" fill="#0A0C10" stroke="#2980B9" strokeWidth="4" />
            <circle cx="70" cy="70" r="24" fill="#181D26" stroke="#3498DB" strokeWidth="2.5" />
            <circle cx="70" cy="70" r="14" fill="#0F172A" />
            <path d="M 58 62 Q 70 54 82 62" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.75" />
          </g>
        </svg>
      )}

      {/* 17. PAINTING / FINE ARTS: Artist easel, fluid paint stroke */}
      {type.includes('painting') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <rect x="110" y="32" width="180" height="135" rx="8" fill="#1E2430" stroke="#475569" strokeWidth="2" />
          {/* Palette */}
          <path d="M 68 150 C 48 150 48 190 85 190 C 105 190 115 170 95 155 Z" fill="#D97706" opacity="0.85" />
          <circle cx="64" cy="165" r="4.5" fill="#EF4444" />
          <circle cx="74" cy="177" r="4.5" fill="#2980B9" />
          <circle cx="84" cy="167" r="4.5" fill="#10B981" />

          {/* Expressive Paint Stroke */}
          <path
            d="M 130 100 C 170 60 210 140 260 90"
            stroke="#E67E22"
            strokeWidth={isHovered ? "9" : "5"}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Paintbrush following the stroke */}
          <g
            className="transition-all duration-500 ease-out"
            style={{ transform: isHovered ? 'translate(48px, -18px) rotate(18deg)' : 'translate(0, 0)' }}
          >
            <g transform="translate(210, 52)">
              <rect x="0" y="0" width="7" height="58" rx="3.5" fill="#B45309" stroke="#78350F" strokeWidth="1" />
              <rect x="-1" y="58" width="9" height="12" fill="#CBD5E1" />
              <path d="M -1 70 L 8 70 L 5 84 L 2 84 Z" fill="#E67E22" />
            </g>
          </g>
        </svg>
      )}

      {/* 18. QUIZ: Broadcast buzzer podium with green success trigger */}
      {(type.includes('quiz') && !type.includes('tech')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(95, 45)">
            <rect x="0" y="0" width="210" height="130" rx="14" fill="#181D26" stroke="#475569" strokeWidth="2.5" />
            <text x="105" y="55" textAnchor="middle" fill="#E67E22" fontSize="34" fontWeight="bold" fontFamily="sans-serif">
              {isHovered ? "CORRECT!" : "COLORIDO"}
            </text>
            <rect x="35" y="80" width="140" height="32" rx="8" fill={isHovered ? "#27AE60" : "#2980B9"} className="transition-colors duration-300" />
            <text x="105" y="101" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">
              {isHovered ? "✓ 100 POINTS" : "PRESS BUZZER"}
            </text>
          </g>
        </svg>
      )}

      {/* 19. LITERARY / DEBATE: Illuminated open book, animated writing quill */}
      {type.includes('literary') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(115, 55)">
            <path d="M 0 30 Q 85 15 85 105 Q 0 120 0 30 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
            <path d="M 170 30 Q 85 15 85 105 Q 170 120 170 30 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
            <line x1="16" y1="52" x2="70" y2="47" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="16" y1="68" x2="70" y2="63" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="100" y1="47" x2="154" y2="52" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="100" y1="63" x2="154" y2="68" stroke="#94A3B8" strokeWidth="2.5" />

            {/* Writing Feather Quill */}
            <g
              className="transition-transform duration-500 ease-out"
              style={{ transform: isHovered ? 'translate(-18px, -18px) rotate(-18deg)' : 'translate(0, 0)' }}
            >
              <path d="M 135 10 Q 160 -15 175 10 Q 145 25 130 50 Z" fill="#2980B9" />
              <line x1="130" y1="50" x2="115" y2="72" stroke="#CBD5E1" strokeWidth="2.5" />
            </g>
          </g>
        </svg>
      )}

      {/* ============================================================
          TECHNICAL ANIMATIONS (20 to 29)
          ============================================================ */}

      {/* 20. 24-HOUR HACKATHON: Dual-screen developer workstation, live typing cursor */}
      {type.includes('hackathon') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(105, 38)">
            <rect x="20" y="10" width="150" height="102" rx="10" fill="#0A0C10" stroke="#475569" strokeWidth="2.5" />
            <rect x="32" y="24" width="60" height="4.5" rx="2" fill="#2980B9" />
            <rect x="32" y="35" width="80" height="4.5" rx="2" fill="#27AE60" />
            <rect x="42" y="46" width="65" height="4.5" rx="2" fill="#E67E22" />
            <rect x="42" y="57" width="50" height="4.5" rx="2" fill="#3498DB" />
            {/* Blinking Cursor */}
            <rect
              x={isHovered ? "96" : "32"}
              y="68"
              width="5"
              height="9"
              fill="#27AE60"
              className="animate-pulse"
            />
            {/* Laptop Base */}
            <polygon points="5,112 185,112 200,132 -10,132" fill="#1E2430" stroke="#334155" strokeWidth="1.8" />
            <rect x="75" y="118" width="45" height="8" rx="2" fill="#0F172A" />
          </g>
        </svg>
      )}

      {/* 21. CODING CONTEST: macOS style IDE with algorithmic code & execution check */}
      {type.includes('coding') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(85, 38)">
            <rect x="0" y="0" width="230" height="142" rx="10" fill="#11151C" stroke="#334155" strokeWidth="2" />
            <circle cx="16" cy="14" r="4" fill="#E74C3C" />
            <circle cx="28" cy="14" r="4" fill="#E67E22" />
            <circle cx="40" cy="14" r="4" fill="#27AE60" />
            <line x1="0" y1="28" x2="230" y2="28" stroke="#1E2430" strokeWidth="1.5" />

            <text x="14" y="48" fill="#737C8C" fontSize="10" fontFamily="monospace">01</text>
            <text x="34" y="48" fill="#E67E22" fontSize="10" fontFamily="monospace">int solve(int n) &#123;</text>
            <text x="14" y="66" fill="#737C8C" fontSize="10" fontFamily="monospace">02</text>
            <text x="46" y="66" fill="#3498DB" fontSize="10" fontFamily="monospace">dp[n] = dp[n-1] + ...;</text>
            <text x="14" y="84" fill="#737C8C" fontSize="10" fontFamily="monospace">03</text>
            <text x="46" y="84" fill="#27AE60" fontSize="10" fontFamily="monospace">return dp[n];</text>
            <text x="14" y="102" fill="#737C8C" fontSize="10" fontFamily="monospace">04</text>
            <text x="34" y="102" fill="#E67E22" fontSize="10" fontFamily="monospace">&#125;</text>

            <rect x={isHovered ? "120" : "58"} y="93" width="6" height="13" fill="#27AE60" className="animate-pulse" />

            {/* Testcase Status */}
            {isHovered && (
              <g transform="translate(14, 116)">
                <rect x="0" y="0" width="202" height="18" rx="4" fill="rgba(39, 174, 96, 0.2)" stroke="#27AE60" strokeWidth="1" />
                <text x="101" y="13" textAnchor="middle" fill="#27AE60" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  ✓ ACCEPTED (0.02ms)
                </text>
              </g>
            )}
          </g>
        </svg>
      )}

      {/* 22. DEBUGGING: Terminal error turned to green fixed status */}
      {type.includes('debugging') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(90, 42)">
            <rect x="0" y="0" width="220" height="132" rx="10" fill="#11151C" stroke="#334155" strokeWidth="2" />
            <rect x="0" y="0" width="220" height="26" rx="10" fill="#181D26" />
            <text x="12" y="17" fill="#A9B1BF" fontSize="11" fontFamily="monospace">gdb - debugger</text>

            <rect
              x="20"
              y="50"
              width="180"
              height="52"
              rx="8"
              fill={isHovered ? "rgba(39, 174, 96, 0.15)" : "rgba(231, 76, 60, 0.15)"}
              stroke={isHovered ? "#27AE60" : "#E74C3C"}
              strokeWidth="1.8"
            />
            <text
              x="110"
              y="81"
              textAnchor="middle"
              fill={isHovered ? "#27AE60" : "#E74C3C"}
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {isHovered ? "✓ 0 ERRORS [FIXED]" : "⚠ SEGMENTATION FAULT"}
            </text>
          </g>
        </svg>
      )}

      {/* 23. TECH QUIZ: Protocol query with instant neon selection */}
      {type.includes('techquiz') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(95, 42)">
            <rect x="0" y="0" width="210" height="132" rx="12" fill="#181D26" stroke="#2980B9" strokeWidth="2" />
            <text x="105" y="46" textAnchor="middle" fill="#ECF0F1" fontSize="13" fontWeight="bold">
              Which protocol is stateless?
            </text>
            <rect x="25" y="68" width="75" height="28" rx="6" fill="#11151C" stroke="#475569" />
            <text x="62" y="86" textAnchor="middle" fill="#95A5A6" fontSize="11">A) TCP</text>

            <rect
              x="110"
              y="68"
              width="75"
              height="28"
              rx="6"
              fill={isHovered ? "#27AE60" : "#11151C"}
              stroke={isHovered ? "#27AE60" : "#475569"}
              className="transition-colors duration-300"
            />
            <text x="147" y="86" textAnchor="middle" fill={isHovered ? "#FFFFFF" : "#95A5A6"} fontSize="11" fontWeight="bold">
              B) HTTP
            </text>
          </g>
        </svg>
      )}

      {/* 24. PAPER PRESENTATION: Research projector display + ascending bar charts */}
      {type.includes('paper') && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(120, 38)">
            <rect x="0" y="0" width="160" height="116" rx="8" fill="#1E2430" stroke="#2980B9" strokeWidth="2.2" />
            <rect x="16" y="18" width="128" height="12" rx="3" fill="#2980B9" />
            <rect x="26" y={isHovered ? "60" : "74"} width="16" height={isHovered ? "36" : "22"} fill="#3498DB" className="transition-all duration-500" />
            <rect x="48" y={isHovered ? "45" : "60"} width="16" height={isHovered ? "51" : "36"} fill="#27AE60" className="transition-all duration-500" />
            <rect x="70" y={isHovered ? "32" : "50"} width="16" height={isHovered ? "64" : "46"} fill="#E67E22" className="transition-all duration-500" />
            <rect x="92" y={isHovered ? "24" : "40"} width="16" height={isHovered ? "72" : "56"} fill="#F39C12" className="transition-all duration-500" />
            {/* Stand */}
            <line x1="80" y1="116" x2="80" y2="155" stroke="#64748B" strokeWidth="3" />
            <line x1="55" y1="155" x2="105" y2="155" stroke="#64748B" strokeWidth="3" />
          </g>
        </svg>
      )}

      {/* 25. PROJECT EXPO / HARDWARE: Live IoT sensor telemetry gauge */}
      {(type.includes('projectexpo') || type.includes('expo') || type.includes('project')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(95, 38)">
            <rect x="0" y="0" width="210" height="126" rx="10" fill="#0A0C10" stroke="#27AE60" strokeWidth="2" />
            <circle cx="62" cy="60" r="30" fill="none" stroke="#1E2430" strokeWidth="7" />
            <circle
              cx="62"
              cy="60"
              r="30"
              fill="none"
              stroke="#27AE60"
              strokeWidth="7"
              strokeDasharray={isHovered ? "150 190" : "95 190"}
              className="transition-all duration-700"
            />
            <text x="62" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">98%</text>
            <text x="142" y="52" fill="#95A5A6" fontSize="11">IOT TELEMETRY</text>
            <text x="142" y="70" fill="#27AE60" fontSize="12" fontWeight="bold">ONLINE</text>
            <text x="142" y="88" fill="#3498DB" fontSize="10">24.5°C | 60Hz</text>
          </g>
        </svg>
      )}

      {/* 26. UI/UX DESIGN CHALLENGE: Wireframe mockup + vector design cursor */}
      {(type.includes('uiux') || type.includes('design')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(105, 32)">
            <rect x="0" y="0" width="90" height="155" rx="16" fill="#11151C" stroke="#E67E22" strokeWidth="2.2" />
            <rect x="28" y="6" width="34" height="5" rx="2.5" fill="#334155" />
            <rect x="10" y="24" width="70" height="26" rx="4" fill="#1E2430" />
            <circle cx="26" cy="70" r="11" fill="#2980B9" />
            <circle cx="64" cy="70" r="11" fill="#3498DB" />
            <rect x="10" y="94" width="70" height="44" rx="4" fill="#181D26" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" />

            <g
              className="transition-transform duration-500 ease-out"
              style={{ transform: isHovered ? 'translate(55px, 65px)' : 'translate(105px, 35px)' }}
            >
              <polygon points="0,0 0,18 6,14 14,20 17,17 9,11 15,11" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
            </g>
          </g>
        </svg>
      )}

      {/* 27. WEB DEVELOPMENT: Browser window with URL bar, live DOM elements */}
      {(type.includes('webdev') || type.includes('web')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(80, 38)">
            <rect x="0" y="0" width="240" height="140" rx="10" fill="#11151C" stroke="#2980B9" strokeWidth="2" />
            <rect x="0" y="0" width="240" height="26" rx="10" fill="#181D26" />
            <circle cx="16" cy="13" r="3.5" fill="#E74C3C" />
            <circle cx="28" cy="13" r="3.5" fill="#E67E22" />
            <circle cx="40" cy="13" r="3.5" fill="#27AE60" />
            <rect x="56" y="5" width="135" height="16" rx="4" fill="#0A0C10" />
            <text x="65" y="17" fill="#737C8C" fontSize="9" fontFamily="monospace">https://colorido2k26.dev</text>

            <rect x="20" y="42" width="85" height="38" rx="4" fill="#2980B9" opacity="0.85" />
            <rect x="115" y="42" width="105" height="9" rx="2" fill="#CBD5E1" />
            <rect x="115" y="56" width="90" height="6.5" rx="2" fill="#64748B" />
            <rect x="115" y="68" width="65" height="6.5" rx="2" fill="#64748B" />
            <rect x="20" y="94" width="200" height="30" rx="4" fill="#181D26" stroke="#334155" strokeWidth="1" />
          </g>
        </svg>
      )}

      {/* 28. AI / MACHINE LEARNING: Neural network synapsis data firing */}
      {(type.includes('aiml') || type.includes('ai') || type.includes('neural')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(85, 48)">
            {/* Synaptic Interconnections */}
            <line x1="30" y1="20" x2="115" y2="42" stroke="#2980B9" strokeWidth="1.8" opacity="0.65" />
            <line x1="30" y1="68" x2="115" y2="42" stroke="#2980B9" strokeWidth="1.8" opacity="0.65" />
            <line x1="30" y1="115" x2="115" y2="92" stroke="#2980B9" strokeWidth="1.8" opacity="0.65" />
            <line x1="115" y1="42" x2="200" y2="68" stroke="#3498DB" strokeWidth="1.8" opacity="0.65" />
            <line x1="115" y1="92" x2="200" y2="68" stroke="#3498DB" strokeWidth="1.8" opacity="0.65" />

            {/* Input Nodes */}
            <circle cx="30" cy="20" r="9.5" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />
            <circle cx="30" cy="68" r="9.5" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />
            <circle cx="30" cy="115" r="9.5" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />

            {/* Hidden Nodes with Glowing Expansion on Hover */}
            <circle
              cx="115"
              cy="42"
              r={isHovered ? "14" : "10"}
              fill="#3498DB"
              stroke="#93C5FD"
              strokeWidth="2"
              className="transition-all duration-300"
            />
            <circle
              cx="115"
              cy="92"
              r={isHovered ? "14" : "10"}
              fill="#3498DB"
              stroke="#93C5FD"
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Classification Output Node */}
            <circle cx="200" cy="68" r="13" fill="#27AE60" stroke="#A7F3D0" strokeWidth="2.5" />
          </g>
        </svg>
      )}

      {/* 29. CODE RELAY: Multi-station handoff baton */}
      {(type.includes('coderelay') || type.includes('relay')) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <g transform="translate(75, 52)">
            <line x1="20" y1="65" x2="230" y2="65" stroke="#334155" strokeWidth="4.5" strokeDasharray="6 4" />

            <g transform="translate(30, 32)">
              <rect x="0" y="0" width="48" height="65" rx="6" fill="#181D26" stroke="#2980B9" strokeWidth="2" />
              <text x="24" y="38" textAnchor="middle" fill="#2980B9" fontSize="12" fontWeight="bold">DEV 1</text>
            </g>

            {/* Passing Baton */}
            <g
              className="transition-all duration-700 ease-in-out"
              style={{ transform: isHovered ? 'translate(95px, 0px)' : 'translate(0px, 0px)' }}
            >
              <g transform="translate(100, 22)">
                <rect x="0" y="0" width="54" height="80" rx="8" fill="#2980B9" stroke="#E67E22" strokeWidth="2" />
                <text x="27" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">BATON</text>
                <text x="27" y="62" textAnchor="middle" fill="#ECF0F1" fontSize="10">&lt;/&gt;</text>
              </g>
            </g>

            <g transform="translate(180, 32)">
              <rect x="0" y="0" width="48" height="65" rx="6" fill="#181D26" stroke="#27AE60" strokeWidth="2" />
              <text x="24" y="38" textAnchor="middle" fill="#27AE60" fontSize="12" fontWeight="bold">DEV 2</text>
            </g>
          </g>
        </svg>
      )}

      {/* Fallback for general events */}
      {!([
        'cricket', 'football', 'basketball', 'volleyball', 'badminton', 'chess', 'kabaddi', 'tabletennis', 'athletics',
        'dance', 'singing', 'voice', 'soloperformance', 'solo', 'groupperformance', 'group', 'band', 'drama', 'fashionshow', 'fashion', 'photography', 'painting', 'quiz', 'literary',
        'hackathon', 'coding', 'debugging', 'techquiz', 'paper', 'projectexpo', 'expo', 'project', 'uiux', 'design', 'webdev', 'web', 'aiml', 'ai', 'neural', 'coderelay', 'relay'
      ].some(k => type.includes(k))) && (
        <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
          <circle cx="200" cy="115" r="48" stroke="#2980B9" strokeWidth="2.5" strokeDasharray="5 5" />
          <circle cx="200" cy="115" r="28" fill="#181D26" stroke="#E67E22" strokeWidth="2" />
          <text x="200" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">COLORIDO</text>
        </svg>
      )}
    </div>
  );
}
