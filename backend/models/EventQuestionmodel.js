const mongoose = require('mongoose');

const selectedSubCategorySchema = new mongoose.Schema({
  subCategoryId: { type: String, default: '' },
  subCategoryName: { type: String, required: true, trim: true }
}, { _id: false });

const selectedEventTypeSchema = new mongoose.Schema({
  eventTypeId: { type: String, default: '' },
  typeName: { type: String, required: true, trim: true },
  subCategoryId: { type: String, default: '' },
  subCategoryName: { type: String, default: '' }
}, { _id: false });

const eventQuestionSchema = new mongoose.Schema({
  eventQuestionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  eventCategoryId: { type: String, required: true, trim: true },
  eventCategoryName: { type: String, required: true, trim: true },
  subCategories: [selectedSubCategorySchema],
  eventTypes: [selectedEventTypeSchema],
  questionIds: [{ type: String, required: true, trim: true }],
  showQuestionDetails: { type: Boolean, default: false },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('EventQuestionMaster', eventQuestionSchema);
