const express = require('express');
const router = express.Router();

const { requireAdmin } = require('../middleware/adminMiddleware');
const { getDashboardStats } = require('../controllers/adminController');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  togglePublish,
  toggleFeatured
} = require('../controllers/eventController');
const {
  getAllRegistrations,
  updateRegistrationStatus,
  checkInParticipant
} = require('../controllers/registrationController');
const {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  togglePublishSchedule
} = require('../controllers/scheduleController');
const {
  getResults,
  createResult,
  updateResult,
  deleteResult,
  togglePublishResult
} = require('../controllers/resultController');
const {
  getContactMessages,
  updateContactStatus,
  deleteContactMessage
} = require('../controllers/contactController');

// All endpoints in this router strictly require administrator credentials
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Events Management (Section 52)
router.get('/events', (req, res, next) => {
  req.query.includeUnpublished = 'true';
  getEvents(req, res, next);
});
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.patch('/events/:id/publish', togglePublish);
router.patch('/events/:id/feature', toggleFeatured);

// Registrations Management (Section 53)
router.get('/registrations', getAllRegistrations);
router.post('/registrations/check-in', checkInParticipant);
router.patch('/registrations/:id/status', updateRegistrationStatus);

// Schedule Management (Section 54)
router.get('/schedule', (req, res, next) => {
  req.query.includeUnpublished = 'true';
  getSchedule(req, res, next);
});
router.post('/schedule', createSchedule);
router.put('/schedule/:id', updateSchedule);
router.delete('/schedule/:id', deleteSchedule);
router.patch('/schedule/:id/publish', togglePublishSchedule);

// Results Management (Section 55)
router.get('/results', (req, res, next) => {
  req.query.includeUnpublished = 'true';
  getResults(req, res, next);
});
router.post('/results', createResult);
router.put('/results/:id', updateResult);
router.delete('/results/:id', deleteResult);
router.patch('/results/:id/publish', togglePublishResult);

// Contact Messages Management (Section 56)
router.get('/messages', getContactMessages);
router.patch('/messages/:id/status', updateContactStatus);
router.delete('/messages/:id', deleteContactMessage);

module.exports = router;
