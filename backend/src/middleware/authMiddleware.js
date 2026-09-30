const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma');
const config = require('../config');

/**
 * Authentication middleware for authenticated requests.
 * Strictly verifies JWT bearer token and fetches user or admin from DB.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to your account.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please sign in again.',
        error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
      });
    }

    const accountId = decoded.userId || decoded.adminId;
    if (!accountId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session structure.'
      });
    }

    // Check User table first
    let account = await prisma.user.findUnique({
      where: { id: accountId }
    });

    // Check Admin table if not found in User and token indicates ADMIN
    if (!account && (decoded.role === 'ADMIN' || decoded.adminId)) {
      account = await prisma.admin.findUnique({
        where: { id: accountId }
      });
      if (account) {
        req.admin = account;
      }
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Account profile not found or session revoked.'
      });
    }

    if (account.role === 'USER' && account.isVerified === false) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        message: 'Your account is not activated yet. Please verify your email before proceeding.'
      });
    }

    req.user = account;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional authentication middleware for endpoints that can enrich data
 * when a user is logged in, but don't strictly require it.
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const accountId = decoded.userId || decoded.adminId;
        if (accountId) {
          let account = await prisma.user.findUnique({ where: { id: accountId } });
          if (!account && (decoded.role === 'ADMIN' || decoded.adminId)) {
            account = await prisma.admin.findUnique({ where: { id: accountId } });
            if (account) req.admin = account;
          }
          if (account) req.user = account;
        }
      } catch (e) {
        // Silently ignore invalid optional tokens
      }
    }
  } catch (e) {}
  next();
}

module.exports = { requireAuth, optionalAuth };
