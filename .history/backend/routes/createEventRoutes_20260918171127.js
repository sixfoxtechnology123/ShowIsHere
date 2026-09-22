const express = require('express');
const router = express.Router();

const {
  getGuideQuestionsByStep1,
  saveEventStepData,
  publishEvent,
  getEventById,
  getAllEvents
} = require('../controllers/createEventController');

// Fetch Step 5 guide questions using Step 1 values
router.get('/guide-questions', getGuideQuestionsByStep1);

// Step saving & draft endpoint
router.post('/save-step', saveEventStepData);

// Step 5 final publish endpoint
router.post('/publish', publishEvent);

// Fetch single event or list
router.get('/:id', getEventById);
router.get('/', getAllEvents);

module.exports = router;