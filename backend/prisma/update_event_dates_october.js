const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const EVENT_DATES_MAP = {
  // SPORTS
  'cricket': 'October 15-16, 2026',
  'football': 'October 15-16, 2026',
  'basketball': 'October 15, 2026',
  'volleyball': 'October 15-16, 2026',
  'badminton': 'October 16, 2026',
  'chess': 'October 15, 2026',
  'kabaddi': 'October 16, 2026',
  'table-tennis': 'October 15, 2026',
  'athletics': 'October 17, 2026',

  // CULTURAL
  'dance': 'October 16, 2026',
  'singing': 'October 15, 2026',
  'solo-performance': 'October 15, 2026',
  'group-performance': 'October 16, 2026',
  'drama': 'October 16, 2026',
  'fashion-show': 'October 17, 2026',
  'photography': 'October 15, 2026',
  'painting': 'October 15, 2026',
  'quiz': 'October 16, 2026',
  'literary-events': 'October 15, 2026',

  // TECHNICAL
  'hackathon': 'October 15-16, 2026',
  'coding-contest': 'October 15, 2026',
  'debugging-contest': 'October 16, 2026',
  'tech-quiz': 'October 15, 2026',
  'paper-presentation': 'October 16, 2026',
  'project-expo': 'October 16, 2026',
  'ui-ux-design-challenge': 'October 15, 2026',
  'web-development-challenge': 'October 16, 2026',
  'ai-ml-challenge': 'October 15, 2026',
  'code-relay': 'October 17, 2026'
};

const IMPORTANT_DATES_TEMPLATE = `• Online Registration Closes: October 13, 2026 (11:59 PM)\n• Spot Registration & Desk Verification: October 15, 2026 (08:00 AM)\n• Tournament Schedule Release: October 14, 2026\n• Grand Prize Distribution & Valedictory: October 17, 2026 (06:00 PM)`;

async function updateAllDates() {
  console.log('--- UPDATING ALL EVENT DATES TO OCTOBER 15 - 17, 2026 ---');

  // 1. Update Events
  const events = await prisma.event.findMany();
  console.log(`Found ${events.length} events in database.`);

  for (const ev of events) {
    const newDate = EVENT_DATES_MAP[ev.slug] || EVENT_DATES_MAP[ev.visualType] || 'October 15-17, 2026';
    await prisma.event.update({
      where: { id: ev.id },
      data: {
        date: newDate,
        importantDates: IMPORTANT_DATES_TEMPLATE
      }
    });
    console.log(`  ✓ Updated Event [${ev.title}]: ${newDate}`);
  }

  // 2. Update Event Rounds
  const rounds = await prisma.eventRound.findMany();
  console.log(`\nFound ${rounds.length} event rounds in database.`);

  for (const round of rounds) {
    let roundDate = 'October 15, 2026';
    if (round.roundNumber === 2) {
      roundDate = 'October 16, 2026';
    } else if (round.roundNumber >= 3) {
      roundDate = 'October 17, 2026';
    }

    await prisma.eventRound.update({
      where: { id: round.id },
      data: { date: roundDate }
    });
  }
  console.log(`  ✓ Successfully updated ${rounds.length} rounds.`);

  // 3. Update Schedules
  const schedules = await prisma.schedule.findMany();
  console.log(`\nFound ${schedules.length} schedules in database.`);

  for (const sch of schedules) {
    let schDate = '2026-10-15';
    const titleLower = sch.title.toLowerCase();

    if (titleLower.includes('kickoff') || titleLower.includes('prelim') || titleLower.includes('round 1') || titleLower.includes('training')) {
      schDate = '2026-10-15';
    } else if (titleLower.includes('pitch') || titleLower.includes('showcase') || titleLower.includes('final') || titleLower.includes('mains')) {
      if (titleLower.includes('fashion') || titleLower.includes('relay')) {
        schDate = '2026-10-17';
      } else {
        schDate = '2026-10-16';
      }
    } else if (sch.order > 8) {
      schDate = '2026-10-17';
    } else if (sch.order > 5) {
      schDate = '2026-10-16';
    }

    await prisma.schedule.update({
      where: { id: sch.id },
      data: { date: schDate }
    });
    console.log(`  ✓ Updated Schedule [${sch.title}]: ${schDate}`);
  }

  // 4. Update any contact messages with old dates
  const messages = await prisma.contactMessage.findMany({
    where: {
      message: {
        contains: 'March'
      }
    }
  });
  for (const msg of messages) {
    const updated = msg.message.replace(/March 27 and 28/g, 'October 15 and 16').replace(/March/g, 'October');
    await prisma.contactMessage.update({
      where: { id: msg.id },
      data: { message: updated }
    });
    console.log(`  ✓ Updated contact message ${msg.id}`);
  }

  console.log('\n✅ ALL DATABASE RECORDS ARE NOW SET STRICTLY TO OCTOBER 15 - 17, 2026!');
  process.exit(0);
}

updateAllDates().catch(err => {
  console.error('Update error:', err);
  process.exit(1);
});
