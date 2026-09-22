const express = require('express');
const router = express.Router();
const createEventController = require('../controllers/createEventController');

router.get('/guide-questions', createEventController.getGuideQuestionsByStep1);
router.post('/save-step', createEventController.saveEventStepData);
router.post('/publish', createEventController.publishEvent);
router.get('/:id', createEventController.getEventById);
router.get('/', createEventController.getAllEvents);

module.exports = router;