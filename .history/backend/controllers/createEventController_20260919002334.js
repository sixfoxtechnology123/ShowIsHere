const mongoose = require('mongoose');
const CreateEvent = require('../models/CreateEventModel');

const getQuestionDatabaseCollection = () => mongoose.connection.collection('questiondatabase');

// Function: Finds the actual latest createEventId in the DB (per tenant) and generates the next one
const getNextCreateEventIdFromDB = async (tenantKey) => {
  // Find all events for this tenant that have a createEventId
  const events = await CreateEvent.find(
    { tenantKey, createEventId: { $regex: /^CE\d+$/ } },
    { createEventId: 1 }
  ).lean();

  if (!events || events.length === 0) {
    return 'CE1'; // If database is empty or all deleted, start fresh at CE1
  }

  // Extract all numbers: e.g., ["CE1", "CE5"] -> [1, 5]
  const numbers = events
    .map((e) => parseInt((e.createEventId || '').replace(/\D/g, ''), 10))
    .filter((num) => !isNaN(num));

  if (numbers.length === 0) {
    return 'CE1';
  }

  const maxId = Math.max(...numbers);
  return `CE${maxId + 1}`; // Increments directly from the highest remaining ID
};

// 2. Save Step Data or Draft
exports.saveEventStepData = async (req, res) => {
  try {
    const { eventId, currentActiveStep, ...eventData } = req.body;
    const tenantKey = req.tenantKey || req.headers['x-tenant-key'] || 'default-tenant';

    if (!eventData.eventName || !eventData.eventCategoryId) {
      return res.status(400).json({
        success: false,
        message: 'Event Title and Category are required.'
      });
    }

    // A. UPDATE EXISTING DRAFT
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
      const updatedEvent = await CreateEvent.findByIdAndUpdate(
        eventId,
        {
          $set: {
            ...eventData,
            tenantKey,
            currentActiveStep: currentActiveStep || 1
          }
        },
        { new: true, runValidators: false }
      );

      if (!updatedEvent) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      return res.status(200).json({
        success: true,
        data: updatedEvent,
        message: `Saved successfully! (${updatedEvent.createEventId})`
      });
    }

    // B. NEW EVENT: Query DB for the highest existing ID right before inserting
    const createEventId = await getNextCreateEventIdFromDB(tenantKey);

    const newEvent = await CreateEvent.create({
      ...eventData,
      createEventId,
      tenantKey,
      currentActiveStep: currentActiveStep || 1,
      status: 'DRAFT'
    });

    return res.status(201).json({
      success: true,
      data: newEvent,
      message: `Draft saved successfully! (${createEventId})`
    });
  } catch (error) {
    console.error('Save Draft DB Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 1. Fetch matching Step 5 Guide Questions based on Step 1 selection
exports.getGuideQuestionsByStep1 = async (req, res) => {
  try {
    const { categoryId, subCategoryIds, eventTypeIds } = req.query;

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'categoryId query parameter is required' });
    }

    const subCats = subCategoryIds ? subCategoryIds.split(',').map((s) => s.trim()) : [];
    const eventTypes = eventTypeIds ? eventTypeIds.split(',').map((t) => t.trim()) : [];

    const mappings = await mongoose.connection.collection('eventquestionsmasters').find({
      eventCategoryId: categoryId,
      status: 'ACTIVE'
    }).toArray();

    if (!mappings || mappings.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

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

    const QuestionColl = getQuestionDatabaseCollection();
    const resolvedQuestions = await QuestionColl.find({
      questionId: { $in: uniqueQuestionIds }
    }).toArray();

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



// 3. Final Step 6 Publish
exports.publishEvent = async (req, res) => {
  try {
    const { eventId, ...rest } = req.body;
    const tenantKey = req.tenantKey || req.headers['x-tenant-key'] || 'default-tenant';

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Valid eventId is required to publish' });
    }

    const publishedEvent = await CreateEvent.findByIdAndUpdate(
      eventId,
      {
        $set: {
          ...rest,
          tenantKey,
          currentActiveStep: 6,
          status: 'PUBLISHED'
        }
      },
      { new: true, runValidators: false }
    );

    if (!publishedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({
      success: true,
      data: publishedEvent,
      message: `Event ${publishedEvent.createEventId} published successfully.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get Event By ID
exports.getEventById = async (req, res) => {
  try {
    const event = await CreateEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Get All Events (Scoped to tenantKey)
exports.getAllEvents = async (req, res) => {
  try {
    const tenantKey = req.tenantKey || req.headers['x-tenant-key'] || 'default-tenant';
    const events = await CreateEvent.find({ tenantKey }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.resolveMapLink = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL query parameter is required' });
    }

    let targetUrl = url.trim();

    // 1. Fetch with standard browser headers
    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    let finalUrl = response.url || targetUrl;

    // 2. If it landed on a redirect or consent page, inspect HTML body for canonical or meta URL
    if (finalUrl.includes('goo.gl') || finalUrl.includes('consent.google.com')) {
      const html = await response.text();
      const metaMatch = html.match(/content="0;url=(https:\/\/[^"]+)"/i) || html.match(/href="(https:\/\/[^"]+)"/i);
      if (metaMatch && metaMatch[1]) {
        finalUrl = metaMatch[1];
      }
    }

    // 3. Extract Place Name (e.g., /place/Howrah+Railway+Station/...)
    const placeMatch = finalUrl.match(/\/place\/([^/@?]+)/);
    if (placeMatch && placeMatch[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return res.status(200).json({
        success: true,
        embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=m&z=17&output=embed`
      });
    }

    // 4. Extract Coordinates (e.g., @22.5833008,88.3400508)
    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return res.status(200).json({
        success: true,
        embedUrl: `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&t=m&z=17&output=embed`
      });
    }

    // 5. Query Parameter (?q=...)
    try {
      const parsed = new URL(finalUrl);
      const q = parsed.searchParams.get('q');
      if (q) {
        return res.status(200).json({
          success: true,
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=m&z=17&output=embed`
        });
      }
    } catch (e) {}

    // Fallback: Embed using the resolved final URL directly
    return res.status(200).json({
      success: true,
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(finalUrl)}&t=m&z=17&output=embed`
    });
  } catch (error) {
    console.error('Resolve Map Link Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resolve map link' });
  }
};