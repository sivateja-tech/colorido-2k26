const express = require('express');
const router = express.Router();
const {
  unifiedLogin,
  registerUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
  getMe,
  logout
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Unified Authentication Endpoints (Section: AUTHENTICATION — FINAL DESIGN)
router.post('/login', unifiedLogin);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);
router.post('/change-password', requireAuth, changePassword);
router.post('/logout', logout);

// Profile Endpoints
router.get('/me', requireAuth, getMe);
router.get('/admin/me', requireAdmin, getMe);

// Backward Compatibility Aliases
router.post('/admin/login', unifiedLogin);
router.post('/email', unifiedLogin);

module.exports = router;
