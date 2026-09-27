require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');
const app = require('./src/app');
const prisma = require('./src/services/prisma');
const { JWT_SECRET } = require('./src/config');

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

let server;

async function runTests() {
  console.log('====================================================');
  console.log(' COLORIDO 2K26 - COMPREHENSIVE END-TO-END TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Database Connection & In-Memory Server Start
    await prisma.$connect();
    server = app.listen(TEST_PORT);
    await new Promise((res) => setTimeout(res, 500));
    console.log(`Test server running at http://localhost:${TEST_PORT}\n`);

    // 2. Health Check
    console.log('--- TEST 1: Health & Database Connectivity ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
    assert(healthData.database === 'connected', 'Database reports connected state');

    // 3. Events Verification (All 29 events: 9 Sports, 10 Cultural, 10 Technical)
    console.log('\n--- TEST 2: Festival Events (9 Sports, 10 Cultural, 10 Technical) ---');
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const eventsData = await eventsRes.json();
    const events = eventsData.data || [];
    assert(events.length === 29, `Exact count of 29 festival events present (Found: ${events.length})`);

    const sports = events.filter((e) => e.category === 'SPORTS');
    const cultural = events.filter((e) => e.category === 'CULTURAL');
    const technical = events.filter((e) => e.category === 'TECHNICAL');

    assert(sports.length === 9, `Sports events count is 9 (Found: ${sports.length})`);
    assert(cultural.length === 10, `Cultural events count is 10 (Found: ${cultural.length})`);
    assert(technical.length === 10, `Technical events count is 10 (Found: ${technical.length})`);

    // Verify key technical events
    const techTitles = technical.map((t) => t.title.toLowerCase());
    assert(techTitles.some((t) => t.includes('hackathon')), 'Hackathon event exists');
    assert(techTitles.some((t) => t.includes('coding contest')), 'Coding Contest exists');
    assert(techTitles.some((t) => t.includes('ai/ml')), 'AI/ML Challenge exists');
    assert(techTitles.some((t) => t.includes('ui/ux')), 'UI/UX Design Challenge exists');

    // 4. Schedule Verification
    console.log('\n--- TEST 3: Multi-Day Program Schedule ---');
    const scheduleRes = await fetch(`${BASE_URL}/schedule`);
    const scheduleData = await scheduleRes.json();
    const schedules = scheduleData.data || [];
    assert(schedules.length >= 8, `Festival schedule contains program items (Found: ${schedules.length})`);
    assert(schedules.some((s) => s.category === 'SPORTS'), 'Sports schedule items exist');
    assert(schedules.some((s) => s.category === 'TECHNICAL'), 'Technical schedule items exist');
    assert(schedules.some((s) => s.category === 'CULTURAL'), 'Cultural schedule items exist');

    // 5. Results & Leaderboard Verification
    console.log('\n--- TEST 4: Results & Leaderboard ---');
    const resultsRes = await fetch(`${BASE_URL}/results`);
    const resultsData = await resultsRes.json();
    assert(Array.isArray(resultsData.data), 'Results endpoint returns array');

    const leaderboardRes = await fetch(`${BASE_URL}/results/leaderboard`);
    const leaderboardData = await leaderboardRes.json();
    assert(leaderboardRes.status === 200, 'Leaderboard endpoint responds with 200 OK');
    assert(Array.isArray(leaderboardData.data), 'Leaderboard returns college standings');

    // 6. Contact Inquiries Submission
    console.log('\n--- TEST 5: Public Contact Inquiry Submission ---');
    const contactPayload = {
      name: 'E2E Test Participant',
      email: 'e2e_test@example.com',
      phone: '9876543210',
      subject: 'Inquiry regarding Technical Hackathon rules',
      message: 'Hello COLORIDO team, please clarify hardware hack requirements.'
    };
    const contactRes = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    });
    const contactResult = await contactRes.json();
    assert(contactRes.status === 201, 'Contact message submitted with 201 Created');
    assert(contactResult.success === true, 'Contact response reports success');
    const submittedMsgId = contactResult.data?.id;

    // 7. Admin Authentication
    console.log('\n--- TEST 6: Administrator Authentication ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@colorido2k26.com',
        password: 'Admin@Colorido2026!'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login succeeds with valid credentials');
    assert(Boolean(adminLoginData.data?.token), 'Admin JWT token returned in data.token');
    assert(adminLoginData.data?.admin?.role === 'ADMIN', 'Admin role verified as ADMIN');
    const adminToken = adminLoginData.data?.token;

    // 8. Admin Protected Endpoints
    console.log('\n--- TEST 7: Admin Portal Protected Endpoints ---');
    const adminDashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminDashData = await adminDashRes.json();
    const metrics = adminDashData.data?.metrics || adminDashData.data;
    assert(adminDashRes.status === 200, 'Admin dashboard accessible with admin token');
    assert(metrics.totalEvents === 29, `Dashboard correctly counts 29 total events`);
    assert(metrics.sportsEvents === 9, 'Dashboard counts 9 sports events');
    assert(metrics.culturalEvents === 10, 'Dashboard counts 10 cultural events');
    assert(metrics.technicalEvents === 10, 'Dashboard counts 10 technical events');

    // Admin Messages & Status Update
    if (submittedMsgId) {
      const updateMsgRes = await fetch(`${BASE_URL}/admin/messages/${submittedMsgId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      assert(updateMsgRes.status === 200, 'Admin can resolve visitor inquiries');
    }

    // 9. User Authentication & Registration Isolation
    console.log('\n--- TEST 8: User Registration & Strict Data Isolation ---');
    // Create two test users directly in DB
    const testUserA = await prisma.user.upsert({
      where: { email: 'usera@rvrjc.ac.in' },
      update: {},
      create: {
        googleId: 'test-google-user-a',
        email: 'usera@rvrjc.ac.in',
        name: 'User A (CSE)',
        college: 'R V R & J C College of Engineering',
        phone: '9988776655'
      }
    });

    const testUserB = await prisma.user.upsert({
      where: { email: 'userb@rvrjc.ac.in' },
      update: {},
      create: {
        googleId: 'test-google-user-b',
        email: 'userb@rvrjc.ac.in',
        name: 'User B (IT)',
        college: 'R V R & J C College of Engineering',
        phone: '9988776644'
      }
    });

    const tokenA = jwt.sign({ userId: testUserA.id, email: testUserA.email, role: 'USER' }, JWT_SECRET, { expiresIn: '1h' });
    const tokenB = jwt.sign({ userId: testUserB.id, email: testUserB.email, role: 'USER' }, JWT_SECRET, { expiresIn: '1h' });

    // Clean any prior test registrations for User A and B
    await prisma.registration.deleteMany({
      where: { email: { in: ['usera@rvrjc.ac.in', 'userb@rvrjc.ac.in'] } }
    });

    // Select Hackathon event for User A registration
    const targetEvent = technical.find((e) => e.title.toLowerCase().includes('hackathon')) || technical[0];

    const regRes = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        eventId: targetEvent.id,
        fullName: 'User A',
        email: 'usera@rvrjc.ac.in',
        phone: '9988776655',
        college: 'R V R & J C College of Engineering',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        teamName: 'HackVanguard',
        teamMembers: 'Member 2 (Y22CS002), Member 3 (Y22CS003)'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, `User A registered for ${targetEvent.title} (Status 201)`);
    assert(Boolean(regData.data?.registrationId), `Registration ID issued: ${regData.data?.registrationId}`);

    // Duplicate Registration Prevention Test
    const dupRes = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        eventId: targetEvent.id,
        fullName: 'User A',
        email: 'usera@rvrjc.ac.in',
        phone: '9988776655',
        college: 'R V R & J C College of Engineering',
        department: 'Computer Science & Engineering',
        year: '3rd Year'
      })
    });
    assert(dupRes.status === 409, 'Duplicate registration correctly blocked with 409 Conflict');

    // Isolation Test: User A fetches own registrations
    const userARegsRes = await fetch(`${BASE_URL}/registrations`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const userARegsData = await userARegsRes.json();
    assert(userARegsData.data?.length === 1, 'User A sees exactly 1 registration');

    // Isolation Test: User B fetches registrations -> MUST BE 0!
    const userBRegsRes = await fetch(`${BASE_URL}/registrations`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const userBRegsData = await userBRegsRes.json();
    assert(userBRegsData.data?.length === 0, 'User B sees 0 registrations (Strict Tenant Isolation Verified)');

    // Pass lookup test
    const regId = regData.data?.registrationId;
    const passRes = await fetch(`${BASE_URL}/registrations/pass/${regId}`);
    const passData = await passRes.json();
    assert(passRes.status === 200, 'Pass verification endpoint returns pass details');
    assert(passData.data?.fullName === 'User A', 'Pass details match registered participant');

    // 10. Role Security & Admin Endpoint Authorization
    console.log('\n--- TEST 9: Normal User Admin Access Block (403 Forbidden) ---');
    const forbiddenRes = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert(forbiddenRes.status === 403, 'Normal user token blocked from /api/admin/* with 403 Forbidden');

    const noAuthAdminRes = await fetch(`${BASE_URL}/admin/dashboard`);
    assert(noAuthAdminRes.status === 401, 'Unauthenticated request to /api/admin/* blocked with 401 Unauthorized');

    // 11. Cleanup test records
    await prisma.registration.deleteMany({
      where: { email: { in: ['usera@rvrjc.ac.in', 'userb@rvrjc.ac.in'] } }
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testUserA.id, testUserB.id] } }
    });
    if (submittedMsgId) {
      await prisma.contactMessage.delete({ where: { id: submittedMsgId } }).catch(() => {});
    }

  } catch (err) {
    console.error('Fatal error during E2E testing:', err);
    failed++;
  } finally {
    if (server) {
      server.close();
    }
    await prisma.$disconnect();

    console.log('\n====================================================');
    console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
