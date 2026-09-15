const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  addSubCategory,
  addEventType,
  createFullCategoryTree,
  deleteCategoryTree
} = require('../controllers/eventCategoryController');

router.get('/', getAllCategories);
router.post('/category', createCategory);
router.post('/subcategory', addSubCategory);
router.post('/event-type', addEventType);
router.post('/create-full', createFullCategoryTree);
router.delete('/:id', deleteCategoryTree);

module.exports = router;
