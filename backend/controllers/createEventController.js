const mongoose = require('mongoose');
const CreateEvent = require('../models/CreateEventModel');
const EventQuestionMaster = require('../models/EventQuestionmodel');
const QuestionDatabase = require('../models/questionDatabaseModel');
const Organizer = require('../models/orgKycModel');
const ArtistMaster = require('../models/Artist');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const { getEventCancellationSubmittedEmailTemplate } = require('../utils/EmailTemplates');
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
      if (existingEvent && existingEvent.status === 'APPROVED') {
        eventData.status = 'PENDING';
      }

      const updatedEvent = await CreateEvent.findOneAndUpdate(
        query,
        {
          $set: {
            ...eventData,
            tenantKey,
           orgkycId,
            loginMobileNumber,
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

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(targetStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status.' });
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { createEventId: id };
const updated = await CreateEvent.findOneAndUpdate(query,
      {
          $set: {
          status: targetStatus,
          rejectionReason: targetStatus === 'REJECTED' ? reason : ''
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


exports.cancelEvent = async (req, res) => {
  try {
    const { eventId, reason, description, attachment } = req.body;
    
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required.' });
    }

    const query = mongoose.Types.ObjectId.isValid(eventId) ? { _id: eventId } : { createEventId: eventId };
    const event = await CreateEvent.findOne(query);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // 1. Generate Request ID and create history entry
    const currentHistoryLength = Array.isArray(event.cancelHistory) ? event.cancelHistory.length : 0;
    const requestId = `CR-${String(currentHistoryLength + 1).padStart(5, '0')}`;

    const cancelEntry = {
      requestId,
      reason,
      description: description || '',
      attachment: attachment?.data || attachment || '',
      cancelledAt: new Date()
    };

    // 2. Update DB with pending request and push to cancelHistory array
    const updatedEvent = await CreateEvent.findOneAndUpdate(
      query,
      {
        $set: { cancelRequest: 'pending' },$push: { cancelHistory: cancelEntry }
      },
      { returnDocument: 'after', runValidators: false }
    );

    // 3. Match event's orgkycId with the Organizer model to fetch contactEmail
    const orgDoc = await Organizer.findOne({ 
      $or: [
        { orgkycId: event.orgkycId },
        { loginMobileNumber: event.loginMobileNumber }
      ] 
    });
    
    const recipientEmail = orgDoc?.contactEmail || event.contactPerson?.email;
    const recipientName = orgDoc?.orgName || orgDoc?.contactFullName || event.contactPerson?.name || 'User';

    // 4. Send Email Notification
    if (recipientEmail) {
      const template = getEventCancellationSubmittedEmailTemplate(recipientName, requestId);
      
      transporter.sendMail({
        from: `"ShowIsHere" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
      }).catch(err => {
        console.error('Background Cancellation Email Error:', err);
      });
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