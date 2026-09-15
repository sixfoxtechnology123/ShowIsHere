const express = require('express');
const router = express.Router();
const questionDatabaseController = require('../controllers/questionDatabaseController');

router.get('/', questionDatabaseController.getQuestions);
router.post('/', questionDatabaseController.createQuestion);
router.put('/:id', questionDatabaseController.updateQuestion);
router.delete('/:id', questionDatabaseController.deleteQuestion);

module.exports = router;
