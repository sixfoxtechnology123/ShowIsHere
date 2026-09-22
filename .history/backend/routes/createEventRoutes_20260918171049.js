import express from 'express';
import {
  getGuideQuestionsByStep1,
  saveEventStepData,
  publishEvent,
  getEventById,
  getAllEvents
} from '../controllers/createEventController.js';

const router = express.Router();

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