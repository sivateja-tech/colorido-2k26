const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { requireAuth } = require('../middleware/authMiddleware');

// Contact message submission strictly requires authenticated user session
router.post('/', requireAuth, submitContact);

module.exports = router;

