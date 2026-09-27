const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
  }

  res.json({
    status: 'UP',
    database: dbStatus,
    festival: 'COLORIDO 2K26',
    institution: 'R V R & J C College of Engineering',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
