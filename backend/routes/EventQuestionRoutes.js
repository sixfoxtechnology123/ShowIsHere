const express = require('express');
const router = express.Router();
const eventQuestionController = require('../controllers/EventQuestionControler');

router.get('/', eventQuestionController.getEventQuestions);
router.post('/', eventQuestionController.createEventQuestion);
router.put('/:id', eventQuestionController.updateEventQuestion);
router.delete('/:id', eventQuestionController.deleteEventQuestion);

module.exports = router;
 