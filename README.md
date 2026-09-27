# COLORIDO 2K26 — Premier Interactive Cultural, Sports & Technical Festival Platform

> **A national-level festival web platform engineered for R V R & J C College of Engineering.**  
> **Host Institution:** Rayapati Venkata Ranga Rao & Jagarlamudi Chandramouli College of Engineering, Guntur, Andhra Pradesh (Autonomous • NAAC A+ Grade • NBA Accredited • Estd. 1985).  
> **Brand Name:** Strictly `COLORIDO 2K26`.

---

## 🌟 1. Project Overview

**COLORIDO 2K26** is a modern, high-performance, full-stack festival platform engineered from the ground up for R V R & J C College of Engineering's flagship intercollegiate festival. The platform unites three primary pillars:
1. **Sports Championships (9 Disciplines)**: Cricket, Football, Basketball, Volleyball, Kabaddi, Table Tennis, Badminton, Chess, Athletics.
2. **Cultural Competitions (10 Disciplines)**: Classical Dance, Western Group Dance, Battle of the Bands, Solo Singing, Stand-Up Comedy, Street Play (Nukkad Natak), Fashion Runway, Short Film, Fine Arts Painting, Photography Salon.
3. **Technical Innovations (10 Disciplines)**: 24H National Hackathon, Speed Coding Contest, Bug Bounty / Debugging Contest, Technical Quiz, Paper Presentation, Engineering Project Expo, UI/UX Design Challenge, Web Development Sprint, AI/ML Model Challenge, Code Relay.

---

## ⚡ 2. Core Highlights & Architecture

- **Strict Brand Integrity:** Brand name formatted consistently as `COLORIDO 2K26`.
- **Untouched College Identity:** High-resolution transparent official emblem of R V R & J C College of Engineering integrated in navbar, footer, about page, and generated digital passes.
- **Large Animated SVG Mini-Scenes:** Every single event card features a custom, responsive, 45–55% card height animated visual scene (cricket batsman swing, football penalty net, hackathon dual-monitor IDE, chess board depth, dance stage spotlight, robotics gear, etc.).
- **Live Event Countdown:** Driven by single ISO target timestamp (`2026-10-15T09:00:00+05:30`) updating every second, transitioning seamlessly to `EVENT STARTED` when reached.
- **ACID-Compliant Concurrency-Safe Registrations:**
  - Capacity protection using atomic Prisma database transactions (`increment`, capacity checks).
  - Duplicate registration protection via composite unique database constraint on `[eventId, email]`.
  - Issue of alphanumeric verified Pass IDs in format `COL26-XXXXX`.
- **Digital Registration Pass & QR Verification:**
  - Real SVG QR code containing cryptographically verifiable registration data.
  - One-click PDF print and digital download support.
- **Strict Role Security & Authentication:**
  - Normal participants sign in with Google Identity Services (GIS) / Google OAuth 2.0 with backend JWT.
  - Normal users have strict tenant isolation: users only see their own passes and registrations.
  - Normal users are strictly forbidden (`403 Forbidden`) from accessing `/api/admin/*`.
  - Administrators authenticate via dedicated Email + Password (`admin@colorido2k26.com`) with bcrypt hashing and JWT.
- **Comprehensive SaaS Admin Operations Console:**
  - Real DB Metrics Dashboard (total, sports, cultural, technical, utilization rate).
  - Events Management: full CRUD, capacity configuration, publish toggle, feature toggle.
  - Registrations Management: search, event filter, status update (CONFIRMED, PENDING, REJECTED, CANCELLED), CSV export.
  - Schedule Operations: multi-day program management, live stage flags, published status.
  - Winners & Leaderboard: rank allocations, championship college points, prize money.
  - Inquiries & Helpdesk: message triage, resolution status transitions, direct email reply.
- **Dual Visual Theme:**
  - Complete Dark Theme (`#08090e`, `#12131a`, `#1a1b26`, `#8b5cf6`, `#06b6d4`, `#f59e0b`).
  - Crisp Light Theme (`#f8fafc`, `#ffffff`, `#e2e8f0`, `#6d28d9`, `#0891b2`, `#d97706`).
  - Persistent preference in `localStorage`.

---

## 🛠️ 3. Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Dark/Light mode via class strategy, keyframe animations)
- **Routing:** React Router DOM v6 (All public and nested admin routes)
- **HTTP Client:** Axios (Interceptors for dynamic JWT bearer token injection)
- **Icons:** Lucide React
- **QR Code Engine:** `qrcode.react` (SVG renderer)
- **Celebration Effects:** `canvas-confetti`

### Backend
- **Runtime:** Node.js (v20+ / v22+)
- **Framework:** Express.js
- **Database:** PostgreSQL 15+ (`colorido2k26` database)
- **ORM:** Prisma ORM 5.22
- **Authentication:** Google Auth Library (`google-auth-library`), JWT (`jsonwebtoken`), and bcrypt (`bcryptjs`)
- **Security:** Helmet, CORS, Express Rate Limit

---

## 📂 4. Project Directory Map

```text
colorido2k26/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma schema with Event, User, Admin, Registration, Schedule, Result, ContactMessage
│   │   └── seed.js             # Seeds Admin, all 29 events (9 Sports, 10 Cultural, 10 Technical), schedules, results
│   ├── src/
│   │   ├── config/             # Centralized config (JWT, DB, Google OAuth)
│   │   ├── controllers/        # auth, event, registration, schedule, result, contact, admin
│   │   ├── middleware/         # authMiddleware, adminMiddleware, rateLimiter, errorHandler
│   │   ├── routes/             # authRoutes, eventRoutes, registrationRoutes, scheduleRoutes, resultRoutes, contactRoutes, adminRoutes, healthRoutes
│   │   ├── services/           # prisma.js, googleAuth.js
│   │   └── app.js              # Express app setup with CORS, Helmet, routes, and error handling
│   ├── server.js               # Server entry point
│   ├── test_e2e.js             # Automated end-to-end integration test suite (37 assertions)
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── rvrjc_logo.png      # Official R V R & J C College of Engineering logo
│   ├── src/
│   │   ├── components/         # Navbar, Footer, EventCard, EventVisualCanvas, CountdownTimer, GoogleAuthModal, ThemeToggle, LoadingSkeleton
│   │   ├── context/            # AuthContext (GIS + Admin), ThemeContext (Dark/Light)
│   │   ├── hooks/              # useCountdown
│   │   ├── layouts/            # MainLayout (public festival) & AdminLayout (admin console)
│   │   ├── pages/              # HomePage, AboutPage, EventsPage, SportsEventsPage, CulturalEventsPage, TechnicalEventsPage, EventDetailsPage, RegistrationPage, MyRegistrationsPage, PassPage, SchedulePage, ResultsPage, LeaderboardPage, GalleryPage, ContactPage, NotFoundPage, AdminLoginPage, AdminDashboardPage, AdminEventsPage, AdminRegistrationsPage, AdminSchedulePage, AdminResultsPage, AdminMessagesPage
│   │   ├── services/           # api.js (complete API methods for public, user, and admin)
│   │   ├── utils/              # constants.js, helpers.js
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # Entry point with BrowserRouter
│   │   └── index.css           # Tailwind directives & design tokens
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 5. Quick Start & Setup

### Prerequisites
- Node.js v18+ (tested on Node.js v22.17.0)
- PostgreSQL (running locally or cloud instance)

### 1. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
# Copy .env.example to .env and adjust DATABASE_URL
cp .env.example .env

# Push Prisma schema to PostgreSQL and generate client
npx prisma db push
npx prisma generate

# Seed database with Admin and all 29 events
node prisma/seed.js

# Start backend development server (Port 5000)
npm start
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite development server (Port 5173)
npm run dev

# Or test production build
npm run build
```

---

## 🔑 6. Credentials & Evaluator Access

| Role | Interface | URL | Identifier / Email | Password |
|---|---|---|---|---|
| **Administrator** | Admin Console | `/admin/login` | `admin@colorido2k26.com` | `Admin@Colorido2026!` |
| **Participant** | Festival Portal | `/` or `/register` | Google Sign-In or Demo Login | One-click Demo Profile |

*(Note: The Admin login page features a 1-click "Autofill Competition Judge Admin Credentials" button for instant convenience).*

---

## 🧪 7. Automated Verification & E2E Testing

An end-to-end integration test suite is included in `backend/test_e2e.js`. It boots an in-memory server, performs live database interactions, and runs 37 strict assertions covering:
- PostgreSQL health connectivity
- Verification of exact 29 events (9 Sports, 10 Cultural, 10 Technical)
- Multi-day schedule items across all 3 pillars
- Results calculation and College Championship Leaderboard standings
- Public contact form inquiry submission
- Admin email/password login with bcrypt and JWT generation
- Admin dashboard metrics across all 3 pillars
- User registration with unique pass ID generation (`COL26-XXXXX`)
- Atomic duplicate registration prevention (HTTP 409 Conflict)
- Strict user data isolation (User A only sees User A's registrations; User B sees 0)
- QR Pass lookup and verification endpoint
- Strict 403 Forbidden enforcement on normal user tokens accessing `/api/admin/*`
- Strict 401 Unauthorized enforcement on unauthenticated admin requests

To run the verification suite:
```bash
cd backend
node test_e2e.js
```

**Result:**
```text
====================================================
 TEST SUMMARY: 37 PASSED, 0 FAILED
====================================================
```

---

## 🎓 8. Host Institution

**R V R & J C College of Engineering (Autonomous)**  
Chandramoulipuram, Chowdavaram, Guntur – 522 019, Andhra Pradesh, India.  
- Approved by AICTE, New Delhi
- Affiliated to Acharya Nagarjuna University
- Accredited by NAAC with **'A+' Grade**
- Programs accredited by NBA
- Established: 1985 (40+ Years of Academic & Sporting Legacy)

---
*Built with ❤️ for COLORIDO 2K26.*
