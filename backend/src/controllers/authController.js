const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../services/prisma');
const config = require('../config');
const { verifyGoogleToken } = require('../services/googleAuth');

/**
 * Handle Google OAuth Sign-in / Sign-up for Normal Users
 * Section 42: Real Google OAuth 2.0 / Google Identity Services
 */
async function googleAuth(req, res, next) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required'
      });
    }

    const googleUser = await verifyGoogleToken(credential);

    // Upsert user in database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.picture,
          googleId: googleUser.googleId,
          role: 'USER',
          college: 'R V R & J C College of Engineering'
        }
      });
    } else {
      // Update profile image or googleId if missing
      const updates = {};
      if (!user.profileImage && googleUser.picture) updates.profileImage = googleUser.picture;
      if (!user.googleId && googleUser.googleId) updates.googleId = googleUser.googleId;
      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates
        });
      }
    }

    const appToken = jwt.sign(
      { userId: user.id, email: user.email, role: 'USER' },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Successfully authenticated with Google',
      data: {
        token: appToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          college: user.college,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message || 'Google authentication failed'
    });
  }
}

/**
 * Handle Direct Email Sign-in / Sign-up for Normal Users
 * Allows participants to sign in with their email, name, college, etc.
 * Works seamlessly in all environments and allows participants to register with their email.
 */
async function emailAuth(req, res, next) {
  try {
    const { email, name, college, phone } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required for participant sign-in.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name && name.trim() ? name.trim() : normalizedEmail.split('@')[0];

    // Find or create participant
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: displayName,
          college: college && college.trim() ? college.trim() : 'R V R & J C College of Engineering',
          phone: phone && phone.trim() ? phone.trim() : null,
          role: 'USER'
        }
      });
    } else {
      // Update name/college/phone if newly provided
      const updates = {};
      if (name && name.trim() && user.name !== name.trim()) updates.name = name.trim();
      if (college && college.trim() && user.college !== college.trim()) updates.college = college.trim();
      if (phone && phone.trim() && user.phone !== phone.trim()) updates.phone = phone.trim();
      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates
        });
      }
    }

    const appToken = jwt.sign(
      { userId: user.id, email: user.email, role: 'USER' },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Successfully signed in with email',
      data: {
        token: appToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          college: user.college,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin Login with Email & Password
 * Section 49: Admin MUST NOT use Google OAuth. Uses email/password, bcrypt, JWT.
 */
async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admin email and password are required'
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative email or password'
      });
    }

    const adminToken = jwt.sign(
      { adminId: admin.id, email: admin.email, role: 'ADMIN', type: 'ADMIN' },
      config.JWT_SECRET,
      { expiresIn: '3d' }
    );

    return res.json({
      success: true,
      message: 'Admin logged in successfully',
      data: {
        token: adminToken,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current authenticated normal user profile with registrations
 */
async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        registrations: {
          orderBy: { createdAt: 'desc' },
          include: {
            event: {
              select: {
                id: true,
                title: true,
                category: true,
                visualType: true,
                date: true,
                startTime: true,
                endTime: true,
                venue: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        college: user.college,
        phone: user.phone,
        role: user.role,
        registrations: user.registrations
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current authenticated admin profile
 */
async function getAdminMe(req, res, next) {
  try {
    res.json({
      success: true,
      data: {
        id: req.admin.id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  googleAuth,
  emailAuth,
  adminLogin,
  getMe,
  getAdminMe
};
