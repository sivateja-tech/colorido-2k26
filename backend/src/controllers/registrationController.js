const crypto = require('crypto');
const prisma = require('../services/prisma');
const config = require('../config');
const socketService = require('../services/socketService');

function generateRegistrationId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return `COL26-${code}`;
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function parseFestivalEventDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  // Handle formats like "October 15-16, 2026" or "October 15, 2026" or "2026-10-15"
  const rangeMatch = dateStr.match(/([a-zA-Z]+)\s+(\d+)(?:\s*[-–]\s*(\d+))?,\s*(\d{4})/);
  if (rangeMatch) {
    const month = rangeMatch[1];
    const endDay = rangeMatch[3] || rangeMatch[2];
    const year = rangeMatch[4];
    const parsed = new Date(`${month} ${endDay}, ${year}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Normal User: Create registration for an event.
 * Uses atomic transaction to verify event, check capacity, prevent duplicate,
 * increment registeredCount, create Registration, and insert RegistrationParticipants.
 */
async function createRegistration(req, res, next) {
  try {
    // 1. Strictly require authenticated & verified user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to register for events.'
      });
    }

    if (req.user.isVerified === false) {
      return res.status(403).json({
        success: false,
        unverified: true,
        requiresVerification: true,
        email: req.user.email,
        message: 'Your email address is not verified. Please verify your email before registering.'
      });
    }

    const {
      eventId,
      fullName,
      email,
      phone,
      college,
      department,
      year,
      participantType,
      registrationType,
      teamName,
      teamMembers,
      participants = []
    } = req.body;

    // Validate required fields
    if (!eventId || !fullName || !email || !phone || !college || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: event, captain name, email, phone, college, department, and year are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const captainName = fullName.trim();
    const captainPhone = phone.trim();
    const captainCollege = college.trim();

    // 2. Fetch event configuration
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (!event.published) {
      return res.status(400).json({ success: false, message: 'Registration for this event is currently not open.' });
    }

    // Check if event date has already passed
    if (event.date) {
      const eventDateParsed = parseFestivalEventDate(event.date);
      if (eventDateParsed) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eventDateParsed < today) {
          return res.status(400).json({
            success: false,
            message: `Registration is closed because the event date (${event.date}) has already passed.`
          });
        }
      }
    }

    // Determine effective registration type: INDIVIDUAL, GROUP, or TEAM
    const effectiveType = (
      registrationType ||
      participantType ||
      (event.participantType && event.participantType !== 'INDIVIDUAL' ? event.participantType : (event.registrationType || 'INDIVIDUAL'))
    ).toUpperCase();

    // Parse additional team/group members
    let additionalMembers = [];
    if (Array.isArray(participants) && participants.length > 0) {
      additionalMembers = participants;
    } else if (teamMembers) {
      if (typeof teamMembers === 'string') {
        try {
          const parsed = JSON.parse(teamMembers);
          if (Array.isArray(parsed)) {
            additionalMembers = parsed;
          } else {
            additionalMembers = teamMembers.split(',').map(name => ({ name: name.trim() })).filter(m => m.name);
          }
        } catch (e) {
          additionalMembers = teamMembers.split(',').map(name => ({ name: name.trim() })).filter(m => m.name);
        }
      } else if (Array.isArray(teamMembers)) {
        additionalMembers = teamMembers;
      }
    }

    // Normalize additional members
    const cleanMembers = additionalMembers
      .map(m => {
        if (typeof m === 'string') return { name: m.trim(), email: null, phone: null, college: captainCollege };
        return {
          name: (m.name || '').trim(),
          email: m.email ? m.email.toLowerCase().trim() : null,
          phone: m.phone ? m.phone.trim() : null,
          college: m.college ? m.college.trim() : captainCollege
        };
      })
      .filter(m => m.name.length > 0);

    // Total participants = Captain (1) + Additional Members
    const totalParticipantsCount = 1 + cleanMembers.length;

    // Validate registration rules based on event configuration
    if (effectiveType === 'INDIVIDUAL') {
      if (cleanMembers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'This is an individual event. Additional participants cannot be added.'
        });
      }
    } else {
      // GROUP or TEAM events
      const minRequired = event.minTeamSize || (effectiveType === 'TEAM' ? 5 : 2);
      const maxAllowed = event.maxTeamSize || (effectiveType === 'TEAM' ? 16 : 10);

      // Check team name requirement
      const trimmedTeamName = (teamName || '').trim();
      if ((event.isTeamNameRequired || effectiveType === 'TEAM' || effectiveType === 'GROUP') && !trimmedTeamName) {
        return res.status(400).json({
          success: false,
          message: 'Team / Group Name is required for this event.'
        });
      }

      // Check member count
      if (totalParticipantsCount < minRequired) {
        return res.status(400).json({
          success: false,
          message: `Minimum participant requirement not met. This event requires at least ${minRequired} participants (current: ${totalParticipantsCount}).`
        });
      }

      if (totalParticipantsCount > maxAllowed) {
        return res.status(400).json({
          success: false,
          message: `Maximum participant limit exceeded. This event allows at most ${maxAllowed} participants (current: ${totalParticipantsCount}).`
        });
      }

      // Check if member emails are strictly required by event
      if (event.areMemberEmailsRequired) {
        for (const m of cleanMembers) {
          if (!m.email || !m.email.includes('@')) {
            return res.status(400).json({
              success: false,
              message: `Participant ${m.name} is missing a valid email address, which is required for this event.`
            });
          }
        }
      }

      // Check for duplicate participant names within the same team submission
      const allNames = [captainName.toLowerCase(), ...cleanMembers.map(m => m.name.toLowerCase())];
      const uniqueNames = new Set(allNames);
      if (uniqueNames.size !== allNames.length) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate participant names detected within your registration. Each participant must have a distinct name.'
        });
      }
    }

    const normalizedTeamName = teamName ? teamName.trim() : null;

    let registration;
    try {
      registration = await prisma.$transaction(async (tx) => {
        // 1. Prevent duplicate active registration by Captain Email
        const existingByEmail = await tx.registration.findFirst({
          where: {
            eventId,
            email: normalizedEmail,
            status: { notIn: ['CANCELLED', 'REJECTED'] }
          }
        });

        if (existingByEmail) {
          const err = new Error(`You have already registered for ${event.title} (Registration ID: ${existingByEmail.registrationId}).`);
          err.statusCode = 409;
          err.existingRegistrationId = existingByEmail.registrationId;
          throw err;
        }

        // 2. Prevent duplicate active registration by Team Name
        if (normalizedTeamName) {
          const existingByTeam = await tx.registration.findFirst({
            where: {
              eventId,
              teamName: { equals: normalizedTeamName, mode: 'insensitive' },
              status: { notIn: ['CANCELLED', 'REJECTED'] }
            }
          });

          if (existingByTeam) {
            const err = new Error(`A team named "${normalizedTeamName}" has already registered for ${event.title}. Please choose a unique team name.`);
            err.statusCode = 409;
            throw err;
          }
        }

        // 3. Prevent capacity overflow with atomic check
        const currentEvent = await tx.event.findUnique({
          where: { id: eventId },
          select: { capacity: true, registeredCount: true }
        });

        if (currentEvent.registeredCount >= currentEvent.capacity) {
          const err = new Error(`Registration closed: ${event.title} has reached its capacity of ${currentEvent.capacity} slots.`);
          err.statusCode = 400;
          throw err;
        }

        // Increment registered count
        await tx.event.update({
          where: { id: eventId },
          data: { registeredCount: { increment: 1 } }
        });

        // 4. Generate unique human-readable Registration ID
        let registrationId = generateRegistrationId();
        while (await tx.registration.findUnique({ where: { registrationId } })) {
          registrationId = generateRegistrationId();
        }

        // 5. Generate 6-digit verification code
        const verificationCode = generateVerificationCode();

        // Pass URL payload
        const frontendUrl = config.FRONTEND_URL || 'http://localhost:5173';
        const passPayload = `${frontendUrl}/verify/${registrationId}`;

        // 6. Create Registration record
        const newReg = await tx.registration.create({
          data: {
            registrationId,
            verificationCode,
            userId: req.user.id,
            eventId,
            fullName: captainName,
            email: normalizedEmail,
            phone: captainPhone,
            college: captainCollege,
            department: department.trim(),
            year: year.trim(),
            participantType: effectiveType,
            teamName: normalizedTeamName,
            teamMembers: cleanMembers.length > 0 ? JSON.stringify(cleanMembers.map(m => m.name)) : null,
            status: 'CONFIRMED',
            qrData: passPayload,
            participants: {
              create: [
                // Captain / Primary registrant (Order 0)
                {
                  name: captainName,
                  email: normalizedEmail,
                  phone: captainPhone,
                  college: captainCollege,
                  isCaptain: true,
                  order: 0
                },
                // Additional members (Order 1..N)
                ...cleanMembers.map((m, idx) => ({
                  name: m.name,
                  email: m.email || null,
                  phone: m.phone || null,
                  college: m.college || captainCollege,
                  isCaptain: false,
                  order: idx + 1
                }))
              ]
            }
          },
          include: {
            event: true,
            participants: {
              orderBy: { order: 'asc' }
            }
          }
        });

        return newReg;
      });
    } catch (txError) {
      if (txError.statusCode) {
        return res.status(txError.statusCode).json({
          success: false,
          message: txError.message,
          existingRegistrationId: txError.existingRegistrationId
        });
      }
      if (txError.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: `Duplicate registration detected for this event.`
        });
      }
      throw txError;
    }

    // Real-time notification to authorized admins via Socket.IO
    socketService.emitAdminRegistration(registration);

    res.status(201).json({
      success: true,
      message: 'Registration confirmed successfully!',
      data: registration
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Normal User: Get own registrations only
 */
async function getUserRegistrations(req, res, next) {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email.toLowerCase().trim();

    const registrations = await prisma.registration.findMany({
      where: {
        OR: [
          { userId: userId },
          { email: userEmail }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            visualType: true,
            date: true,
            startTime: true,
            endTime: true,
            venue: true,
            prizePool: true,
            registrationType: true
          }
        },
        participants: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      data: registrations
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get single registration by ID or registrationId (Pass lookup)
 */
async function getRegistrationById(req, res, next) {
  try {
    const { id } = req.params;
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId: id.toUpperCase().trim() },
          { id: id }
        ]
      },
      include: {
        event: true,
        participants: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration pass not found for the specified ID.'
      });
    }

    res.json({
      success: true,
      data: registration
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get ALL registrations with search, filter, pagination
 */
/**
 * Admin: Get ALL registrations with search, filter, and server-side pagination
 */
async function getAllRegistrations(req, res, next) {
  try {
    const {
      search,
      eventId,
      category,
      status,
      participantType,
      checkedIn,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    // Cap limit at 100 to prevent database exhaustion
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const where = {};

    if (eventId && eventId !== 'ALL') {
      where.eventId = eventId;
    }

    if (category && category !== 'ALL') {
      where.event = { category: category.toUpperCase() };
    }

    if (status && status !== 'ALL') {
      if (status.toUpperCase() === 'CHECKED_IN') {
        where.OR = [
          { status: 'CHECKED_IN' },
          { checkedIn: true }
        ];
      } else {
        where.status = status.toUpperCase();
      }
    }

    if (checkedIn !== undefined && checkedIn !== null && checkedIn !== '' && checkedIn !== 'ALL') {
      where.checkedIn = checkedIn === 'true' || checkedIn === true;
    }

    if (participantType && participantType !== 'ALL') {
      where.participantType = participantType.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      const searchConditions = [
        { registrationId: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { college: { contains: q, mode: 'insensitive' } },
        { teamName: { contains: q, mode: 'insensitive' } },
        { event: { title: { contains: q, mode: 'insensitive' } } },
        { participants: { some: { name: { contains: q, mode: 'insensitive' } } } }
      ];

      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: searchConditions }
        ];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    const [registrations, totalItems] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              category: true,
              date: true,
              venue: true,
              registrationType: true
            }
          },
          participants: {
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.registration.count({ where })
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / limitNum));
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    res.json({
      success: true,
      data: registrations,
      registrations,
      currentPage: pageNum,
      pageSize: limitNum,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      pagination: {
        currentPage: pageNum,
        pageSize: limitNum,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page: pageNum,
        limit: limitNum,
        total: totalItems,
        pages: totalPages
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update registration status
 */
async function updateRegistrationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'CHECKED_IN'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = await prisma.registration.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const updated = await prisma.registration.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        checkedIn: status.toUpperCase() === 'CHECKED_IN' ? true : existing.checkedIn,
        checkedInAt: status.toUpperCase() === 'CHECKED_IN' ? (existing.checkedInAt || new Date()) : existing.checkedInAt
      },
      include: {
        event: true,
        participants: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Real-time notification to authorized admins
    socketService.emitAdminStatusUpdate(updated);

    res.json({
      success: true,
      message: `Registration status updated to ${status.toUpperCase()}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin / Mobile Check-in: Search Registration ID, Verify Participant, Mark as Checked In
 * Checks in the entire registration / team and returns full participant details with captain
 */
async function checkInParticipant(req, res, next) {
  try {
    const { registrationId } = req.body;
    if (!registrationId || !registrationId.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Registration ID.' });
    }

    const query = registrationId.trim();
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId: { equals: query, mode: 'insensitive' } },
          { id: query }
        ]
      },
      include: {
        event: true,
        participants: {
          orderBy: { order: 'asc' }
        },
        user: true
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `No registration found matching "${query}". Please check the Registration ID.`
      });
    }

    if (registration.status === 'REJECTED' || registration.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: `This registration has status ${registration.status} and cannot be checked in.`,
        data: registration
      });
    }

    if (registration.checkedIn) {
      return res.json({
        success: true,
        alreadyCheckedIn: true,
        message: `Participant was already checked in at ${new Date(registration.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        data: registration
      });
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
        status: 'CHECKED_IN'
      },
      include: {
        event: true,
        participants: {
          orderBy: { order: 'asc' }
        },
        user: true
      }
    });

    // Real-time notification to authorized admins
    socketService.emitAdminCheckIn(updated);

    res.json({
      success: true,
      message: `Participant ${updated.fullName} and team successfully checked in for ${updated.event.title}!`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRegistration,
  getUserRegistrations,
  getRegistrationById,
  getAllRegistrations,
  updateRegistrationStatus,
  checkInParticipant
};
