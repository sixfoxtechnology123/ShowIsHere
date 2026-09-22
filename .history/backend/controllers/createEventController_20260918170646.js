import mongoose from 'mongoose';
import CreateEvent from '../models/CreateEventModel.js';
import EventQuestionMaster from '../models/EventQuestionMaster.js';

// Access Question Database collection directly
const getQuestionDatabaseCollection = () => mongoose.connection.collection('questiondatabase');

// 1. Fetch matching Step 5 Guide Questions based on Step 1 selections
export const getGuideQuestionsByStep1 = async (req, res) => {
  try {
    const { categoryId, subCategoryIds, eventTypeIds } = req.query;

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'categoryId query parameter is required' });
    }

    // Parse array query params if passed as comma-separated values
    const subCats = subCategoryIds ? subCategoryIds.split(',').map((s) => s.trim()) : [];
    const eventTypes = eventTypeIds ? eventTypeIds.split(',').map((t) => t.trim()) : [];

    // Find all active mapping records matching this category
    const mappings = await EventQuestionMaster.find({
      eventCategoryId: categoryId,
      status: 'ACTIVE'
    }).lean();

    if (!mappings || mappings.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Match subcategory and event type against mappings
    const matchedQuestionIdsSet = new Set();

    mappings.forEach((mapping) => {
      const mappingSubIds = (mapping.subCategories || []).map((s) => s.subCategoryId || s.subCategoryName);
      const mappingTypeIds = (mapping.eventTypes || []).map((t) => `${t.subCategoryId}-${t.eventTypeId || t.typeName}`);

      const subMatch = subCats.length === 0 || mappingSubIds.some((id) => subCats.includes(id));
      const typeMatch = eventTypes.length === 0 || mappingTypeIds.some((id) => eventTypes.includes(id));

      if (subMatch && typeMatch && Array.isArray(mapping.questionIds)) {
        mapping.questionIds.forEach((qId) => matchedQuestionIdsSet.add(qId));
      }
    });

    const uniqueQuestionIds = Array.from(matchedQuestionIdsSet);

    if (uniqueQuestionIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Query questiondatabase for complete questions (options A-E, text A-E)
    const QuestionColl = getQuestionDatabaseCollection();
    const resolvedQuestions = await QuestionColl.find({
      questionId: { $in: uniqueQuestionIds }
    }).toArray();

    // Sort questions numerically by ID (e.g., QD1, QD2, QD10...)
    resolvedQuestions.sort((a, b) => {
      const numA = parseInt((a.questionId || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt((b.questionId || '').replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

    return res.status(200).json({ success: true, data: resolvedQuestions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Save Draft or Save Any Step (Step 1 to Step 5)
export const saveEventStepData = async (req, res) => {
  try {
    const { eventId, currentActiveStep, ...eventData } = req.body;

    if (eventId) {
      const updatedEvent = await CreateEvent.findByIdAndUpdate(
        eventId,
        {
          ...eventData,
          currentActiveStep: currentActiveStep || 1
        },
        { new: true, runValidators: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      return res.status(200).json({
        success: true,
        data: updatedEvent,
        message: `Step ${currentActiveStep} saved successfully.`
      });
    }

    // If new event starting from Step 1
    const newEvent = await CreateEvent.create({
      ...eventData,
      currentActiveStep: currentActiveStep || 1,
      status: 'DRAFT'
    });

    return res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Event created and Step 1 saved.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Final Step 5 Submission & Publish Event
export const publishEvent = async (req, res) => {
  try {
    const { eventId, guideResponses, eventGuideNotes, ...rest } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'eventId is required to publish the event' });
    }

    const publishedEvent = await CreateEvent.findByIdAndUpdate(
      eventId,
      {
        ...rest,
        guideResponses: guideResponses || [],
        eventGuideNotes: eventGuideNotes || '',
        currentActiveStep: 5,
        status: 'PUBLISHED'
      },
      { new: true, runValidators: true }
    );

    if (!publishedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({
      success: true,
      data: publishedEvent,
      message: 'Event and Event Guide completed and published successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get Event Details by ID
export const getEventById = async (req, res) => {
  try {
    const event = await CreateEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Get All Events with Pagination & Filter
export const getAllEvents = async (req, res) => {
  try {
    const { status, categoryId, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (categoryId) filter.eventCategoryId = categoryId;
    if (search) {
      filter.eventName = { $regex: search,$options: 'i' };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [events, total] = await Promise.all([
      CreateEvent.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      CreateEvent.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};