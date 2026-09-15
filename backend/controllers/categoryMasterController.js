const CategoryMaster = require('../models/categoryModel');

const nextCategoryId = async () => {
  const categories = await CategoryMaster.find({ categoryId: /^CAT\d+$/ }).select('categoryId');
  const maxNumber = categories.reduce((max, item) => {
    const value = parseInt(item.categoryId.replace('CAT', ''), 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `CAT${maxNumber + 1}`;
};

exports.getCategories = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status.toUpperCase();
    const categories = await CategoryMaster.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { categoryName, imageBase64, status } = req.body;
    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const existing = await CategoryMaster.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already exist this category.' });
    }

    const category = await CategoryMaster.create({
      categoryId: await nextCategoryId(),
      categoryName: categoryName.trim(),
      imageBase64: imageBase64 || '',
      status: status || 'ACTIVE'
    });

    res.status(201).json({ success: true, message: 'Category saved successfully.', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryName, imageBase64, status } = req.body;
    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const duplicate = await CategoryMaster.findOne({
      _id: { $ne: req.params.id },
      categoryName: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') }
    });
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'Already exist this category.' });
    }

    const updated = await CategoryMaster.findByIdAndUpdate(
      req.params.id,
      {
        categoryName: categoryName.trim(),
        imageBase64: imageBase64 || '',
        status: status || 'ACTIVE'
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.status(200).json({ success: true, message: 'Category updated successfully.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await CategoryMaster.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
