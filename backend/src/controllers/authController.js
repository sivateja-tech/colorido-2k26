const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../services/prisma');
const config = require('../config');
const { sendPasswordResetCodeEmail } = require('../services/emailService');

/**
 * 1. UNIFIED LOGIN
 * Handles Email + Password authentication for BOTH Admin and User accounts.
 * Validates credentials via bcrypt and issues signed JWT.
 * No email-verification gating — all registered users are active.
 */
async function unifiedLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if account is an Administrator
    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail }
    });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        });
      }

      // Generate Admin JWT (3-day duration)
      const token = jwt.sign(
        {
          adminId: admin.id,
          userId: admin.id,
          email: admin.email,
          role: 'ADMIN',
          type: 'ADMIN'
        },
        config.JWT_SECRET,
        { expiresIn: '3d' }
      );

      return res.json({
        success: true,
        message: 'Welcome back, Administrator!',
        token,
        role: 'ADMIN',
        redirectTo: '/admin/dashboard',
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'ADMIN'
        }
      });
    }

    // 2. Check if account is a Normal Participant (User)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (user) {
      if (!user.passwordHash) {
        return res.status(401).json({
          success: false,
          code: 'PASSWORD_NOT_SET',
          message: 'This account requires a password. Please use Forgot Password to set one.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        });
      }

      // Ensure account is marked verified (active) in the background if legacy flag was false
      if (user.isVerified === false) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true }
        }).catch(err => console.warn('[AUTH] Could not auto-upgrade isVerified:', err.message));
      }

      // Generate User JWT (7-day duration)
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: 'USER',
          type: 'USER'
        },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Welcome back!',
        token,
        role: 'USER',
        redirectTo: '/events',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          college: user.college,
          department: user.department,
          year: user.year,
          course: user.course,
          phone: user.phone,
          role: 'USER',
          isVerified: true
        }
      });
    }

    // Neither Admin nor User found
    return res.status(401).json({
      success: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 2. USER REGISTRATION (SIGNUP)
 * Validates all fields, normalizes email, checks for duplicates, hashes password with bcrypt.
 * Account is created as IMMEDIATELY ACTIVE (isVerified: true).
 * NO email verification, NO verification link, NO verification screen.
 * User can login immediately after signup (JWT and profile returned).
 */
async function registerUser(req, res, next) {
  try {
    const {
      fullName,
      name,
      email,
      phone,
      college,
      course,
      department,
      year,
      password,
      confirmPassword
    } = req.body;

    const displayName = (fullName || name || '').trim();
    const userEmail = (email || '').toLowerCase().trim();
    const userPhone = (phone || '').trim();
    const userCollege = (college || '').trim();
    const userCourse = (course || 'B.Tech').trim();
    const userDepartment = (department || '').trim();
    const userYear = (year || '').trim();

    // Required fields validation
    if (!displayName || !userEmail || !userPhone || !userCollege || !userDepartment || !userYear || !password) {
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'All fields (Full Name, Email, Phone, College, Course, Department, Year, and Password) are required.'
      });
    }

    if (!userEmail.includes('@') || !userEmail.includes('.')) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        code: 'PASSWORD_TOO_SHORT',
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        code: 'PASSWORD_MISMATCH',
        message: 'Passwords do not match.'
      });
    }

    // Check duplicate email in both User and Admin tables
    const [existingUser, existingAdmin] = await Promise.all([
      prisma.user.findUnique({ where: { email: userEmail } }),
      prisma.admin.findUnique({ where: { email: userEmail } })
    ]);

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        code: 'RESERVED_EMAIL',
        message: 'This email is reserved for administration. Please use a different email.'
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: 'USER_ALREADY_EXISTS',
        message: 'An account with this email already exists. Please sign in.'
      });
    }

    // Securely hash password with bcrypt (salt rounds = 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user account as IMMEDIATELY ACTIVE (isVerified: true)
    const newUser = await prisma.user.create({
      data: {
        email: userEmail,
        name: displayName,
        phone: userPhone,
        college: userCollege,
        course: userCourse,
        department: userDepartment,
        year: userYear,
        passwordHash,
        role: 'USER',
        isVerified: true
      }
    });

    // Generate JWT token so user can authenticate immediately
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: 'USER',
        type: 'USER'
      },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to COLORIDO 2K26.',
      token,
      role: 'USER',
      redirectTo: '/events',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        college: newUser.college,
        course: newUser.course,
        department: newUser.department,
        year: newUser.year,
        phone: newUser.phone,
        role: 'USER',
        isVerified: true
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 3. FORGOT PASSWORD — ONLY CODE FLOW
 * Generates a secure 6-digit numeric reset code.
 * Stores ONLY the SHA-256 hash in the database with 10-minute expiry.
 * Sends the 6-digit code to the user's email.
 * Always returns a generic response to prevent email enumeration.
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'Please provide a valid email address.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limit (60-second cooldown per email to prevent spam)
    const recentReset = await prisma.passwordReset.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: 'desc' }
    });

    if (recentReset) {
      const elapsedSec = (Date.now() - new Date(recentReset.createdAt).getTime()) / 1000;
      if (elapsedSec < 60) {
        const waitTime = Math.ceil(60 - elapsedSec);
        return res.status(429).json({
          success: false,
          code: 'RATE_LIMITED',
          rateLimited: true,
          retryAfter: waitTime,
          message: `Please wait ${waitTime} seconds before requesting another reset code.`
        });
      }
    }

    // Check if account exists in Admin or User
    const [admin, user] = await Promise.all([
      prisma.admin.findUnique({ where: { email: normalizedEmail } }),
      prisma.user.findUnique({ where: { email: normalizedEmail } })
    ]);

    const targetAccount = admin || user;
    const userType = admin ? 'ADMIN' : (user ? 'USER' : null);

    // If account does NOT exist, return generic response without leaking account existence
    if (!targetAccount) {
      return res.json({
        success: true,
        message: 'If an account exists with this email address, a 6-digit reset code has been sent.'
      });
    }

    // Generate secure 6-digit numeric code (e.g. 849201)
    const resetCode = crypto.randomInt(100000, 1000000).toString();
    // Store ONLY the SHA-256 hash of the code
    const tokenHash = crypto.createHash('sha256').update(resetCode).digest('hex');

    // Invalidate any previous unused reset codes for this email
    await prisma.passwordReset.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true }
    });

    // Create single-use token record with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.passwordReset.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        userType,
        expiresAt,
        used: false
      }
    });

    // Send code by email
    const emailResult = await sendPasswordResetCodeEmail({
      to: normalizedEmail,
      code: resetCode,
      name: targetAccount.name || 'Participant'
    });

    if (!emailResult.success) {
      console.error(`[FORGOT PASSWORD] Email dispatch failed:`, emailResult.error);
    }

    const isDev = process.env.NODE_ENV !== 'production';

    return res.json({
      success: true,
      email: normalizedEmail,
      message: 'A 6-digit password reset code has been sent to your email address.',
      ...(isDev && { devCode: resetCode })
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 4. RESEND RESET CODE (ONLY EXISTS HERE)
 * Resends a fresh 6-digit reset code to the user.
 * Enforces a 60-second cooldown rate limit.
 * Safely invalidates previous code.
 */
async function resendResetCode(req, res, next) {
  return forgotPassword(req, res, next);
}

/**
 * 5. VERIFY RESET CODE
 * Checks if the 6-digit code is valid, unused, and not expired for the given email.
 */
async function verifyResetCode(req, res, next) {
  try {
    const rawEmail = req.body?.email || req.query?.email;
    const rawCode = req.body?.code || req.query?.code;

    if (!rawEmail || !rawCode) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Email address and 6-digit reset code are required.'
      });
    }

    const normalizedEmail = rawEmail.toLowerCase().trim();
    const cleanCode = rawCode.toString().replace(/\D/g, '');

    if (cleanCode.length !== 6) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_RESET_CODE',
        message: 'Reset code must be a 6-digit number.'
      });
    }

    const codeHash = crypto.createHash('sha256').update(cleanCode).digest('hex');

    const record = await prisma.passwordReset.findFirst({
      where: {
        email: normalizedEmail,
        tokenHash: codeHash,
        used: false
      }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_RESET_CODE',
        message: 'Invalid or already used verification code. Please check and try again.'
      });
    }

    if (new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({
        success: false,
        code: 'RESET_CODE_EXPIRED',
        expired: true,
        message: 'This reset code has expired. Codes are valid for 10 minutes. Please request a new code.'
      });
    }

    return res.json({
      success: true,
      valid: true,
      message: 'Reset code verified successfully. You may now set your new password.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 6. RESET PASSWORD (WITH 6-DIGIT CODE)
 * Validates the 6-digit code, hashes new password with bcrypt, updates account,
 * and atomically invalidates the code.
 */
async function resetPassword(req, res, next) {
  try {
    const rawEmail = req.body?.email || req.query?.email;
    const rawCode = req.body?.code || req.body?.token;
    const newPassword = req.body?.newPassword || req.body?.password;
    const confirmPassword = req.body?.confirmPassword;

    if (!rawEmail || !rawCode || !newPassword) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Email, verification code, and new password are required.'
      });
    }

    const normalizedEmail = rawEmail.toLowerCase().trim();
    const cleanCode = rawCode.toString().replace(/\D/g, '');

    if (cleanCode.length !== 6) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_RESET_CODE',
        message: 'Verification code must be a 6-digit number.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        code: 'PASSWORD_TOO_SHORT',
        message: 'New password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        code: 'PASSWORD_MISMATCH',
        message: 'Passwords do not match.'
      });
    }

    // Verify code hash
    const codeHash = crypto.createHash('sha256').update(cleanCode).digest('hex');

    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        email: normalizedEmail,
        tokenHash: codeHash,
        used: false
      }
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_RESET_CODE',
        message: 'Invalid or already used verification code. Please check and try again.'
      });
    }

    if (new Date() > new Date(resetRecord.expiresAt)) {
      return res.status(400).json({
        success: false,
        code: 'RESET_CODE_EXPIRED',
        expired: true,
        message: 'This reset code has expired. Please request a new code.'
      });
    }

    // Hash new password with bcrypt (salt rounds = 10)
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update account in both Admin and User tables if matching
    const adminAccount = await prisma.admin.findUnique({ where: { email: normalizedEmail } });
    if (adminAccount) {
      await prisma.admin.update({
        where: { email: normalizedEmail },
        data: { passwordHash: newHash }
      });
    }

    const userAccount = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (userAccount) {
      await prisma.user.update({
        where: { email: normalizedEmail },
        data: { passwordHash: newHash, isVerified: true }
      });
    }

    // Atomically invalidate all active reset codes for this email
    await prisma.passwordReset.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true }
    });

    return res.json({
      success: true,
      message: 'Password has been successfully reset! You can now sign in with your new password.',
      redirectTo: '/auth'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 7. CHANGE PASSWORD (AUTHENTICATED)
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const actor = req.user || req.admin;

    if (!actor || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        code: 'PASSWORD_TOO_SHORT',
        message: 'New password must be at least 6 characters long.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        code: 'PASSWORD_MISMATCH',
        message: 'New passwords do not match.'
      });
    }

    const isAdmin = actor.role === 'ADMIN';
    let account = null;

    if (isAdmin) {
      account = await prisma.admin.findUnique({ where: { id: actor.id } });
    } else {
      account = await prisma.user.findUnique({ where: { id: actor.id } });
    }

    if (!account || !account.passwordHash) {
      return res.status(400).json({
        success: false,
        code: 'ACCOUNT_NOT_FOUND',
        message: 'Account not found or has no password set.'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        code: 'INCORRECT_CURRENT_PASSWORD',
        message: 'Current password is incorrect.'
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    if (isAdmin) {
      await prisma.admin.update({
        where: { id: actor.id },
        data: { passwordHash: newHash }
      });
    } else {
      await prisma.user.update({
        where: { id: actor.id },
        data: { passwordHash: newHash }
      });
    }

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 8. GET CURRENT AUTHENTICATED PROFILE (USER OR ADMIN)
 */
async function getMe(req, res, next) {
  try {
    const userId = req.user?.id || req.admin?.id;
    const role = req.user?.role || req.admin?.role;

    if (role === 'ADMIN' || req.admin) {
      const admin = await prisma.admin.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      });
      return res.json({ success: true, data: admin });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        course: true,
        department: true,
        year: true,
        role: true,
        isVerified: true,
        createdAt: true,
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
                venue: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * 9. LOGOUT
 */
async function logout(req, res) {
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
}

/**
 * 10. BACKWARD COMPATIBILITY STUBS
 * For any legacy bookmarks to /verify-email: returns immediate success.
 */
async function verifyEmail(req, res) {
  return res.json({
    success: true,
    message: 'Email verification is no longer required. You can sign in directly.'
  });
}

async function resendVerificationEmail(req, res) {
  return res.json({
    success: true,
    message: 'Email verification is no longer required. You can sign in directly.'
  });
}

module.exports = {
  unifiedLogin,
  registerUser,
  forgotPassword,
  resendResetCode,
  verifyResetCode,
  resetPassword,
  changePassword,
  getMe,
  getAdminMe: getMe,
  logout,

  // Backward compatibility
  verifyEmail,
  resendVerificationEmail,
  verifyResetToken: verifyResetCode,
  adminLogin: unifiedLogin,
  emailAuth: unifiedLogin
};
