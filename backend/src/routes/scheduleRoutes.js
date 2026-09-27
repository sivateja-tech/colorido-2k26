const express = require('express');
const router = express.Router();
const {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public schedule feed
router.get('/', getSchedule);

// Admin schedule management
router.post('/', requireAdmin, createSchedule);
router.put('/:id', requireAdmin, updateSchedule);
router.delete('/:id', requireAdmin, deleteSchedule);

module.exports = router;
