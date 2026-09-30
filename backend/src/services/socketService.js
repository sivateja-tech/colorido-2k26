const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');
const prisma = require('./prisma');

let io = null;

/**
 * Initialize Socket.IO with HTTP Server
 */
function init(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
    },
    pingTimeout: 30000,
    pingInterval: 15000,
    transports: ['websocket', 'polling']
  });

  // Authentication & Authorization Handshake Middleware
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers?.authorization;
      const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      const token = socket.handshake.auth?.token || bearerToken;

      if (!token) {
        socket.isAdmin = false;
        return next();
      }

      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if ((decoded.role === 'ADMIN' || decoded.type === 'ADMIN') && decoded.adminId) {
          const admin = await prisma.admin.findUnique({
            where: { id: decoded.adminId },
            select: { id: true, email: true, name: true, role: true }
          });

          if (admin) {
            socket.isAdmin = true;
            socket.admin = admin;
            return next();
          }
        }
      } catch (tokenErr) {
        // Invalid or expired token: fall back to non-admin
      }

      socket.isAdmin = false;
      return next();
    } catch (err) {
      console.error('[Socket.IO] Handshake auth error:', err.message);
      next(err);
    }
  });

  io.on('connection', (socket) => {
    if (socket.isAdmin) {
      socket.join('admin_channel');
      console.log(`⚡ [Socket.IO] Authenticated Admin connected: ${socket.admin.email} (socket: ${socket.id})`);
    } else {
      console.log(`⚡ [Socket.IO] Public client connected (socket: ${socket.id})`);
    }

    socket.on('disconnect', (reason) => {
      // Normal disconnect log
    });
  });

  return io;
}

/**
 * Get active io instance
 */
function getIO() {
  return io;
}

/**
 * Emit new registration event to authorized admins only
 */
function emitAdminRegistration(registration) {
  if (!io) return;
  try {
    const payload = {
      id: registration.id,
      registrationId: registration.registrationId,
      verificationCode: registration.verificationCode,
      fullName: registration.fullName,
      email: registration.email,
      phone: registration.phone,
      college: registration.college,
      department: registration.department,
      year: registration.year,
      participantType: registration.participantType,
      teamName: registration.teamName,
      status: registration.status,
      checkedIn: registration.checkedIn,
      checkedInAt: registration.checkedInAt,
      createdAt: registration.createdAt,
      event: registration.event ? {
        id: registration.event.id,
        title: registration.event.title,
        category: registration.event.category,
        registrationType: registration.event.registrationType
      } : null,
      participants: Array.isArray(registration.participants) ? registration.participants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        isCaptain: p.isCaptain
      })) : []
    };

    io.to('admin_channel').emit('admin:new_registration', payload);
  } catch (err) {
    console.error('[Socket.IO] Error emitting registration event:', err.message);
  }
}

/**
 * Emit check-in event to authorized admins
 */
function emitAdminCheckIn(registration) {
  if (!io) return;
  try {
    io.to('admin_channel').emit('admin:check_in_update', {
      id: registration.id,
      registrationId: registration.registrationId,
      fullName: registration.fullName,
      eventTitle: registration.event?.title,
      checkedIn: registration.checkedIn,
      checkedInAt: registration.checkedInAt,
      status: registration.status
    });
  } catch (err) {
    console.error('[Socket.IO] Error emitting check-in event:', err.message);
  }
}

/**
 * Emit registration status change to authorized admins
 */
function emitAdminStatusUpdate(registration) {
  if (!io) return;
  try {
    io.to('admin_channel').emit('admin:status_update', {
      id: registration.id,
      registrationId: registration.registrationId,
      status: registration.status,
      checkedIn: registration.checkedIn,
      checkedInAt: registration.checkedInAt
    });
  } catch (err) {
    console.error('[Socket.IO] Error emitting status update event:', err.message);
  }
}

module.exports = {
  init,
  getIO,
  emitAdminRegistration,
  emitAdminCheckIn,
  emitAdminStatusUpdate
};
