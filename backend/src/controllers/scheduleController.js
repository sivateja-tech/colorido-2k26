const prisma = require('../services/prisma');

/**
 * Public: Get published schedule slots
 */
async function getSchedule(req, res, next) {
  try {
    const { category, date, status, includeUnpublished } = req.query;
    const where = {};

    if (includeUnpublished !== 'true') {
      where.published = true;
    }

    if (category && ['SPORTS', 'CULTURAL', 'TECHNICAL'].includes(category.toUpperCase())) {
      where.category = category.toUpperCase();
    }

    if (date) {
      where.date = { contains: date, mode: 'insensitive' };
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    const schedule = await prisma.schedule.findMany({
      where,
      orderBy: [{ date: 'asc' }, { order: 'asc' }, { startTime: 'asc' }],
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            visualType: true,
            venue: true
          }
        }
      }
    });

    res.json({ success: true, data: schedule });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Create schedule item
 */
async function createSchedule(req, res, next) {
  try {
    const {
      title,
      category,
      date,
      startTime,
      endTime,
      venue,
      stage,
      description,
      status = 'SCHEDULED',
      eventId,
      order = 0,
      published = true
    } = req.body;

    if (!title || !category || !date || !startTime || !endTime || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, category, date, startTime, endTime, and venue are required.'
      });
    }

    const item = await prisma.schedule.create({
      data: {
        title: title.trim(),
        category: category.toUpperCase().trim(),
        date: date.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        venue: venue.trim(),
        stage: stage ? stage.trim() : null,
        description: description ? description.trim() : null,
        status: status.toUpperCase(),
        eventId: eventId || null,
        order: parseInt(order) || 0,
        published: Boolean(published)
      },
      include: { event: true }
    });

    res.status(201).json({
      success: true,
      message: 'Schedule slot created successfully',
      data: item
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update schedule item
 */
async function updateSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Schedule item not found' });
    }

    const {
      title,
      category,
      date,
      startTime,
      endTime,
      venue,
      stage,
      description,
      status,
      eventId,
      order,
      published
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (category !== undefined) data.category = category.toUpperCase().trim();
    if (date !== undefined) data.date = date.trim();
    if (startTime !== undefined) data.startTime = startTime.trim();
    if (endTime !== undefined) data.endTime = endTime.trim();
    if (venue !== undefined) data.venue = venue.trim();
    if (stage !== undefined) data.stage = stage ? stage.trim() : null;
    if (description !== undefined) data.description = description ? description.trim() : null;
    if (status !== undefined) data.status = status.toUpperCase();
    if (eventId !== undefined) data.eventId = eventId || null;
    if (order !== undefined) data.order = parseInt(order);
    if (published !== undefined) data.published = Boolean(published);

    const updated = await prisma.schedule.update({
      where: { id },
      data,
      include: { event: true }
    });

    res.json({
      success: true,
      message: 'Schedule slot updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete schedule item
 */
async function deleteSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Schedule item not found' });
    }

    await prisma.schedule.delete({ where: { id } });
    res.json({ success: true, message: 'Schedule slot deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Toggle publish schedule item
 */
async function togglePublishSchedule(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Schedule item not found' });
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: { published: !existing.published }
    });

    res.json({
      success: true,
      message: `Schedule ${updated.published ? 'published' : 'unpublished'} successfully`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  togglePublishSchedule
};
