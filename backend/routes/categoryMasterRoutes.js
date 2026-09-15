const express = require('express');
const router = express.Router();
const categoryMasterController = require('../controllers/categoryMasterController');

router.get('/', categoryMasterController.getCategories);
router.post('/', categoryMasterController.createCategory);
router.put('/:id', categoryMasterController.updateCategory);
router.delete('/:id', categoryMasterController.deleteCategory);

module.exports = router;
