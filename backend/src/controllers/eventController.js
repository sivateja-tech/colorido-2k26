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
        orderBy: [{ featured: 'desc' }, { title: 'asc' }]
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
 * Admin: Create new event
 * Section 52: Title, Category, Description, Date, Start time, End time, Venue, Prize, Capacity, Min team size, Max team size, Visual type, Image
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
      published = true
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
        featured: Boolean(featured),
        published: Boolean(published),
        imageUrl: imageUrl || null
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
 * Admin: Update existing event
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
      published
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (category !== undefined) data.category = category.toUpperCase().trim();
    if (visualType !== undefined) data.visualType = visualType.toLowerCase().trim();
    if (description !== undefined) data.description = description.trim();
    if (shortDescription !== undefined) data.shortDescription = shortDescription.trim();
    if (rules !== undefined) data.rules = rules.trim();
    if (eligibility !== undefined) data.eligibility = eligibility.trim();
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
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (featured !== undefined) data.featured = Boolean(featured);
    if (published !== undefined) data.published = Boolean(published);

    const updated = await prisma.event.update({
      where: { id },
      data
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
