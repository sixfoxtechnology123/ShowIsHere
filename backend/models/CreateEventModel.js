const mongoose = require('mongoose');



const ticketTierSchema = new mongoose.Schema({
  ticketName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  available: { type: Number, required: true },
  slotDate: { type: String, default: '' },
  eventStartTime: { type: String, default: '' },
  eventEndTime: { type: String, default: '' },
  startDate: { type: String, default: '' },
  startTime: { type: String, default: '' },
  endDate: { type: String, default: '' },
  endTime: { type: String, default: '' },
  ebPrice: { type: String, default: '-' },
  ebQty: { type: String, default: '-' },
  ebStart: { type: String, default: '-' },
  ebStartTime: { type: String, default: '-' },
  ebEnd: { type: String, default: '-' },
  ebEndTime: { type: String, default: '-' }
}, { _id: false });

const createEventSchema = new mongoose.Schema({
  // Auto-increment Event ID (CE1, CE2, ...) & Multi-tenancy
  createEventId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true
  },
  tenantKey: {
    type: String,
    required: true,
    default: 'default-tenant',
    index: true
  },

orgId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  loginMobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  // STEP 1: Basic Details & Categorization
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  eventDescription: { type: String, trim: true, default: '' },
  eventCategoryId: {
    type: String,
    required: [true, 'Event category ID is required'],
    trim: true
  },
  eventCategoryName: { type: String, trim: true, default: '' },
  subCategories: { type: Array, default: [] },
  eventTypes: { type: Array, default: [] },
  eventLanguages: { type: Array, default: [] },
  eventFormat: { type: String, default: '' },

  // STEP 2: Artists & Content
  artists: { type: Array, default: [] },
  hashtags: { type: Array, default: [] },

  // Media
  media: {
    bannerImage: { type: String, default: null },
    thumbnailImage: { type: String, default: null },
    seatMapImage: { type: String, default: null }
  },

  // STEP 3: Schedule & Venue
  schedule: {
    eventScheduleType: { type: String, default: 'single' },
    recurringType: { type: String, default: 'daily' },
    startDate: { type: Date, default: null },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    dailyTimeSlots: { type: Array, default: [] },
    selectedWeeklyDates: { type: Array, default: [] },
    weeklyTimeSlots: { type: Array, default: [] },
    sameTimeSlotForAll: { type: Boolean, default: false }
  },
  venue: {
    name: { type: String, default: '' },
    addressLine1: { type: String, default: '' },
    city: { type: String, default: '' },
    pincode: { type: String, default: '' },
    googleMapLink: { type: String, default: '' }
  },

  seatMapId: { 
    type: String, 
    default: null, 
    trim: true,
    index: true 
  },
  ticketTiers: [ticketTierSchema],

  // STEP 5: Event Guide & Rules
  guideResponses: { type: Array, default: [] },
  minAgeLimit: { type: String, default: '' },
  durationHours: { type: String, default: '' },
  durationMinutes: { type: String, default: '' },

  // STEP 6: Contact Person
  contactPerson: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' }
  },

  // Status & Stepper Tracker
  currentActiveStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 6
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'DRAFT',
    index: true
  },
  rejectionReason: { type: String, default: '' },
  approvalHistory: [{
    status: { type: String, enum: ['pending', 'approved', 'rejected'] },
    reason: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  strict: true,
  collection: 'createevents'
});

module.exports = mongoose.model('CreateEvent', createEventSchema);
