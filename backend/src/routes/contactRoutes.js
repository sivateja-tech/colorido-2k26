const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

// Public contact submission
router.post('/', submitContact);

module.exports = router;
