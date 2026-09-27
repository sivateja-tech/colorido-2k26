const express = require('express');
const router = express.Router();
const {
  googleAuth,
  adminLogin,
  getMe,
  getAdminMe
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public auth endpoints
router.post('/google', googleAuth);
router.post('/admin/login', adminLogin);

// Protected profile endpoints
router.get('/me', requireAuth, getMe);
router.get('/admin/me', requireAdmin, getAdminMe);

module.exports = router;
