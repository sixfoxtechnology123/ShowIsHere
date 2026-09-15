const QuestionDatabase = require('../models/questionDatabaseModel');

const nextQuestionId = async () => {
  const questions = await QuestionDatabase.find({ questionId: /^QD\d+$/ }).select('questionId');
  const maxNumber = questions.reduce((max, item) => {
    const value = parseInt(item.questionId.replace('QD', ''), 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `QD${maxNumber + 1}`;
};

const getMaxQuestionNumber = async () => {
  const questions = await QuestionDatabase.find({ questionId: /^QD\d+$/ }).select('questionId');
  return questions.reduce((max, item) => {
    const value = parseInt(item.questionId.replace('QD', ''), 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
};

const mapPayload = (item, questionId) => ({
  questionId,
  question: item.question || item.Questions || item.Question || '',
  optionA: item.optionA || item['Option A'] || '',
  optionB: item.optionB || item['Option B'] || '',
  optionC: item.optionC || item['Option C'] || '',
  optionD: item.optionD || item['Option D'] || '',
  optionE: item.optionE || item['Option E'] || '',
  textA: item.textA || item['A Text'] || '',
  textB: item.textB || item['B Text'] || '',
  textC: item.textC || item['C Text'] || '',
  textD: item.textD || item['D Text'] || '',
  textE: item.textE || item['E Text'] || ''
});

exports.getQuestions = async (req, res) => {
  try {
    const questions = await QuestionDatabase.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      let questionNumber = await getMaxQuestionNumber();
      const rows = [];
      for (const item of req.body) {
        questionNumber += 1;
        const mapped = mapPayload(item, `QD${questionNumber}`);
        if (mapped.question.trim()) rows.push(mapped);
      }
      const saved = await QuestionDatabase.insertMany(rows);
      return res.status(201).json({ success: true, data: saved });
    }

    const payload = mapPayload(req.body, await nextQuestionId());
    if (!payload.question.trim()) {
      return res.status(400).json({ success: false, message: 'Question is required.' });
    }
    const saved = await QuestionDatabase.create(payload);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const existing = await QuestionDatabase.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Question not found.' });

    const updated = await QuestionDatabase.findByIdAndUpdate(
      req.params.id,
      mapPayload(req.body, existing.questionId),
      { new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deleted = await QuestionDatabase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Question not found.' });
    res.status(200).json({ success: true, message: 'Question deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
