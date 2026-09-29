const crypto = require('crypto');
const prisma = require('../services/prisma');
const config = require('../config');

function generateRegistrationId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return `COL26-${code}`;
}

/**
 * Normal User: Create registration for an event.
 * Uses atomic transaction to verify event, check capacity, prevent duplicate,
 * increment registeredCount, and create Registration.
 */
async function createRegistration(req, res, next) {
  try {
    const {
      eventId,
      fullName,
      email,
      phone,
      college,
      department,
      year,
      participantType = 'INDIVIDUAL',
      teamName,
      teamMembers
    } = req.body;

    // Validate required fields
    if (!eventId || !fullName || !email || !phone || !college || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: event, full name, email, phone, college, department, and year are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // If user is authenticated, verify their email or link their ID
    const userId = req.user ? req.user.id : null;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!event.published) {
      return res.status(400).json({ success: false, message: 'Registration for this event is currently not open.' });
    }

    let registration;
    try {
      registration = await prisma.$transaction(async (tx) => {
        // 1. Prevent duplicate registration
        const existing = await tx.registration.findFirst({
          where: {
            eventId,
            email: normalizedEmail
          }
        });

        if (existing) {
          const err = new Error(`You have already registered for ${event.title} with email ${normalizedEmail}.`);
          err.statusCode = 409;
          throw err;
        }

        // 2. Prevent capacity overflow with atomic check
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

        // 3. Unique registration ID
        let registrationId = generateRegistrationId();
        while (await tx.registration.findUnique({ where: { registrationId } })) {
          registrationId = generateRegistrationId();
        }

        // QR data payload: direct scannable verification URL
        const frontendUrl = config.FRONTEND_URL || 'http://localhost:5173';
        const qrPayload = `${frontendUrl}/verify/${registrationId}`;

        const newReg = await tx.registration.create({
          data: {
            registrationId,
            userId,
            eventId,
            fullName: fullName.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            college: college.trim(),
            department: department.trim(),
            year: year.trim(),
            participantType: participantType.toUpperCase(),
            teamName: teamName ? teamName.trim() : null,
            teamMembers: teamMembers ? (typeof teamMembers === 'string' ? teamMembers : JSON.stringify(teamMembers)) : null,
            status: 'CONFIRMED',
            qrData: qrPayload
          },
          include: {
            event: true
          }
        });

        return newReg;
      });
    } catch (txError) {
      if (txError.statusCode) {
        return res.status(txError.statusCode).json({ success: false, message: txError.message });
      }
      if (txError.code === 'P2002') {
        return res.status(409).json({ success: false, message: `Duplicate registration detected for email ${normalizedEmail}.` });
      }
      throw txError;
    }

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
 * Section 47 & Section 57: Normal users must ONLY see their own registrations.
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
            prizePool: true
          }
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
 * Section 53
 */
async function getAllRegistrations(req, res, next) {
  try {
    const { search, eventId, category, status, page = 1, limit = 25 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const where = {};

    if (eventId) {
      where.eventId = eventId;
    }

    if (category) {
      where.event = { category: category.toUpperCase() };
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { registrationId: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { college: { contains: q, mode: 'insensitive' } },
        { teamName: { contains: q, mode: 'insensitive' } },
        { event: { title: { contains: q, mode: 'insensitive' } } }
      ];
    }

    const [registrations, total] = await Promise.all([
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
              venue: true
            }
          }
        }
      }),
      prisma.registration.count({ where })
    ]);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take)
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

    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'];
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
      data: { status: status.toUpperCase() },
      include: { event: true }
    });

    res.json({
      success: true,
      message: `Registration status updated to ${status.toUpperCase()}`,
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
  updateRegistrationStatus
};
