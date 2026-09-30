const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getUserRegistrations,
  getRegistrationById
} = require('../controllers/registrationController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

// Normal user: Create registration (strictly requires auth)
router.post('/', requireAuth, createRegistration);

// Normal user: View ONLY own registrations (strictly requires auth)
router.get('/', requireAuth, getUserRegistrations);

// Public/User: Lookup registration pass by ID or registrationId
router.get('/pass/:id', getRegistrationById);
router.get('/:id', getRegistrationById);

module.exports = router;
