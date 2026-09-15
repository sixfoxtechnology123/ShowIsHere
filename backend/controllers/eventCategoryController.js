const EventCategoryMaster = require('../models/EventCategoryMaster');

// Get all categories with nested subcategories and event types
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await EventCategoryMaster.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stage 1: Create Category
exports.createCategory = async (req, res) => {
  try {
    const { categoryId, categoryName, status } = req.body;
    if (!categoryName) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const existing = await EventCategoryMaster.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName.trim()}$`, 'i') }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already exist this category.' });
    }

    let finalCategoryId = categoryId;
    if (!finalCategoryId) {
      const count = await EventCategoryMaster.countDocuments();
      finalCategoryId = `EC${count + 1}`;
    }

    const newCategory = new EventCategoryMaster({
      categoryId: finalCategoryId,
      categoryName: categoryName.trim(),
      status: status || 'ACTIVE',
      subCategories: []
    });

    await newCategory.save();
    res.status(201).json({ success: true, message: 'Category created successfully!', data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stage 2: Add Subcategory under a specific Category ID
exports.addSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryName } = req.body;
    if (!categoryId || !subCategoryName) {
      return res.status(400).json({ success: false, message: 'Category ID and Subcategory name are required.' });
    }

    const category = await EventCategoryMaster.findById(categoryId);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    category.subCategories.push({ subCategoryName: subCategoryName.trim(), eventTypes: [] });
    await category.save();

    res.status(201).json({ success: true, message: 'Subcategory added successfully!', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stage 3: Add Event Type under a specific Subcategory ID
exports.addEventType = async (req, res) => {
  try {
    const { categoryId, subCategoryId, typeName } = req.body;
    if (!categoryId || !subCategoryId || !typeName) {
      return res.status(400).json({ success: false, message: 'Category ID, Subcategory ID, and Type name are required.' });
    }

    const category = await EventCategoryMaster.findById(categoryId);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) return res.status(404).json({ success: false, message: 'Subcategory not found.' });

    subCategory.eventTypes.push({ typeName: typeName.trim() });
    await category.save();

    res.status(201).json({ success: true, message: 'Event type added successfully!', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save the complete 3-stage category tree with robust update & duplicate checks
exports.createFullCategoryTree = async (req, res) => {
  try {
    const { recordId, categoryId, categoryName, status, subCategories } = req.body;
    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const formattedSubCategories = (subCategories || []).map((sub) => ({
      subCategoryName: (sub.name || sub.subCategoryName || '').trim(),
      isActive: sub.isActive !== undefined ? sub.isActive : true,
      eventTypes: (sub.eventTypes || []).map((type) => ({
        typeName: (type.name || type.typeName || '').trim(),
        isActive: type.isActive !== undefined ? type.isActive : true
      }))
    }));

    let existingCategory = null;
    if (recordId) {
      existingCategory = await EventCategoryMaster.findById(recordId);
    }
    
    if (!existingCategory) {
      existingCategory = await EventCategoryMaster.findOne({
        categoryId
      });
    }

    // If it exists in DB, but the frontend didn't pass a matching ID (meaning it's a brand new submit with an existing name)
    if (existingCategory && (!recordId || existingCategory._id.toString() !== recordId.toString())) {
      return res.status(400).json({ success: false, message: 'Already exist this category.' });
    }

    if (existingCategory && recordId) {
      // UPDATE EXISTING
      existingCategory.categoryId = categoryId || existingCategory.categoryId;
      existingCategory.categoryName = categoryName.trim();
      existingCategory.status = status || existingCategory.status;
      existingCategory.subCategories = formattedSubCategories;

      await existingCategory.save();
      return res.status(200).json({ 
        success: true, 
        message: 'Category hierarchy updated successfully!', 
        data: existingCategory 
      });
    }

    // CREATE NEW RECORD
    const newCategory = new EventCategoryMaster({
      categoryId,
      categoryName: categoryName.trim(),
      status: status || 'ACTIVE',
      subCategories: formattedSubCategories
    });

    await newCategory.save();
    res.status(201).json({ success: true, message: 'Category and sub-categories saved successfully!', data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategoryTree = async (req, res) => {
  try {
    const deleted = await EventCategoryMaster.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Category hierarchy not found.' });
    res.status(200).json({ success: true, message: 'Category hierarchy deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
