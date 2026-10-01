const mongoose = require('mongoose');
const CreateEvent = require('../models/CreateEventModel');
const EventQuestionMaster = require('../models/EventQuestionmodel');
const QuestionDatabase = require('../models/questionDatabaseModel');
const Organizer = require('../models/orgKycModel');
const ArtistMaster = require('../models/Artist');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const { 
  getEventCancellationSubmittedEmailTemplate,
  getEventCancellationAcceptedEmailTemplate, 
  getEventCancellationRejectedEmailTemplate 
} = require('../utils/EmailTemplates');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toList = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : String(value).split(',').map((item) => item.trim()).filter(Boolean);
};

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

exports.saveEventStepData = async (req, res) => {
  try {
    const { eventId, currentActiveStep, loginMobileNumber, ...eventData } = req.body;
    const tenantKey = req.tenantKey || req.headers['x-tenant-key'] || 'default-tenant';

    const mobile = loginMobileNumber || req.headers['x-login-mobile'];
    const orgDoc = mobile ? await Organizer.findOne({
      $or: [{ loginMobileNumber: mobile }, { contactMobile: mobile }]
    }) : null;
    const orgkycId = req.body.orgkycId || orgDoc?.orgkycId || 'OK1';

    if (!eventData.eventName || !eventData.eventCategoryId) {
      return res.status(400).json({
        success: false,
        message: 'Event Title and Category are required.'
      });
    }

    if (eventId) {
      const isObjectId = mongoose.Types.ObjectId.isValid(eventId);
      const query = isObjectId ? { _id: eventId } : { createEventId: eventId };

      const existingEvent = await CreateEvent.findOne(query).lean();
      if (!existingEvent) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

 if (existingEvent.status === 'APPROVED') {
        const changeEntries = [];
        const cleanedEventData = {};

        // Helper to check if two values are genuinely different (treating empty strings, null, and undefined as equal)
        const isActuallyDifferent = (oldVal, newVal) => {
          const cleanOld = (oldVal === null || oldVal === undefined) ? '' : String(oldVal).trim();
          const cleanNew = (newVal === null || newVal === undefined) ? '' : String(newVal).trim();
          return cleanOld !== cleanNew;
        };

        Object.keys(eventData).forEach((key) => {
          // Skip internal metadata fields
          if (['eventId', 'status', 'currentActiveStep', 'tenantKey', 'orgkycId', 'loginMobileNumber', 'eventCategoryId'].includes(key)) {
            return;
          }

          const newVal = eventData[key];
          const oldVal = existingEvent[key];

          // ── 1. HANDLE NESTED OBJECTS (contactPerson, venue, media, etc.) ──
          if (newVal && typeof newVal === 'object' && !Array.isArray(newVal)) {
            const oldObj = (oldVal && typeof oldVal === 'object') ? oldVal : {};
            const cleanedSubObj = {};
            let hasSubChanges = false;

            Object.keys(newVal).forEach((subKey) => {
              const subNewVal = newVal[subKey];
              const subOldVal = oldObj[subKey];
              const nestedFieldName = `${key}.${subKey}`;

              if (isActuallyDifferent(subOldVal, subNewVal)) {
                hasSubChanges = true;
                cleanedSubObj[subKey] = subNewVal;
                changeEntries.push({
                  fieldName: nestedFieldName,
                  oldData: subOldVal !== undefined ? subOldVal : null,
                  newData: subNewVal !== undefined ? subNewVal : null,
                  createdAt: new Date()
                });
              } else {
                // Keep the original value so we don't wipe it out if needed, or omit it
                cleanedSubObj[subKey] = subOldVal;
              }
            });

            if (hasSubChanges) {
              cleanedEventData[key] = cleanedSubObj;
            }
          } 
          // ── 2. HANDLE ARRAYS (artists, hashtags, guideResponses, etc.) ──
          else if (Array.isArray(newVal)) {
            if (JSON.stringify(oldVal || []) !== JSON.stringify(newVal)) {
              cleanedEventData[key] = newVal;
              changeEntries.push({
                fieldName: key,
                oldData: oldVal !== undefined ? oldVal : null,
                newData: newVal !== undefined ? newVal : null,
                createdAt: new Date()
              });
            }
          } 
          // ── 3. HANDLE REGULAR TOP-LEVEL FIELDS (eventName, minAgeLimit, etc.) ──
          else {
            if (isActuallyDifferent(oldVal, newVal)) {
              cleanedEventData[key] = newVal;
              changeEntries.push({
                fieldName: key,
                oldData: oldVal !== undefined ? oldVal : null,
                newData: newVal !== undefined ? newVal : null,
                createdAt: new Date()
              });
            }
          }
        });

        let updatedEvent = existingEvent;
        if (changeEntries.length > 0) {
          updatedEvent = await CreateEvent.findOneAndUpdate(
            query,
            { 
              $push: { changesRequest: { $each: changeEntries } },$set: cleanedEventData // Only updates the exact fields that changed!
            },
            { returnDocument: 'after', runValidators: false }
          );
        }

        return res.status(200).json({
          success: true,
          data: updatedEvent,
          message: changeEntries.length > 0 ? 'Changes submitted for admin approval.' : 'No changes detected.'
        });
      }
      if (existingEvent.status === 'APPROVED') {
        eventData.status = 'PENDING';
      }

      // ── SMART RESUBMISSION FIELD RESOLUTION ──
      let currentResubmitFields = existingEvent.resubmitFields || [];
      const updatedKeys = Object.keys(eventData);

      // Map incoming saved properties to your resubmit field keys
      if (updatedKeys.includes('eventName') || updatedKeys.includes('title')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'eventTitle');
      }
      if (updatedKeys.includes('eventDescription') || updatedKeys.includes('fullDescription')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'description');
      }
      if (updatedKeys.includes('media') || updatedKeys.includes('bannerImage')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'eventBanner');
      }
      if (updatedKeys.includes('venue') || updatedKeys.includes('venueName')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'venue');
      }
      if (updatedKeys.includes('artists')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'artist');
      }
      if (updatedKeys.includes('minAgeLimit')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'ageLimit');
      }
      if (updatedKeys.includes('contactPerson') || updatedKeys.includes('contactName')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'eventContact');
      }
      if (updatedKeys.includes('guideResponses')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'eventGuide');
      }
      if (updatedKeys.includes('schedules') || updatedKeys.includes('schedule')) {
        currentResubmitFields = currentResubmitFields.filter(f => f !== 'date');
      }

      // If all requested fields are addressed, resubmit becomes false
      const isFullyResolved = currentResubmitFields.length === 0;

      const updatedEvent = await CreateEvent.findOneAndUpdate(
        query,
        {
          $set: {
            ...eventData,
            tenantKey,
            orgkycId,
            loginMobileNumber,
            currentActiveStep: currentActiveStep || 1,
            resubmitFields: currentResubmitFields,
            resubmit: !isFullyResolved
          }
        },
        { returnDocument: 'after', runValidators: false }
      );

      return res.status(200).json({
        success: true,
        data: updatedEvent,
        message: isFullyResolved 
          ? 'All resubmission fields updated successfully!' 
          : 'Progress saved. Complete remaining requested fields.'
      });
    }

    // B. NEW EVENT
    const createEventId = await getNextCreateEventIdFromDB(tenantKey);

    const newEvent = await CreateEvent.create({
      ...eventData,
      createEventId,
      tenantKey,
      orgkycId,
      loginMobileNumber,
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
exports.getGuideQuestionsByStep1 = async (req, res) => {
  try {
    const { categoryId, subCategoryIds, eventTypeIds } = req.query;

    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'categoryId query parameter is required' });
    }

    const subCategoryList = toList(subCategoryIds);
    const eventTypeList = toList(eventTypeIds);
    const subCategoryRegexes = subCategoryList.map((item) => new RegExp(`^${escapeRegex(item)}$`, 'i'));
    const eventTypeRegexes = eventTypeList.map((item) => new RegExp(`^${escapeRegex(item)}$`, 'i'));

    const query = {
      status: 'ACTIVE',
      $or: [
        { eventCategoryId: categoryId },
        { eventCategoryName: new RegExp(`^${escapeRegex(categoryId)}$`, 'i') }
      ]
    };

    if (subCategoryList.length) {
      query.subCategories = {
        $elemMatch: {
          $or: [
            { subCategoryId: { $in: subCategoryList } },
            { subCategoryName: { $in: subCategoryRegexes } }
          ]
        }
      };
    }

    if (eventTypeList.length) {
      query.eventTypes = {
        $elemMatch: {
          $or: [
            { eventTypeId: { $in: eventTypeList } },
            { typeName: { $in: eventTypeRegexes } }
          ]
        }
      };
    }

    const mappings = await EventQuestionMaster.find(query).lean();

    if (!mappings || mappings.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const matchedQuestionIdsSet = new Set();
    mappings.forEach((mapping) => {
      if (Array.isArray(mapping.questionIds)) {
        mapping.questionIds.forEach((qId) => matchedQuestionIdsSet.add(qId));
      }
    });

    const uniqueQuestionIds = Array.from(matchedQuestionIdsSet);

    if (uniqueQuestionIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const objectIds = uniqueQuestionIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const resolvedQuestions = await QuestionDatabase.find({
      $or: [
        { questionId: { $in: uniqueQuestionIds } },
        { _id: { $in: objectIds } }
      ]
    }).lean();

    const questionOrder = uniqueQuestionIds.reduce((map, id, index) => {
      map[id] = index;
      return map;
    }, {});

    resolvedQuestions.sort((a, b) => {
      const orderA = questionOrder[a.questionId] ?? questionOrder[String(a._id)] ?? Number.MAX_SAFE_INTEGER;
      const orderB = questionOrder[b.questionId] ?? questionOrder[String(b._id)] ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    const data = resolvedQuestions.map((question) => ({
      ...question,
      questionText: question.question,
      options: ['optionA', 'optionB', 'optionC', 'optionD', 'optionE']
        .map((key) => question[key])
        .filter((option) => option && String(option).trim())
    }));

    return res.status(200).json({ success: true, data });
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
          status: 'PENDING',
         
          rejectionReason: ''
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

exports.getEventById = async (req, res) => {
  try {
    // 1. Fetch event and lean it for speed
    const id = req.params.id;
const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { createEventId: id };
const event = await CreateEvent.findOne(query).lean();
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // 2. Check if the event has artists
    if (Array.isArray(event.artists) && event.artists.length > 0) {
      const artistIds = event.artists.map((a) => a.artistId || a.id).filter(Boolean);

      if (artistIds.length > 0) {
        const validObjectIds = artistIds
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id));

        // 3. Batch fetch all artists in ONE query (using .select to avoid heavy blobs)
        const artistDocs = await ArtistMaster.find({
          $or: [
            { artistId: { $in: artistIds } },
            { _id: { $in: validObjectIds } }
          ]
        }).select('artistId photoUrl photo photoBase64').lean();

        // 4. Create a quick lookup map
        const artistMap = new Map();
        artistDocs.forEach((doc) => {
          if (doc.artistId) artistMap.set(String(doc.artistId), doc);
          if (doc._id) artistMap.set(String(doc._id), doc);
        });

        // 5. Map photo URLs safely using your original fallback logic
        event.artists = event.artists.map((a) => {
          const searchId = String(a.artistId || a.id || '');
          const match = artistMap.get(searchId);
          return {
            ...a,
            photoUrl: match?.photoUrl || match?.photo || match?.photoBase64 || a.photoUrl || ''
          };
        });
      }
    }

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

exports.getMyEvents = async (req, res) => {
  try {
    const { loginMobileNumber,orgkycId, page = 1, limit = 10 } = req.query;
    const conditions = [];

    if (orgkycId) conditions.push({orgkycId: String(orgkycId).trim() });
    if (loginMobileNumber) {
      const mobile = String(loginMobileNumber).trim();
      conditions.push({ loginMobileNumber: mobile }, { 'contactPerson.mobile': mobile });
    }

    if (conditions.length === 0) {
      return res.status(400).json({ success: false, message: 'Organizer identity is required.' });
    }

    // Pagination: Load events in smaller chunks so it doesn't fetch everything together
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const events = await CreateEvent.find({ $or: conditions })
      .lean()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum); 

    if (!events || events.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Collect all artist IDs for this chunk
    const allArtistIds = new Set();
    events.forEach((event) => {
      if (Array.isArray(event.artists) && event.artists.length > 0) {
        event.artists.forEach((a) => {
          const id = a.artistId || a.id;
          if (id) allArtistIds.add(String(id));
        });
      }
    });

    const uniqueArtistIdsArray = Array.from(allArtistIds);

    let artistDocs = [];
    if (uniqueArtistIdsArray.length > 0) {
      const validObjectIds = uniqueArtistIdsArray
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

      artistDocs = await ArtistMaster.find({
        $or: [
          { artistId: { $in: uniqueArtistIdsArray } },
          { _id: { $in: validObjectIds } }
        ]
      }).lean();
    }

    const artistMap = new Map();
    artistDocs.forEach((doc) => {
      if (doc.artistId) artistMap.set(String(doc.artistId), doc);
      if (doc._id) artistMap.set(String(doc._id), doc);
    });

    // Enrich events using your exact original fallback logic
    for (let event of events) {
      if (Array.isArray(event.artists) && event.artists.length > 0) {
        event.artists = event.artists.map((a) => {
          const searchId = a.artistId || a.id;
          const match = artistMap.get(String(searchId));
          return {
            ...a,
            photoUrl: match?.photoUrl || match?.photo || match?.photoBase64 || a.photoUrl || ''
          };
        });
      }
    }

    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminEvents = async (req, res) => {
  try {
    const events = await CreateEvent.find().sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEventApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason = '' } = req.body;
    const targetStatus = status?.toUpperCase();

    if (!['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(targetStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status.' });
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { createEventId: id };
    const updated = await CreateEvent.findOneAndUpdate(
      query,
      {
        $set: {
          status: targetStatus,
          rejectionReason: ['REJECTED', 'CANCELLED'].includes(targetStatus) ? reason : ''
        },
        $push: { approvalHistory: { status: targetStatus, reason } }
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Event not found.' });
    return res.status(200).json({ success: true, message: 'Event approval status updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.duplicateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantKey = req.tenantKey || req.headers['x-tenant-key'] || 'default-tenant';

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { createEventId: id };
const originalEvent = await CreateEvent.findOne(query).lean();

    if (!originalEvent) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Delete primary keys to avoid duplicate key errors
    delete originalEvent._id;
    delete originalEvent.createdAt;
    delete originalEvent.updatedAt;

    const createEventId = await getNextCreateEventIdFromDB(tenantKey);

    const duplicatedEvent = await CreateEvent.create({
      ...originalEvent,
      createEventId,
      tenantKey,
      duplicate: true,
      status: 'DRAFT',              // Set status to DRAFT
     
      rejectionReason: '',          // Reset rejection reason
      approvalHistory: []          // Reset approval history
    });

    return res.status(201).json({
      success: true,
      data: duplicatedEvent,
      message: `Event duplicated as draft! (${createEventId})`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// AI-powered SEO & Viral Hashtag Generator
exports.generateHashtags = async (req, res) => {
  try {
    const { 
      eventTitle, 
      eventCategoryName, 
      subCategoryName, 
      typeName, 
      eventFormat, 
      eventLanguages, 
      fullDescription 
    } = req.body;

    const prompt = `Act as an expert Social Media and SEO Growth Manager. Deeply scan and analyze the following event details to generate exactly 5 top-performing, viral, SEO-optimized event hashtags starting with '#'.

Event Details:
- Title: ${eventTitle || ''}
- Category: ${eventCategoryName || ''} > ${subCategoryName || ''} > ${typeName || ''}
- Format: ${eventFormat || ''}
- Languages: ${Array.isArray(eventLanguages) ? eventLanguages.join(', ') : (eventLanguages || '')}
- Description: ${fullDescription || ''}

CRITICAL RULES:
1. Return ONLY a valid JSON array of 5 string hashtags (e.g., ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]).
2. Do not include markdown code blocks (like \`\`\`json), conversational filler, introductory sentences, or extra words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const aiText = response.text.trim();
    const cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const hashtags = JSON.parse(cleanedText);

    if (!Array.isArray(hashtags) || hashtags.length === 0) {
      throw new Error('AI failed to return a valid hashtag array.');
    }

    const finalTags = [...hashtags, '', '', '', '', ''].slice(0, 5);

    return res.status(200).json({ success: true, hashtags: finalTags });
  } catch (error) {
    console.error('AI Hashtag Generation Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Function: Finds the highest global CR number across all events and returns the next one (e.g., CR-00005)
const getNextGlobalRequestId = async () => {
  const events = await CreateEvent.find(
    { "cancelHistory.requestId": { $exists: true,$ne: "" } },
    { "cancelHistory.requestId": 1 }
  ).lean();

  let maxNum = 0;

  events.forEach((event) => {
    if (Array.isArray(event.cancelHistory)) {
      event.cancelHistory.forEach((item) => {
        if (item.requestId) {
          const num = parseInt(item.requestId.replace(/\D/g, ''), 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
    }
  });

  return `CR-${String(maxNum + 1).padStart(5, '0')}`;
};

exports.cancelEvent = async (req, res) => {
  try {
    const { eventId, reason, description, attachment, fileName } = req.body;
    
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required.' });
    }

    const query = mongoose.Types.ObjectId.isValid(eventId) ? { _id: eventId } : { createEventId: eventId };
    const event = await CreateEvent.findOne(query);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // ── GET CONTINUOUS GLOBAL REQUEST ID ACROSS ALL EVENTS ──
    const requestId = await getNextGlobalRequestId();

    const base64Data = attachment?.data || attachment || '';
    const nameOfFile = fileName || attachment?.name || (base64Data ? `Document_${requestId}` : '');

    const cancelEntry = {
      requestId,
      reason,
      description: description || '',
      documentPaths: base64Data ? [base64Data] : [],
      documentNames: nameOfFile ? [nameOfFile] : [],
      cancelledAt: new Date()
    };

    const updatedEvent = await CreateEvent.findOneAndUpdate(
      query,
      {
        $set: { cancelRequest: 'pending' },$push: { cancelHistory: cancelEntry }
      },
      { returnDocument: 'after', runValidators: false }
    );

    // Organizer email notification block...
    const orgDoc = await Organizer.findOne({ 
      $or: [
        { orgkycId: event.orgkycId },
        { loginMobileNumber: event.loginMobileNumber }
      ] 
    });
    
    const recipientEmail = orgDoc?.contactEmail || event.contactPerson?.email;
    const recipientName = orgDoc?.orgName || orgDoc?.contactFullName || event.contactPerson?.name || 'User';

    if (recipientEmail) {
      const template = getEventCancellationSubmittedEmailTemplate(recipientName, requestId);
      transporter.sendMail({
        from: `"ShowIsHere" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
      }).catch(err => console.error('Background Cancellation Email Error:', err));
    }

    return res.status(200).json({
      success: true,
      message: `Cancellation request submitted successfully`,
      data: updatedEvent
    });
  } catch (error) {
    console.error('Cancel Event Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateCancelRequestStatus = async (req, res) => {
  try {
    const { id, cancelRequestId } = req.params;
    const { status, reason } = req.body;
    const targetStatus = status?.toUpperCase();

    const eventObjectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    const cancelObjectId = mongoose.Types.ObjectId.isValid(cancelRequestId) ? new mongoose.Types.ObjectId(cancelRequestId) : null;

    if (!eventObjectId || !cancelObjectId) {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    const cancelReqValue = targetStatus === 'APPROVED' ? 'accept' : 'reject';

    // ── BUILD UPDATE QUERY ──
    const updateQuery = {
      $set: {
        cancelRequest: cancelReqValue,
        "cancelHistory.$.cancelRequest": cancelReqValue
      }
    };

    if (targetStatus === 'APPROVED') {
      updateQuery.$set.status = 'CANCELED';
    } else if (targetStatus === 'REJECTED' && reason) {
      // Stores the rejection reason inside the specific cancelHistory subdocument
      updateQuery.$set["cancelHistory.$.reason"] = reason; 

      // ── PUSHES INTOresonNotification (Matching your DB schema) ──
      updateQuery.$push = {
        resonNotification: {
          reason: reason,
          link: `/event-details?tab=Setting`, // Passes tab parameter so frontend opens the Setting tab
          createdAt: new Date()
        }
      };
    }

    const updated = await CreateEvent.findOneAndUpdate(
      { _id: eventObjectId, "cancelHistory._id": cancelObjectId },
      updateQuery,
      { returnDocument: 'after' }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event or cancel request not found in database.' });
    }

    // ── FIND SPECIFIC CANCEL ITEM TO GET REQUEST ID ──
    const targetCancelItem = updated.cancelHistory.find(
      (item) => String(item._id) === String(cancelObjectId)
    );
    const requestId = targetCancelItem?.requestId || '';

    // ── FETCH ORGANIZER EMAIL ──
    const orgDoc = await Organizer.findOne({ 
      $or: [
        { orgkycId: updated.orgkycId },
        { loginMobileNumber: updated.loginMobileNumber }
      ] 
    });
    
    const recipientEmail = orgDoc?.contactEmail || updated.contactPerson?.email;
    const recipientName = orgDoc?.orgName || orgDoc?.contactFullName || updated.contactPerson?.name || 'User';

    // ── SEND EMAIL NOTIFICATION (ACCEPTED / REJECTED) ──
    if (recipientEmail) {
      const isAccepted = targetStatus === 'APPROVED';
      const template = isAccepted
        ? getEventCancellationAcceptedEmailTemplate(recipientName, updated.eventName, requestId)
        : getEventCancellationRejectedEmailTemplate(recipientName, updated.eventName, requestId);

      transporter.sendMail({
        from: `"ShowIsHere" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
      }).catch(err => {
        console.error('Background Cancellation Status Email Error:', err);
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Cancel request updated successfully and email sent.', 
      data: updated 
    });
  } catch (error) {
    console.error('Update Cancel Request Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.resubmitEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields, reason = '' } = req.body;

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { createEventId: id };
    
 const notificationLink = `/event-details`;

    const updated = await CreateEvent.findOneAndUpdate(
      query,
      {
        $set: {
          status: 'PENDING',
          resubmit: true,
          resubmitFields: fields || [],
          rejectionReason: reason
        },
        $push: { 
          resubmitHistory: { fields: fields || [], reason, date: new Date() },
          resonNotification: { reason, link: notificationLink, createdAt: new Date() },
          approvalHistory: { status: 'RESUBMIT', reason, fields } 
        }
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Event not found.' });
    return res.status(200).json({ success: true, message: 'Resubmission requested successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { createEventId: id };
    const deleted = await CreateEvent.findOneAndDelete(query);

    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found.' });
    return res.status(200).json({ success: true, message: 'Event permanently deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};