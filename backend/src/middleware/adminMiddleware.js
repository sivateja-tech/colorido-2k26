const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma');
const config = require('../config');

/**
 * Admin authorization middleware.
 * Verifies JWT token is an admin token and admin exists in database.
 * Returns 401 if missing/invalid, 403 if user lacks admin role.
 */
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Admin authorization required. Please log in to admin portal.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired admin session token.',
        error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
      });
    }

    // Role check: Normal users will not have type === 'ADMIN' or role === 'ADMIN'
    if (decoded.type !== 'ADMIN' && decoded.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator privileges required.'
      });
    }

    if (!decoded.adminId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Invalid administrator token structure.'
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or has been revoked.'
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAdmin };
