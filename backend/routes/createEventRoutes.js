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
router.post('/duplicate/:id', createEventController.duplicateEvent);
router.post('/generate-hashtags', createEventController.generateHashtags);
router.post('/cancel', createEventController.cancelEvent);
router.put('/admin/events/:id/cancel-request/:cancelRequestId', createEventController.updateCancelRequestStatus);
router.put('/admin/events/:id/resubmit', createEventController.resubmitEvent);
router.delete('/admin/events/:id', createEventController.deleteEvent);
router.put('/admin/events/:id/changes-request/bulk', createEventController.bulkUpdateChangesRequest);
router.put('/admin/events/:id/changes-request/:changeId', createEventController.updateSingleChangeRequest);

module.exports = router;
 