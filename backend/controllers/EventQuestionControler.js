const EventQuestion = require('../models/EventQuestionmodel');
const QuestionDatabase = require('../models/questionDatabaseModel');

const getMaxEventQuestionNumber = async () => {
  const records = await EventQuestion.find({ eventQuestionId: /^EQ\d+$/ }).select('eventQuestionId');
  return records.reduce((max, item) => {
    const value = parseInt(item.eventQuestionId.replace('EQ', ''), 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
};

const getNextIds = async (count) => {
  const maxNum = await getMaxEventQuestionNumber();
  const ids = [];
  for (let i = 1; i <= count; i++) {
    ids.push(`EQ${maxNum + i}`);
  }
  return ids;
};

const attachQuestionDetails = async (records) => {
  const list = Array.isArray(records) ? records : [records];
  const ids = [...new Set(list.flatMap((item) => item.questionIds || []))];
  const questions = await QuestionDatabase.find({ questionId: { $in: ids } }).lean();
  const questionMap = questions.reduce((map, question) => {
    map[question.questionId] = question;
    return map;
  }, {});

  const mapped = list.map((item) => {
    const plain = item.toObject ? item.toObject() : item;
    return {
      ...plain,
      questions: (plain.questionIds || []).map((id) => questionMap[id]).filter(Boolean)
    };
  });

  return Array.isArray(records) ? mapped : mapped[0];
};

exports.getEventQuestions = async (req, res) => {
  try {
    const records = await EventQuestion.find().sort({ createdAt: -1 });
    const data = await attachQuestionDetails(records);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEventQuestion = async (req, res) => {
  try {
    const body = req.body;
    if (!body.eventCategoryId || !body.eventCategoryName) {
      return res.status(400).json({ success: false, message: 'Event category is required.' });
    }
    const questionIds = Array.isArray(body.questionIds) ? body.questionIds.filter(Boolean) : [];
    if (!questionIds.length) {
      return res.status(400).json({ success: false, message: 'Please select at least one question.' });
    }

    const subCategories = Array.isArray(body.subCategories) ? body.subCategories : [];
    const eventTypes = Array.isArray(body.eventTypes) ? body.eventTypes : [];

    const docsToCreate = [];

    if (subCategories.length > 0) {
      for (const sub of subCategories) {
        const subId = sub.subCategoryId || sub.subCategoryName;
        const matchingTypes = eventTypes.filter(
          (t) => String(t.subCategoryId || '') === String(subId) || String(t.subCategoryName || '') === String(sub.subCategoryName)
        );

        if (matchingTypes.length > 0) {
          for (const type of matchingTypes) {
            docsToCreate.push({
              eventCategoryId: body.eventCategoryId,
              eventCategoryName: body.eventCategoryName,
              subCategories: [sub],
              eventTypes: [type],
              questionIds,
              showQuestionDetails: Boolean(body.showQuestionDetails),
              status: body.status || 'ACTIVE'
            });
          }
        } else {
          docsToCreate.push({
            eventCategoryId: body.eventCategoryId,
            eventCategoryName: body.eventCategoryName,
            subCategories: [sub],
            eventTypes: [],
            questionIds,
            showQuestionDetails: Boolean(body.showQuestionDetails),
            status: body.status || 'ACTIVE'
          });
        }
      }
    } else {
      docsToCreate.push({
        eventCategoryId: body.eventCategoryId,
        eventCategoryName: body.eventCategoryName,
        subCategories: [],
        eventTypes: [],
        questionIds,
        showQuestionDetails: Boolean(body.showQuestionDetails),
        status: body.status || 'ACTIVE'
      });
    }

    const assignedIds = await getNextIds(docsToCreate.length);
    const finalPayloads = docsToCreate.map((doc, idx) => ({
      ...doc,
      eventQuestionId: assignedIds[idx]
    }));

    const saved = await EventQuestion.insertMany(finalPayloads);
    res.status(201).json({ success: true, data: await attachQuestionDetails(saved) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEventQuestion = async (req, res) => {
  try {
    const existing = await EventQuestion.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Event question mapping not found.' });

    const body = req.body;
    const updated = await EventQuestion.findByIdAndUpdate(
      req.params.id,
      {
        eventCategoryId: body.eventCategoryId || existing.eventCategoryId,
        eventCategoryName: body.eventCategoryName || existing.eventCategoryName,
        subCategories: Array.isArray(body.subCategories) ? body.subCategories : existing.subCategories,
        eventTypes: Array.isArray(body.eventTypes) ? body.eventTypes : existing.eventTypes,
        questionIds: Array.isArray(body.questionIds) ? body.questionIds.filter(Boolean) : existing.questionIds,
        showQuestionDetails: Boolean(body.showQuestionDetails),
        status: body.status || 'ACTIVE'
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: await attachQuestionDetails(updated) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEventQuestion = async (req, res) => {
  try {
    const deleted = await EventQuestion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Event question mapping not found.' });
    res.status(200).json({ success: true, message: 'Event question mapping deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};