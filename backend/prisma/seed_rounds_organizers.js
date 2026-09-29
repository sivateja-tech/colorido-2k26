const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ORGANIZER_TEMPLATES = {
  SPORTS: [
    { role: 'Faculty Convenor', name: 'Dr. G. Rama Mohan Rao', dept: 'Physical Education & Sports', phone: '+91 94402 58190', email: 'sports.convenor@rvrjc.ac.in' },
    { role: 'Student Coordinator', name: 'K. Sai Krishna', dept: 'Mechanical Engineering (4th Year)', phone: '+91 98481 23419', email: 'saikrishna.sports@colorido2k26.com' },
    { role: 'Official Arbiter / Referee', name: 'M. Venkatesh', dept: 'State Athletics Association', phone: '+91 99890 45612', email: 'arbiter@colorido2k26.com' }
  ],
  CULTURAL: [
    { role: 'Faculty Convenor', name: 'Dr. K. Swarnalatha', dept: 'Humanities & Social Sciences', phone: '+91 94412 87654', email: 'cultural.convenor@rvrjc.ac.in' },
    { role: 'Student Coordinator', name: 'V. Divya Teja', dept: 'Information Technology (3rd Year)', phone: '+91 96521 89043', email: 'divya.cultural@colorido2k26.com' },
    { role: 'Stage & Tech Director', name: 'P. Tarun Kumar', dept: 'Electronics & Communication', phone: '+91 91234 56780', email: 'stage.tech@colorido2k26.com' }
  ],
  TECHNICAL: [
    { role: 'Faculty Convenor', name: 'Dr. Ch. Aparna', dept: 'Computer Science & Engineering', phone: '+91 94901 34567', email: 'tech.convenor@rvrjc.ac.in' },
    { role: 'Student Coordinator', name: 'N. Rohith Sharma', dept: 'Computer Science & Engineering (4th Year)', phone: '+91 98765 12098', email: 'rohith.tech@colorido2k26.com' },
    { role: 'Jury & Evaluation Lead', name: 'Prof. B. Srinivasa Rao', dept: 'AI & Data Science', phone: '+91 99480 98712', email: 'jury.tech@rvrjc.ac.in' }
  ]
};

const ROUNDS_BY_CATEGORY = {
  SPORTS: [
    {
      roundNumber: 1,
      title: 'Round 1 – Knockout Qualifiers',
      description: 'Single-elimination knockout matches conducted simultaneously across division grounds.',
      date: 'October 15, 2026',
      time: '08:30 AM - 01:00 PM',
      duration: '45-90 Mins per match',
      qualificationCriteria: 'Winner of each knockout tie directly advances to Quarter-Finals. Official association referees officiate.'
    },
    {
      roundNumber: 2,
      title: 'Round 2 – Quarter & Semi-Finals',
      description: 'Top advancing collegiate teams battle in high-intensity semi-final fixtures.',
      date: 'October 16, 2026',
      time: '09:00 AM - 03:00 PM',
      duration: 'Full-length match duration',
      qualificationCriteria: 'Winners advance to Grand Championship Finals. Losers contest 3rd place bronze playoff.'
    },
    {
      roundNumber: 3,
      title: 'Round 3 – Grand Championship Finals',
      description: 'Floodlit grand finale with stadium commentary, collegiate broadcast, and trophy ceremony.',
      date: 'October 17, 2026',
      time: '04:00 PM - 07:30 PM',
      duration: 'Full championship match',
      qualificationCriteria: 'Gold Medal and Champions Rolling Trophy awarded to the victor; Runner-up receives Silver.'
    }
  ],
  CULTURAL: [
    {
      roundNumber: 1,
      title: 'Round 1 – Screening Prelims',
      description: 'Short preliminary performance showcase evaluated on technical precision, rhythm, and stage etiquette.',
      date: 'October 15, 2026',
      time: '10:00 AM - 02:00 PM',
      duration: '3 to 5 Minutes per participant/team',
      qualificationCriteria: 'Top 8 highest scoring entries across technical criteria qualify for Stage Mains.'
    },
    {
      roundNumber: 2,
      title: 'Round 2 – Grand Amphitheatre Finals',
      description: 'Full-scale stage showcase under professional lighting, sound system, and live audience of 5,000+ students.',
      date: 'October 17, 2026',
      time: '05:30 PM - 09:30 PM',
      duration: '8 to 12 Minutes per team',
      qualificationCriteria: 'Judged on choreography/composition, audience impact, costumes, innovation, and adherence to time limits.'
    }
  ],
  TECHNICAL: [
    {
      roundNumber: 1,
      title: 'Round 1 – Ideation & Screening Assessment',
      description: 'Problem statement selection, rapid architectural pitch, and core algorithmic foundation review.',
      date: 'October 15, 2026',
      time: '09:30 AM - 12:30 PM',
      duration: '3 Hours',
      qualificationCriteria: 'Viability of solution, technical complexity, and architectural feasibility scored out of 100.'
    },
    {
      roundNumber: 2,
      title: 'Round 2 – Sprint Build & Checkpoint Review',
      description: 'Intense development sprint in high-performance labs with mentor evaluation and technical milestone reviews.',
      date: 'October 16, 2026',
      time: '01:00 PM - 07:00 PM',
      duration: '6 Hours',
      qualificationCriteria: 'Working code repository, test cases, and database integration verified by technical jury.'
    },
    {
      roundNumber: 3,
      title: 'Round 3 – Grand Jury Pitch & Live Demonstration',
      description: 'Live product demo before industry executives, venture evaluators, and department heads.',
      date: 'October 17, 2026',
      time: '11:00 AM - 02:30 PM',
      duration: '10 Mins Pitch + 5 Mins Q&A',
      qualificationCriteria: 'Final score calculated from codebase quality (40%), innovation (30%), and live demonstration (30%).'
    }
  ]
};

const FAQS_BY_CATEGORY = {
  SPORTS: [
    {
      question: 'What sports gear and kit must participants bring?',
      answer: 'Participants must report in proper sports attire (team jersey, shorts/trackpants, and non-marking rubber stud shoes for turf/synthetic courts). RVR&JC provides match balls, nets, and referee equipment.'
    },
    {
      question: 'Is inter-college team composition permitted?',
      answer: 'All members of a sports team must be bonafide students enrolled in the same college or university. Valid college identity cards and bonafide letters are mandatory during registration desk verification.'
    },
    {
      question: 'What happens in case of rain or inclement weather?',
      answer: 'Outdoor matches (Cricket, Football) will follow revised DLS/over reduction rules or move to reserve time slots. Indoor games (Badminton, TT, Chess, Basketball) proceed as scheduled in the Silver Jubilee Indoor Stadium.'
    }
  ],
  CULTURAL: [
    {
      question: 'Can we submit audio tracks and music beforehand?',
      answer: 'Yes! Audio tracks in high-quality MP3/WAV format must be handed over on a labeled USB pen drive at the sound desk at least 90 minutes before your round starts.'
    },
    {
      question: 'Are instruments and amplifiers provided for Battle of the Bands?',
      answer: 'Standard 5-piece drum kit, bass amp, guitar amps, and vocal microphones are provided on the main stage. Bands must bring their own guitars, keyboards, effect pedals, and patch cables.'
    },
    {
      question: 'Are there any theme or censorship restrictions on stage acts?',
      answer: 'Performances must adhere to collegiate ethics. Any content deemed derogatory, offensive, or politically incendiary will lead to immediate disqualification by the faculty panel.'
    }
  ],
  TECHNICAL: [
    {
      question: 'Can team members be from different engineering branches?',
      answer: 'Yes! Cross-departmental teams (e.g. CSE + ECE + Mechanical) from the same institution are encouraged for multidisciplinary innovation.'
    },
    {
      question: 'Is pre-written code allowed in Hackathon or Coding contests?',
      answer: 'All projects must be initialized during the official hackathon start window. Open-source libraries, frameworks, and public APIs are permitted, but core project logic must be built during the festival sprint.'
    },
    {
      question: 'Will high-speed internet and power outlets be provided?',
      answer: 'Every team workstation in the Advanced Computing Labs is equipped with multi-plug power strips, gigabit LAN connectivity, and uninterrupted campus Wi-Fi.'
    }
  ]
};

async function seedRoundsAndOrganizers() {
  console.log('Seeding detailed Rounds, Organizers, FAQs, Requirements for all 29 events...');

  const events = await prisma.event.findMany();
  console.log(`Found ${events.length} events to enrich.`);

  for (const event of events) {
    const cat = event.category.toUpperCase();
    const orgTemplates = ORGANIZER_TEMPLATES[cat] || ORGANIZER_TEMPLATES.TECHNICAL;
    const roundTemplates = ROUNDS_BY_CATEGORY[cat] || ROUNDS_BY_CATEGORY.TECHNICAL;
    const faqTemplates = FAQS_BY_CATEGORY[cat] || FAQS_BY_CATEGORY.TECHNICAL;

    // 1. Delete existing relational rounds, organizers, faqs for idempotency
    await prisma.eventRound.deleteMany({ where: { eventId: event.id } });
    await prisma.eventOrganizer.deleteMany({ where: { eventId: event.id } });
    await prisma.eventFaq.deleteMany({ where: { eventId: event.id } });

    // 2. Insert event-specific Organizers
    for (let i = 0; i < orgTemplates.length; i++) {
      const org = orgTemplates[i];
      await prisma.eventOrganizer.create({
        data: {
          eventId: event.id,
          name: org.name,
          role: org.role,
          department: org.dept,
          phone: org.phone,
          email: org.email,
          order: i
        }
      });
    }

    // 3. Insert event-specific Rounds
    for (let i = 0; i < roundTemplates.length; i++) {
      const r = roundTemplates[i];
      await prisma.eventRound.create({
        data: {
          eventId: event.id,
          roundNumber: r.roundNumber,
          title: r.title,
          description: r.description,
          date: r.date,
          time: r.time,
          venue: event.venue || r.venue,
          duration: r.duration,
          qualificationCriteria: r.qualificationCriteria,
          order: i
        }
      });
    }

    // 4. Insert event-specific FAQs
    for (let i = 0; i < faqTemplates.length; i++) {
      const f = faqTemplates[i];
      await prisma.eventFaq.create({
        data: {
          eventId: event.id,
          question: f.question,
          answer: f.answer,
          order: i
        }
      });
    }

    // 5. Update requirements and important dates on the event
    const requirements = cat === 'TECHNICAL'
      ? '• Bonafide student ID card & festival entry QR pass\n• Personal laptop with required compilers/frameworks installed\n• Extension cords & USB drives for project presentation\n• GitHub account with public commit history'
      : cat === 'SPORTS'
      ? '• College sports uniform / kit with visible chest numbers\n• Non-marking turf / rubber studs as per ground specification\n• Personal safety gear (guards, gloves, helmets where mandatory)\n• College bonafide eligibility certificate endorsed by Physical Director'
      : '• Official college ID card & festival confirmation ticket\n• High-resolution background music track on USB pen drive\n• Stage props and costumes (must be inspected by stage crew 1 hr before)\n• Live instrumentalists must register acoustic setup beforehand';

    const importantDates = `• Online Registration Closes: October 13, 2026 (11:59 PM)\n• Spot Registration & Desk Verification: October 15, 2026 (08:00 AM)\n• Tournament Schedule Release: October 14, 2026\n• Grand Prize Distribution & Valedictory: October 17, 2026 (06:00 PM)`;

    await prisma.event.update({
      where: { id: event.id },
      data: {
        requirements,
        importantDates
      }
    });
  }

  console.log('✅ Successfully enriched all 29 events with Rounds, Organizers, FAQs, Requirements, and Dates!');
  process.exit(0);
}

seedRoundsAndOrganizers().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
