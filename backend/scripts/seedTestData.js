const crypto = require('crypto');
const prisma = require('../src/services/prisma');

// Parse CLI Arguments
const args = process.argv.slice(2);
const isClean = args.includes('--clean') || args.includes('-c');
const countArg = args.find(a => a.startsWith('--count='));
let targetCount = countArg ? parseInt(countArg.split('=')[1], 10) : null;

if (!targetCount) {
  const numArg = args.find(a => !a.startsWith('--') && !isNaN(parseInt(a, 10)));
  targetCount = numArg ? parseInt(numArg, 10) : 500;
}

// Production safety guard
if (process.env.NODE_ENV === 'production' && !args.includes('--force')) {
  console.error('\n❌ SAFETY ERROR: Test seed script cannot be executed in production environment without explicit --force flag.');
  process.exit(1);
}

// Realistic Indian Student Seed Data Pools
const FIRST_NAMES = [
  'Rahul', 'Priya', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Aarav', 'Kavya', 'Aditya', 'Pooja',
  'Karthik', 'Divya', 'Sai', 'Deepa', 'Varun', 'Meera', 'Nikhil', 'Riya', 'Harish', 'Swathi',
  'Manoj', 'Preeti', 'Akhil', 'Bhavana', 'Suresh', 'Keerthi', 'Teja', 'Sowmya', 'Pranav', 'Harika',
  'Gautam', 'Anusha', 'Tarun', 'Pavani', 'Charan', 'Sirisha', 'Kiran', 'Madhuri', 'Vinay', 'Alekhya',
  'Rohit', 'Lavanya', 'Chaitanya', 'Ramya', 'Abhishek', 'Yamini', 'Mahesh', 'Navya', 'Rajesh', 'Sindhu'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Reddy', 'Verma', 'Iyer', 'Rao', 'Kodavatiganti', 'Choudhary', 'Joshi',
  'Kulkarni', 'Nair', 'Gupta', 'Das', 'Singh', 'Murthy', 'Bhat', 'Chalasani', 'Kommineni',
  'Alapati', 'Maddipati', 'Nallapati', 'Gollapudi', 'Chintala', 'Guntupalli', 'Vellanki', 'Puvvada'
];

const COLLEGES = [
  'R V R & J C College of Engineering',
  "Vignan's Foundation for Science, Technology & Research",
  'Koneru Lakshmaiah Education Foundation (KL University)',
  'Andhra University College of Engineering',
  'SRM University, AP',
  'Vellore Institute of Technology, AP',
  'Vasireddy Venkatadri Institute of Technology (VVIT)',
  'Bapatla Engineering College',
  'Gayatri Vidya Parishad College of Engineering',
  'JNTU College of Engineering, Kakinada'
];

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'AI & DS', 'CSBS'];
const YEARS = ['1', '2', '3', '4'];

const GROUP_NAMES = [
  'Cosmic Dancers', 'Rhythm Syndicate', 'Natya Tarang', 'Harmonic Beats', 'Urban Groove',
  'The Pulse Collective', 'Sonic Wave', 'Nritya Kala', 'Acoustic Soul', 'Verve Performers',
  'Echo Chamber', 'Rhapsody Crew', 'Prism Dancers', 'Melody Makers', 'Dynamic Striders'
];

const TEAM_NAMES = [
  'RVRJC Strikers', 'Guntur Titans', 'Cyber Knights', 'Blaze Warriors', 'Code Ninjas',
  'Delta Force', 'Phoenix XI', 'Spartan Smashers', 'Iron Hawks', 'Quantum Hackers',
  'Thunderbolts', 'Apex Predators', 'Byte Bandits', 'Velocity Racers', 'Matrix Raiders'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRegistrationId(index) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars[crypto.randomInt(0, chars.length)];
  }
  return `COL26-T${randomPart}`;
}

/**
 * CLEANUP MODE: Remove all generated test data without touching real accounts
 */
async function cleanTestData() {
  console.log('\n🧹 Starting Safe Test Data Cleanup...');
  
  // 1. Find all test registrations
  const testRegistrations = await prisma.registration.findMany({
    where: { isTest: true },
    select: { id: true, eventId: true }
  });

  console.log(`Found ${testRegistrations.length} test registrations to remove.`);

  if (testRegistrations.length > 0) {
    // Group by eventId to recalculate or decrement event registration counts
    const countByEvent = {};
    for (const r of testRegistrations) {
      countByEvent[r.eventId] = (countByEvent[r.eventId] || 0) + 1;
    }

    // Delete participants
    const deletedParticipants = await prisma.registrationParticipant.deleteMany({
      where: {
        registration: { isTest: true }
      }
    });
    console.log(`✓ Deleted ${deletedParticipants.count} test participant records.`);

    // Delete test registrations
    const deletedRegs = await prisma.registration.deleteMany({
      where: { isTest: true }
    });
    console.log(`✓ Deleted ${deletedRegs.count} test registration passes.`);

    // Adjust event registered counts safely
    for (const [eventId, decrementBy] of Object.entries(countByEvent)) {
      try {
        const ev = await prisma.event.findUnique({ where: { id: eventId }, select: { registeredCount: true } });
        if (ev) {
          const newCount = Math.max(0, ev.registeredCount - decrementBy);
          await prisma.event.update({
            where: { id: eventId },
            data: { registeredCount: newCount }
          });
        }
      } catch (e) {
        // Continue adjusting others
      }
    }
    console.log('✓ Adjusted event registration counts.');
  }

  // Delete test users
  const deletedUsers = await prisma.user.deleteMany({
    where: { isTest: true }
  });
  console.log(`✓ Deleted ${deletedUsers.count} test user accounts.`);

  console.log('✨ Test data cleanup completed successfully. All real user registrations remain 100% intact.\n');
}

/**
 * SEED MODE: Generate 500 or 1,000 realistic registrations
 */
async function seedTestData(count) {
  console.log(`\n🚀 Initializing Safe Bulk Test Data Generator for ${count} registrations...`);

  // Verify published events
  const events = await prisma.event.findMany({
    where: { published: true }
  });

  if (events.length === 0) {
    console.error('❌ No published events found in database. Please seed events catalog first.');
    process.exit(1);
  }

  console.log(`✓ Found ${events.length} active events across Sports, Cultural, and Technical categories.`);

  const batchTimestamp = Date.now().toString().slice(-6);
  const CHUNK_SIZE = 50;
  let totalCreatedUsers = 0;
  let totalCreatedRegs = 0;

  const totalChunks = Math.ceil(count / CHUNK_SIZE);
  console.log(`⚙ Processing in ${totalChunks} optimized batches of ${CHUNK_SIZE} records...\n`);

  for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
    const chunkSize = Math.min(CHUNK_SIZE, count - (chunkIdx * CHUNK_SIZE));
    const userBatch = [];
    const regBatchMeta = [];

    // 1. Prepare User and Registration Metadata
    for (let i = 0; i < chunkSize; i++) {
      const overallIdx = chunkIdx * CHUNK_SIZE + i + 1;
      const firstName = getRandomElement(FIRST_NAMES);
      const lastName = getRandomElement(LAST_NAMES);
      const fullName = `${firstName} ${lastName}`;
      const email = `test.student.${batchTimestamp}.${overallIdx}@test.colorido.in`;
      const college = getRandomElement(COLLEGES);
      const department = getRandomElement(DEPARTMENTS);
      const year = getRandomElement(YEARS);
      const phone = `9${getRandomInt(100000000, 999999999)}`;

      const targetEvent = events[overallIdx % events.length];
      const regType = (targetEvent.registrationType || targetEvent.participantType || 'INDIVIDUAL').toUpperCase();

      userBatch.push({
        email,
        name: fullName,
        college,
        department,
        year,
        phone,
        role: 'USER',
        isVerified: true,
        isTest: true
      });

      regBatchMeta.push({
        targetEvent,
        regType,
        fullName,
        email,
        phone,
        college,
        department,
        year,
        overallIdx
      });
    }

    // 2. Insert Users and create Registrations in atomic transaction
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < chunkSize; i++) {
        const u = userBatch[i];
        const meta = regBatchMeta[i];
        const targetEvent = meta.targetEvent;
        const regType = meta.regType;

        // Upsert user
        const dbUser = await tx.user.upsert({
          where: { email: u.email },
          update: {},
          create: u
        });
        totalCreatedUsers++;

        // Determine Team Details
        let teamName = null;
        let additionalMembers = [];

        if (regType === 'GROUP') {
          teamName = `${getRandomElement(GROUP_NAMES)} ${getRandomInt(10, 99)}`;
          const memberCount = getRandomInt(1, 3);
          for (let m = 0; m < memberCount; m++) {
            additionalMembers.push({
              name: `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
              email: `member.${m + 1}.${meta.overallIdx}@test.colorido.in`,
              phone: `8${getRandomInt(100000000, 999999999)}`,
              college: meta.college,
              isCaptain: false,
              order: m + 1
            });
          }
        } else if (regType === 'TEAM') {
          teamName = `${getRandomElement(TEAM_NAMES)} ${getRandomInt(1, 20)}`;
          const memberCount = getRandomInt(4, 8);
          for (let m = 0; m < memberCount; m++) {
            additionalMembers.push({
              name: `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
              email: `player.${m + 1}.${meta.overallIdx}@test.colorido.in`,
              phone: `7${getRandomInt(100000000, 999999999)}`,
              college: meta.college,
              isCaptain: false,
              order: m + 1
            });
          }
        }

        // Status Distribution: 70% CONFIRMED, 20% CHECKED_IN, 7% PENDING, 3% CANCELLED
        const randStatus = Math.random();
        let status = 'CONFIRMED';
        let checkedIn = false;
        let checkedInAt = null;

        if (randStatus < 0.20) {
          status = 'CHECKED_IN';
          checkedIn = true;
          checkedInAt = new Date(Date.now() - getRandomInt(60000, 3600000 * 5));
        } else if (randStatus < 0.27) {
          status = 'PENDING';
        } else if (randStatus < 0.30) {
          status = 'CANCELLED';
        }

        const registrationId = generateRegistrationId(meta.overallIdx);
        const verificationCode = getRandomInt(100000, 999999).toString();

        const participantsCreate = [
          {
            name: meta.fullName,
            email: meta.email,
            phone: meta.phone,
            college: meta.college,
            isCaptain: true,
            order: 0
          },
          ...additionalMembers
        ];

        // Create Registration
        await tx.registration.create({
          data: {
            registrationId,
            verificationCode,
            userId: dbUser.id,
            eventId: targetEvent.id,
            fullName: meta.fullName,
            email: meta.email,
            phone: meta.phone,
            college: meta.college,
            department: meta.department,
            year: meta.year,
            participantType: regType,
            teamName,
            teamMembers: additionalMembers.length > 0 ? JSON.stringify(additionalMembers.map(m => m.name)) : null,
            status,
            checkedIn,
            checkedInAt,
            isTest: true,
            participants: {
              create: participantsCreate
            }
          }
        });

        // Update event registration count
        await tx.event.update({
          where: { id: targetEvent.id },
          data: { registeredCount: { increment: 1 } }
        });

        totalCreatedRegs++;
      }
    });

    const progressPercent = Math.round(((chunkIdx + 1) / totalChunks) * 100);
    process.stdout.write(`\r⏳ Progress: [${'█'.repeat(Math.floor(progressPercent / 5))}${'░'.repeat(20 - Math.floor(progressPercent / 5))}] ${progressPercent}% (${totalCreatedRegs}/${count} records inserted)`);
  }

  console.log('\n\n=============================================================');
  console.log(`✅ BULK SEED SUCCESS: Generated ${totalCreatedRegs} Realistic Registrations!`);
  console.log(`✓ Test Users Created: ${totalCreatedUsers}`);
  console.log(`✓ Test Registrations Created: ${totalCreatedRegs}`);
  console.log(`✓ All records safely tagged with isTest: true`);
  console.log(`✓ To remove these test records at any time, run:`);
  console.log(`   node scripts/seedTestData.js --clean`);
  console.log('=============================================================\n');
}

async function main() {
  try {
    await prisma.$connect();
    if (isClean) {
      await cleanTestData();
    } else {
      await seedTestData(targetCount);
    }
  } catch (err) {
    console.error('❌ Error executing script:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
