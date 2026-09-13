const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
  typeName: { type: String, required: true, trim: true }
});

const subCategorySchema = new mongoose.Schema({
  subCategoryName: { type: String, required: true, trim: true },
  eventTypes: [eventTypeSchema]
});

const eventCategoryMasterSchema = new mongoose.Schema({
  tenantKey: { type: String, default: 'default' },
  categoryId: { type: String, required: true, unique: true, trim: true }, // <--- ADDED HERE
  categoryName: { type: String, required: true, unique: true, trim: true },
  subCategories: [subCategorySchema]
}, { timestamps: true });

module.exports = mongoose.model('EventCategoryMaster', eventCategoryMasterSchema);