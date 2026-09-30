import React from 'react';

/**
 * EventVisualCanvas Component — COLORIDO 2K26
 * Competition-grade character-based cinematic visuals showing actual participants performing each event.
 * Polished illustrated characters in athletic, artistic, and technical action with COLORIDO purple/blue
 * rim lighting, dark cinematic environments, and calm resting states that trigger smooth kinetic actions on hover/tap.
 * Optimized for mobile and desktop using lightweight scalable SVGs with zero external bloat.
 */
export default function EventVisualCanvas({ visualType = 'cricket', isHovered = false, className = '' }) {
  const type = visualType?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'cricket';

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#080C14] via-[#0F1622] to-[#182232] ${className}`}>
      {/* Subtle volumetric grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38BDF8_1.2px,transparent_1.2px)] [background-size:22px_22px]" />
      
      {/* Ambient COLORIDO purple & blue atmospheric lighting orbs */}
      <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isHovered ? 'bg-[#8B5CF6]/30 scale-125' : 'bg-[#8B5CF6]/15 scale-100'}`} />
      <div className={`absolute -bottom-10 -left-10 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isHovered ? 'bg-[#2980B9]/35 scale-125' : 'bg-[#2980B9]/18 scale-100'}`} />

      {/* Render dedicated character visual */}
      {renderCharacterScene(type, isHovered)}
    </div>
  );
}

function renderCharacterScene(type, isHovered) {
  // ==========================================
  // SPORTS 1: CRICKET (Batsman Cover Drive)
  // ==========================================
  if (type.includes('cricket')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <defs>
          <linearGradient id="crkTurf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#022C22" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="crkSpot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2980B9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="120,0 280,0 360,230 40,230" fill="url(#crkSpot)" />
        <ellipse cx="200" cy="188" rx="175" ry="34" fill="url(#crkTurf)" />
        <path d="M 80 195 L 320 195 L 305 160 L 95 160 Z" fill="#78350F" opacity="0.45" />
        <line x1="120" y1="195" x2="120" y2="160" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" />

        {/* Stumps in background */}
        <g transform="translate(98, 115)">
          <rect x="0" y="0" width="3.5" height="48" rx="1.5" fill="#FCD34D" />
          <rect x="6" y="0" width="3.5" height="48" rx="1.5" fill="#FCD34D" />
          <rect x="12" y="0" width="3.5" height="48" rx="1.5" fill="#FCD34D" />
          <rect x="-1" y="-4" width="8" height="2.5" rx="1" fill="#EF4444" />
          <rect x="8" y="-4" width="8" height="2.5" rx="1" fill="#EF4444" />
        </g>

        {/* Batsman Character */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transformOrigin: '210px 180px',
            transform: isHovered ? 'translate(10px, -2px)' : 'translate(0px, 0px)'
          }}
        >
          <ellipse cx="210" cy="186" rx="38" ry="8" fill="#000000" opacity="0.5" />
          {/* Back Leg with Pad */}
          <path d="M 172 135 L 164 165 L 152 186 L 168 186 L 178 160 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
          <rect x="156" y="142" width="16" height="40" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          {/* Front Leg Striding Forward */}
          <path
            d={isHovered ? "M 205 138 L 225 160 L 235 186 L 218 186 L 208 165 Z" : "M 195 138 L 205 160 L 210 186 L 195 186 L 192 165 Z"}
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="1"
            className="transition-all duration-500"
          />
          <rect
            x={isHovered ? "214" : "196"}
            y="144"
            width="16"
            height="38"
            rx="3"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="0.8"
            className="transition-all duration-500"
          />
          {/* Jersey */}
          <path d="M 175 92 L 208 88 L 214 138 L 176 138 Z" fill="#2980B9" stroke="#1E3A8A" strokeWidth="1.5" />
          <path d="M 188 88 L 198 88 L 196 98 L 190 98 Z" fill="#E67E22" />
          {/* Helmet */}
          <g transform="translate(186, 56)">
            <rect x="6" y="24" width="8" height="10" fill="#D97706" />
            <path d="M 1 20 C 1 6, 20 5, 22 20 Z" fill="#1E3A8A" stroke="#2980B9" strokeWidth="1.2" />
            <path d="M 14 15 L 25 15 L 21 24 L 14 24 Z" fill="none" stroke="#CBD5E1" strokeWidth="1.4" />
          </g>
          {/* Swinging Bat */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '190px 105px',
              transform: isHovered ? 'rotate(-55deg) translate(-10px, -15px)' : 'rotate(-10deg)'
            }}
          >
            <path d="M 184 94 L 172 108 L 186 118" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
            <path d="M 204 96 L 202 112 L 190 120" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
            <circle cx="188" cy="119" r="6" fill="#F8FAFC" />
            <circle cx="194" cy="122" r="5" fill="#F8FAFC" />
            <rect x="189" y="122" width="4.5" height="26" rx="2" fill="#E67E22" />
            <path d="M 187 148 L 196 148 L 198 208 L 185 208 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.2" />
          </g>
        </g>

        {/* Cricket Ball */}
        <g
          className="transition-all duration-700 ease-out"
          style={{
            transform: isHovered ? 'translate(130px, -65px) scale(0.9)' : 'translate(0px, 0px) scale(1)'
          }}
        >
          {isHovered && <line x1="240" y1="155" x2="190" y2="165" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="4" strokeLinecap="round" />}
          <circle cx="240" cy="155" r="9" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
          <path d="M 234 155 Q 240 150 246 155" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 2: FOOTBALL (Striker Airborne Volley)
  // ==========================================
  if (type.includes('football')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <defs>
          <linearGradient id="ftbTurf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#022C22" stopOpacity="0.7" />
          </linearGradient>
          <pattern id="hexNetPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 5 L 5 0 L 10 5 L 5 10 Z" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <ellipse cx="200" cy="188" rx="175" ry="34" fill="url(#ftbTurf)" />

        {/* Goal Post */}
        <g transform="translate(260, 52)">
          <path
            d={isHovered ? "M 0 0 L 85 20 L 85 125 L 0 115 Z" : "M 0 0 L 70 18 L 70 120 L 0 115 Z"}
            fill="url(#hexNetPattern)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            className="transition-all duration-300"
          />
          <line x1="0" y1="0" x2="0" y2="115" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="0" x2="80" y2="20" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Striker Character */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transformOrigin: '140px 140px',
            transform: isHovered ? 'translate(15px, -8px) rotate(-6deg)' : 'translate(0px, 0px)'
          }}
        >
          <ellipse cx="140" cy="184" rx="32" ry="7" fill="#000000" opacity="0.45" />
          <path d="M 125 128 L 115 152 L 120 180 L 132 180 L 130 152 Z" fill="#1E3A8A" />
          <path d="M 122 78 L 155 82 L 148 132 L 118 128 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
          {/* Head */}
          <g transform="translate(132, 46)">
            <rect x="6" y="24" width="7" height="9" fill="#D97706" />
            <circle cx="10" cy="16" r="10" fill="#D97706" />
            <path d="M 0 15 Q 10 2 20 12 Q 10 7 0 15 Z" fill="#0F172A" />
          </g>
          {/* Kicking Leg */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '144px 128px',
              transform: isHovered ? 'rotate(35deg) translate(10px, -15px)' : 'rotate(0deg)'
            }}
          >
            <path d="M 142 128 L 165 138 L 195 135 L 180 124 L 152 122 Z" fill="#1E3A8A" />
            <path d="M 188 128 L 210 126 L 208 138 L 186 138 Z" fill="#E67E22" stroke="#9A3412" strokeWidth="1.2" />
          </g>
        </g>

        {/* Football */}
        <g
          className="transition-all duration-700 ease-out"
          style={{
            transformOrigin: '215px 135px',
            transform: isHovered ? 'translate(90px, -65px) rotate(420deg) scale(0.85)' : 'translate(0px, 0px) rotate(0deg)'
          }}
        >
          <circle cx="215" cy="135" r="14" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          <polygon points="215,126 221,130 219,138 211,138 209,130" fill="#0F172A" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 3: BASKETBALL (Slam Dunk)
  // ==========================================
  if (type.includes('basketball')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <ellipse cx="200" cy="192" rx="175" ry="32" fill="#451A03" opacity="0.4" />
        {/* Backboard & Rim */}
        <g transform="translate(305, 30)">
          <rect x="18" y="0" width="6" height="85" rx="2" fill="rgba(255,255,255,0.25)" stroke="#E2E8F0" strokeWidth="2" />
          <line x1="0" y1="62" x2="18" y2="62" stroke="#EA580C" strokeWidth="4.5" strokeLinecap="round" />
          <path
            d={isHovered ? "M 0 62 L 6 98 L 12 98 L 18 62" : "M 0 62 L 3 88 L 15 88 L 18 62"}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />
        </g>

        {/* High-Flying Dunker */}
        <g
          className="transition-all duration-500 ease-out"
          style={{
            transformOrigin: '170px 120px',
            transform: isHovered ? 'translate(85px, -35px) rotate(8deg)' : 'translate(0px, 0px)'
          }}
        >
          <ellipse cx="170" cy="190" rx={isHovered ? "18" : "26"} ry="5" fill="#000000" opacity="0.35" />
          <path d="M 148 125 L 132 155 L 124 180 L 136 182 L 145 158 Z" fill="#1E3A8A" />
          <path d="M 152 75 L 184 75 L 176 126 L 148 126 Z" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.5" />
          <circle cx="168" cy="62" r="9" fill="#D97706" />

          {/* Right Arm Cocked High with Basketball */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '182px 82px',
              transform: isHovered ? 'rotate(42deg) translate(8px, 4px)' : 'rotate(0deg)'
            }}
          >
            <path d="M 182 82 L 202 62 L 222 52" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
            <circle cx="232" cy="42" r="14" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.8" />
            <line x1="218" y1="42" x2="246" y2="42" stroke="#1E293B" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 4: VOLLEYBALL (Volleyball Spike)
  // ==========================================
  if (type.includes('volleyball')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <ellipse cx="200" cy="190" rx="175" ry="32" fill="#1E3A8A" opacity="0.3" />
        {/* Net */}
        <g transform="translate(230, 48)">
          <rect x="0" y="0" width="4" height="135" fill="#CBD5E1" />
          <line x1="-80" y1="20" x2="60" y2="20" stroke="#FFFFFF" strokeWidth="4" />
          <rect x="-80" y="20" width="140" height="70" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 2" />
        </g>
        {/* Spiker */}
        <g
          className="transition-all duration-500 ease-out"
          style={{
            transformOrigin: '160px 115px',
            transform: isHovered ? 'translate(20px, -15px)' : 'translate(0px, 0px)'
          }}
        >
          <path d="M 130 145 L 140 175 L 132 188 L 144 188 L 152 165 Z" fill="#1E3A8A" />
          <path d="M 155 88 L 180 84 L 175 132 L 148 132 Z" fill="#2563EB" />
          <circle cx="166" cy="65" r="9" fill="#D97706" />
          {/* Hitting Arm */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '175px 86px',
              transform: isHovered ? 'rotate(-65deg) translate(-10px, -5px)' : 'rotate(10deg)'
            }}
          >
            <path d="M 175 86 L 192 62 L 205 38" fill="none" stroke="#D97706" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        </g>
        {/* Ball */}
        <g
          className="transition-all duration-700 ease-out"
          style={{
            transform: isHovered ? 'translate(85px, 60px) rotate(320deg)' : 'translate(0px, 0px)'
          }}
        >
          <circle cx="218" cy="48" r="13" fill="#FEF08A" stroke="#1E3A8A" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 5: BADMINTON (Overhead Smash)
  // ==========================================
  if (type.includes('badminton')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <ellipse cx="200" cy="190" rx="175" ry="32" fill="#065F46" opacity="0.3" />
        <g transform="translate(250, 70)">
          <rect x="0" y="0" width="3.5" height="110" fill="#E2E8F0" />
          <line x1="-90" y1="15" x2="60" y2="15" stroke="#FFFFFF" strokeWidth="3" />
        </g>
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transformOrigin: '150px 130px',
            transform: isHovered ? 'translate(15px, -12px)' : 'translate(0px, 0px)'
          }}
        >
          <path d="M 140 135 L 125 162 L 132 186 L 144 186 L 148 160 Z" fill="#1E3A8A" />
          <path d="M 135 88 L 164 85 L 160 135 L 134 135 Z" fill="#2563EB" />
          <circle cx="150" cy="66" r="9" fill="#D97706" />
          {/* Racket Arm */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '160px 88px',
              transform: isHovered ? 'rotate(-48deg) translate(-12px, -8px)' : 'rotate(0deg)'
            }}
          >
            <path d="M 160 88 L 172 65 L 182 46" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
            <line x1="182" y1="46" x2="204" y2="24" stroke="#CBD5E1" strokeWidth="2.5" />
            <ellipse cx="218" cy="12" rx="14" ry="18" fill="rgba(41,128,185,0.2)" stroke="#2980B9" strokeWidth="2" />
          </g>
        </g>
        {/* Shuttlecock */}
        <g
          className="transition-all duration-700 ease-out"
          style={{
            transform: isHovered ? 'translate(95px, 85px) rotate(60deg)' : 'translate(0px, 0px)'
          }}
        >
          <polygon points="210,48 226,42 220,58" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="224" cy="55" r="4" fill="#F8FAFC" stroke="#E67E22" strokeWidth="1.2" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 6: CHESS (Grandmaster Strategic Move)
  // ==========================================
  if (type.includes('chess')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <circle cx="200" cy="90" r="140" fill="#F59E0B" opacity="0.15" />
        {/* Board */}
        <g transform="translate(100, 75)">
          <polygon points="100,10 200,65 100,120 0,65" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
          <polygon points="100,10 150,37 100,65 50,37" fill="#64748B" opacity="0.5" />
          <polygon points="150,37 200,65 150,92 100,65" fill="#0F172A" opacity="0.9" />
          {/* Moving Knight */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'translate(50px, 26px)' : 'translate(0px, 0px)'
            }}
          >
            <g transform="translate(85, 34)">
              <rect x="0" y="22" width="14" height="4" rx="1" fill="#38BDF8" />
              <path d="M 2 22 Q 1 10 6 7 Q 10 4 14 8 Q 16 12 12 16 L 14 22 Z" fill="#2980B9" stroke="#E67E22" strokeWidth="1" />
            </g>
          </g>
        </g>
        {/* Grandmaster */}
        <g transform="translate(40, 35)">
          <path d="M 30 75 L 75 75 L 85 140 L 25 140 Z" fill="#1E293B" />
          <circle cx="52" cy="50" r="14" fill="#D97706" />
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '70px 85px',
              transform: isHovered ? 'translate(45px, 20px) rotate(8deg)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 68 85 L 105 102 L 125 106" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
            <circle cx="126" cy="106" r="3.5" fill="#D97706" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 7: KABADDI (Raider Lunge vs Defenders)
  // ==========================================
  if (type.includes('kabaddi')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <path d="M 25 190 L 375 190 L 335 135 L 65 135 Z" fill="#831843" opacity="0.35" />
        <line x1="200" y1="190" x2="200" y2="135" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="5 3" />
        <line x1="270" y1="190" x2="270" y2="135" stroke="#F59E0B" strokeWidth="2" />

        {/* Chain of Defenders on Right */}
        <g transform="translate(265, 85)">
          <circle cx="20" cy="15" r="8" fill="#1E3A8A" />
          <path d="M 12 24 L 28 24 L 26 55 L 14 55 Z" fill="#2563EB" />
          <circle cx="55" cy="15" r="8" fill="#1E3A8A" />
          <path d="M 47 24 L 63 24 L 61 55 L 49 55 Z" fill="#2563EB" />
          <line x1="26" y1="30" x2="50" y2="30" stroke="#93C5FD" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Athletic Raider Lunging */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? 'translate(75px, 0px)' : 'translate(0px, 0px)'
          }}
        >
          <g transform="translate(85, 95)">
            <circle cx="28" cy="10" r="8" fill="#D97706" />
            <path d="M 12 18 L 36 16 L 40 38 L 22 42 Z" fill="#E67E22" />
            {/* Lunge Touch Hand */}
            <line x1="34" y1="22" x2="62" y2="25" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
            {isHovered && <circle cx="62" cy="25" r="6" fill="#F59E0B" className="animate-ping" />}
            {/* Powerful Legs */}
            <path d="M 22 42 L 8 65 L 18 65 Z" fill="#1E3A8A" />
            <path d="M 36 40 L 46 65 L 56 65 Z" fill="#1E3A8A" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 8: TABLE TENNIS (Forehand Loop)
  // ==========================================
  if (type.includes('tabletennis') || type.includes('tt')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(85, 65)">
          <polygon points="115,15 230,55 115,98 0,55" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.8" />
          <line x1="115" y1="15" x2="115" y2="98" stroke="#FFFFFF" strokeWidth="1.8" />
          <line x1="115" y1="0" x2="115" y2="30" stroke="#E2E8F0" strokeWidth="3" />
        </g>
        {/* Player in Low Stance Whipping Paddle */}
        <g transform="translate(60, 48)">
          <circle cx="30" cy="20" r="9" fill="#D97706" />
          <path d="M 18 30 L 44 30 L 40 85 L 15 85 Z" fill="#2563EB" />
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '42px 35px',
              transform: isHovered ? 'rotate(-38deg) translate(8px, -15px)' : 'rotate(0deg)'
            }}
          >
            <path d="M 42 35 L 62 55 L 75 48" fill="none" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
            <ellipse cx="85" cy="42" rx="10" ry="12" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          </g>
        </g>
        {/* Ping-Pong Ball */}
        <g
          className="transition-all duration-500 ease-out"
          style={{
            transform: isHovered ? 'translate(125px, 8px)' : 'translate(0px, 0px)'
          }}
        >
          <circle cx="155" cy="115" r="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // SPORTS 9: ATHLETICS / RUNNER (Sprinter)
  // ==========================================
  if (type.includes('athletics') || type.includes('sprint') || type.includes('running')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <path d="M 0 178 C 130 178 270 178 400 178" stroke="#DC2626" strokeWidth="36" opacity="0.65" />
        <line x1="330" y1="140" x2="330" y2="215" stroke="#FFFFFF" strokeWidth="3" />
        {/* Sprinter Driving Forward */}
        <g
          className="transition-transform duration-700 ease-out"
          style={{
            transform: isHovered ? 'translate(145px, 0px)' : 'translate(0px, 0px)'
          }}
        >
          <g transform="translate(90, 95)">
            <path d="M 28 42 L 48 52 L 44 72 L 36 72 Z" fill="#1E3A8A" />
            <path d="M 16 42 L -2 58 L -6 70 L 2 70 Z" fill="#1E3A8A" />
            <path d="M 18 20 L 42 16 L 36 44 L 16 44 Z" fill="#2563EB" />
            <circle cx="44" cy="10" r="8" fill="#D97706" />
            <line x1="22" y1="24" x2="6" y2="34" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
            <line x1="36" y1="20" x2="56" y2="28" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 1: DANCE (Dancer with Flowing Silk)
  // ==========================================
  if (type.includes('dance')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <circle cx="200" cy="115" r="130" fill="#8B5CF6" opacity="0.25" />
        <ellipse cx="200" cy="192" rx="110" ry="24" fill="#2980B9" opacity="0.25" />
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transformOrigin: '200px 180px',
            transform: isHovered ? 'scale(1.08) rotate(4deg)' : 'scale(1) rotate(0deg)'
          }}
        >
          <g transform="translate(180, 52)">
            <circle cx="20" cy="16" r="7.5" fill="#D97706" />
            <circle cx="20" cy="7" r="4.5" fill="#F59E0B" />
            <path d="M 14 24 L 26 24 L 28 50 L 12 50 Z" fill="#2980B9" />
            <path
              d={isHovered ? "M 8 50 Q 20 60 32 50 L 46 95 Q 20 108 -6 95 Z" : "M 10 50 Q 20 58 30 50 L 42 92 Q 20 102 -2 92 Z"}
              fill="#E67E22"
              className="transition-all duration-500"
            />
            {/* Mudra Arms */}
            <path
              d={isHovered ? "M 14 28 Q 0 15 -6 -2" : "M 14 28 Q 4 16 0 2"}
              fill="none"
              stroke="#D97706"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <path
              d={isHovered ? "M 26 28 Q 40 15 46 -2" : "M 26 28 Q 36 16 40 2"}
              fill="none"
              stroke="#D97706"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 2: SINGING / VOICE (Concert Vocalist)
  // ==========================================
  if (type.includes('singing') || type.includes('voice') || type.includes('vocal')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <polygon points="120,0 280,0 350,230 50,230" fill="#8B5CF6" opacity="0.2" />
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transformOrigin: '190px 170px',
            transform: isHovered ? 'scale(1.04) translate(0px, -4px)' : 'scale(1)'
          }}
        >
          <g transform="translate(160, 58)">
            <circle cx="26" cy="18" r="10" fill="#D97706" />
            <path d="M 16 30 L 40 30 L 36 85 L 18 85 Z" fill="#2980B9" />
            <path d="M 36 34 L 46 48 L 40 56" fill="none" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="42" y1="56" x2="42" y2="135" stroke="#94A3B8" strokeWidth="3" />
            <rect x="37" y="44" width="10" height="18" rx="5" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          </g>
        </g>
        {/* Sonic Waves */}
        <g transform="translate(202, 108)">
          <circle cx="0" cy="0" r={isHovered ? "35" : "20"} fill="none" stroke="#8B5CF6" strokeWidth="2" opacity={isHovered ? "0.8" : "0.3"} className="transition-all duration-300" />
          <circle cx="0" cy="0" r={isHovered ? "60" : "35"} fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity={isHovered ? "0.6" : "0.2"} className="transition-all duration-500" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 3: BAND / SOLO PERFORMANCE (Guitarist)
  // ==========================================
  if (type.includes('band') || type.includes('group') || type.includes('solo')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {/* Stage Equalizer */}
        <g transform="translate(100, 75)" opacity="0.8">
          <rect x="0" y={isHovered ? "10" : "40"} width="8" height={isHovered ? "60" : "30"} fill="#8B5CF6" className="transition-all duration-300" />
          <rect x="20" y={isHovered ? "0" : "25"} width="8" height={isHovered ? "70" : "45"} fill="#38BDF8" className="transition-all duration-300" />
          <rect x="180" y={isHovered ? "5" : "30"} width="8" height={isHovered ? "65" : "40"} fill="#38BDF8" className="transition-all duration-300" />
          <rect x="200" y={isHovered ? "15" : "45"} width="8" height={isHovered ? "55" : "25"} fill="#8B5CF6" className="transition-all duration-300" />
        </g>
        {/* Guitarist Character */}
        <g transform="translate(170, 52)">
          <circle cx="28" cy="18" r="9" fill="#D97706" />
          <path d="M 16 30 L 40 30 L 36 90 L 18 90 Z" fill="#1E293B" />
          {/* Guitar */}
          <path d="M 12 55 L 48 42 L 52 52 L 20 68 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
          <line x1="48" y1="42" x2="68" y2="28" stroke="#CBD5E1" strokeWidth="2.5" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 4: DRAMA / THEATRE (Actor Monologue)
  // ==========================================
  if (type.includes('drama') || type.includes('theatre')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {/* Velvet Curtains */}
        <path d="M 0 0 C 60 40 40 140 15 230 L 0 230 Z" fill="#881337" opacity="0.75" />
        <path d="M 400 0 C 340 40 360 140 385 230 L 400 230 Z" fill="#881337" opacity="0.75" />
        {/* Expressive Actor */}
        <g transform="translate(180, 55)">
          <circle cx="20" cy="18" r="9" fill="#D97706" />
          <path d="M 10 30 L 32 30 L 30 85 L 12 85 Z" fill="#1E293B" />
          {/* Expressive Hands */}
          <path
            d={isHovered ? "M 10 35 L -12 25 L -18 35" : "M 10 35 L -6 45 L -2 55"}
            fill="none"
            stroke="#D97706"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          <path
            d={isHovered ? "M 32 35 L 54 25 L 60 35" : "M 32 35 L 48 45 L 44 55"}
            fill="none"
            stroke="#D97706"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 5: FASHION SHOW (Catwalk Model)
  // ==========================================
  if (type.includes('fashion')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <polygon points="175,70 225,70 295,230 105,230" fill="#151D24" stroke="#475569" strokeWidth="1" />
        <line x1="175" y1="70" x2="105" y2="230" stroke="#8B5CF6" strokeWidth="3" opacity="0.9" />
        <line x1="225" y1="70" x2="295" y2="230" stroke="#38BDF8" strokeWidth="3" opacity="0.9" />
        {/* Model Stride */}
        <g
          className="transition-all duration-700 ease-out"
          style={{
            transformOrigin: '200px 175px',
            transform: isHovered ? 'translate(0, 16px) scale(1.15)' : 'translate(0, 0) scale(1)'
          }}
        >
          <g transform="translate(190, 48)">
            <circle cx="10" cy="12" r="5.5" fill="#E2E8F0" />
            <polygon points="4,38 16,38 25,80 -5,80" fill="#7C3AED" opacity="0.9" />
            <line x1="6" y1="80" x2="4" y2="112" stroke="#E2E8F0" strokeWidth="2.5" />
            <line x1="14" y1="80" x2="17" y2="108" stroke="#E2E8F0" strokeWidth="2.5" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 6: PHOTOGRAPHY (Photographer with DSLR)
  // ==========================================
  if (type.includes('photo')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {/* Flash on Hover */}
        <circle
          cx="245"
          cy="70"
          r={isHovered ? "50" : "0"}
          fill="#FFFFFF"
          opacity={isHovered ? "0.9" : "0"}
          className="transition-all duration-300"
        />
        {/* Photographer Framing Shot */}
        <g transform="translate(110, 60)">
          <circle cx="35" cy="20" r="10" fill="#D97706" />
          <path d="M 22 32 L 55 32 L 50 85 L 20 85 Z" fill="#1E293B" />
          {/* DSLR Telephoto Lens */}
          <rect x="52" y="18" width="55" height="34" rx="4" fill="#0A0C10" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="107" cy="35" r="12" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 7: PAINTING (Artist at Canvas)
  // ==========================================
  if (type.includes('painting') || type.includes('art')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(180, 42)">
          <line x1="70" y1="12" x2="10" y2="160" stroke="#78350F" strokeWidth="3" />
          <line x1="70" y1="12" x2="130" y2="160" stroke="#78350F" strokeWidth="3" />
          <rect x="25" y="24" width="90" height="75" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path
            d={isHovered ? "M 38 65 Q 65 38 85 75 Q 98 48 105 55" : "M 38 65 Q 50 55 60 62"}
            stroke="#E67E22"
            strokeWidth={isHovered ? "6" : "3"}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500"
          />
        </g>
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transformOrigin: '140px 170px',
            transform: isHovered ? 'translate(10px, 0px)' : 'translate(0px, 0px)'
          }}
        >
          <g transform="translate(110, 68)">
            <circle cx="20" cy="18" r="9" fill="#D97706" />
            <path d="M 8 14 Q 20 6 32 14 Z" fill="#8B5CF6" />
            <path d="M 12 28 L 30 28 L 26 85 L 10 85 Z" fill="#334155" />
            <path d="M 26 34 L 48 50 L 72 45" fill="none" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // CULTURAL 8: LITERARY / DEBATE (Orator at Podium)
  // ==========================================
  if (type.includes('literary') || type.includes('debate')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {/* Mahogany Podium */}
        <g transform="translate(160, 95)">
          <rect x="15" y="0" width="50" height="85" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <rect x="5" y="-10" width="70" height="12" rx="3" fill="#92400E" />
          <line x1="40" y1="-10" x2="40" y2="-25" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="40" cy="-27" r="3" fill="#1E293B" />
        </g>
        {/* Orator Debating */}
        <g transform="translate(170, 42)">
          <circle cx="20" cy="18" r="9" fill="#D97706" />
          <path d="M 10 30 L 32 30 L 30 65 L 12 65 Z" fill="#1E3A8A" />
          {/* Persuasive Hand Gesture */}
          <path
            d={isHovered ? "M 28 35 L 48 20 L 58 26" : "M 28 35 L 42 42 L 48 45"}
            fill="none"
            stroke="#D97706"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 1: HACKATHON (Developer at Workstation)
  // ==========================================
  if (type.includes('hackathon')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(160, 48)">
          <rect x="0" y="0" width="150" height="98" rx="8" fill="#0A0C10" stroke="#38BDF8" strokeWidth="1.8" />
          <rect x="12" y="14" width="55" height="4" rx="2" fill="#8B5CF6" />
          <rect x="12" y="24" width="80" height="4" rx="2" fill="#10B981" />
          <rect x="22" y="34" width="65" height="4" rx="2" fill="#E67E22" />
          <rect
            x="12"
            y="65"
            width={isHovered ? "125" : "75"}
            height="18"
            rx="4"
            fill={isHovered ? "rgba(16, 185, 129, 0.25)" : "rgba(56, 189, 248, 0.2)"}
            stroke={isHovered ? "#10B981" : "#38BDF8"}
            strokeWidth="1"
          />
          <text x="20" y="78" fill={isHovered ? "#10B981" : "#38BDF8"} fontSize="9" fontWeight="bold" fontFamily="monospace">
            {isHovered ? "✓ TESTCASES PASSED [100%]" : "> BUILDING..."}
          </text>
        </g>
        <g transform="translate(70, 72)">
          <circle cx="48" cy="24" r="13" fill="#D97706" />
          <path d="M 30 40 L 65 40 L 60 95 L 26 95 Z" fill="#2563EB" />
          <path d="M 52 48 L 74 65 L 98 62" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 2: CODING CONTEST (Algorithmic Coder)
  // ==========================================
  if (type.includes('coding') || type.includes('code')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(145, 42)">
          <rect x="0" y="0" width="170" height="110" rx="8" fill="#11151C" stroke="#334155" strokeWidth="2" />
          <circle cx="14" cy="12" r="3.5" fill="#EF4444" />
          <circle cx="24" cy="12" r="3.5" fill="#F59E0B" />
          <circle cx="34" cy="12" r="3.5" fill="#10B981" />
          <text x="14" y="42" fill="#E67E22" fontSize="9" fontFamily="monospace">int solve(int n) &#123;</text>
          <text x="24" y="58" fill="#38BDF8" fontSize="9" fontFamily="monospace">dp[n] = dp[n-1] + ...;</text>
          <text x="14" y="74" fill="#E67E22" fontSize="9" fontFamily="monospace">&#125;</text>
          {isHovered && (
            <rect x="14" y="86" width="142" height="16" rx="3" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" />
          )}
          {isHovered && (
            <text x="85" y="98" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace">
              ✓ ACCEPTED (0.01ms)
            </text>
          )}
        </g>
        <g transform="translate(60, 68)">
          <circle cx="45" cy="22" r="12" fill="#D97706" />
          <path d="M 28 38 L 62 38 L 56 95 L 24 95 Z" fill="#1E3A8A" />
          <path d="M 48 45 L 72 58 L 92 54" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 3: DEBUGGING (Bug Solver)
  // ==========================================
  if (type.includes('debug')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(140, 42)">
          <rect x="0" y="0" width="180" height="115" rx="8" fill="#0B0F17" stroke="#475569" strokeWidth="2" />
          <rect
            x="15"
            y="38"
            width="150"
            height="46"
            rx="6"
            fill={isHovered ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}
            stroke={isHovered ? "#10B981" : "#EF4444"}
            strokeWidth="1.5"
            className="transition-colors duration-500"
          />
          <text
            x="90"
            y="65"
            textAnchor="middle"
            fill={isHovered ? "#10B981" : "#EF4444"}
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {isHovered ? "✓ 0 ERRORS [RESOLVED]" : "⚠ EXCEPTION AT 0x884F"}
          </text>
        </g>
        <g transform="translate(60, 65)">
          <circle cx="45" cy="24" r="13" fill="#D97706" />
          <path d="M 28 40 L 62 40 L 56 95 L 24 95 Z" fill="#1E3A8A" stroke="#2563EB" strokeWidth="1" />
          <path
            d={isHovered ? "M 48 48 L 75 55 L 98 48" : "M 48 48 L 70 65 L 88 65"}
            fill="none"
            stroke="#D97706"
            strokeWidth="5"
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 4: WEB DEVELOPMENT (UI/Web Builder)
  // ==========================================
  if (type.includes('web') || type.includes('uiux') || type.includes('design')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(145, 38)">
          <rect x="0" y="0" width="180" height="120" rx="8" fill="#11151C" stroke="#2980B9" strokeWidth="2" />
          <rect x="15" y="25" width="65" height="35" rx="4" fill="#2980B9" opacity="0.85" />
          <rect x="90" y="25" width="75" height="8" rx="2" fill="#CBD5E1" />
          <rect x="90" y="38" width="60" height="6" rx="2" fill="#64748B" />
          <rect x="15" y="70" width="150" height="35" rx="4" fill="#181D26" stroke="#334155" />
        </g>
        <g transform="translate(60, 65)">
          <circle cx="45" cy="24" r="13" fill="#D97706" />
          <path d="M 28 40 L 62 40 L 56 95 L 24 95 Z" fill="#2563EB" />
          <path d="M 48 48 L 72 58 L 95 55" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 5: AI / MACHINE LEARNING (Neural Nodes)
  // ==========================================
  if (type.includes('aiml') || type.includes('ai') || type.includes('neural')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(170, 48)">
          <line x1="20" y1="20" x2="80" y2="45" stroke="#38BDF8" strokeWidth="1.8" opacity="0.6" />
          <line x1="20" y1="70" x2="80" y2="45" stroke="#38BDF8" strokeWidth="1.8" opacity="0.6" />
          <line x1="80" y1="45" x2="140" y2="60" stroke="#8B5CF6" strokeWidth="2" opacity="0.8" />
          <circle cx="20" cy="20" r="9" fill="#2563EB" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="20" cy="70" r="9" fill="#2563EB" stroke="#38BDF8" strokeWidth="2" />
          <circle
            cx="80"
            cy="45"
            r={isHovered ? "15" : "11"}
            fill="#8B5CF6"
            stroke="#C084FC"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />
          <circle cx="140" cy="60" r="13" fill="#10B981" stroke="#34D399" strokeWidth="2" />
        </g>
        <g transform="translate(70, 68)">
          <circle cx="44" cy="22" r="12" fill="#D97706" />
          <path d="M 28 38 L 60 38 L 56 95 L 24 95 Z" fill="#2563EB" />
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? 'translate(25px, -10px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 48 45 L 75 35 L 98 25" fill="none" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="98" cy="25" r="3" fill="#D97706" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 6: HARDWARE / EXPO (Robotics Builder)
  // ==========================================
  if (type.includes('expo') || type.includes('project') || type.includes('hardware')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {/* Robotic Mechanism on Bench */}
        <g transform="translate(160, 60)">
          <rect x="0" y="55" width="120" height="15" rx="3" fill="#334155" />
          <circle cx="25" cy="50" r="15" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <line x1="25" y1="50" x2="65" y2="20" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
          <circle cx="65" cy="20" r="6" fill="#E67E22" />
          {isHovered && <circle cx="65" cy="20" r="10" fill="none" stroke="#10B981" strokeWidth="2" className="animate-ping" />}
        </g>
        {/* Robotics Builder Character */}
        <g transform="translate(70, 65)">
          <circle cx="45" cy="22" r="12" fill="#D97706" />
          <path d="M 28 38 L 60 38 L 56 95 L 24 95 Z" fill="#1E3A8A" />
          <path d="M 48 45 L 75 55 L 95 50" fill="none" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 7: PAPER PRESENTATION (Researcher on Stage)
  // ==========================================
  if (type.includes('paper') || type.includes('presentation')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        <g transform="translate(150, 42)">
          <rect x="0" y="0" width="150" height="105" rx="8" fill="#1E2430" stroke="#2980B9" strokeWidth="2" />
          <rect x="15" y="16" width="120" height="10" rx="2" fill="#2980B9" />
          <rect x="25" y={isHovered ? "50" : "68"} width="15" height={isHovered ? "40" : "22"} fill="#38BDF8" className="transition-all duration-500" />
          <rect x="48" y={isHovered ? "38" : "55"} width="15" height={isHovered ? "52" : "35"} fill="#10B981" className="transition-all duration-500" />
          <rect x="71" y={isHovered ? "28" : "45"} width="15" height={isHovered ? "62" : "45"} fill="#E67E22" className="transition-all duration-500" />
        </g>
        <g transform="translate(60, 65)">
          <circle cx="45" cy="24" r="12" fill="#D97706" />
          <path d="M 28 40 L 60 40 L 56 95 L 24 95 Z" fill="#1E3A8A" />
          <path d="M 48 48 L 78 40 L 98 32" fill="none" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // ==========================================
  // TECHNICAL 8: TECH QUIZ (Contestant on Buzzer)
  // ==========================================
  if (type.includes('techquiz') || type.includes('quiz')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {/* Buzzer Podium */}
        <g transform="translate(155, 75)">
          <rect x="0" y="20" width="90" height="75" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          {/* Buzzer Button */}
          <ellipse
            cx="45"
            cy="18"
            rx="20"
            ry="9"
            fill={isHovered ? "#10B981" : "#EF4444"}
            stroke={isHovered ? "#34D399" : "#B91C1C"}
            strokeWidth="2"
            className="transition-colors duration-300"
          />
          <text x="45" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
            {isHovered ? "+100 PTS" : "BUZZER"}
          </text>
        </g>
        {/* Contestant Hand Striking Buzzer */}
        <g transform="translate(85, 45)">
          <circle cx="35" cy="20" r="11" fill="#D97706" />
          <path d="M 20 34 L 52 34 L 48 85 L 16 85 Z" fill="#2563EB" />
          <g
            className="transition-transform duration-300 ease-out"
            style={{
              transform: isHovered ? 'translate(22px, 20px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 42 42 L 72 48 L 95 48" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
            <circle cx="95" cy="48" r="4" fill="#D97706" />
          </g>
        </g>
      </svg>
    );
  }

  // ==========================================
  // DEFAULT / GENERAL: Festival Champion Raising Trophy
  // ==========================================
  return (
    <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
      <circle cx="200" cy="95" r="130" fill="#F59E0B" opacity="0.2" />
      <ellipse cx="200" cy="192" rx="100" ry="20" fill="#000000" opacity="0.4" />
      <g
        className="transition-transform duration-500 ease-out"
        style={{
          transformOrigin: '200px 180px',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <g transform="translate(175, 48)">
          <circle cx="25" cy="24" r="11" fill="#D97706" />
          <path d="M 12 38 L 38 38 L 34 95 L 16 95 Z" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.2" />
          {/* Raised Arms */}
          <path d="M 14 42 L 0 20 L 15 8" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
          <path d="M 36 42 L 50 20 L 35 8" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
          {/* Golden Trophy */}
          <g transform="translate(13, -15)">
            <path d="M 0 0 L 24 0 L 20 18 Q 12 26 4 18 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <path d="M -4 4 Q -9 10 -4 16 L 0 14" fill="none" stroke="#F59E0B" strokeWidth="2" />
            <path d="M 28 4 Q 33 10 28 16 L 24 14" fill="none" stroke="#F59E0B" strokeWidth="2" />
            <rect x="9" y="24" width="6" height="10" fill="#D97706" />
            <rect x="4" y="34" width="16" height="6" rx="2" fill="#78350F" />
          </g>
        </g>
      </g>
    </svg>
  );
}
