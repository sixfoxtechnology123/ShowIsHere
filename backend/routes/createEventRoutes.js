const express = require('express');
const router = express.Router();
const createEventController = require('../controllers/createEventController');

router.get('/guide-questions', createEventController.getGuideQuestionsByStep1);
router.post('/save-step', createEventController.saveEventStepData);
router.post('/publish', createEventController.publishEvent);
router.get('/my-events', createEventController.getMyEvents);
router.get('/admin/events', createEventController.getAdminEvents);
router.put('/admin/events/:id/approval', createEventController.updateEventApprovalStatus);
router.get('/', createEventController.getAllEvents);
router.get('/:id', createEventController.getEventById);

module.exports = router;
