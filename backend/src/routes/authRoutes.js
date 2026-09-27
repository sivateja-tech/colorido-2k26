const express = require('express');
const router = express.Router();
const {
  googleAuth,
  emailAuth,
  adminLogin,
  getMe,
  getAdminMe
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public auth endpoints
router.post('/google', googleAuth);
router.post('/email', emailAuth);
router.post('/login', emailAuth);
router.post('/register', emailAuth);
router.post('/admin/login', adminLogin);

// Protected profile endpoints
router.get('/me', requireAuth, getMe);
router.get('/admin/me', requireAdmin, getAdminMe);

module.exports = router;
