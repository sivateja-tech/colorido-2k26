const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Read RVR&JC Logo as Base64 if available
let logoBase64 = '';
const logoPath = path.join(__dirname, 'rvrjc_logo.png');
if (fs.existsSync(logoPath)) {
  const logoBuf = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuf.toString('base64')}`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>COLORIDO 2K26 — Complete Feature Specification & System Documentation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    @page {
      size: A4;
      margin: 14mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.55;
      font-size: 10.5pt;
      background: #ffffff;
    }

    .cover {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cover-left {
      max-width: 75%;
    }

    .inst-badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
      border: 1px solid #bfdbfe;
    }

    h1 {
      font-size: 22pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.2;
      margin-bottom: 6px;
    }

    .subtitle {
      font-size: 11pt;
      color: #64748b;
      font-weight: 500;
    }

    .cover-right img {
      height: 75px;
      object-fit: contain;
    }

    .meta-bar {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 16px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      font-size: 9pt;
    }

    .meta-item strong {
      display: block;
      color: #475569;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meta-item span {
      color: #0f172a;
      font-weight: 600;
    }

    .section-title {
      font-size: 13.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 24px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      page-break-after: avoid;
    }

    .section-num {
      background: #3b82f6;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      margin-right: 10px;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }

    .feature-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      padding: 10px 14px;
      page-break-inside: avoid;
    }

    .feature-card.amber { border-left-color: #f59e0b; }
    .feature-card.emerald { border-left-color: #10b981; }
    .feature-card.indigo { border-left-color: #6366f1; }
    .feature-card.rose { border-left-color: #f43f5e; }
    .feature-card.purple { border-left-color: #a855f7; }

    .feature-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .feature-title {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }

    .badge {
      font-size: 7.5pt;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px;
      background: #f1f5f9;
      color: #475569;
    }

    .feature-desc {
      font-size: 9pt;
      color: #334155;
      line-height: 1.45;
    }

    .sub-list {
      margin-top: 6px;
      margin-left: 18px;
      font-size: 8.5pt;
      color: #475569;
    }

    .sub-list li {
      margin-bottom: 3px;
    }

    .tournament-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }

    .tournament-table th, .tournament-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }

    .tournament-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }

    .page-break {
      page-break-before: always;
    }

    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- Cover Header -->
  <div class="cover">
    <div class="cover-left">
      <div class="inst-badge">R.V.R. & J.C. College of Engineering (Autonomous)</div>
      <h1>COLORIDO 2K26</h1>
      <div class="subtitle">Complete Feature Specification & Architectural Documentation</div>
    </div>
    <div class="cover-right">
      ${logoBase64 ? `<img src="${logoBase64}" alt="RVR&JC Logo">` : ''}
    </div>
  </div>

  <!-- Meta Information Bar -->
  <div class="meta-bar">
    <div class="meta-item">
      <strong>Festival Dates</strong>
      <span>October 15–17, 2026</span>
    </div>
    <div class="meta-item">
      <strong>Official Competitions</strong>
      <span>29 Tournaments</span>
    </div>
    <div class="meta-item">
      <strong>Platform Release</strong>
      <span>Version 2.0 (Production)</span>
    </div>
    <div class="meta-item">
      <strong>Architecture</strong>
      <span>React 18 + Node + PostgreSQL</span>
    </div>
  </div>

  <!-- Section 1 -->
  <div class="section-title">
    <span class="section-num">01</span> Authentication & Security Features
  </div>
  <div class="feature-grid">
    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Student Registration & Onboarding</span>
        <span class="badge">Auth</span>
      </div>
      <div class="feature-desc">Comprehensive multi-field student sign-up capturing verified name, collegiate email, college institution name, degree course, engineering department, graduation year, and phone number with client and server validations.</div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">One-Click Google OAuth 2.0</span>
        <span class="badge">Google Identity</span>
      </div>
      <div class="feature-desc">Seamless one-tap authentication verifying student Google ID tokens using Google's official Auth Library. Auto-populates profile avatar and institutional email.</div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Smart "Forgot Password" System</span>
        <span class="badge">UX Safety</span>
      </div>
      <div class="feature-desc">Validates if an email exists in the PostgreSQL database. If non-existent, it alerts the user and smoothly redirects them to "Create Account" instead of sending ghost links. If valid, issues a time-expiring cryptographic reset token.</div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Stateless JWT Authorization & RBAC</span>
        <span class="badge">Security</span>
      </div>
      <div class="feature-desc">Employs cryptographically signed JSON Web Tokens (JWT) carried in Axios bearer request headers. Strict Role-Based Access Control separates regular students (USER) from faculty convenors (ADMIN).</div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Password Hashing & API Rate Limiting</span>
        <span class="badge">Hardening</span>
      </div>
      <div class="feature-desc">Passwords encrypted using Bcrypt with 10 salt rounds (zero plaintext credentials). Express-Rate-Limit defends login and registration routes against brute-force attacks and bot spam.</div>
    </div>
  </div>

  <!-- Section 2 -->
  <div class="section-title">
    <span class="section-num">02</span> Public Discovery & Homepage Features
  </div>
  <div class="feature-grid">
    <div class="feature-card amber">
      <div class="feature-header">
        <span class="feature-title">Live Festival Countdown Ticker</span>
        <span class="badge">Real-Time</span>
      </div>
      <div class="feature-desc">High-precision interactive countdown timer calculating days, hours, minutes, and seconds until the festival inauguration on October 15, 2026.</div>
    </div>

    <div class="feature-card amber">
      <div class="feature-header">
        <span class="feature-title">Dynamic Festival Stats Showcase</span>
        <span class="badge">Metrics</span>
      </div>
      <div class="feature-desc">Animated metric counters highlighting 29 Official Competitions, ₹5,00,000+ Prize Pool, 3 Action-Packed Days, and 5,000+ Expected Participants.</div>
    </div>

    <div class="feature-card amber">
      <div class="feature-header">
        <span class="feature-title">Interactive Category Matrix</span>
        <span class="badge">Discovery</span>
      </div>
      <div class="feature-desc">Visual preview cards with gradient glows and quick filters across Sports (9), Cultural (10), and Technical (10) domains with direct deep-links.</div>
    </div>

    <div class="feature-card amber">
      <div class="feature-header">
        <span class="feature-title">Campus Venue Map & Directions</span>
        <span class="badge">Logistics</span>
      </div>
      <div class="feature-desc">Interactive campus guide helping visiting students locate cricket grounds, indoor sports stadiums, open-air auditoriums, and high-performance coding labs.</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- Section 3 -->
  <div class="section-title">
    <span class="section-num">03</span> Official 29 Competitions Directory (/events)
  </div>

  <p style="font-size: 8.5pt; color: #475569; margin-bottom: 10px;">The platform manages all 29 official multi-tier competitions scheduled for October 15–17, 2026 with real-time capacity monitoring and instant keyword search:</p>

  <table class="tournament-table">
    <thead>
      <tr>
        <th style="width: 20%;">Category</th>
        <th style="width: 50%;">Official Events</th>
        <th style="width: 30%;">Highlights & Team Format</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Sports (9)</strong></td>
        <td>Cricket, Football, Basketball, Volleyball, Kabaddi, Badminton, Table Tennis, Chess, Athletics (100m)</td>
        <td>Turf wickets, indoor stadium, official association referees, knockout to finals.</td>
      </tr>
      <tr>
        <td><strong>Cultural (10)</strong></td>
        <td>Dance Fiesta, Classical Solo, Battle of Bands, Vocal Solo, Fashion Walk, Street Play, Stand-up Comedy, Fine Arts, Short Film, Photography</td>
        <td>Amphitheatre main stage, acoustic line arrays, jury scoring, multi-tier prelims.</td>
      </tr>
      <tr>
        <td><strong>Technical (10)</strong></td>
        <td>24H Hackathon, Code Sprint, RoboWars, Paper Presentation, Web Sprint UI/UX, AI/ML Challenge, Circuit Mania, CAD/CAM Modeling, Technical Quiz, IoT Expo</td>
        <td>High-performance labs, industry mentor reviews, hardware kits, live jury demo.</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 14px;" class="feature-grid">
    <div class="feature-card emerald">
      <div class="feature-header">
        <span class="feature-title">Instant Filtering & Live Search</span>
        <span class="badge">Fast UI</span>
      </div>
      <div class="feature-desc">Filter by All (29), Sports (9), Cultural (10), and Technical (10) tabs or search instantly by event name, keywords, or venue without page reloading.</div>
    </div>

    <div class="feature-card emerald">
      <div class="feature-header">
        <span class="feature-title">Dynamic Tournament Cards</span>
        <span class="badge">Framer Motion</span>
      </div>
      <div class="feature-desc">Animated cards with physics-based hover effects, glowing borders, prize pool badges, team size requirements (e.g. 11–15 for Cricket), and live registration capacity bars (e.g. 14 / 32 filled).</div>
    </div>
  </div>

  <!-- Section 4 -->
  <div class="section-title">
    <span class="section-num">04</span> Tournament Deep-Dive Pages (/events/:slug)
  </div>
  <div class="feature-grid">
    <div class="feature-card indigo">
      <div class="feature-header">
        <span class="feature-title">Round-by-Round Progression Matrix</span>
        <span class="badge">Schedules</span>
      </div>
      <div class="feature-desc">Breaks each tournament into distinct stages: Round 1 (Qualifiers), Round 2 (Knockouts/Semis), Round 3 (Grand Finals) with exact dates (Oct 15–17), timings, match durations, and qualification criteria.</div>
    </div>

    <div class="feature-card indigo">
      <div class="feature-header">
        <span class="feature-title">Official Organizers & Coordinator Cards</span>
        <span class="badge">Direct Help</span>
      </div>
      <div class="feature-desc">Dedicated contact cards for Faculty Convenor, Student Coordinator, and Official Arbiter/Jury with one-click phone call (tel:) and direct email (mailto:) buttons.</div>
    </div>

    <div class="feature-card indigo">
      <div class="feature-header">
        <span class="feature-title">Rulebooks & Event-Specific FAQs</span>
        <span class="badge">Guidelines</span>
      </div>
      <div class="feature-desc">Comprehensive eligibility criteria, scoring rubrics, equipment guidelines, and accordion FAQs addressing rain contingency, sports kits, and audio submissions.</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- Section 5 -->
  <div class="section-title">
    <span class="section-num">05</span> Registration & Dynamic QR Ticketing Pipeline
  </div>
  <div class="feature-grid">
    <div class="feature-card rose">
      <div class="feature-header">
        <span class="feature-title">Dynamic Solo & Team Roster Builder</span>
        <span class="badge">Booking</span>
      </div>
      <div class="feature-desc">Adaptive registration modal supporting solo participants and multi-member squads with dynamic teammate inputs, student ID validation, and auto-populated profiles.</div>
    </div>

    <div class="feature-card rose">
      <div class="feature-header">
        <span class="feature-title">Zero-Duplicate Registration Guard</span>
        <span class="badge">SQL Integrity</span>
      </div>
      <div class="feature-desc">Enforces a database-level composite unique constraint [eventId, email] that strictly prevents students from double-booking slots or hoarding team seats.</div>
    </div>

    <div class="feature-card rose">
      <div class="feature-header">
        <span class="feature-title">Cryptographic SVG QR Ticket Generation</span>
        <span class="badge">Gate Pass</span>
      </div>
      <div class="feature-desc">Generates a globally unique alphanumeric pass code (e.g. COL26-V8R2J) and an instant dynamic SVG QR code containing encrypted validation payload for gate scanners. Includes canvas-confetti particle celebrations.</div>
    </div>
  </div>

  <!-- Section 6 -->
  <div class="section-title">
    <span class="section-num">06</span> Multi-Day Schedule, Results & Leaderboard
  </div>
  <div class="feature-grid">
    <div class="feature-card purple">
      <div class="feature-header">
        <span class="feature-title">3-Day Interactive Festival Timeline</span>
        <span class="badge">/schedule</span>
      </div>
      <div class="feature-desc">Tabbed timeline across Day 1 (Oct 15: Inauguration & Prelims), Day 2 (Oct 16: Semis & Hackathons), and Day 3 (Oct 17: Championship Finals & Valedictory) with real-time status badges (SCHEDULED, LIVE, COMPLETED).</div>
    </div>

    <div class="feature-card purple">
      <div class="feature-header">
        <span class="feature-title">Podium Results & Medal Leaderboard</span>
        <span class="badge">/results</span>
      </div>
      <div class="feature-desc">Official published scores for 1st Place (Gold), 2nd Place (Silver), and 3rd Place (Bronze). Live inter-college medal tally calculating overall points for the Festival Rolling Trophy.</div>
    </div>
  </div>

  <!-- Section 7 & 8 -->
  <div class="section-title">
    <span class="section-num">07 & 08</span> Support Hub & Convenor / Admin Operations (/admin)
  </div>
  <div class="feature-grid">
    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Authenticated Support & Grievance Desk</span>
        <span class="badge">/contact</span>
      </div>
      <div class="feature-desc">Requires student authentication before submitting questions or complaints, shielding convenors from spam bots and linking inquiries directly to the student profile.</div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Interactive Convenor Operations Dashboard</span>
        <span class="badge">/admin/dashboard</span>
      </div>
      <div class="feature-desc">Metric cards with one-click navigation: Total Events jumps to /admin/events, Total Registrations jumps to /admin/registrations, and Inquiries jumps to /admin/messages.</div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Animated Gate Check-In Circular Progress Gauge</span>
        <span class="badge">Analytics</span>
      </div>
      <div class="feature-desc">Custom animated SVG circular ring measuring real-time scanned attendee arrivals against total registrations, giving organizers an instantaneous campus gate status.</div>
    </div>

    <div class="feature-card">
      <div class="feature-header">
        <span class="feature-title">Gate Attendee Scanner & CSV/Excel Data Export</span>
        <span class="badge">Gate Security</span>
      </div>
      <div class="feature-desc">Live searchable roster for gate volunteers to verify attendee QR codes in real time with one click. One-tap export to CSV/Excel for attendance records and certificate printing.</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>COLORIDO 2K26 Official Platform Documentation</span>
    <span>R.V.R. & J.C. College of Engineering (Autonomous)</span>
    <span>Generated for Production Release 2.0</span>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'COLORIDO_2K26_Full_Features.html');
const pdfFilePath = path.join(__dirname, 'COLORIDO_2K26_Full_Features_Document.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('✓ Created styled HTML specification at:', htmlFilePath);

// 2. Convert to PDF using Google Chrome headless
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (fs.existsSync(chromePath)) {
  try {
    const cmd = `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`;
    console.log('Running PDF compilation with Chrome headless...');
    execSync(cmd, { stdio: 'inherit' });
    console.log('✓ Successfully generated PDF at:', pdfFilePath);
    
    // Also copy to secondary workspace
    const secPdfPath = 'C:\\Users\\sivat\\colorido2k26\\COLORIDO_2K26_Full_Features_Document.pdf';
    fs.copyFileSync(pdfFilePath, secPdfPath);
    console.log('✓ Copied PDF to secondary workspace:', secPdfPath);
  } catch (err) {
    console.error('Error generating PDF with Chrome:', err);
  }
} else {
  console.log('Chrome not found at standard path, trying Edge...');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('✓ Successfully generated PDF with Edge at:', pdfFilePath);
}
