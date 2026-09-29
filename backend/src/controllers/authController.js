const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../services/prisma');
const config = require('../config');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../services/emailService');

/**
 * UNIFIED LOGIN (Section: AUTHENTICATION — FINAL DESIGN)
 * Single endpoint handling authentication for BOTH User and Admin accounts.
 * Authentication Method: Email + Password.
 * Backend determines role and redirection URL.
 */
async function unifiedLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
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
          message: 'Invalid email or password.'
        });
      }

      // Generate Admin JWT
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
          message: 'This account requires a password. Please use Forgot Password to set one.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      // Check if user has verified their email
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          requiresVerification: true,
          email: user.email,
          message: 'Your account is not activated yet. Please verify your email before logging in.'
        });
      }

      // Generate User JWT
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
          phone: user.phone,
          role: 'USER'
        }
      });
    }

    // Neither Admin nor User found
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * USER REGISTRATION (Section: AUTHENTICATION — FINAL DESIGN)
 * Public registration for normal participants.
 * Fields: Full Name, Email, Phone, College, Department, Year, Password, Confirm Password.
 * Automatically and strictly sets role = 'USER'.
 * Never accepts client-defined roles.
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
        message: 'All fields (Full Name, Email, Phone, College, Course, Department, Year, and Password) are required.'
      });
    }

    if (!userEmail.includes('@') || !userEmail.includes('.')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    // Duplicate check in both User and Admin tables
    const [existingUser, existingAdmin] = await Promise.all([
      prisma.user.findUnique({ where: { email: userEmail } }),
      prisma.admin.findUnique({ where: { email: userEmail } })
    ]);

    if (existingUser || existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in instead.'
      });
    }

    // Securely hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user account with isVerified: false until email confirmed
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
        role: 'USER', // Strict invariant: no user can ever register as admin
        isVerified: false
      }
    });

    // Generate cryptographic email verification token
    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawVerifyToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerification.create({
      data: {
        email: userEmail,
        tokenHash,
        expiresAt,
        used: false
      }
    });

    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${rawVerifyToken}`;
    console.log(`\n========================================`);
    console.log(`[EMAIL VERIFICATION] Activation Link for ${userEmail}:`);
    console.log(`${verificationUrl}`);
    console.log(`========================================\n`);

    // Dispatch verification email in background
    sendVerificationEmail({
      to: userEmail,
      verificationUrl,
      name: displayName
    }).catch(err => console.error('[EMAIL VERIFICATION ERROR]', err));

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      message: 'Account created successfully! An activation link has been sent to your email. Please verify your email to activate your account.',
      email: newUser.email,
      verificationUrl: config.NODE_ENV === 'development' ? verificationUrl : undefined,
      role: 'USER',
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
        isVerified: false
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * VERIFY EMAIL (Account Activation)
 * Endpoint to activate user account using verification token
 */
async function verifyEmail(req, res, next) {
  try {
    const token = req.query.token || req.body?.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.'
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const record = await prisma.emailVerification.findUnique({
      where: { tokenHash }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or unrecognized activation link.'
      });
    }

    if (record.used) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        message: 'Your account has already been activated. You can sign in now.'
      });
    }

    if (new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({
        success: false,
        expired: true,
        email: record.email,
        message: 'This activation link has expired. Please request a new activation link.'
      });
    }

    // Mark user as verified and token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { email: record.email },
        data: { isVerified: true }
      }),
      prisma.emailVerification.update({
        where: { id: record.id },
        data: { used: true }
      })
    ]);

    return res.json({
      success: true,
      email: record.email,
      message: 'Account successfully activated! You can now log in to your account.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * RESEND VERIFICATION EMAIL
 */
async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a fresh activation link has been dispatched.'
      });
    }

    if (user.isVerified) {
      return res.json({
        success: true,
        alreadyVerified: true,
        message: 'This account is already activated. You can sign in immediately.'
      });
    }

    // Invalidate old tokens
    await prisma.emailVerification.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true }
    });

    // Generate new token
    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawVerifyToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerification.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        used: false
      }
    });

    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${rawVerifyToken}`;
    console.log(`\n========================================`);
    console.log(`[RESEND EMAIL VERIFICATION] Activation Link for ${normalizedEmail}:`);
    console.log(`${verificationUrl}`);
    console.log(`========================================\n`);

    sendVerificationEmail({
      to: normalizedEmail,
      verificationUrl,
      name: user.name
    }).catch(err => console.error('[EMAIL VERIFICATION ERROR]', err));

    return res.json({
      success: true,
      message: 'A fresh activation link has been sent to your email address.',
      verificationUrl: config.NODE_ENV === 'development' ? verificationUrl : undefined
    });
  } catch (err) {
    next(err);
  }
}

/**
 * FORGOT PASSWORD — USER AND ADMIN (Section: AUTHENTICATION — FINAL DESIGN)
 * Unified password reset system for both user and admin accounts.
 * Does not reveal whether the email exists (constant generic response).
 * Cryptographically generates and stores SHA-256 hash of reset token with short expiration.
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if account exists in Admin or User
    const [admin, user] = await Promise.all([
      prisma.admin.findUnique({ where: { email: normalizedEmail } }),
      prisma.user.findUnique({ where: { email: normalizedEmail } })
    ]);

    let userType = null;
    if (admin) userType = 'ADMIN';
    else if (user) userType = 'USER';

    // If account does NOT exist in DB, direct user to Create Account
    if (!userType) {
      console.log(`[PASSWORD RESET] Non-existent email entered: ${normalizedEmail}. Directing to Create Account.`);
      return res.status(404).json({
        success: false,
        notFound: true,
        userNotFound: true,
        message: 'No account found with this email address. Please create an account to get started.',
        redirectTo: `/auth?mode=signup&email=${encodeURIComponent(normalizedEmail)}`
      });
    }

    // Invalidate existing unused tokens for this email
    await prisma.passwordReset.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true }
    });

    // Generate cryptographically secure token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Expires in 20 minutes
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

    await prisma.passwordReset.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        userType,
        expiresAt,
        used: false
      }
    });

    const targetName = admin?.name || user?.name || 'Participant';
    const resetPath = `/reset-password?token=${rawToken}`;

    // Dispatch real email via Gmail SMTP
    sendPasswordResetEmail({
      to: normalizedEmail,
      resetUrl: resetPath,
      name: targetName
    }).catch((emailErr) => {
      console.error('[EMAIL ERROR] Failed to dispatch password reset email:', emailErr.message);
    });

    console.log(`\n========================================`);
    console.log(`[PASSWORD RESET] Link generated for ${normalizedEmail}:`);
    console.log(`http://localhost:5173${resetPath}`);
    console.log(`========================================\n`);

    return res.json({
      success: true,
      message: 'Password reset link has been dispatched to your email.',
      data: { resetUrl: resetPath }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * VERIFY RESET TOKEN
 * Checks if token is valid, unused, and not expired.
 */
async function verifyResetToken(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is missing.'
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { tokenHash }
    });

    if (!resetRecord || resetRecord.used) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or already-used password reset token.'
      });
    }

    if (new Date() > new Date(resetRecord.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token has expired. Please request a new one.'
      });
    }

    return res.json({
      success: true,
      valid: true,
      message: 'Token is valid.',
      data: { email: resetRecord.email }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * RESET PASSWORD — USER AND ADMIN (Section: AUTHENTICATION — FINAL DESIGN)
 * Validates token, hashes new password with bcrypt, updates account, and invalidates token.
 */
async function resetPassword(req, res, next) {
  try {
    const token = req.body.token;
    const newPassword = req.body.newPassword || req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { tokenHash }
    });

    if (!resetRecord || resetRecord.used) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or already-used password reset token.'
      });
    }

    if (new Date() > new Date(resetRecord.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token has expired. Please request a new one.'
      });
    }

    // Hash new password with bcrypt
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update account based on userType
    if (resetRecord.userType === 'ADMIN') {
      await prisma.admin.update({
        where: { email: resetRecord.email },
        data: { passwordHash: newHash }
      });
    } else {
      await prisma.user.update({
        where: { email: resetRecord.email },
        data: { passwordHash: newHash }
      });
    }

    // Invalidate the token so it cannot be reused
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true }
    });

    return res.json({
      success: true,
      message: 'Password has been successfully reset! Please sign in with your new password.',
      redirectTo: '/auth'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * CHANGE PASSWORD (AUTHENTICATED)
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const actor = req.user || req.admin;

    if (!actor || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.'
      });
    }

    // Fetch account with passwordHash
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
        message: 'Account not found or has no password set.'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
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
 * GET CURRENT AUTHENTICATED PROFILE (USER OR ADMIN)
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
        department: true,
        year: true,
        role: true,
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
 * LOGOUT
 */
async function logout(req, res) {
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
}

module.exports = {
  unifiedLogin,
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
  getMe,
  getAdminMe: getMe,
  logout,

  // Compatibility aliases
  adminLogin: unifiedLogin,
  emailAuth: unifiedLogin
};
