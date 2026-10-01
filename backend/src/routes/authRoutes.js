const express = require('express');
const router = express.Router();
const {
  unifiedLogin,
  registerUser,
  forgotPassword,
  resendResetCode,
  verifyResetCode,
  resetPassword,
  changePassword,
  getMe,
  logout,
  verifyEmail,
  resendVerificationEmail
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Unified Authentication Endpoints
router.post('/login', unifiedLogin);
router.post('/register', registerUser);

// Forgot Password (6-Digit Code Flow)
router.post('/forgot-password', forgotPassword);
router.post('/resend-reset-code', resendResetCode);
router.post('/verify-reset-code', verifyResetCode);
router.get('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

// Backward Compatibility Aliases for Password Reset
router.get('/verify-reset-token', verifyResetCode);
router.post('/verify-reset-token', verifyResetCode);

// Backward Compatibility Aliases for Legacy Email Verification (Immediate No-Op)
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password Management (Authenticated)
router.post('/change-password', requireAuth, changePassword);
router.post('/logout', logout);

// Profile Endpoints
router.get('/me', requireAuth, getMe);
router.get('/admin/me', requireAdmin, getMe);

// Additional Compatibility Aliases
router.post('/admin/login', unifiedLogin);
router.post('/email', unifiedLogin);

module.exports = router;
