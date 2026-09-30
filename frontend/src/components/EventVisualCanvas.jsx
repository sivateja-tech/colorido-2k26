import React from 'react';

/**
 * EventVisualCanvas Component — COLORIDO 2K26
 * Competition-grade, character-based cinematic visuals showing actual human participants in action.
 * Rich 2D/3D illustrated characters with athletic anatomy, clothing folds, realistic equipment,
 * and COLORIDO electric cyan / neon purple rim lighting in dark atmospheric environments.
 * Calm, composed resting state with smooth, high-impact kinetic actions on hover/tap.
 */
export default function EventVisualCanvas({ visualType = 'cricket', isHovered = false, className = '' }) {
  const type = visualType?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'cricket';

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#060911] via-[#0D131F] to-[#141C2B] ${className}`}>
      {/* Volumetric ambient matrix particles */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#38BDF8_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

      {/* Atmospheric COLORIDO Purple & Cyan rim-lighting aura */}
      <div className={`absolute -top-12 -right-12 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isHovered ? 'bg-[#8B5CF6]/35 scale-125' : 'bg-[#8B5CF6]/15 scale-100'}`} />
      <div className={`absolute -bottom-12 -left-12 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isHovered ? 'bg-[#38BDF8]/30 scale-125' : 'bg-[#2980B9]/18 scale-100'}`} />

      {/* Render dedicated cinematic character scene */}
      {renderScene(type, isHovered)}
    </div>
  );
}

function renderScene(type, isHovered) {
  const defs = (

  <defs>
    {/* Stadium Floodlights & Theatrical Cones */}
    <linearGradient id="spotCyan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
      <stop offset="60%" stopColor="#0284C7" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#0B0F17" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="spotPurple" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#A855F7" stopOpacity="0.42" />
      <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.14" />
      <stop offset="100%" stopColor="#0B0F17" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="spotGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
      <stop offset="60%" stopColor="#D97706" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#0B0F17" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="spotCrimson" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
      <stop offset="60%" stopColor="#B91C1C" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#0B0F17" stopOpacity="0" />
    </linearGradient>

    {/* Realistic Anatomical Skin Shading */}
    <linearGradient id="skinBase" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#F6C89F" />
      <stop offset="50%" stopColor="#E29458" />
      <stop offset="100%" stopColor="#B45309" />
    </linearGradient>
    <linearGradient id="skinHighlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FDE68A" />
      <stop offset="100%" stopColor="#F6C89F" />
    </linearGradient>
    <linearGradient id="skinShadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#B45309" />
      <stop offset="100%" stopColor="#78350F" />
    </linearGradient>

    {/* Athletic Uniform & Fabric Materials */}
    <linearGradient id="jerseyRoyal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#38BDF8" />
      <stop offset="40%" stopColor="#1D4ED8" />
      <stop offset="100%" stopColor="#0F172A" />
    </linearGradient>
    <linearGradient id="jerseyPurple" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#C084FC" />
      <stop offset="45%" stopColor="#7C3AED" />
      <stop offset="100%" stopColor="#3B0764" />
    </linearGradient>
    <linearGradient id="jerseyAmber" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FDE047" />
      <stop offset="45%" stopColor="#EA580C" />
      <stop offset="100%" stopColor="#7C2D12" />
    </linearGradient>
    <linearGradient id="jerseyWhite" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="70%" stopColor="#E2E8F0" />
      <stop offset="100%" stopColor="#94A3B8" />
    </linearGradient>
    <linearGradient id="suitCharcoal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#334155" />
      <stop offset="50%" stopColor="#1E293B" />
      <stop offset="100%" stopColor="#090D16" />
    </linearGradient>

    {/* Equipment & Metallic Materials */}
    <linearGradient id="goldMetallic" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FEF08A" />
      <stop offset="35%" stopColor="#F59E0B" />
      <stop offset="70%" stopColor="#B45309" />
      <stop offset="100%" stopColor="#78350F" />
    </linearGradient>
    <linearGradient id="silverChrome" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="40%" stopColor="#94A3B8" />
      <stop offset="100%" stopColor="#334155" />
    </linearGradient>
    <linearGradient id="cricketWillow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FEF3C7" />
      <stop offset="40%" stopColor="#D97706" />
      <stop offset="100%" stopColor="#92400E" />
    </linearGradient>
    <linearGradient id="leatherBall" x1="0.2" y1="0.2" x2="1" y2="1">
      <stop offset="0%" stopColor="#F87171" />
      <stop offset="40%" stopColor="#DC2626" />
      <stop offset="100%" stopColor="#7F1D1D" />
    </linearGradient>
    <linearGradient id="basketballPebble" x1="0.2" y1="0.2" x2="1" y2="1">
      <stop offset="0%" stopColor="#FB923C" />
      <stop offset="50%" stopColor="#EA580C" />
      <stop offset="100%" stopColor="#7C2D12" />
    </linearGradient>

    {/* Ground & Floor Textures */}
    <linearGradient id="turfPitch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#78350F" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#2E1005" stopOpacity="0.9" />
    </linearGradient>
    <linearGradient id="hardwoodPlank" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#9A3412" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#451A03" stopOpacity="0.9" />
    </linearGradient>
    <linearGradient id="synthCourt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#047857" stopOpacity="0.45" />
      <stop offset="100%" stopColor="#022C22" stopOpacity="0.85" />
    </linearGradient>
    <linearGradient id="synthTrack" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.55" />
      <stop offset="100%" stopColor="#450A0A" stopOpacity="0.9" />
    </linearGradient>

    {/* Glow & Shadow Filters */}
    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  );


  // =========================================================================
  // 1. CRICKET: Professional Batsman Stepping Forward into Majestic Cover Drive
  // =========================================================================
  if (type.includes('cricket')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Stadium Floodlight Cones */}
        <polygon points="120,0 280,0 380,230 20,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="195" rx="180" ry="32" fill="url(#synthCourt)" />

        {/* 22-Yard Turf Pitch & Popping Crease */}
        <path d="M 60 198 L 340 198 L 320 162 L 80 162 Z" fill="url(#turfPitch)" opacity="0.8" />
        <line x1="125" y1="198" x2="125" y2="162" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.75" />
        <line x1="105" y1="175" x2="145" y2="175" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.5" />

        {/* Stumps & Bails in Background */}
        <g transform="translate(95, 128)" opacity="0.85">
          <line x1="0" y1="36" x2="0" y2="0" stroke="#FDE68A" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="7" y1="36" x2="7" y2="0" stroke="#FDE68A" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="14" y1="36" x2="14" y2="0" stroke="#FDE68A" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="-2" y1="0" x2="16" y2="0" stroke="#FEF08A" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Red Leather Cricket Ball with Seam & Motion Path */}
        <g
          className="transition-all duration-600 ease-out"
          style={{
            transform: isHovered ? 'translate(145px, -35px) scale(0.9)' : 'translate(0px, 0px) scale(1)'
          }}
        >
          {/* Ball Motion Blur Trail on Hover */}
          <path
            d="M 180 168 Q 235 158 310 142"
            stroke="url(#spotCyan)"
            strokeWidth="3.5"
            strokeDasharray="4 4"
            className={`transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-0'}`}
          />
          {/* Cricket Ball */}
          <g transform="translate(182, 162)">
            <circle cx="6" cy="6" r="6.5" fill="url(#leatherBall)" stroke="#991B1B" strokeWidth="1" />
            <path d="M 1 6 Q 6 3 11 6" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1.5 1.5" />
            {/* Contact Spark Flash */}
            {isHovered && (
              <circle cx="6" cy="6" r="14" fill="#FFFFFF" opacity="0.3" filter="url(#cyanGlow)" />
            )}
          </g>
        </g>

        {/* Batsman Character in High-Elbow Cover Drive */}
        <g transform="translate(145, 45)">
          {/* Back Leg (Right Leg Anchored On Crease) */}
          <path d="M 28 85 L 18 122 L 10 148 L 4 148" stroke="url(#jerseyWhite)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          {/* Back Foot Spikes */}
          <path d="M 2 150 L 14 150 L 10 144 Z" fill="#334155" />

          {/* Front Leg (Left Leg Lunging Forward Towards Pitch) */}
          <g transform="translate(32, 75)">
            {/* Padded Batting Pad with Cane Ribs */}
            <path d="M 8 10 L 28 42 L 32 72 L 18 72 L 12 40 Z" fill="url(#jerseyWhite)" stroke="#CBD5E1" strokeWidth="1.2" />
            {/* Knee Roll Cushion */}
            <rect x="18" y="34" width="13" height="7" rx="3.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
            {/* Pad Rib Lines */}
            <line x1="16" y1="14" x2="23" y2="70" stroke="#94A3B8" strokeWidth="1" opacity="0.6" />
            <line x1="21" y1="14" x2="27" y2="70" stroke="#94A3B8" strokeWidth="1" opacity="0.6" />
            {/* Front Foot Shoe */}
            <path d="M 16 72 L 38 72 L 36 68 L 22 67 Z" fill="#1E293B" />
          </g>

          {/* Torso & Athletic Jersey with Festival Crest */}
          <path
            d="M 28 40 C 35 34, 52 34, 60 40 C 58 60, 56 75, 48 88 C 36 88, 28 85, 24 75 Z"
            fill="url(#jerseyWhite)"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />
          {/* Navy Blue Jersey Collar & Placket Trim */}
          <path d="M 38 36 L 44 48 L 50 36" fill="#1E3A8A" />
          <circle cx="44" cy="54" r="2.5" fill="#2563EB" />

          {/* Batsman Head with Helmet & Metal Faceguard Grille */}
          <g transform="translate(32, 10)">
            {/* Face Profile in Concentration */}
            <path d="M 16 16 C 18 20, 18 26, 14 30 L 8 28 Z" fill="url(#skinBase)" />
            {/* Navy Batting Helmet Shell */}
            <path d="M 4 22 C 2 12, 12 4, 24 6 C 30 7, 34 14, 32 24 C 24 24, 12 24, 4 22 Z" fill="#0F172A" stroke="#1E3A8A" strokeWidth="1.5" />
            {/* Helmet Visor Peak */}
            <path d="M 22 18 L 36 20 L 32 23 L 20 22 Z" fill="#1E293B" />
            {/* Metallic Chin Grille Wire Guard */}
            <path d="M 16 23 L 28 25 L 26 31 L 18 30 Z" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="20" y1="24" x2="20" y2="30" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="24" y1="25" x2="24" y2="31" stroke="#CBD5E1" strokeWidth="1" />
          </g>

          {/* Kinetic Arms & Batting Follow-Through */}
          <g
            className="transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '48px 45px',
              transform: isHovered ? 'rotate(38deg) translate(8px, -4px)' : 'rotate(-18deg) translate(0px, 0px)'
            }}
          >
            {/* Left High Elbow & Arm Leading the Shot */}
            <path d="M 42 42 C 48 40, 58 35, 62 48 C 64 56, 58 66, 48 74" fill="none" stroke="url(#jerseyWhite)" strokeWidth="9" strokeLinecap="round" />
            {/* Right Supporting Arm */}
            <path d="M 32 46 C 34 56, 38 68, 44 76" fill="none" stroke="url(#jerseyWhite)" strokeWidth="8" strokeLinecap="round" />

            {/* Padded Batting Gloves */}
            <g transform="translate(42, 68)">
              <ellipse cx="6" cy="4" rx="5" ry="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
              <rect x="2" y="2" width="7" height="3" rx="1.5" fill="#E2E8F0" />
              <ellipse cx="6" cy="11" rx="5" ry="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
            </g>

            {/* English Willow Cricket Bat */}
            <g transform="translate(45, 74)">
              {/* Cane Handle with Textured Rubber Grip */}
              <line x1="3" y1="0" x2="3" y2="18" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="3" y1="3" x2="3" y2="15" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1.5 1.5" />
              {/* Bat Blade with Curved Spine & Sweet Spot */}
              <path
                d="M 0 18 L 8 18 C 9 32, 9 52, 7 66 C 5 70, 1 70, 0 66 C -2 52, -2 32, 0 18 Z"
                fill="url(#cricketWillow)"
                stroke="#B45309"
                strokeWidth="1.2"
              />
              {/* Bat Maker Label / Colored Spine Stripe */}
              <rect x="1" y="24" width="5" height="14" rx="1" fill="#7C3AED" />
              <text x="3.5" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="4" fontWeight="bold">26</text>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 2. FOOTBALL: Airborne Striker Volleying Ball into Upper Net
  // =========================================================================
  if (type.includes('football') || type.includes('soccer')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Stadium Floodlights & Pitch */}
        <polygon points="100,0 300,0 390,230 10,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="200" rx="190" ry="30" fill="url(#synthCourt)" />

        {/* Penalty Arc & Goal Net in Background */}
        <path d="M 270 90 L 375 75 L 375 190 L 270 190 Z" fill="#000000" opacity="0.35" />
        <g stroke="#E2E8F0" strokeWidth="0.8" strokeOpacity="0.45">
          {/* Net Mesh Perspective Grid */}
          <line x1="270" y1="90" x2="375" y2="75" strokeWidth="3" stroke="#FFFFFF" strokeOpacity="0.9" />
          <line x1="270" y1="90" x2="270" y2="190" strokeWidth="3" stroke="#FFFFFF" strokeOpacity="0.9" />
          <line x1="285" y1="90" x2="285" y2="190" />
          <line x1="305" y1="87" x2="305" y2="190" />
          <line x1="325" y1="84" x2="325" y2="190" />
          <line x1="345" y1="81" x2="345" y2="190" />
          <line x1="270" y1="110" x2="375" y2="100" />
          <line x1="270" y1="135" x2="375" y2="130" />
          <line x1="270" y1="160" x2="375" y2="160" />
        </g>

        {/* Football with Telstar Hexagons */}
        <g
          className="transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transform: isHovered ? 'translate(285px, 95px) scale(0.85)' : 'translate(205px, 125px) scale(1)'
          }}
        >
          {/* Ball Flight Arc & Impact Mesh Distortion */}
          {isHovered && (
            <g>
              <line x1="-70" y1="30" x2="0" y2="0" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 4" opacity="0.75" />
              <circle cx="10" cy="10" r="18" fill="#38BDF8" opacity="0.3" filter="url(#cyanGlow)" />
            </g>
          )}
          {/* 32-Panel Ball */}
          <circle cx="10" cy="10" r="12" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          {/* Black Pentagons */}
          <polygon points="10,5 14,8 12,12 8,12 6,8" fill="#0F172A" />
          <polygon points="3,5 6,8 5,11 2,10 1,6" fill="#0F172A" />
          <polygon points="17,5 19,6 18,10 15,11 14,8" fill="#0F172A" />
          <polygon points="10,15 13,18 7,18" fill="#0F172A" />
        </g>

        {/* Airborne Striker in Scissor Volley Pose */}
        <g transform="translate(100, 55)">
          {/* Non-Kicking Left Leg (Tucked for Balance) */}
          <path d="M 45 78 C 35 90, 22 96, 12 92 C 8 88, 12 78, 20 74" fill="none" stroke="url(#jerseyRoyal)" strokeWidth="11" strokeLinecap="round" />
          <path d="M 12 92 L 6 95 L 4 90 Z" fill="#EF4444" />

          {/* Athletic Torso & Jersey (#10) Angled Backward */}
          <path
            d="M 38 42 C 48 38, 65 42, 70 54 C 62 76, 56 86, 42 90 C 32 86, 30 70, 32 54 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1E40AF"
            strokeWidth="1.2"
          />
          {/* Jersey Stripes & Number */}
          <path d="M 46 44 L 40 85" stroke="#38BDF8" strokeWidth="2.5" />
          <text x="54" y="68" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif">10</text>

          {/* Player Head & Focused Expression */}
          <g transform="translate(56, 16)">
            <ellipse cx="14" cy="14" rx="11" ry="12" fill="url(#skinBase)" />
            {/* Athletic Tapered Haircut */}
            <path d="M 4 14 C 4 6, 12 2, 22 4 C 26 8, 26 14, 24 16 C 18 10, 10 10, 4 14 Z" fill="#0F172A" />
            <path d="M 22 14 L 26 16 L 22 18 Z" fill="url(#skinShadow)" />
          </g>

          {/* Trailing Left Arm for Airborne Stability */}
          <path d="M 36 48 C 22 44, 8 50, 0 60" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />
          {/* Lead Right Arm Driving Forward */}
          <path d="M 68 50 C 78 45, 90 40, 96 32" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

          {/* Kinetic Kicking Right Leg Sweeping Through */}
          <g
            className="transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '50px 85px',
              transform: isHovered ? 'rotate(32deg) translate(12px, -8px)' : 'rotate(-10deg) translate(0px, 0px)'
            }}
          >
            {/* Muscular Thigh */}
            <path d="M 46 84 C 58 84, 76 80, 88 74" fill="none" stroke="url(#jerseyRoyal)" strokeWidth="12" strokeLinecap="round" />
            {/* Lower Leg with Royal Blue High Sock */}
            <path d="M 88 74 C 100 68, 114 62, 126 56" fill="none" stroke="#2563EB" strokeWidth="9" strokeLinecap="round" />
            {/* White Sock Stripes */}
            <line x1="96" y1="71" x2="98" y2="76" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="102" y1="68" x2="104" y2="73" stroke="#FFFFFF" strokeWidth="2" />
            {/* Electric Neon Cleat / Striking Boot */}
            <g transform="translate(122, 48)">
              <path d="M 0 10 L 14 4 L 18 8 L 8 16 L 0 14 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
              <line x1="4" y1="14" x2="14" y2="10" stroke="#0F172A" strokeWidth="1.2" />
              {/* Sole Studs */}
              <circle cx="4" cy="16" r="1.5" fill="#EF4444" />
              <circle cx="10" cy="14" r="1.5" fill="#EF4444" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 3. BASKETBALL: High-Flying Athlete in Rim-Rattling Tomahawk Slam Dunk
  // =========================================================================
  if (type.includes('basketball')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Arena Floodlights & Hardwood Court */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotGold)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="url(#hardwoodPlank)" />

        {/* Hardwood Court Floor Markings */}
        <path d="M 40 205 L 360 205" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.3" />
        <ellipse cx="200" cy="205" rx="70" ry="12" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Backboard & Breakaway Rim on Right */}
        <g transform="translate(290, 30)">
          {/* Glass Backboard with White Border & Target Box */}
          <rect x="0" y="0" width="8" height="90" rx="2" fill="#FFFFFF" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="1" y="32" width="6" height="28" fill="none" stroke="#EA580C" strokeWidth="2" />
          {/* Heavy Steel Support Arm */}
          <path d="M -2 46 L -16 46" stroke="#64748B" strokeWidth="4" />

          {/* Breakaway Rim & Chain / Nylon Net */}
          <g
            className="transition-transform duration-300 ease-out"
            style={{
              transformOrigin: '-16px 46px',
              transform: isHovered ? 'rotate(10deg) translate(-2px, 6px)' : 'rotate(0deg) translate(0px, 0px)'
            }}
          >
            {/* Orange Breakaway Rim */}
            <line x1="-16" y1="46" x2="-56" y2="46" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
            {/* White Nylon Net Strings */}
            <path
              d={isHovered
                ? "M -18 48 L -24 82 L -34 86 L -46 80 L -54 48"
                : "M -18 48 L -26 78 L -36 78 L -48 78 L -54 48"
              }
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="1.8"
              strokeDasharray="3 2"
              className="transition-all duration-300"
            />
            {isHovered && (
              <circle cx="-36" cy="46" r="22" fill="#F59E0B" opacity="0.3" filter="url(#goldGlow)" />
            )}
          </g>
        </g>

        {/* Dunker Soaring High at Rim Level */}
        <g transform="translate(130, 35)">
          {/* Lower Body: Legs in Power Tuck */}
          <path d="M 48 88 L 36 122 L 20 128" stroke="url(#jerseyAmber)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 58 88 L 68 116 L 82 120" stroke="url(#jerseyAmber)" strokeWidth="12" strokeLinecap="round" />
          {/* Compression Tights */}
          <path d="M 36 122 L 20 128" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
          <path d="M 68 116 L 82 120" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
          {/* High-Top Basketball Sneakers */}
          <path d="M 18 128 L 6 128 L 8 120 L 22 122 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
          <path d="M 82 120 L 94 122 L 92 128 L 80 126 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />

          {/* Muscular Torso & Sleeveless Jersey */}
          <path
            d="M 40 40 C 48 36, 68 36, 76 42 C 72 65, 68 85, 58 92 C 48 92, 42 85, 38 68 Z"
            fill="url(#jerseyAmber)"
            stroke="#C2410C"
            strokeWidth="1.2"
          />
          {/* Jersey Trim & Number 26 */}
          <path d="M 44 40 L 52 50 L 62 40" fill="#7C2D12" />
          <text x="54" y="72" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle">26</text>

          {/* Focused Dunker Head & Hair */}
          <g transform="translate(48, 12)">
            <ellipse cx="14" cy="14" rx="11" ry="12" fill="url(#skinBase)" />
            {/* Fade Haircut */}
            <path d="M 4 14 C 4 6, 14 2, 24 4 C 26 10, 26 14, 24 16 C 18 12, 10 12, 4 14 Z" fill="#0F172A" />
            {/* Headband */}
            <rect x="4" y="10" width="20" height="4" rx="1.5" fill="#38BDF8" />
          </g>

          {/* Left Arm (Shielding Dunk Motion) */}
          <path d="M 42 46 C 30 52, 18 56, 12 48" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

          {/* Right Arm & Pebble Leather Basketball (Tomahawk Slam) */}
          <g
            className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '72px 42px',
              transform: isHovered ? 'rotate(48deg) translate(38px, 12px)' : 'rotate(-25deg) translate(0px, 0px)'
            }}
          >
            {/* Flexed Bicep & Arm Reaching High */}
            <path d="M 72 42 C 84 32, 98 22, 114 16" fill="none" stroke="url(#skinBase)" strokeWidth="9" strokeLinecap="round" />
            {/* Wristband */}
            <line x1="108" y1="18" x2="114" y2="15" stroke="#FFFFFF" strokeWidth="4" />

            {/* Hand Cupping Basketball */}
            <g transform="translate(112, 2)">
              {/* Basketball */}
              <circle cx="12" cy="12" r="14" fill="url(#basketballPebble)" stroke="#9A3412" strokeWidth="1.2" />
              {/* Recessed Seams */}
              <path d="M -2 12 L 26 12" stroke="#431407" strokeWidth="1.2" />
              <path d="M 12 -2 L 12 26" stroke="#431407" strokeWidth="1.2" />
              <path d="M 3 3 Q 12 12 3 21" stroke="#431407" strokeWidth="1.2" fill="none" />
              <path d="M 21 3 Q 12 12 21 21" stroke="#431407" strokeWidth="1.2" fill="none" />
              {/* Defined Grip Fingers */}
              <path d="M 4 2 C 8 4, 14 6, 20 6" fill="none" stroke="url(#skinBase)" strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 4. VOLLEYBALL: Spiker Leaping at Apex above High Net Tape
  // =========================================================================
  if (type.includes('volleyball')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Arena Lights & Synthetic Court */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="url(#synthCourt)" />

        {/* Volleyball Net & Upright Antenna */}
        <g transform="translate(240, 80)">
          {/* Steel Post */}
          <line x1="0" y1="-20" x2="0" y2="125" stroke="#64748B" strokeWidth="4" />
          {/* White Top Net Cable Band */}
          <line x1="-120" y1="20" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="4.5" />
          {/* Red & White Striped Court Antenna */}
          <line x1="-20" y1="-30" x2="-20" y2="120" stroke="#EF4444" strokeWidth="2.5" />
          <line x1="-20" y1="-20" x2="-20" y2="-10" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="-20" y1="0" x2="-20" y2="10" stroke="#FFFFFF" strokeWidth="2.5" />
          {/* Black Mesh Netting */}
          <g stroke="#94A3B8" strokeWidth="0.8" opacity="0.45">
            <line x1="-120" y1="40" x2="30" y2="40" />
            <line x1="-120" y1="65" x2="30" y2="65" />
            <line x1="-120" y1="90" x2="30" y2="90" />
            <line x1="-100" y1="20" x2="-100" y2="100" />
            <line x1="-70" y1="20" x2="-70" y2="100" />
            <line x1="-40" y1="20" x2="-40" y2="100" />
            <line x1="-10" y1="20" x2="-10" y2="100" />
            <line x1="20" y1="20" x2="20" y2="100" />
          </g>
        </g>

        {/* Tri-Color Volleyball with Swirl Panels */}
        <g
          className="transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transform: isHovered ? 'translate(255px, 140px) scale(0.9)' : 'translate(205px, 60px) scale(1)'
          }}
        >
          {isHovered && (
            <line x1="-40" y1="-35" x2="0" y2="0" stroke="#38BDF8" strokeWidth="3" strokeDasharray="3 3" opacity="0.8" />
          )}
          <circle cx="10" cy="10" r="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
          <path d="M 0 10 C 6 4, 14 4, 20 10 C 14 16, 6 16, 0 10 Z" fill="#2563EB" />
          <path d="M 10 0 C 4 6, 4 14, 10 20 C 16 14, 16 6, 10 0 Z" fill="#FACC15" />
        </g>

        {/* Airborne Spiker with Arched Back & High Reach */}
        <g transform="translate(100, 30)">
          {/* Lower Body: Bent Knees Floating in Jump */}
          <path d="M 40 92 L 26 125 L 14 122" stroke="url(#jerseyRoyal)" strokeWidth="11" strokeLinecap="round" />
          <path d="M 52 92 L 44 128 L 32 128" stroke="url(#jerseyRoyal)" strokeWidth="11" strokeLinecap="round" />
          {/* Knee Pads */}
          <rect x="22" y="114" width="8" height="6" rx="3" fill="#0F172A" />
          <rect x="40" y="117" width="8" height="6" rx="3" fill="#0F172A" />

          {/* Athletic Torso with Royal & Orange Accents */}
          <path
            d="M 38 42 C 48 38, 66 40, 72 48 C 66 70, 60 88, 48 94 C 38 94, 34 85, 32 68 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />
          <path d="M 42 44 L 62 48" stroke="#FB923C" strokeWidth="3" />

          {/* Head Tracking Ball */}
          <g transform="translate(54, 16)">
            <ellipse cx="13" cy="13" rx="10" ry="11" fill="url(#skinBase)" />
            <path d="M 3 13 C 3 6, 12 2, 22 4 C 24 10, 24 14, 22 16 C 16 11, 8 11, 3 13 Z" fill="#0F172A" />
          </g>

          {/* Left Arm Tracking Trajectory */}
          <path d="M 44 48 C 58 40, 72 32, 88 28" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

          {/* Right Hitting Arm in Power Spike Snap */}
          <g
            className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '68px 46px',
              transform: isHovered ? 'rotate(52deg) translate(22px, 8px)' : 'rotate(-25deg) translate(0px, 0px)'
            }}
          >
            {/* Upper Arm & Flexed Tricep */}
            <path d="M 68 46 C 78 34, 90 20, 106 14" fill="none" stroke="url(#skinBase)" strokeWidth="8" strokeLinecap="round" />
            {/* Open Palm Wrist-Snap */}
            <g transform="translate(104, 6)">
              <ellipse cx="6" cy="6" rx="5" ry="4" fill="url(#skinBase)" />
              <path d="M 4 2 L 12 0 L 10 8 Z" fill="url(#skinBase)" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 5. BADMINTON: Shuttler in Overhead Jump Smash with Feather Shuttlecock
  // =========================================================================
  if (type.includes('badminton')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Dark Tournament Court & Emerald Synthetic Mat */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="url(#synthCourt)" />

        {/* White Court Boundary Tramlines & Net Cord */}
        <line x1="50" y1="205" x2="350" y2="205" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="280" y1="120" x2="280" y2="205" stroke="#FFFFFF" strokeWidth="3" strokeOpacity="0.8" />
        <line x1="220" y1="130" x2="340" y2="130" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />

        {/* Goose-Feather Shuttlecock Darting across Court */}
        <g
          className="transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transform: isHovered ? 'translate(295px, 155px) scale(0.85)' : 'translate(205px, 80px) scale(1)'
          }}
        >
          {isHovered && (
            <line x1="-50" y1="-30" x2="0" y2="0" stroke="#38BDF8" strokeWidth="3" strokeDasharray="3 3" opacity="0.8" />
          )}
          {/* Feather Cone & Natural Cork Base */}
          <path d="M 4 4 L 18 -2 L 14 12 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.8" />
          <line x1="6" y1="5" x2="16" y2="2" stroke="#94A3B8" strokeWidth="0.6" />
          <line x1="8" y1="7" x2="15" y2="8" stroke="#94A3B8" strokeWidth="0.6" />
          <ellipse cx="4" cy="6" rx="4" ry="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
        </g>

        {/* Shuttler in Scissor-Kick Jump Smash */}
        <g transform="translate(100, 30)">
          {/* Scissor Kick Legs */}
          <path d="M 46 90 L 32 128 L 18 126" stroke="url(#jerseyPurple)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 58 90 L 74 120 L 90 120" stroke="url(#jerseyPurple)" strokeWidth="10" strokeLinecap="round" />
          {/* Badminton Court Shoes */}
          <path d="M 16 128 L 6 126 L 8 120 L 20 122 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M 90 120 L 102 122 L 100 128 L 88 126 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />

          {/* Aerodynamic Jersey */}
          <path
            d="M 40 42 C 48 38, 66 38, 72 46 C 68 68, 62 86, 52 92 C 42 92, 36 84, 34 68 Z"
            fill="url(#jerseyPurple)"
            stroke="#7C3AED"
            strokeWidth="1.2"
          />
          <path d="M 44 42 L 56 60 L 68 44" stroke="#FDE047" strokeWidth="2" />

          {/* Shuttler Head & Headband */}
          <g transform="translate(52, 14)">
            <ellipse cx="13" cy="13" rx="10" ry="11" fill="url(#skinBase)" />
            <path d="M 3 13 C 3 6, 12 2, 22 4 C 24 10, 24 14, 22 16 C 16 11, 8 11, 3 13 Z" fill="#0F172A" />
            <rect x="3" y="10" width="19" height="3.5" rx="1.5" fill="#38BDF8" />
          </g>

          {/* Non-Racket Left Hand Balancing Overhead */}
          <path d="M 42 48 C 50 38, 62 28, 74 22" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

          {/* Carbon-Fiber Racket & Smash Swing */}
          <g
            className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '68px 46px',
              transform: isHovered ? 'rotate(50deg) translate(28px, 6px)' : 'rotate(-25deg) translate(0px, 0px)'
            }}
          >
            {/* Flexed Arm */}
            <path d="M 68 46 C 80 34, 94 22, 110 14" fill="none" stroke="url(#skinBase)" strokeWidth="8" strokeLinecap="round" />
            {/* Grip & Graphite Shaft */}
            <g transform="translate(108, 10)">
              <line x1="2" y1="4" x2="16" y2="-4" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="16" y1="-4" x2="42" y2="-18" stroke="#38BDF8" strokeWidth="2.2" />
              {/* Isometric Strung Racket Head */}
              <ellipse cx="54" cy="-24" rx="14" ry="18" fill="none" stroke="#38BDF8" strokeWidth="2.5" transform="rotate(-30, 54, -24)" />
              {/* String Mesh Grid */}
              <line x1="44" y1="-30" x2="64" y2="-18" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.7" />
              <line x1="48" y1="-36" x2="60" y2="-12" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.7" />
              <line x1="46" y1="-16" x2="62" y2="-32" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.7" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 6. CHESS: Grandmaster Advancing Knight with Tactical Purple Flash
  // =========================================================================
  if (type.includes('chess')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Dark Walnut Table & Ambient Light */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* 3D Perspective Chessboard */}
        <g transform="translate(160, 120)">
          {/* Beveled Mahogany Wood Border */}
          <polygon points="0,50 180,50 150,10 30,10" fill="#2E1005" stroke="#78350F" strokeWidth="2" />
          {/* Alternating Squares */}
          <g>
            <polygon points="30,10 60,10 52,20 22,20" fill="#FEF3C7" />
            <polygon points="60,10 90,10 82,20 52,20" fill="#78350F" />
            <polygon points="90,10 120,10 112,20 82,20" fill="#FEF3C7" />
            <polygon points="120,10 150,10 142,20 112,20" fill="#78350F" />

            <polygon points="22,20 52,20 45,32 15,32" fill="#78350F" />
            <polygon points="52,20 82,20 75,32 45,32" fill="#FEF3C7" />
            <polygon points="82,20 112,20 105,32 75,32" fill="#78350F" />
            <polygon points="112,20 142,20 135,32 105,32" fill="#FEF3C7" />

            {/* Critical E5 Landing Square */}
            <polygon
              points="45,32 75,32 68,46 38,46"
              fill={isHovered ? "#8B5CF6" : "#78350F"}
              className="transition-colors duration-500"
            />
            <polygon points="75,32 105,32 98,46 68,46" fill="#FEF3C7" />
            <polygon points="105,32 135,32 128,46 98,46" fill="#78350F" />
          </g>

          {/* DGT Digital Chess Clock */}
          <g transform="translate(145, -15)">
            <rect x="0" y="0" width="35" height="18" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <text x="17" y="13" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">04:18</text>
          </g>

          {/* Checkmate Tactical Rays on Move */}
          {isHovered && (
            <g>
              <circle cx="56" cy="39" r="18" fill="#8B5CF6" opacity="0.3" filter="url(#purpleGlow)" />
              <line x1="56" y1="39" x2="115" y2="25" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 2" />
            </g>
          )}
        </g>

        {/* Grandmaster in Tailored Charcoal Suit */}
        <g transform="translate(60, 40)">
          {/* Torso & Shoulders Leaning in Deep Concentration */}
          <path
            d="M 28 52 C 40 46, 68 44, 82 52 C 86 85, 82 110, 78 135 C 55 135, 35 135, 20 135 C 18 110, 20 85, 28 52 Z"
            fill="url(#suitCharcoal)"
            stroke="#475569"
            strokeWidth="1.2"
          />
          {/* Crisp White Shirt Collar & Lapel */}
          <polygon points="48,50 56,66 64,50" fill="#FFFFFF" />
          <path d="M 44 50 L 52 85 L 60 50" stroke="#0F172A" strokeWidth="1.5" />

          {/* Grandmaster Head & Focused Gaze */}
          <g transform="translate(48, 15)">
            <ellipse cx="14" cy="16" rx="11" ry="13" fill="url(#skinBase)" />
            {/* Styled Hair */}
            <path d="M 4 15 C 4 6, 15 2, 25 4 C 27 10, 27 16, 25 18 C 18 12, 10 12, 4 15 Z" fill="#1E293B" />
            {/* Ear & Jawline */}
            <ellipse cx="6" cy="18" rx="2.5" ry="3.5" fill="url(#skinShadow)" />
          </g>

          {/* Left Arm Resting on Table */}
          <path d="M 24 60 C 18 80, 16 100, 20 118" fill="none" stroke="url(#suitCharcoal)" strokeWidth="12" strokeLinecap="round" />

          {/* Kinetic Right Hand & Staunton Knight Piece */}
          <g
            className="transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '75px 56px',
              transform: isHovered ? 'translate(68px, 48px)' : 'translate(0px, 0px)'
            }}
          >
            {/* Extended Forearm */}
            <path d="M 75 56 C 88 68, 102 82, 114 96" fill="none" stroke="url(#suitCharcoal)" strokeWidth="11" strokeLinecap="round" />
            {/* White Cuff */}
            <line x1="110" y1="92" x2="116" y2="98" stroke="#FFFFFF" strokeWidth="4" />

            {/* Delicate Hand Gripping Knight */}
            <g transform="translate(112, 92)">
              <ellipse cx="6" cy="6" rx="5" ry="4" fill="url(#skinBase)" />
              {/* Fingers Curled Around Piece */}
              <path d="M 4 4 L 10 2 L 12 10" fill="none" stroke="url(#skinBase)" strokeWidth="3" strokeLinecap="round" />

              {/* Hand-Carved Knight Piece */}
              <g transform="translate(6, 6)">
                {/* Flared Pedestal */}
                <path d="M -2 16 L 10 16 L 8 13 L 0 13 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.8" />
                {/* Horse Head Silhouette */}
                <path
                  d="M 1 13 C 0 8, -2 4, 3 1 C 5 0, 7 2, 8 4 C 11 6, 10 9, 7 10 L 8 13 Z"
                  fill="#F8FAFC"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                />
                {/* Carved Mane & Eye Detail */}
                <circle cx="5" cy="3" r="0.8" fill="#475569" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 7. KABADDI: Muscular Raider Lunging in Toe-Touch against Linked Defenders
  // =========================================================================
  if (type.includes('kabaddi')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Arena Floodlights & Kabaddi Mat */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCrimson)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#7C2D12" opacity="0.75" />

        {/* Bonus & Baulk Lines on Mat */}
        <line x1="60" y1="185" x2="340" y2="185" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.7" />
        <line x1="80" y1="165" x2="320" y2="165" stroke="#FACC15" strokeWidth="2" strokeOpacity="0.7" />

        {/* Two Linked Chain Defenders in Athletic Ready Stance */}
        <g transform="translate(265, 85)" opacity="0.9">
          {/* Corner Defender 1 */}
          <ellipse cx="14" cy="14" rx="8" ry="9" fill="url(#skinBase)" />
          <path d="M 6 22 L 22 22 L 20 52 L 4 52 Z" fill="#1E3A8A" />
          <path d="M 8 52 L 2 76" stroke="#1E3A8A" strokeWidth="8" strokeLinecap="round" />
          <path d="M 18 52 L 24 76" stroke="#1E3A8A" strokeWidth="8" strokeLinecap="round" />

          {/* Corner Defender 2 */}
          <g transform="translate(35, 6)">
            <ellipse cx="14" cy="14" rx="8" ry="9" fill="url(#skinBase)" />
            <path d="M 6 22 L 22 22 L 20 52 L 4 52 Z" fill="#1E3A8A" />
            <path d="M 8 52 L 4 72" stroke="#1E3A8A" strokeWidth="8" strokeLinecap="round" />
            <path d="M 18 52 L 26 72" stroke="#1E3A8A" strokeWidth="8" strokeLinecap="round" />
          </g>

          {/* Linked Hands Chain */}
          <line x1="20" y1="36" x2="38" y2="40" stroke="url(#skinBase)" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Raider in Aggressive Low Tiger Crouch */}
        <g transform="translate(80, 75)">
          {/* Back Coiled Leg */}
          <path d="M 40 55 L 20 72 L 6 70" stroke="url(#jerseyAmber)" strokeWidth="12" strokeLinecap="round" />

          {/* Muscular Torso Leaning Low & Cantilevered */}
          <path
            d="M 38 32 C 48 26, 68 28, 76 34 C 70 54, 62 68, 48 72 C 38 72, 34 64, 32 48 Z"
            fill="url(#jerseyAmber)"
            stroke="#C2410C"
            strokeWidth="1.2"
          />

          {/* Focused Raider Head */}
          <g transform="translate(68, 12)">
            <ellipse cx="12" cy="12" rx="9" ry="10" fill="url(#skinBase)" />
            <path d="M 3 12 C 3 6, 10 2, 20 4 C 22 8, 22 12, 20 14 C 14 10, 8 10, 3 12 Z" fill="#0F172A" />
          </g>

          {/* Left Hand Ready to Push Back */}
          <path d="M 44 40 C 34 46, 26 50, 16 46" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

          {/* Kinetic Lunging Front Leg for Toe-Touch */}
          <g
            className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '55px 65px',
              transform: isHovered ? 'translate(32px, -4px)' : 'translate(0px, 0px)'
            }}
          >
            {/* Muscular Lunge Thigh & Calf */}
            <path d="M 55 65 C 72 65, 96 66, 118 70" fill="none" stroke="url(#jerseyAmber)" strokeWidth="12" strokeLinecap="round" />
            <path d="M 118 70 C 132 72, 146 75, 158 78" fill="none" stroke="url(#skinBase)" strokeWidth="8" strokeLinecap="round" />
            {/* Outstretched Toe Snapping for Point */}
            <path d="M 158 78 L 168 80 L 164 84 Z" fill="url(#skinShadow)" />

            {/* Outstretched Arm Seeking Touch */}
            <path d="M 68 38 C 88 38, 114 42, 138 46" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

            {/* Toe Touch Impact Flash */}
            {isHovered && (
              <g transform="translate(166, 78)">
                <circle cx="0" cy="0" r="14" fill="#38BDF8" opacity="0.4" filter="url(#cyanGlow)" />
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="8" y1="-8" x2="-8" y2="8" stroke="#FFFFFF" strokeWidth="2" />
              </g>
            )}
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 8. TABLE TENNIS: Low Crouch Player Whipping Forehand Topspin Loop
  // =========================================================================
  if (type.includes('tabletennis') || type.includes('table-tennis')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Arena Floodlights & Court Mat */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* 3D Perspective Blue Table Tennis Table */}
        <g transform="translate(150, 105)">
          <polygon points="10,65 190,65 170,25 30,25" fill="#1E3A8A" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="100" y1="25" x2="100" y2="65" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />
          {/* Net Cable Band & Black Mesh */}
          <line x1="15" y1="42" x2="185" y2="42" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="15" y="42" width="170" height="8" fill="#000000" opacity="0.4" />
        </g>

        {/* Seamless 40mm Orange Ball with Spinning Orbit Arc */}
        <g
          className="transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transform: isHovered ? 'translate(270px, 115px) scale(0.8)' : 'translate(190px, 128px) scale(1)'
          }}
        >
          {isHovered && (
            <path d="M -50 20 Q -20 -15 0 0" fill="none" stroke="#F97316" strokeWidth="2.5" strokeDasharray="2 2" opacity="0.8" />
          )}
          <circle cx="6" cy="6" r="6" fill="#FB923C" stroke="#EA580C" strokeWidth="1" />
          <circle cx="4" cy="4" r="2" fill="#FED7AA" />
        </g>

        {/* Player in Low Crouched Forehand Stance */}
        <g transform="translate(70, 50)">
          {/* Deep Crouch Legs */}
          <path d="M 36 82 L 20 114 L 6 116" stroke="url(#jerseyRoyal)" strokeWidth="11" strokeLinecap="round" />
          <path d="M 52 82 L 68 114 L 84 116" stroke="url(#jerseyRoyal)" strokeWidth="11" strokeLinecap="round" />

          {/* Torso Leaning Forward */}
          <path
            d="M 34 38 C 42 32, 60 32, 68 38 C 64 58, 58 74, 48 82 C 38 82, 34 74, 30 58 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />

          {/* Head & Laser Focus Eyes */}
          <g transform="translate(46, 12)">
            <ellipse cx="12" cy="13" rx="10" ry="11" fill="url(#skinBase)" />
            <path d="M 3 13 C 3 6, 12 2, 22 4 C 24 10, 24 14, 22 16 C 16 11, 8 11, 3 13 Z" fill="#0F172A" />
          </g>

          {/* Non-Paddle Hand Balancing */}
          <path d="M 34 44 C 22 48, 12 52, 6 46" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />

          {/* Kinetic Forehand Topspin Loop Swing */}
          <g
            className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '64px 44px',
              transform: isHovered ? 'rotate(42deg) translate(22px, -12px)' : 'rotate(-18deg) translate(0px, 0px)'
            }}
          >
            {/* Whipping Forearm */}
            <path d="M 64 44 C 76 52, 90 62, 104 68" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

            {/* Pro Blade with Inverted Red Rubber */}
            <g transform="translate(104, 62)">
              {/* Wooden Handle */}
              <line x1="0" y1="4" x2="8" y2="8" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              {/* Circular Bat Head */}
              <circle cx="16" cy="12" r="10" fill="#DC2626" stroke="#0F172A" strokeWidth="1.5" />
              <line x1="8" y1="6" x2="8" y2="18" stroke="#0F172A" strokeWidth="1.5" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 9. ATHLETICS: Sprinter in Forward Drive Phase Snapping Finish Ribbon
  // =========================================================================
  if (type.includes('athletics') || type.includes('sprint') || type.includes('track')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Synthetic Crimson 8-Lane Running Track */}
        <polygon points="100,0 300,0 390,230 10,230" fill="url(#spotCrimson)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="url(#synthTrack)" />

        {/* White Lane Dividers & Distance Markings */}
        <line x1="40" y1="180" x2="360" y2="180" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" />
        <line x1="60" y1="205" x2="340" y2="205" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" />
        <text x="70" y="198" fill="#FFFFFF" fillOpacity="0.3" fontSize="14" fontWeight="bold" fontFamily="sans-serif">100M</text>

        {/* Sprinter Exploding in 45° Drive Phase */}
        <g
          className="transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transformOrigin: '150px 140px',
            transform: isHovered ? 'translate(45px, -6px)' : 'translate(0px, 0px)'
          }}
        >
          {/* Back Driving Leg */}
          <path d="M 120 105 L 85 135 L 55 145" stroke="url(#jerseyRoyal)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 55 145 L 45 152 L 40 148 Z" fill="#FACC15" />

          {/* Front High-Knee Drive Leg */}
          <path d="M 135 105 L 165 92 L 170 125" stroke="url(#jerseyRoyal)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 170 125 L 178 132 L 172 136 Z" fill="#FACC15" />

          {/* Muscular Aerodynamic Speedsuit Torso */}
          <path
            d="M 115 62 C 128 54, 148 56, 155 68 C 146 88, 138 104, 122 110 C 112 110, 108 100, 106 82 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />
          {/* Festival Sprint Bib #01 */}
          <rect x="122" y="74" width="18" height="14" rx="2" fill="#FFFFFF" />
          <text x="131" y="85" fill="#0F172A" fontSize="9" fontWeight="900" textAnchor="middle">01</text>

          {/* Sprinter Head & Aerodynamic Form */}
          <g transform="translate(138, 38)">
            <ellipse cx="12" cy="13" rx="10" ry="11" fill="url(#skinBase)" />
            <path d="M 2 13 C 2 6, 12 2, 22 4 C 24 10, 24 14, 22 16 C 16 11, 8 11, 2 13 Z" fill="#0F172A" />
          </g>

          {/* Piston Arms (90° Angle Driving Hard) */}
          <path d="M 120 70 C 104 76, 92 88, 86 102" fill="none" stroke="url(#skinBase)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 148 66 C 162 60, 178 52, 188 44" fill="none" stroke="url(#skinBase)" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* Purple Festival Finish Line Tape */}
        <g transform="translate(240, 60)">
          {isHovered ? (
            /* Broken Ribbon Fluttering Away */
            <g>
              <path d="M 0 30 C 18 10, 32 45, 55 25" fill="none" stroke="#C084FC" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M -10 65 C 10 85, 30 70, 48 95" fill="none" stroke="#A855F7" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="10" cy="50" r="16" fill="#A855F7" opacity="0.3" filter="url(#purpleGlow)" />
            </g>
          ) : (
            /* Intact Taut Finish Ribbon */
            <path d="M 0 25 L 0 95" stroke="#A855F7" strokeWidth="4.5" strokeLinecap="round" />
          )}
        </g>
      </svg>
    );
  }



  // =========================================================================
  // 10. DANCE: Classical / Contemporary Dancer in Nataraja Leap with Billowing Silk
  // =========================================================================
  if (type.includes('dance')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Theatrical Overhead Violet Spotlight */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <ellipse cx="200" cy="205" rx="170" ry="22" fill="#000000" opacity="0.5" />

        {/* Billowing Translucent Silk Dupatta (S-Curve Ribbon) */}
        <path
          d={isHovered
            ? "M 50 140 C 90 40, 160 30, 210 75 C 260 120, 310 60, 360 85"
            : "M 80 130 C 110 70, 170 65, 200 95 C 230 125, 280 85, 320 105"
          }
          fill="none"
          stroke="url(#spotPurple)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeOpacity="0.65"
          className="transition-all duration-700 ease-out"
        />
        <path
          d={isHovered
            ? "M 50 140 C 90 40, 160 30, 210 75 C 260 120, 310 60, 360 85"
            : "M 80 130 C 110 70, 170 65, 200 95 C 230 125, 280 85, 320 105"
          }
          fill="none"
          stroke="#F472B6"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="transition-all duration-700 ease-out"
        />

        {/* Graceful Dancer in Nataraja / Arabesque Leap */}
        <g
          className="transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transformOrigin: '200px 140px',
            transform: isHovered ? 'scale(1.05) translate(0px, -8px)' : 'scale(1) translate(0px, 0px)'
          }}
        >
          <g transform="translate(155, 35)">
            {/* Supporting Leg (Extended on Tiptoe) */}
            <path d="M 44 88 L 44 142 L 40 152" stroke="url(#skinBase)" strokeWidth="10" strokeLinecap="round" />
            {/* Ghungroo Ankle Bells */}
            <rect x="38" y="140" width="12" height="4" rx="2" fill="#FBBF24" />
            <circle cx="41" cy="142" r="1.5" fill="#78350F" />
            <circle cx="47" cy="142" r="1.5" fill="#78350F" />

            {/* Raised Sculpted Leg in Nataraja Bend */}
            <path d="M 46 84 C 62 82, 78 72, 82 58 C 86 44, 76 34, 68 34" fill="none" stroke="url(#skinBase)" strokeWidth="9" strokeLinecap="round" />
            <rect x="68" y="32" width="5" height="10" rx="2" fill="#FBBF24" />

            {/* Traditional Pleated Fan Skirt (Zari Gold Border) */}
            <path
              d="M 28 80 C 40 76, 52 76, 62 80 L 78 116 C 50 125, 30 125, 12 116 Z"
              fill="url(#jerseyPurple)"
              stroke="#FBBF24"
              strokeWidth="1.5"
            />
            {/* Pleat Radiating Lines */}
            <line x1="45" y1="78" x2="28" y2="120" stroke="#FBBF24" strokeWidth="0.8" />
            <line x1="45" y1="78" x2="45" y2="122" stroke="#FBBF24" strokeWidth="0.8" />
            <line x1="45" y1="78" x2="62" y2="120" stroke="#FBBF24" strokeWidth="0.8" />

            {/* Fitted Blouse / Choli & Jewelry */}
            <path
              d="M 34 46 C 40 42, 50 42, 56 46 C 54 62, 52 74, 46 80 C 38 80, 36 68, 34 46 Z"
              fill="url(#jerseyAmber)"
              stroke="#B45309"
              strokeWidth="1"
            />
            <path d="M 38 48 C 45 56, 52 48, 52 48" stroke="#FDE047" strokeWidth="1.5" fill="none" />

            {/* Expressive Dancer Head & Classical Adornments */}
            <g transform="translate(35, 15)">
              <ellipse cx="11" cy="12" rx="9" ry="10" fill="url(#skinBase)" />
              {/* Classical Top Knot / Bun with Flowers */}
              <circle cx="10" cy="4" r="6" fill="#0F172A" />
              <circle cx="10" cy="4" r="7" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2" />
              {/* Profile Nose & Bindi */}
              <circle cx="15" cy="10" r="1" fill="#DC2626" />
            </g>

            {/* Classical Mudra Arms (Pataka & Alapadma) */}
            <g
              className="transition-transform duration-500 ease-out"
              style={{
                transformOrigin: '45px 50px',
                transform: isHovered ? 'rotate(12deg)' : 'rotate(0deg)'
              }}
            >
              {/* Left Arm Swept Overhead */}
              <path d="M 34 48 C 22 42, 12 30, 16 16 C 18 10, 28 8, 36 10" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
              {/* Right Arm in Elegant Mudra Horizontal Reach */}
              <path d="M 56 48 C 72 46, 88 44, 98 38" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
              {/* Mudra Hand Fingers (Alapadma Lotus) */}
              <g transform="translate(96, 34)">
                <ellipse cx="4" cy="4" rx="3.5" ry="3" fill="url(#skinBase)" />
                <line x1="4" y1="2" x2="8" y2="0" stroke="url(#skinBase)" strokeWidth="1.5" />
                <line x1="4" y1="4" x2="9" y2="3" stroke="url(#skinBase)" strokeWidth="1.5" />
                <line x1="4" y1="6" x2="8" y2="7" stroke="url(#skinBase)" strokeWidth="1.5" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 11. SINGING: Concert Vocalist at Stage Mic with Resonating Acoustic Waves
  // =========================================================================
  if (type.includes('singing') || type.includes('voice') || type.includes('vocal')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Warm Stage Spotlight Cone */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#000000" opacity="0.6" />

        {/* Concentric Acoustic Sound Waves Radiating from Mic */}
        <g transform="translate(195, 95)">
          <circle
            cx="0"
            cy="0"
            r={isHovered ? "32" : "18"}
            fill="none"
            stroke="#C084FC"
            strokeWidth="2"
            opacity={isHovered ? "0.8" : "0.3"}
            className="transition-all duration-500"
          />
          <circle
            cx="0"
            cy="0"
            r={isHovered ? "58" : "36"}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1.8"
            opacity={isHovered ? "0.6" : "0.2"}
            className="transition-all duration-700"
          />
          <circle
            cx="0"
            cy="0"
            r={isHovered ? "88" : "55"}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity={isHovered ? "0.5" : "0.1"}
            className="transition-all duration-1000"
          />

          {/* Floating Musical Notes on Hover */}
          {isHovered && (
            <g>
              <text x="24" y="-22" fill="#FBBF24" fontSize="16" fontWeight="bold">♪</text>
              <text x="48" y="-45" fill="#38BDF8" fontSize="20" fontWeight="bold">♫</text>
              <text x="-38" y="-40" fill="#F472B6" fontSize="14" fontWeight="bold">♩</text>
            </g>
          )}
        </g>

        {/* Dynamic Studio Microphone on Angled Boom Stand */}
        <g transform="translate(195, 95)">
          {/* Vertical Chrome Stand & Base */}
          <line x1="0" y1="12" x2="0" y2="110" stroke="#94A3B8" strokeWidth="3" />
          <path d="M -15 110 L 15 110" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          {/* Mic Clip */}
          <rect x="-4" y="8" width="8" height="6" rx="2" fill="#1E293B" />
          {/* Shure SM58 Style Mesh Grille Capsule */}
          <path d="M -7 4 C -7 -6, 7 -6, 7 4 Z" fill="url(#silverChrome)" stroke="#64748B" strokeWidth="1" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#0F172A" strokeWidth="1" />
        </g>

        {/* Vocalist in Soulful Belting Pose */}
        <g transform="translate(90, 45)">
          {/* Torso & Elegant Stage Attire */}
          <path
            d="M 32 52 C 42 46, 68 44, 78 52 C 75 85, 72 110, 68 135 C 50 135, 34 135, 24 135 C 22 110, 24 85, 32 52 Z"
            fill="url(#jerseyPurple)"
            stroke="#7C3AED"
            strokeWidth="1.2"
          />

          {/* Head Tilted Back in Emotional Delivery */}
          <g transform="translate(48, 14)">
            <ellipse cx="14" cy="16" rx="11" ry="13" fill="url(#skinBase)" />
            {/* Styled Hair Flowing Backward */}
            <path d="M 4 16 C 4 6, 14 2, 24 4 C 28 8, 28 16, 26 22 C 18 20, 10 16, 4 16 Z" fill="#0F172A" />
            {/* Open Singing Mouth & Chin Tilt */}
            <ellipse cx="23" cy="20" rx="3" ry="2" fill="#78350F" />
          </g>

          {/* Left Hand Holding the Microphone */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '70px 55px',
              transform: isHovered ? 'translate(8px, -2px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 68 55 C 80 62, 92 72, 102 78" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />
            {/* Fingers Wrapped on Mic Body */}
            <ellipse cx="103" cy="79" rx="5" ry="4" fill="url(#skinBase)" />
          </g>

          {/* Right Hand Extended in Passionate Gestural Delivery */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '32px 55px',
              transform: isHovered ? 'rotate(-15deg)' : 'rotate(0deg)'
            }}
          >
            <path d="M 32 55 C 18 52, 6 42, 0 32" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />
            <circle cx="0" cy="32" r="3.5" fill="url(#skinBase)" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 12. SOLO PERFORMANCE: Multi-Talented Performer / Beatboxer / Comic
  // =========================================================================
  if (type.includes('soloperformance') || type.includes('solo-performance')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Intimate Circular Stage with Warm Amber & Violet Glow */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotGold)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Acoustic Resonance Rings */}
        <circle
          cx="200"
          cy="110"
          r={isHovered ? "65" : "40"}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeDasharray="4 4"
          opacity={isHovered ? "0.7" : "0.2"}
          className="transition-all duration-500"
        />

        {/* Performer Character */}
        <g transform="translate(150, 45)">
          {/* Torso & Stylized Rolled-Sleeve Jacket */}
          <path
            d="M 32 50 C 42 44, 62 44, 72 50 C 70 80, 68 105, 62 135 C 48 135, 36 135, 26 135 C 24 105, 26 80, 32 50 Z"
            fill="url(#jerseyAmber)"
            stroke="#B45309"
            strokeWidth="1.2"
          />

          {/* Headphones Draped Around Neck */}
          <path d="M 40 44 C 42 36, 62 36, 64 44" fill="none" stroke="#38BDF8" strokeWidth="4" />
          <circle cx="38" cy="45" r="4.5" fill="#0F172A" />
          <circle cx="66" cy="45" r="4.5" fill="#0F172A" />

          {/* Head & Expressive Stage Profile */}
          <g transform="translate(42, 14)">
            <ellipse cx="12" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 2 14 C 2 6, 12 2, 22 4 C 24 10, 24 14, 22 16 C 16 11, 8 11, 2 14 Z" fill="#0F172A" />
          </g>

          {/* Expressive Gesturing Arms */}
          <path
            d={isHovered ? "M 32 55 C 16 48, 6 35, 2 24" : "M 32 55 C 20 62, 12 68, 8 75"}
            fill="none"
            stroke="url(#skinBase)"
            strokeWidth="7"
            strokeLinecap="round"
            className="transition-all duration-400"
          />
          <path
            d={isHovered ? "M 72 55 C 88 48, 98 35, 102 24" : "M 72 55 C 84 62, 92 68, 96 75"}
            fill="none"
            stroke="url(#skinBase)"
            strokeWidth="7"
            strokeLinecap="round"
            className="transition-all duration-400"
          />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 13. BAND / GROUP PERFORMANCE: Rock Guitarist Power Stance before Equalizer
  // =========================================================================
  if (type.includes('band') || type.includes('group') || type.includes('rock')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Arena Concert Lighting */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#000000" opacity="0.6" />

        {/* Marshall-Style Amplifier Stack in Background */}
        <g transform="translate(60, 95)" opacity="0.85">
          <rect x="0" y="0" width="70" height="90" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <rect x="6" y="8" width="58" height="42" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          {/* Dual Speaker Cones */}
          <circle cx="22" cy="29" r="14" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          <circle cx="48" cy="29" r="14" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          {/* Gold Script Badge */}
          <rect x="22" y="56" width="26" height="5" rx="1" fill="#FBBF24" />
        </g>

        {/* Neon Equalizer Spectrum Bars Radiating Upward on Hover */}
        <g transform="translate(270, 70)" opacity={isHovered ? "0.9" : "0.35"} className="transition-opacity duration-500">
          <rect x="0" y={isHovered ? "20" : "60"} width="8" height={isHovered ? "80" : "40"} rx="2" fill="#38BDF8" className="transition-all duration-300" />
          <rect x="12" y={isHovered ? "5" : "50"} width="8" height={isHovered ? "95" : "50"} rx="2" fill="#818CF8" className="transition-all duration-300" />
          <rect x="24" y={isHovered ? "30" : "65"} width="8" height={isHovered ? "70" : "35"} rx="2" fill="#C084FC" className="transition-all duration-300" />
          <rect x="36" y={isHovered ? "10" : "45"} width="8" height={isHovered ? "90" : "55"} rx="2" fill="#F472B6" className="transition-all duration-300" />
          <rect x="48" y={isHovered ? "25" : "60"} width="8" height={isHovered ? "75" : "40"} rx="2" fill="#FBBF24" className="transition-all duration-300" />
        </g>

        {/* Lead Guitarist in Wide Power Stance */}
        <g transform="translate(130, 45)">
          {/* Legs in Wide Athletic Stance */}
          <path d="M 40 85 L 24 135 L 12 138" stroke="#0F172A" strokeWidth="11" strokeLinecap="round" />
          <path d="M 58 85 L 76 135 L 88 138" stroke="#0F172A" strokeWidth="11" strokeLinecap="round" />

          {/* Torso with Leather Vest */}
          <path
            d="M 36 44 C 44 38, 62 38, 70 44 C 68 68, 64 88, 54 94 C 42 94, 38 85, 34 68 Z"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="1.2"
          />

          {/* Head & Rocker Hair Flow */}
          <g transform="translate(45, 14)">
            <ellipse cx="13" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 3 14 C 3 4, 14 0, 24 2 C 28 8, 28 16, 26 22 C 16 20, 8 16, 3 14 Z" fill="#0F172A" />
          </g>

          {/* Left Arm Fretting High on Guitar Neck */}
          <path d="M 38 48 C 22 55, 6 60, -8 55" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />

          {/* Electric Solid-Body Guitar (Fender / Gibson Contour) */}
          <g transform="translate(15, 60)">
            {/* Long Neck & Fretted Fingerboard */}
            <line x1="-30" y1="-8" x2="45" y2="28" stroke="#92400E" strokeWidth="4.5" />
            <line x1="-30" y1="-8" x2="45" y2="28" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 3" />
            {/* Headstock & Tuning Pegs */}
            <polygon points="-30,-8 -38,-12 -36,-5 -28,-4" fill="#D97706" />

            {/* Contoured Guitar Body with Cutaway Horns */}
            <path
              d="M 28 18 C 35 12, 52 14, 60 26 C 68 38, 62 55, 48 58 C 34 60, 24 50, 24 38 C 24 32, 20 24, 28 18 Z"
              fill="#DC2626"
              stroke="#991B1B"
              strokeWidth="1.5"
            />
            {/* Pickguard & Pickups */}
            <ellipse cx="44" cy="36" rx="8" ry="12" fill="#FFFFFF" opacity="0.9" />
            <rect x="40" y="30" width="8" height="4" rx="1" fill="#0F172A" />
            <rect x="40" y="38" width="8" height="4" rx="1" fill="#0F172A" />
          </g>

          {/* Kinetic Right Strumming Arm */}
          <g
            className="transition-transform duration-300 ease-out"
            style={{
              transformOrigin: '68px 48px',
              transform: isHovered ? 'rotate(24deg) translate(8px, 6px)' : 'rotate(0deg) translate(0px, 0px)'
            }}
          >
            <path d="M 68 48 C 76 60, 72 75, 62 88" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />
            <circle cx="60" cy="90" r="3.5" fill="#FACC15" />
            {isHovered && (
              <circle cx="60" cy="90" r="14" fill="#C084FC" opacity="0.4" filter="url(#purpleGlow)" />
            )}
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 14. DRAMA: Thespian Actor in Dramatic Monologue between Velvet Curtains
  // =========================================================================
  if (type.includes('drama') || type.includes('theatre') || type.includes('play')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Stage Warm Footlights & Planks */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotGold)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#451A03" opacity="0.75" />

        {/* Deep Crimson Proscenium Velvet Curtains */}
        <g>
          {/* Left Velvet Drape */}
          <path
            d={isHovered
              ? "M 0 0 L 50 0 C 40 80, 20 160, 0 230 Z"
              : "M 0 0 L 85 0 C 70 80, 45 160, 0 230 Z"
            }
            fill="#991B1B"
            className="transition-all duration-700 ease-out"
          />
          {/* Right Velvet Drape */}
          <path
            d={isHovered
              ? "M 400 0 L 350 0 C 360 80, 380 160, 400 230 Z"
              : "M 400 0 L 315 0 C 330 80, 355 160, 400 230 Z"
            }
            fill="#991B1B"
            className="transition-all duration-700 ease-out"
          />
          {/* Golden Tassel Tie-Backs */}
          <circle cx="35" cy="120" r="6" fill="#FBBF24" />
          <circle cx="365" cy="120" r="6" fill="#FBBF24" />
        </g>

        {/* Dramatic Actor in Monologue Stance */}
        <g transform="translate(155, 45)">
          {/* Thespian Robe / Tunic */}
          <path
            d="M 32 50 C 42 44, 62 44, 72 50 C 74 85, 78 120, 82 145 C 55 145, 35 145, 18 145 C 24 120, 28 85, 32 50 Z"
            fill="url(#suitCharcoal)"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* Expressive Actor Head */}
          <g transform="translate(42, 14)">
            <ellipse cx="14" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 4 14 C 4 6, 14 2, 24 4 C 26 10, 26 14, 24 16 C 18 11, 10 11, 4 14 Z" fill="#0F172A" />
          </g>

          {/* Dramatic Expressive Arms */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '50px 55px',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)'
            }}
          >
            {/* Left Arm Raised Emoting to the Heavens */}
            <path d="M 32 52 C 18 42, 12 28, 14 14" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            {/* Right Hand Pressed to Heart */}
            <path d="M 72 52 C 62 58, 52 64, 48 66" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 15. FASHION SHOW: Haute Couture Runway Model Gliding down LED Catwalk
  // =========================================================================
  if (type.includes('fashion') || type.includes('runway') || type.includes('couture')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Overhead Spotlights & LED Runway Catwalk */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <polygon points="150,80 250,80 320,230 80,230" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />

        {/* Linear LED Catwalk Floor Edge Strips */}
        <line x1="150" y1="80" x2="80" y2="230" stroke="#C084FC" strokeWidth="2.5" />
        <line x1="250" y1="80" x2="320" y2="230" stroke="#38BDF8" strokeWidth="2.5" />

        {/* Flashing Paparazzi Camera Bulbs */}
        {isHovered && (
          <g>
            <circle cx="50" cy="110" r="12" fill="#FFFFFF" opacity="0.6" filter="url(#cyanGlow)" />
            <circle cx="350" cy="140" r="16" fill="#FFFFFF" opacity="0.7" filter="url(#purpleGlow)" />
            <circle cx="365" cy="85" r="9" fill="#FFFFFF" opacity="0.5" filter="url(#cyanGlow)" />
          </g>
        )}

        {/* High-Fashion Model in Confident Runway Stride */}
        <g
          className="transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transformOrigin: '200px 140px',
            transform: isHovered ? 'scale(1.08) translate(0px, 4px)' : 'scale(1) translate(0px, 0px)'
          }}
        >
          <g transform="translate(170, 25)">
            {/* Long Runway Stride Legs */}
            <path d="M 28 95 L 24 165 L 18 170" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />
            <path d="M 34 95 L 42 160 L 46 166" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />
            {/* High-Heel Stilettos */}
            <path d="M 18 170 L 14 172 L 20 172 Z" fill="#0F172A" />
            <path d="M 46 166 L 50 168 L 44 168 Z" fill="#0F172A" />

            {/* Avant-Garde Haute Couture Gown & Billowing Cape */}
            <path
              d="M 18 52 C 26 44, 38 44, 46 52 C 48 75, 54 95, 60 145 C 38 150, 22 150, 4 145 C 8 95, 14 75, 18 52 Z"
              fill="url(#jerseyPurple)"
              stroke="#A855F7"
              strokeWidth="1.2"
            />
            {/* Geometric Structured Collar */}
            <polygon points="22,46 32,58 42,46" fill="#38BDF8" />

            {/* Striking Model Silhouette & Hairstyle */}
            <g transform="translate(25, 14)">
              <ellipse cx="8" cy="11" rx="6.5" ry="8" fill="url(#skinBase)" />
              {/* Sleek High Fashion Bun */}
              <circle cx="8" cy="4" r="5" fill="#0F172A" />
            </g>

            {/* Arm with Hand on Hip */}
            <path d="M 18 52 C 8 62, 4 72, 10 82 L 18 80" fill="none" stroke="url(#skinBase)" strokeWidth="5" strokeLinecap="round" />
            <path d="M 46 52 C 54 62, 58 72, 54 82" fill="none" stroke="url(#skinBase)" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 16. PHOTOGRAPHY: Photographer Crouched with Telephoto DSLR & Lens Flare
  // =========================================================================
  if (type.includes('photography') || type.includes('photo')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Atmospheric Bokeh Environment */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Soft Colorful Bokeh Circles */}
        <circle cx="80" cy="60" r="28" fill="#38BDF8" opacity="0.15" />
        <circle cx="320" cy="80" r="38" fill="#8B5CF6" opacity="0.15" />
        <circle cx="280" cy="140" r="22" fill="#F59E0B" opacity="0.15" />

        {/* Blinding Camera Flash Burst & Lens Flare on Hover */}
        {isHovered && (
          <g transform="translate(230, 95)">
            <circle cx="0" cy="0" r="45" fill="#FFFFFF" opacity="0.7" filter="url(#cyanGlow)" />
            <line x1="-80" y1="0" x2="80" y2="0" stroke="#38BDF8" strokeWidth="2.5" opacity="0.9" />
            <line x1="0" y1="-80" x2="0" y2="80" stroke="#38BDF8" strokeWidth="2.5" opacity="0.9" />
          </g>
        )}

        {/* Photographer Crouched on One Knee */}
        <g transform="translate(100, 60)">
          {/* Kneeling Lower Body */}
          <path d="M 40 68 L 22 92 L 6 92" stroke="#1E293B" strokeWidth="11" strokeLinecap="round" />
          <path d="M 52 68 L 65 96 L 78 96" stroke="#1E293B" strokeWidth="11" strokeLinecap="round" />

          {/* Torso & Photography Vest with Pockets */}
          <path
            d="M 38 34 C 46 28, 62 28, 70 34 C 66 54, 62 70, 52 76 C 42 76, 38 70, 34 54 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />
          <rect x="42" y="44" width="8" height="10" rx="1.5" fill="#1E3A8A" />
          <rect x="54" y="44" width="8" height="10" rx="1.5" fill="#1E3A8A" />

          {/* Photographer Head Leaning into Viewfinder */}
          <g transform="translate(48, 12)">
            <ellipse cx="12" cy="12" rx="9" ry="11" fill="url(#skinBase)" />
            <path d="M 2 12 C 2 4, 12 0, 22 2 C 24 8, 24 14, 20 16 C 14 12, 6 12, 2 12 Z" fill="#0F172A" />
          </g>

          {/* Pro DSLR Camera & Massive White L-Series Telephoto Zoom Lens */}
          <g transform="translate(68, 28)">
            {/* Black Camera Body */}
            <rect x="0" y="4" width="22" height="16" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <rect x="8" y="0" width="8" height="4" rx="1" fill="#1E293B" />
            {/* White Barrel 70-200mm f/2.8 Telephoto Lens */}
            <rect x="22" y="6" width="34" height="12" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            {/* Focus Ring & Red Ring Accent */}
            <rect x="30" y="6" width="12" height="12" fill="#1E293B" />
            <line x1="52" y1="6" x2="52" y2="18" stroke="#EF4444" strokeWidth="1.5" />
            {/* Lens Hood */}
            <polygon points="56,4 66,2 66,22 56,20" fill="#0F172A" />
          </g>

          {/* Arms Holding Camera Firmly */}
          <path d="M 38 40 C 48 44, 60 44, 72 38" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 52 48 C 65 52, 78 52, 92 42" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 17. PAINTING & FINE ARTS: Artist at Wooden Easel Laying Radiant Paint Ribbon
  // =========================================================================
  if (type.includes('painting') || type.includes('fineart') || type.includes('art')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Studio Lighting & Ambient Shadow */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotGold)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Wooden A-Frame Artist Easel & Stretched Canvas */}
        <g transform="translate(230, 40)">
          {/* Wooden Easel Legs */}
          <line x1="10" y1="0" x2="-25" y2="170" stroke="url(#cricketWillow)" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="10" y1="0" x2="45" y2="170" stroke="url(#cricketWillow)" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="10" y1="0" x2="10" y2="170" stroke="#78350F" strokeWidth="3" />
          {/* Horizontal Shelf Bar */}
          <line x1="-35" y1="125" x2="55" y2="125" stroke="url(#cricketWillow)" strokeWidth="6" strokeLinecap="round" />

          {/* Stretched White Artist Canvas */}
          <rect x="-25" y="30" width="70" height="92" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />

          {/* Luminous Multicolored Paint Ribbon Sweeping across Canvas on Hover */}
          <path
            d="M -15 95 C 0 65, 20 110, 35 60"
            fill="none"
            stroke="url(#jerseyPurple)"
            strokeWidth={isHovered ? "7" : "3"}
            strokeLinecap="round"
            className="transition-all duration-600 ease-out"
          />
          <path
            d="M -15 95 C 0 65, 20 110, 35 60"
            fill="none"
            stroke="#38BDF8"
            strokeWidth={isHovered ? "3" : "1"}
            strokeLinecap="round"
            className="transition-all duration-600 ease-out"
          />
          {isHovered && (
            <circle cx="35" cy="60" r="12" fill="#F59E0B" opacity="0.4" filter="url(#goldGlow)" />
          )}
        </g>

        {/* Fine Artist Standing with Palette & Brush */}
        <g transform="translate(100, 45)">
          {/* Standing Legs */}
          <path d="M 40 85 L 36 150" stroke="#0F172A" strokeWidth="10" strokeLinecap="round" />
          <path d="M 52 85 L 56 150" stroke="#0F172A" strokeWidth="10" strokeLinecap="round" />

          {/* Artist Apron / Smock with Paint Smudges */}
          <path
            d="M 34 44 C 42 38, 60 38, 68 44 C 66 70, 64 92, 54 96 C 42 96, 38 88, 32 68 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          <circle cx="44" cy="62" r="3" fill="#38BDF8" />
          <circle cx="56" cy="74" r="2.5" fill="#EF4444" />
          <circle cx="48" cy="80" r="3.5" fill="#FBBF24" />

          {/* Artist Head & Classic Beret */}
          <g transform="translate(42, 14)">
            <ellipse cx="14" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            {/* French Artist Beret */}
            <path d="M 2 12 C 4 2, 24 2, 26 12 C 28 14, 18 16, 2 12 Z" fill="#0F172A" />
            <circle cx="14" cy="3" r="1.5" fill="#0F172A" />
          </g>

          {/* Left Hand Holding Wooden Palette */}
          <g transform="translate(18, 68)">
            {/* Kidney Palette with Paint Dabs */}
            <ellipse cx="14" cy="14" rx="18" ry="12" fill="url(#cricketWillow)" stroke="#92400E" strokeWidth="1" />
            <circle cx="6" cy="10" r="2.5" fill="#38BDF8" />
            <circle cx="12" cy="7" r="2.5" fill="#EF4444" />
            <circle cx="18" cy="7" r="2.5" fill="#FBBF24" />
            <circle cx="24" cy="11" r="2.5" fill="#10B981" />
            <circle cx="20" cy="18" r="3" fill="#0F172A" />
          </g>

          {/* Kinetic Right Hand & Fine-Tip Paintbrush */}
          <g
            className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '64px 46px',
              transform: isHovered ? 'rotate(18deg) translate(28px, 4px)' : 'rotate(0deg) translate(0px, 0px)'
            }}
          >
            {/* Extended Arm */}
            <path d="M 64 46 C 78 52, 92 56, 108 58" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
            {/* Slender Wooden Paintbrush */}
            <line x1="106" y1="58" x2="138" y2="60" stroke="#78350F" strokeWidth="2.5" />
            <polygon points="138,59 146,59 142,61" fill="#38BDF8" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 18. QUIZ: Quick-Thinking Contestant Slamming Buzzer with Radiating Rings
  // =========================================================================
  if (type.includes('quiz') && !type.includes('tech')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Quiz Show Arena Floodlights */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotGold)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Modern Quiz Show Podium */}
        <g transform="translate(180, 115)">
          {/* Curved Front Podium Panel */}
          <path d="M -30 20 L -20 85 L 60 85 L 70 20 Z" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          {/* Digital Timer / Status Screen */}
          <rect x="-10" y="35" width="60" height="24" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          <text
            x="20"
            y="51"
            fill={isHovered ? "#FBBF24" : "#38BDF8"}
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {isHovered ? "BUZZ: 0.12s" : "READY"}
          </text>

          {/* Giant Dome Buzzer Button */}
          <g transform="translate(20, 16)">
            {/* Buzzer Base */}
            <rect x="-12" y="0" width="24" height="6" rx="2" fill="#334155" />
            {/* Red / Amber Dome */}
            <path
              d="M -10 0 C -10 -8, 10 -8, 10 0 Z"
              fill={isHovered ? "#FBBF24" : "#EF4444"}
              stroke="#B45309"
              strokeWidth="1"
            />
            {/* Shockwave Rings on Strike */}
            {isHovered && (
              <g>
                <circle cx="0" cy="-4" r="22" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
                <circle cx="0" cy="-4" r="38" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.4" />
              </g>
            )}
          </g>
        </g>

        {/* Contestant Leaning Forward in Excitement */}
        <g transform="translate(110, 48)">
          {/* Torso & Collegiate Jacket */}
          <path
            d="M 32 46 C 42 40, 62 40, 72 46 C 70 75, 68 98, 62 125 C 48 125, 36 125, 26 125 C 24 98, 26 75, 32 46 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />

          {/* Contestant Head with Revelation Expression */}
          <g transform="translate(42, 14)">
            <ellipse cx="12" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 2 14 C 2 6, 12 2, 22 4 C 24 10, 24 14, 22 16 C 16 11, 8 11, 2 14 Z" fill="#0F172A" />
          </g>

          {/* Kinetic Arm Slamming Down on the Buzzer */}
          <g
            className="transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{
              transformOrigin: '68px 48px',
              transform: isHovered ? 'rotate(28deg) translate(16px, 18px)' : 'rotate(-10deg) translate(0px, 0px)'
            }}
          >
            <path d="M 68 48 C 80 58, 92 68, 102 78" fill="none" stroke="url(#skinBase)" strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="104" cy="80" rx="6" ry="4" fill="url(#skinBase)" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 19. LITERARY / DEBATE: Parliamentary Orator at Carved Mahogany Podium
  // =========================================================================
  if (type.includes('literary') || type.includes('debate')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Debate Chamber Ambient Lighting */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Carved Dark Mahogany Speech Podium */}
        <g transform="translate(195, 100)">
          {/* Tapered Pillar Body */}
          <polygon points="0,20 40,20 34,95 6,95" fill="#2E1005" stroke="#78350F" strokeWidth="2" />
          {/* Slanted Reading Tabletop */}
          <polygon points="-8,10 48,10 40,22 0,22" fill="#78350F" stroke="#B45309" strokeWidth="1" />
          {/* Brass Gooseneck Microphone */}
          <path d="M 8 10 C 6 -4, 18 -10, 24 -14" fill="none" stroke="#FBBF24" strokeWidth="2" />
          <circle cx="24" cy="-14" r="2.5" fill="#0F172A" />

          {/* COLORIDO Debate Seal on Podium Front */}
          <circle cx="20" cy="46" r="10" fill="#78350F" stroke="#FBBF24" strokeWidth="1" />
          <text x="20" y="49" fill="#FBBF24" fontSize="6" fontWeight="bold" textAnchor="middle">2K26</text>
        </g>

        {/* Eloquent Orator in Formal Blazer */}
        <g transform="translate(115, 38)">
          {/* Torso & Formal Collegiate Blazer */}
          <path
            d="M 32 50 C 42 44, 66 44, 76 50 C 74 85, 70 115, 64 140 C 48 140, 36 140, 24 140 C 22 115, 26 85, 32 50 Z"
            fill="url(#suitCharcoal)"
            stroke="#475569"
            strokeWidth="1.2"
          />
          {/* White Shirt Collar & Tie */}
          <polygon points="48,48 54,64 60,48" fill="#FFFFFF" />
          <polygon points="52,54 56,54 58,80 50,80" fill="#EF4444" />

          {/* Head with Focused Expression */}
          <g transform="translate(44, 14)">
            <ellipse cx="14" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 4 14 C 4 6, 14 2, 24 4 C 26 10, 26 14, 24 16 C 18 11, 10 11, 4 14 Z" fill="#1E293B" />
          </g>

          {/* Left Hand Resting on Podium Notes */}
          <path d="M 68 54 C 76 66, 82 82, 88 95" fill="none" stroke="url(#suitCharcoal)" strokeWidth="8" strokeLinecap="round" />

          {/* Kinetic Right Hand Making Assertive Persuasive Rhetorical Gesture */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '32px 54px',
              transform: isHovered ? 'rotate(-25deg) translate(-4px, -6px)' : 'rotate(0deg) translate(0px, 0px)'
            }}
          >
            <path d="M 32 54 C 20 48, 8 36, 0 24" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            {/* Open Palm Assertive Gesture */}
            <ellipse cx="0" cy="24" rx="4" ry="5" fill="url(#skinBase)" />
          </g>
        </g>
      </svg>
    );
  }



  // =========================================================================
  // 20. HACKATHON 24H: Late Night Developer Sprint Shipping Production MVP
  // =========================================================================
  if (type.includes('hackathon')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Dark Ambient Tech Studio & Monitor Glow */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Developer Workstation Desk */}
        <line x1="40" y1="185" x2="360" y2="185" stroke="#334155" strokeWidth="4" />

        {/* Curved Ultrawide Monitors Displaying Code & Live Terminal */}
        <g transform="translate(170, 75)">
          {/* Main IDE Monitor */}
          <rect x="0" y="0" width="130" height="85" rx="4" fill="#090D16" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="0" y1="16" x2="130" y2="16" stroke="#1E293B" strokeWidth="1" />
          {/* Window Buttons */}
          <circle cx="8" cy="8" r="2.5" fill="#EF4444" />
          <circle cx="16" cy="8" r="2.5" fill="#FBBF24" />
          <circle cx="24" cy="8" r="2.5" fill="#10B981" />

          {/* Syntax Highlighted Code Lines */}
          <g transform="translate(8, 24)">
            <rect x="0" y="0" width="28" height="4" rx="1" fill="#C084FC" />
            <rect x="32" y="0" width="45" height="4" rx="1" fill="#38BDF8" />
            <rect x="10" y="8" width="55" height="4" rx="1" fill="#FACC15" />
            <rect x="10" y="16" width="70" height="4" rx="1" fill="#4ADE80" />
            <rect x="20" y="24" width="40" height="4" rx="1" fill="#F472B6" />
            <rect x="10" y="32" width="25" height="4" rx="1" fill="#C084FC" />
          </g>

          {/* Production Deploy Badge on Hover */}
          {isHovered ? (
            <g transform="translate(15, 52)">
              <rect x="0" y="0" width="100" height="20" rx="3" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
              <text x="50" y="14" fill="#6EE7B7" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                🚀 SHIPPED TO PROD
              </text>
            </g>
          ) : (
            <g transform="translate(15, 52)">
              <rect x="0" y="0" width="85" height="18" rx="2" fill="#1E293B" />
              <text x="42" y="12" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                git push origin main
              </text>
            </g>
          )}

          {/* Steaming Coffee Mug on Desk */}
          <g transform="translate(140, 75)">
            <rect x="0" y="10" width="16" height="20" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M 16 14 C 22 14, 22 22, 16 22" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            {/* Steam Wisp */}
            <path d="M 6 4 C 4 0, 8 -4, 6 -8" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          </g>
        </g>

        {/* Primary Developer with Over-Ear Headphones */}
        <g transform="translate(85, 60)">
          {/* Developer Torso with COLORIDO Tech Hoodie */}
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />

          {/* Head & Over-Ear Noise Cancelling Headphones */}
          <g transform="translate(43, 14)">
            <ellipse cx="14" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 4 14 C 4 6, 14 2, 24 4 C 26 10, 26 14, 24 16 C 18 11, 10 11, 4 14 Z" fill="#0F172A" />
            {/* Headphones Band & Ear Cups */}
            <path d="M 2 12 C 4 2, 24 2, 26 12" fill="none" stroke="#38BDF8" strokeWidth="3" />
            <ellipse cx="3" cy="14" rx="3.5" ry="5" fill="#0F172A" />
            <ellipse cx="25" cy="14" rx="3.5" ry="5" fill="#0F172A" />
          </g>

          {/* Mechanical Keyboard Underglow */}
          <rect x="75" y="115" width="45" height="10" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />

          {/* Kinetic Typing Arms */}
          <g
            className="transition-transform duration-300 ease-out"
            style={{
              transformOrigin: '70px 52px',
              transform: isHovered ? 'translate(4px, -2px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 68 52 C 80 65, 88 85, 96 114" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M 38 52 C 50 65, 62 85, 78 114" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            {/* Fingers on Home Row */}
            <ellipse cx="98" cy="115" rx="4" ry="2.5" fill="url(#skinBase)" />
            <ellipse cx="76" cy="115" rx="4" ry="2.5" fill="url(#skinBase)" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 21. CODING CONTEST: Algorithmic Coder with Test Suite Accepted [100%]
  // =========================================================================
  if (type.includes('coding') && !type.includes('relay')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Terminal Green & Cyan Lighting */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Large Code Judge Window */}
        <g transform="translate(170, 65)">
          <rect x="0" y="0" width="145" height="95" rx="4" fill="#090D16" stroke="#10B981" strokeWidth="1.5" />
          <line x1="0" y1="16" x2="145" y2="16" stroke="#1E293B" strokeWidth="1" />
          <text x="12" y="12" fill="#10B981" fontSize="8" fontFamily="monospace">ONLINE JUDGE - PROBLEM D</text>

          {/* Test Case Execution Badges */}
          <g transform="translate(12, 28)">
            <text x="0" y="10" fill={isHovered ? "#34D399" : "#94A3B8"} fontSize="9" fontFamily="monospace">
              {isHovered ? "✓ TEST 1: PASSED (0.01s)" : "• TEST 1: RUNNING"}
            </text>
            <text x="0" y="24" fill={isHovered ? "#34D399" : "#94A3B8"} fontSize="9" fontFamily="monospace">
              {isHovered ? "✓ TEST 2: PASSED (0.02s)" : "• TEST 2: QUEUED"}
            </text>
            <text x="0" y="38" fill={isHovered ? "#34D399" : "#94A3B8"} fontSize="9" fontFamily="monospace">
              {isHovered ? "✓ TEST 3: PASSED (0.01s)" : "• TEST 3: QUEUED"}
            </text>

            {/* Verdict Box */}
            <g transform="translate(0, 46)">
              <rect
                x="0"
                y="0"
                width="120"
                height="16"
                rx="2"
                fill={isHovered ? "#065F46" : "#1E293B"}
                stroke={isHovered ? "#10B981" : "#475569"}
                strokeWidth="1"
              />
              <text x="60" y="11" fill={isHovered ? "#A7F3D0" : "#94A3B8"} fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {isHovered ? "ACCEPTED [100/100 PTS]" : "EVALUATING CODE..."}
              </text>
            </g>
          </g>
        </g>

        {/* Competitive Coder in Laser Focus */}
        <g transform="translate(75, 55)">
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyPurple)"
            stroke="#7C3AED"
            strokeWidth="1.2"
          />

          {/* Focused Head */}
          <g transform="translate(43, 14)">
            <ellipse cx="14" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 4 14 C 4 6, 14 2, 24 4 C 26 10, 26 14, 24 16 C 18 11, 10 11, 4 14 Z" fill="#0F172A" />
          </g>

          {/* Typing Hands */}
          <path d="M 68 52 C 80 65, 88 85, 96 114" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M 38 52 C 50 65, 62 85, 78 114" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 22. DEBUGGING CONTEST: Diagnostic Loupe Converting Red Error to Green Shield
  // =========================================================================
  if (type.includes('debugging')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        <polygon points="120,0 280,0 370,230 30,230" fill={isHovered ? "url(#spotCyan)" : "url(#spotCrimson)"} className="transition-all duration-500" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Stack Trace Diagnostic Terminal */}
        <g transform="translate(170, 65)">
          <rect
            x="0"
            y="0"
            width="145"
            height="95"
            rx="4"
            fill="#090D16"
            stroke={isHovered ? "#10B981" : "#EF4444"}
            strokeWidth="1.5"
            className="transition-colors duration-500"
          />
          <line x1="0" y1="16" x2="145" y2="16" stroke="#1E293B" strokeWidth="1" />
          <text x="12" y="12" fill={isHovered ? "#10B981" : "#EF4444"} fontSize="8" fontFamily="monospace">
            {isHovered ? "DIAGNOSTIC STATUS: CLEAN" : "EXCEPTION TRACE - CORE DUMP"}
          </text>

          {/* Error / Verified State Details */}
          <g transform="translate(12, 30)">
            <text x="0" y="10" fill={isHovered ? "#34D399" : "#F87171"} fontSize="8.5" fontFamily="monospace">
              {isHovered ? "✓ NullPointer resolved at L:142" : "⚠ NullPointer in auth_token.c"}
            </text>
            <text x="0" y="24" fill={isHovered ? "#34D399" : "#F87171"} fontSize="8.5" fontFamily="monospace">
              {isHovered ? "✓ Memory leak: 0 bytes leaked" : "⚠ Leak: 4096 bytes unfreed"}
            </text>

            {/* Resolved Shield Banner on Hover */}
            <g transform="translate(0, 40)">
              <rect
                x="0"
                y="0"
                width="120"
                height="18"
                rx="2"
                fill={isHovered ? "#065F46" : "#7F1D1D"}
                stroke={isHovered ? "#10B981" : "#DC2626"}
                strokeWidth="1"
              />
              <text x="60" y="12" fill={isHovered ? "#A7F3D0" : "#FCA5A5"} fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {isHovered ? "0 BUGS • PATCH VERIFIED" : "FIX REQUIRED [FAILING]"}
              </text>
            </g>
          </g>
        </g>

        {/* Debugger with Holographic Diagnostic Loupe */}
        <g transform="translate(75, 55)">
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />

          {/* Head & Glasses Frame with Monitor Reflection */}
          <g transform="translate(43, 14)">
            <ellipse cx="14" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 4 14 C 4 6, 14 2, 24 4 C 26 10, 26 14, 24 16 C 18 11, 10 11, 4 14 Z" fill="#0F172A" />
            {/* Glasses */}
            <rect x="18" y="12" width="6" height="5" rx="1" fill="none" stroke="#38BDF8" strokeWidth="1" />
          </g>

          {/* Kinetic Arm Holding Diagnostic Tool */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '68px 52px',
              transform: isHovered ? 'translate(14px, -6px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 68 52 C 82 58, 96 66, 108 72" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            {/* Magnifying Loupe */}
            <circle cx="114" cy="74" r="8" fill="none" stroke="#38BDF8" strokeWidth="2" />
            <line x1="120" y1="80" x2="126" y2="86" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 23. TECH QUIZ: Contestant with Digital Circuits & Logic Gate Projections
  // =========================================================================
  if (type.includes('techquiz') || type.includes('tech-quiz')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Digital Holographic Logic Circuit Traces */}
        <g transform="translate(180, 50)" opacity={isHovered ? "0.9" : "0.4"} className="transition-opacity duration-500">
          <line x1="0" y1="20" x2="40" y2="20" stroke="#38BDF8" strokeWidth="2" />
          <line x1="0" y1="45" x2="40" y2="45" stroke="#38BDF8" strokeWidth="2" />
          {/* AND Gate Silhouette */}
          <path d="M 40 10 L 60 10 C 75 10, 75 55, 60 55 L 40 55 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="72" y1="32" x2="110" y2="32" stroke="#FACC15" strokeWidth="2" />
          <circle cx="110" cy="32" r="4" fill="#FACC15" />
          {isHovered && (
            <text x="56" y="85" fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              CORRECT +50 PTS
            </text>
          )}
        </g>

        {/* Contestant at Podium */}
        <g transform="translate(90, 50)">
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />
          <ellipse cx="53" cy="24" rx="10" ry="12" fill="url(#skinBase)" />
          {/* Buzzer Press */}
          <path d="M 68 52 C 82 62, 94 72, 102 78" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 24. PAPER PRESENTATION: Researcher Pointing Laser at 3D Accuracy Graph
  // =========================================================================
  if (type.includes('paper') || type.includes('presentation')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        {/* Conference Hall Spotlight */}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* 16:9 Presentation Projection Screen */}
        <g transform="translate(170, 45)">
          <rect x="0" y="0" width="145" height="90" rx="3" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
          <text x="12" y="16" fill="#FBBF24" fontSize="8" fontWeight="bold">IEEE SYMPOSIUM: 2K26</text>

          {/* 3D Bar Graph Animating Upward */}
          <g transform="translate(20, 28)">
            <line x1="0" y1="45" x2="105" y2="45" stroke="#64748B" strokeWidth="1" />
            <rect x="10" y={isHovered ? "20" : "32"} width="14" height={isHovered ? "25" : "13"} fill="#3B82F6" className="transition-all duration-500" />
            <rect x="35" y={isHovered ? "12" : "28"} width="14" height={isHovered ? "33" : "17"} fill="#8B5CF6" className="transition-all duration-500" />
            <rect x="60" y={isHovered ? "4" : "22"} width="14" height={isHovered ? "41" : "23"} fill="#10B981" className="transition-all duration-500" />
            {isHovered && (
              <text x="67" y="0" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">99.4%</text>
            )}
          </g>
        </g>

        {/* Engineering Researcher Presenting */}
        <g transform="translate(80, 45)">
          {/* Formal Attire */}
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 135 C 48 135, 36 135, 26 135 C 24 100, 26 75, 32 46 Z"
            fill="url(#suitCharcoal)"
            stroke="#475569"
            strokeWidth="1.2"
          />
          <ellipse cx="53" cy="24" rx="10" ry="12" fill="url(#skinBase)" />

          {/* Kinetic Laser Pointer Hand */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '68px 50px',
              transform: isHovered ? 'rotate(-12deg) translate(8px, -4px)' : 'rotate(0deg) translate(0px, 0px)'
            }}
          >
            <path d="M 68 50 C 82 46, 96 40, 112 36" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            {/* Wireless Remote Clicker */}
            <rect x="110" y="32" width="10" height="6" rx="1.5" fill="#0F172A" />
            {/* Red Laser Beam Dot on Graph */}
            {isHovered && (
              <line x1="120" y1="35" x2="250" y2="72" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2" />
            )}
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 25. PROJECT EXPO: Maker Soldering 4-Axis Robotic Arm Mechanism
  // =========================================================================
  if (type.includes('projectexpo') || type.includes('project-expo') || type.includes('expo')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotGold)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Articulating Robotic Arm Mechanism on Workbench */}
        <g transform="translate(230, 95)">
          <rect x="-20" y="60" width="80" height="12" rx="2" fill="#334155" />
          {/* Base Servo */}
          <circle cx="20" cy="55" r="12" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
          {/* Lower Arm Segment */}
          <line x1="20" y1="55" x2="35" y2="15" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
          {/* Elbow Joint */}
          <circle cx="35" cy="15" r="8" fill="#F59E0B" />
          {/* Upper Arm Gripper Segment */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '35px 15px',
              transform: isHovered ? 'rotate(25deg)' : 'rotate(0deg)'
            }}
          >
            <line x1="35" y1="15" x2="65" y2="-10" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
            {/* Gripper Claws */}
            <path d="M 65 -10 L 72 -18 L 76 -14" fill="none" stroke="#64748B" strokeWidth="2.5" />
            <path d="M 65 -10 L 72 -2 L 76 -6" fill="none" stroke="#64748B" strokeWidth="2.5" />
          </g>
        </g>

        {/* Hardware Engineer with Soldering Tool */}
        <g transform="translate(100, 55)">
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyAmber)"
            stroke="#EA580C"
            strokeWidth="1.2"
          />
          <ellipse cx="53" cy="24" rx="10" ry="12" fill="url(#skinBase)" />

          {/* Soldering Hand Extending to Mechanism */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '68px 52px',
              transform: isHovered ? 'translate(22px, 8px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 68 52 C 82 62, 96 74, 114 82" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            {/* Soldering Iron with Heat Glow */}
            <line x1="112" y1="82" x2="135" y2="92" stroke="#64748B" strokeWidth="3" />
            <circle cx="136" cy="93" r="2.5" fill="#EF4444" />
            {isHovered && (
              <circle cx="136" cy="93" r="10" fill="#F59E0B" opacity="0.4" filter="url(#goldGlow)" />
            )}
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 26. UI/UX CHALLENGE: Designer Sculpting Mobile Screen with Vector Stylus
  // =========================================================================
  if (type.includes('uiux') || type.includes('ui-ux') || type.includes('design')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Graphics Display Tablet with Mobile App Canvas */}
        <g transform="translate(180, 55)">
          <rect x="0" y="0" width="130" height="95" rx="5" fill="#090D16" stroke="#8B5CF6" strokeWidth="1.5" />
          {/* Mobile Screen Mockup */}
          <rect x="25" y="10" width="45" height="75" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          <rect x="30" y="18" width="35" height="18" rx="3" fill="#38BDF8" opacity="0.8" />
          <rect x="30" y="42" width="22" height="4" rx="1" fill="#FFFFFF" />
          <rect x="30" y="50" width="30" height="3" rx="1" fill="#94A3B8" />

          {/* Interactive Bezier Vector Curve with Anchor Handles */}
          <path
            d={isHovered ? "M 75 35 C 90 20, 100 65, 120 40" : "M 75 45 C 90 40, 100 55, 120 48"}
            fill="none"
            stroke="#F472B6"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />
          <circle cx="75" cy="35" r="2.5" fill="#38BDF8" />
          <circle cx="120" cy="40" r="2.5" fill="#38BDF8" />
        </g>

        {/* UI Designer with Digital Stylus */}
        <g transform="translate(85, 55)">
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyPurple)"
            stroke="#7C3AED"
            strokeWidth="1.2"
          />
          <ellipse cx="53" cy="24" rx="10" ry="12" fill="url(#skinBase)" />

          {/* Kinetic Stylus Arm Drawing Curve */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '68px 50px',
              transform: isHovered ? 'translate(26px, 8px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 68 50 C 82 58, 96 68, 112 76" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            <line x1="110" y1="74" x2="128" y2="60" stroke="#F8FAFC" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 27. WEB DEVELOPMENT: Full-Stack Developer with Live Hot-Reloading Viewport
  // =========================================================================
  if (type.includes('webdev') || type.includes('web-development')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* Split-Screen Code & Chrome Viewport */}
        <g transform="translate(160, 60)">
          {/* Browser Window */}
          <rect x="0" y="0" width="155" height="95" rx="4" fill="#090D16" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="0" y1="16" x2="155" y2="16" stroke="#1E293B" strokeWidth="1" />
          <text x="12" y="12" fill="#38BDF8" fontSize="8" fontFamily="monospace">localhost:5173 - COLORIDO</text>

          {/* Rendered Responsive Card Elements */}
          <g transform="translate(15, 26)">
            <rect x="0" y="0" width="58" height="55" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <rect x="68" y="0" width="58" height="55" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <circle cx="29" cy="20" r="10" fill="#38BDF8" />
            <circle cx="97" cy="20" r="10" fill="#8B5CF6" />
          </g>

          {/* Hot Reload Status Badge */}
          {isHovered && (
            <g transform="translate(35, 66)">
              <rect x="0" y="0" width="85" height="15" rx="2" fill="#065F46" />
              <text x="42" y="11" fill="#A7F3D0" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                ⚡ HOT RELOAD (12ms)
              </text>
            </g>
          )}
        </g>

        {/* Web Developer Character */}
        <g transform="translate(75, 55)">
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />
          <ellipse cx="53" cy="24" rx="10" ry="12" fill="url(#skinBase)" />
          <path d="M 68 52 C 80 65, 88 85, 96 114" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 28. AI / ML CHALLENGE: AI Scientist Manipulating 3D Holographic Synapses
  // =========================================================================
  if (type.includes('aiml') || type.includes('ai-ml') || type.includes('ai') || type.includes('neural')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotPurple)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* 3D Holographic Neural Network Synaptic Graph */}
        <g transform="translate(170, 50)">
          {/* Synaptic Connection Lines */}
          <line x1="20" y1="20" x2="70" y2="45" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
          <line x1="20" y1="75" x2="70" y2="45" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
          <line x1="70" y1="45" x2="125" y2="30" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.85" />
          <line x1="70" y1="45" x2="125" y2="65" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.85" />

          {/* Input Nodes */}
          <circle cx="20" cy="20" r="10" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="20" cy="75" r="10" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />

          {/* Hidden Deep Layer Attention Node */}
          <circle
            cx="70"
            cy="45"
            r={isHovered ? "16" : "12"}
            fill="#7C3AED"
            stroke="#C084FC"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />

          {/* Output Nodes */}
          <circle cx="125" cy="30" r="11" fill="#065F46" stroke="#34D399" strokeWidth="2" />
          <circle cx="125" cy="65" r="11" fill="#065F46" stroke="#34D399" strokeWidth="2" />

          {/* Epoch Counter Floating Text on Hover */}
          {isHovered && (
            <text x="70" y="92" fill="#C084FC" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              EPOCH 100/100 • LOSS: 0.002
            </text>
          )}
        </g>

        {/* AI Scientist with Neural Augmented Visor */}
        <g transform="translate(75, 55)">
          <path
            d="M 32 46 C 42 40, 64 40, 74 46 C 72 75, 70 100, 64 125 C 48 125, 36 125, 26 125 C 24 100, 26 75, 32 46 Z"
            fill="url(#jerseyPurple)"
            stroke="#7C3AED"
            strokeWidth="1.2"
          />
          {/* Head & Holographic Visor */}
          <g transform="translate(43, 14)">
            <ellipse cx="14" cy="14" rx="10" ry="12" fill="url(#skinBase)" />
            <path d="M 4 14 C 4 6, 14 2, 24 4 C 26 10, 26 14, 24 16 C 18 11, 10 11, 4 14 Z" fill="#0F172A" />
            {/* Glowing Visor */}
            <rect x="16" y="11" width="12" height="6" rx="2" fill="#38BDF8" opacity="0.9" />
          </g>

          {/* Arms Manipulating Floating Tensors in Space */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transformOrigin: '68px 50px',
              transform: isHovered ? 'translate(24px, -12px)' : 'translate(0px, 0px)'
            }}
          >
            <path d="M 68 50 C 82 45, 96 38, 114 30" fill="none" stroke="url(#skinBase)" strokeWidth="6.5" strokeLinecap="round" />
            <circle cx="114" cy="30" r="4" fill="url(#skinBase)" />
          </g>
        </g>
      </svg>
    );
  }

  // =========================================================================
  // 29. CODE RELAY: Fast-Paced Team Coding Station with Baton Handoff
  // =========================================================================
  if (type.includes('coderelay') || type.includes('code-relay') || type.includes('relay')) {
    return (
      <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
        {defs}
        <polygon points="120,0 280,0 370,230 30,230" fill="url(#spotCyan)" />
        <ellipse cx="200" cy="205" rx="180" ry="24" fill="#0F172A" opacity="0.6" />

        {/* 10:00 Shift Countdown Timer */}
        <g transform="translate(200, 45)">
          <rect x="-35" y="0" width="70" height="22" rx="3" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="0" y="15" fill="#FBBF24" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            {isHovered ? "TAG: ROTATE" : "10:00 MIN"}
          </text>
        </g>

        {/* Teammate 1 (Outgoing Coder Tagging Out) */}
        <g transform="translate(85, 65)">
          <path d="M 28 42 C 38 38, 56 38, 64 42 L 58 105 L 24 105 Z" fill="url(#jerseyRoyal)" />
          <ellipse cx="46" cy="22" rx="9" ry="11" fill="url(#skinBase)" />
          {/* Tagging Arm */}
          <path d="M 58 48 C 72 52, 85 55, 98 52" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Teammate 2 (Incoming Coder Stepping Up to Keyboard) */}
        <g
          className="transition-transform duration-500 ease-out"
          style={{
            transformOrigin: '210px 100px',
            transform: isHovered ? 'translate(-14px, 0px)' : 'translate(0px, 0px)'
          }}
        >
          <g transform="translate(185, 65)">
            <path d="M 28 42 C 38 38, 56 38, 64 42 L 58 105 L 24 105 Z" fill="url(#jerseyPurple)" />
            <ellipse cx="46" cy="22" rx="9" ry="11" fill="url(#skinBase)" />
            {/* Hands Reaching for Home Row */}
            <path d="M 28 48 C 18 58, 12 75, 10 95" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }



  // =========================================================================
  // 30. DEFAULT / GRAND FINALE: Champion Hoisting Golden COLORIDO 2K26 Cup
  // =========================================================================
  return (
    <svg viewBox="0 0 400 230" className="w-full h-full max-h-60" fill="none">
      {defs}
      {/* Golden Celebration Arena Floodlight */}
      <polygon points="100,0 300,0 390,230 10,230" fill="url(#spotGold)" />
      <ellipse cx="200" cy="205" rx="180" ry="24" fill="#000000" opacity="0.6" />

      {/* Triple-Tiered Winner Podium */}
      <g transform="translate(130, 145)">
        {/* 2nd Place Silver Tier */}
        <path d="M 0 35 L 45 35 L 45 60 L 0 60 Z" fill="#334155" stroke="#64748B" strokeWidth="1" />
        <text x="22" y="52" fill="#94A3B8" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>

        {/* 1st Place Gold Champion Tier */}
        <path d="M 45 15 L 95 15 L 95 60 L 45 60 Z" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="70" y="42" fill="#FBBF24" fontSize="16" fontWeight="bold" textAnchor="middle">1</text>

        {/* 3rd Place Bronze Tier */}
        <path d="M 95 42 L 140 42 L 140 60 L 95 60 Z" fill="#334155" stroke="#64748B" strokeWidth="1" />
        <text x="117" y="56" fill="#94A3B8" fontSize="11" fontWeight="bold" textAnchor="middle">3</text>
      </g>

      {/* Confetti Celebration Bursts on Hover */}
      {isHovered && (
        <g>
          {/* Confetti Ribbon Streamers */}
          <path d="M 60 40 Q 80 80 65 120" stroke="#FBBF24" strokeWidth="3" fill="none" strokeDasharray="6 4" />
          <path d="M 340 50 Q 320 90 335 130" stroke="#38BDF8" strokeWidth="3" fill="none" strokeDasharray="6 4" />
          <circle cx="100" cy="70" r="4" fill="#C084FC" />
          <circle cx="300" cy="65" r="4.5" fill="#F472B6" />
          <circle cx="140" cy="40" r="3.5" fill="#34D399" />
          <circle cx="260" cy="35" r="3.5" fill="#FBBF24" />
        </g>
      )}

      {/* Champion Standing Tall atop 1st Place Podium */}
      <g
        className="transition-transform duration-600 cubic-bezier(0.16, 1, 0.3, 1)"
        style={{
          transformOrigin: '200px 145px',
          transform: isHovered ? 'scale(1.06)' : 'scale(1)'
        }}
      >
        <g transform="translate(175, 25)">
          {/* Legs on Top Step */}
          <path d="M 18 80 L 18 135" stroke="url(#jerseyRoyal)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 32 80 L 32 135" stroke="url(#jerseyRoyal)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 14 135 L 22 135 Z" stroke="#0F172A" strokeWidth="4" />
          <path d="M 28 135 L 36 135 Z" stroke="#0F172A" strokeWidth="4" />

          {/* Athletic Torso & Royal Jersey with Gold Sash */}
          <path
            d="M 14 42 C 20 36, 30 36, 36 42 C 34 65, 32 85, 28 95 C 22 95, 18 95, 12 95 C 10 85, 10 65, 14 42 Z"
            fill="url(#jerseyRoyal)"
            stroke="#1D4ED8"
            strokeWidth="1.2"
          />
          {/* Gold Sash */}
          <line x1="14" y1="44" x2="32" y2="82" stroke="#FBBF24" strokeWidth="3" />

          {/* Champion Head & Triumphant Smile */}
          <g transform="translate(14, 12)">
            <ellipse cx="11" cy="13" rx="9" ry="11" fill="url(#skinBase)" />
            <path d="M 2 13 C 2 5, 10 1, 20 3 C 22 8, 22 13, 20 15 C 14 10, 6 10, 2 13 Z" fill="#0F172A" />
          </g>

          {/* Raised Arms Hoisting the Golden Trophy */}
          <path d="M 14 44 C 4 32, -4 16, 8 2" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 36 44 C 46 32, 54 16, 42 2" fill="none" stroke="url(#skinBase)" strokeWidth="6" strokeLinecap="round" />

          {/* Golden COLORIDO 2K26 Championship Trophy */}
          <g transform="translate(12, -26)">
            {/* Cup Body with Laurel Engravings */}
            <path d="M 0 0 L 26 0 L 22 22 C 20 28, 6 28, 4 22 Z" fill="url(#goldMetallic)" stroke="#B45309" strokeWidth="1.5" />
            {/* Dual Sweeping Handles */}
            <path d="M -2 4 C -12 8, -6 20, 2 18" fill="none" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 28 4 C 38 8, 32 20, 24 18" fill="none" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
            {/* Pedestal Stem & Base */}
            <rect x="10" y="27" width="6" height="8" fill="#D97706" />
            <rect x="4" y="35" width="18" height="6" rx="2" fill="#78350F" stroke="#B45309" strokeWidth="1" />

            {/* Radiant Star Flares on Trophy on Hover */}
            {isHovered && (
              <g transform="translate(13, 10)">
                <circle cx="0" cy="0" r="16" fill="#FBBF24" opacity="0.4" filter="url(#goldGlow)" />
                <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" fill="#FFFFFF" />
              </g>
            )}
          </g>
        </g>
      </g>
    </svg>
  );

}
