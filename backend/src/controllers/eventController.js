const prisma = require('../services/prisma');

/**
 * Public: Get published events with search and filters
 */
async function getEvents(req, res, next) {
  try {
    const { category, search, venue, featured, page = 1, limit = 60 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const where = {};

    // By default, public only sees published events
    if (req.query.includeUnpublished !== 'true') {
      where.published = true;
    }

    if (category && ['SPORTS', 'CULTURAL', 'TECHNICAL'].includes(category.toUpperCase())) {
      where.category = category.toUpperCase();
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (venue) {
      where.venue = { contains: venue, mode: 'insensitive' };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { venue: { contains: q, mode: 'insensitive' } },
        { visualType: { contains: q, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: [{ featured: 'desc' }, { title: 'asc' }],
        include: {
          rounds: {
            orderBy: { roundNumber: 'asc' }
          },
          organizers: {
            orderBy: { order: 'asc' }
          },
          faqs: {
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      success: true,
      data: events,
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
 * Public: Get single event by slug or cuid
 */
async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }]
      },
      include: {
        rounds: {
          orderBy: { roundNumber: 'asc' }
        },
        organizers: {
          orderBy: { order: 'asc' }
        },
        faqs: {
          orderBy: { order: 'asc' }
        },
        schedules: {
          where: { published: true },
          orderBy: { order: 'asc' }
        },
        results: {
          where: { published: true },
          orderBy: { rank: 'asc' }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Create new event with rounds, organizers, faqs
 */
async function createEvent(req, res, next) {
  try {
    const {
      title,
      category,
      visualType,
      description,
      shortDescription,
      rules,
      eligibility,
      requirements,
      importantDates,
      date,
      startTime,
      endTime,
      venue,
      prizePool,
      firstPrize,
      secondPrize,
      capacity = 50,
      participantType = 'INDIVIDUAL',
      minTeamSize = 1,
      maxTeamSize = 1,
      imageUrl,
      featured = false,
      published = true,
      rounds = [],
      organizers = [],
      faqs = []
    } = req.body;

    if (!title || !category || !description || !date || !startTime || !endTime || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, category, description, date, startTime, endTime, and venue are required.'
      });
    }

    const validCategories = ['SPORTS', 'CULTURAL', 'TECHNICAL'];
    const normCategory = category.toUpperCase().trim();
    if (!validCategories.includes(normCategory)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newEvent = await prisma.event.create({
      data: {
        title: title.trim(),
        slug,
        category: normCategory,
        visualType: visualType ? visualType.toLowerCase().trim() : 'custom',
        description: description.trim(),
        shortDescription: shortDescription ? shortDescription.trim() : description.slice(0, 150),
        rules: rules ? rules.trim() : 'Standard collegiate competition rules apply.',
        eligibility: eligibility ? eligibility.trim() : 'Open to all bonafide college students with valid student ID.',
        requirements: requirements ? requirements.trim() : null,
        importantDates: importantDates ? importantDates.trim() : null,
        date: date.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        venue: venue.trim(),
        prizePool: prizePool || '₹20,000',
        firstPrize: firstPrize || '₹12,000',
        secondPrize: secondPrize || '₹8,000',
        capacity: parseInt(capacity) || 50,
        registeredCount: 0,
        participantType: participantType.toUpperCase(),
        minTeamSize: parseInt(minTeamSize) || 1,
        maxTeamSize: parseInt(maxTeamSize) || 1,
        registrationType: (registrationType || (participantType === 'TEAM' ? 'TEAM' : (participantType === 'GROUP' ? 'GROUP' : 'INDIVIDUAL'))).toUpperCase(),
        isTeamNameRequired: Boolean(isTeamNameRequired || participantType === 'TEAM' || registrationType === 'TEAM'),
        isCaptainRequired: isCaptainRequired !== undefined ? Boolean(isCaptainRequired) : true,
        areMemberEmailsRequired: Boolean(areMemberEmailsRequired),
        featured: Boolean(featured),
        published: Boolean(published),
        imageUrl: imageUrl || null,
        rounds: Array.isArray(rounds) && rounds.length > 0 ? {
          create: rounds.map((r, idx) => ({
            roundNumber: parseInt(r.roundNumber) || idx + 1,
            title: r.title || `Round ${idx + 1}`,
            description: r.description || '',
            date: r.date || date,
            time: r.time || `${startTime} - ${endTime}`,
            venue: r.venue || venue,
            duration: r.duration || '2 Hours',
            qualificationCriteria: r.qualificationCriteria || 'Top scoring participants qualify.',
            order: idx
          }))
        } : undefined,
        organizers: Array.isArray(organizers) && organizers.length > 0 ? {
          create: organizers.map((o, idx) => ({
            name: o.name || 'Coordinator',
            role: o.role || 'Event Coordinator',
            department: o.department || 'RVR & JC College of Engineering',
            phone: o.phone || '+91 98765 43210',
            email: o.email || 'coordinator@rvrjc.ac.in',
            order: idx
          }))
        } : undefined,
        faqs: Array.isArray(faqs) && faqs.length > 0 ? {
          create: faqs.map((f, idx) => ({
            question: f.question,
            answer: f.answer,
            order: idx
          }))
        } : undefined
      },
      include: {
        rounds: true,
        organizers: true,
        faqs: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Event successfully created',
      data: newEvent
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update existing event with rounds, organizers, faqs
 */
async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const {
      title,
      category,
      visualType,
      description,
      shortDescription,
      rules,
      eligibility,
      requirements,
      importantDates,
      date,
      startTime,
      endTime,
      venue,
      prizePool,
      firstPrize,
      secondPrize,
      capacity,
      participantType,
      minTeamSize,
      maxTeamSize,
      imageUrl,
      featured,
      published,
      rounds,
      organizers,
      faqs
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (category !== undefined) data.category = category.toUpperCase().trim();
    if (visualType !== undefined) data.visualType = visualType.toLowerCase().trim();
    if (description !== undefined) data.description = description.trim();
    if (shortDescription !== undefined) data.shortDescription = shortDescription.trim();
    if (rules !== undefined) data.rules = rules.trim();
    if (eligibility !== undefined) data.eligibility = eligibility.trim();
    if (requirements !== undefined) data.requirements = requirements.trim();
    if (importantDates !== undefined) data.importantDates = importantDates.trim();
    if (date !== undefined) data.date = date.trim();
    if (startTime !== undefined) data.startTime = startTime.trim();
    if (endTime !== undefined) data.endTime = endTime.trim();
    if (venue !== undefined) data.venue = venue.trim();
    if (prizePool !== undefined) data.prizePool = prizePool;
    if (firstPrize !== undefined) data.firstPrize = firstPrize;
    if (secondPrize !== undefined) data.secondPrize = secondPrize;
    if (capacity !== undefined) data.capacity = parseInt(capacity);
    if (participantType !== undefined) data.participantType = participantType.toUpperCase();
    if (minTeamSize !== undefined) data.minTeamSize = parseInt(minTeamSize);
    if (maxTeamSize !== undefined) data.maxTeamSize = parseInt(maxTeamSize);
    if (req.body.registrationType !== undefined) data.registrationType = req.body.registrationType.toUpperCase();
    if (req.body.isTeamNameRequired !== undefined) data.isTeamNameRequired = Boolean(req.body.isTeamNameRequired);
    if (req.body.isCaptainRequired !== undefined) data.isCaptainRequired = Boolean(req.body.isCaptainRequired);
    if (req.body.areMemberEmailsRequired !== undefined) data.areMemberEmailsRequired = Boolean(req.body.areMemberEmailsRequired);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (featured !== undefined) data.featured = Boolean(featured);
    if (published !== undefined) data.published = Boolean(published);

    // Update main event
    await prisma.event.update({
      where: { id },
      data
    });

    // Sync Rounds if provided
    if (Array.isArray(rounds)) {
      await prisma.eventRound.deleteMany({ where: { eventId: id } });
      if (rounds.length > 0) {
        await prisma.eventRound.createMany({
          data: rounds.map((r, idx) => ({
            eventId: id,
            roundNumber: parseInt(r.roundNumber) || idx + 1,
            title: r.title || `Round ${idx + 1}`,
            description: r.description || '',
            date: r.date || existing.date,
            time: r.time || `${existing.startTime} - ${existing.endTime}`,
            venue: r.venue || existing.venue,
            duration: r.duration || '2 Hours',
            qualificationCriteria: r.qualificationCriteria || 'Top scoring participants qualify.',
            order: idx
          }))
        });
      }
    }

    // Sync Organizers if provided
    if (Array.isArray(organizers)) {
      await prisma.eventOrganizer.deleteMany({ where: { eventId: id } });
      if (organizers.length > 0) {
        await prisma.eventOrganizer.createMany({
          data: organizers.map((o, idx) => ({
            eventId: id,
            name: o.name || 'Coordinator',
            role: o.role || 'Event Coordinator',
            department: o.department || 'RVR & JC College of Engineering',
            phone: o.phone || '+91 98765 43210',
            email: o.email || 'coordinator@rvrjc.ac.in',
            order: idx
          }))
        });
      }
    }

    // Sync FAQs if provided
    if (Array.isArray(faqs)) {
      await prisma.eventFaq.deleteMany({ where: { eventId: id } });
      if (faqs.length > 0) {
        await prisma.eventFaq.createMany({
          data: faqs.map((f, idx) => ({
            eventId: id,
            question: f.question,
            answer: f.answer,
            order: idx
          }))
        });
      }
    }

    const updated = await prisma.event.findUnique({
      where: { id },
      include: {
        rounds: { orderBy: { roundNumber: 'asc' } },
        organizers: { orderBy: { order: 'asc' } },
        faqs: { orderBy: { order: 'asc' } }
      }
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete event
 */
async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Toggle publish
 */
async function togglePublish(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { published: !existing.published }
    });

    res.json({
      success: true,
      message: `Event ${updated.published ? 'published' : 'unpublished'} successfully`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Toggle featured
 */
async function toggleFeatured(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { featured: !existing.featured }
    });

    res.json({
      success: true,
      message: `Event ${updated.featured ? 'marked as featured' : 'unfeatured'} successfully`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  togglePublish,
  toggleFeatured
};
