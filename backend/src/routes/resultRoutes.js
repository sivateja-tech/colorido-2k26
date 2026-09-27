const express = require('express');
const router = express.Router();
const { getResults, getLeaderboard } = require('../controllers/resultController');

// Public results & leaderboard
router.get('/', getResults);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
