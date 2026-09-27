const prisma = require('../services/prisma');

/**
 * Public: Get published results with filters
 */
async function getResults(req, res, next) {
  try {
    const { eventId, category, search, includeUnpublished } = req.query;
    const where = {};

    if (includeUnpublished !== 'true') {
      where.published = true;
    }

    if (eventId) {
      where.eventId = eventId;
    }

    if (category && ['SPORTS', 'CULTURAL', 'TECHNICAL'].includes(category.toUpperCase())) {
      where.category = category.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { participantName: { contains: q, mode: 'insensitive' } },
        { college: { contains: q, mode: 'insensitive' } },
        { teamName: { contains: q, mode: 'insensitive' } },
        { event: { title: { contains: q, mode: 'insensitive' } } }
      ];
    }

    const results = await prisma.result.findMany({
      where,
      orderBy: [{ eventId: 'asc' }, { rank: 'asc' }],
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

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

/**
 * Public: Get collegiate points and medal leaderboard
 */
async function getLeaderboard(req, res, next) {
  try {
    const results = await prisma.result.findMany({
      where: { published: true },
      include: { event: true }
    });

    const colleges = {};

    results.forEach((r) => {
      const collegeName = r.college ? r.college.trim() : 'Independent';
      if (!colleges[collegeName]) {
        colleges[collegeName] = {
          college: collegeName,
          gold: 0,
          silver: 0,
          bronze: 0,
          points: 0,
          totalMedals: 0,
          eventsWon: []
        };
      }

      if (r.rank === 1) {
        colleges[collegeName].gold += 1;
        colleges[collegeName].points += 10;
        colleges[collegeName].totalMedals += 1;
        colleges[collegeName].eventsWon.push(`${r.event?.title || 'Event'} (Gold)`);
      } else if (r.rank === 2) {
        colleges[collegeName].silver += 1;
        colleges[collegeName].points += 7;
        colleges[collegeName].totalMedals += 1;
        colleges[collegeName].eventsWon.push(`${r.event?.title || 'Event'} (Silver)`);
      } else if (r.rank === 3) {
        colleges[collegeName].bronze += 1;
        colleges[collegeName].points += 5;
        colleges[collegeName].totalMedals += 1;
        colleges[collegeName].eventsWon.push(`${r.event?.title || 'Event'} (Bronze)`);
      } else {
        colleges[collegeName].points += 2;
      }
    });

    const leaderboard = Object.values(colleges).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gold !== a.gold) return b.gold - a.gold;
      return b.silver - a.silver;
    });

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Create result
 */
async function createResult(req, res, next) {
  try {
    const {
      eventId,
      category,
      rank,
      position,
      participantName,
      college,
      teamName,
      score,
      notes,
      published = true
    } = req.body;

    if (!eventId || !rank || !position || !participantName || !college) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: eventId, rank, position, participantName, and college are required.'
      });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const result = await prisma.result.create({
      data: {
        eventId,
        category: category ? category.toUpperCase() : event.category,
        rank: parseInt(rank),
        position: position.trim(),
        participantName: participantName.trim(),
        college: college.trim(),
        teamName: teamName ? teamName.trim() : null,
        score: score ? score.trim() : null,
        notes: notes ? notes.trim() : null,
        published: Boolean(published)
      },
      include: { event: true }
    });

    res.status(201).json({
      success: true,
      message: 'Result created successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update result
 */
async function updateResult(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    const {
      eventId,
      category,
      rank,
      position,
      participantName,
      college,
      teamName,
      score,
      notes,
      published
    } = req.body;

    const data = {};
    if (eventId !== undefined) data.eventId = eventId;
    if (category !== undefined) data.category = category.toUpperCase().trim();
    if (rank !== undefined) data.rank = parseInt(rank);
    if (position !== undefined) data.position = position.trim();
    if (participantName !== undefined) data.participantName = participantName.trim();
    if (college !== undefined) data.college = college.trim();
    if (teamName !== undefined) data.teamName = teamName ? teamName.trim() : null;
    if (score !== undefined) data.score = score ? score.trim() : null;
    if (notes !== undefined) data.notes = notes ? notes.trim() : null;
    if (published !== undefined) data.published = Boolean(published);

    const updated = await prisma.result.update({
      where: { id },
      data,
      include: { event: true }
    });

    res.json({
      success: true,
      message: 'Result updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete result
 */
async function deleteResult(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    await prisma.result.delete({ where: { id } });
    res.json({ success: true, message: 'Result deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Toggle publish result
 */
async function togglePublishResult(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    const updated = await prisma.result.update({
      where: { id },
      data: { published: !existing.published }
    });

    res.json({
      success: true,
      message: `Result ${updated.published ? 'published' : 'unpublished'} successfully`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getResults,
  getLeaderboard,
  createResult,
  updateResult,
  deleteResult,
  togglePublishResult
};
