const mongoose = require('mongoose');

const questionDatabaseSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  question: { type: String, required: true, trim: true },
  optionA: { type: String, default: '' },
  optionB: { type: String, default: '' },
  optionC: { type: String, default: '' },
  optionD: { type: String, default: '' },
  optionE: { type: String, default: '' },
  textA: { type: String, default: '' },
  textB: { type: String, default: '' },
  textC: { type: String, default: '' },
  textD: { type: String, default: '' },
  textE: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('QuestionDatabaseMaster', questionDatabaseSchema);
