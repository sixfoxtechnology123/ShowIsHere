const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  addSubCategory,
  addEventType,
  createFullCategoryTree
} = require('../controllers/eventCategoryController');

router.get('/', getAllCategories);
router.post('/category', createCategory);
router.post('/subcategory', addSubCategory);
router.post('/event-type', addEventType);
router.post('/create-full', createFullCategoryTree);

module.exports = router;