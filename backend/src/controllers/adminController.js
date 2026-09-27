const prisma = require('../services/prisma');

/**
 * Admin: Get real database statistics
 * Section 51:
 * Total Events, Sports, Cultural, Technical,
 * Total Registrations, Today's Registrations,
 * Upcoming Events, Published Results
 */
async function getDashboardStats(req, res, next) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalEvents,
      sportsEvents,
      culturalEvents,
      technicalEvents,
      totalRegistrations,
      todayRegistrations,
      confirmedRegistrations,
      pendingRegistrations,
      cancelledRegistrations,
      upcomingEvents,
      publishedResults,
      unreadMessages,
      eventsSummary,
      recentRegistrations
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { category: 'SPORTS' } }),
      prisma.event.count({ where: { category: 'CULTURAL' } }),
      prisma.event.count({ where: { category: 'TECHNICAL' } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.registration.count({ where: { status: 'CONFIRMED' } }),
      prisma.registration.count({ where: { status: 'PENDING' } }),
      prisma.registration.count({ where: { status: 'CANCELLED' } }),
      prisma.event.count({ where: { published: true } }),
      prisma.result.count({ where: { published: true } }),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.event.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          visualType: true,
          capacity: true,
          registeredCount: true,
          venue: true,
          date: true,
          published: true,
          featured: true
        },
        orderBy: { registeredCount: 'desc' },
        take: 10
      }),
      prisma.registration.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              title: true,
              category: true
            }
          }
        }
      })
    ]);

    const totalCapacity = eventsSummary.reduce((sum, e) => sum + (e.capacity || 0), 0);
    const capacityPercent = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

    res.json({
      success: true,
      data: {
        metrics: {
          totalEvents,
          sportsEvents,
          culturalEvents,
          technicalEvents,
          totalRegistrations,
          todayRegistrations,
          confirmedRegistrations,
          pendingRegistrations,
          cancelledRegistrations,
          upcomingEvents,
          publishedResults,
          unreadMessages,
          capacityPercent
        },
        topEvents: eventsSummary,
        recentRegistrations
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats };
