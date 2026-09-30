const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: { type: String, default: '' },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  durationHours: { type: String, default: '' },
  durationMinutes: { type: String, default: '' }
}, { _id: false });

const ticketTierSchema = new mongoose.Schema({
  ticketType: { type: String, enum: ['free', 'paid'], default: 'paid' },
  ticketName: { type: String, default: '' },    
  price: { type: Number, default: 0 },         
  quantity: { type: Number, default: 0 },    
  available: { type: Number, default: 0 },
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

orgkycId: {
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
    startDate: { type: String, default: '' }, 
    endDate: { type: String, default: '' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    durationHours: { type: String, default: '' },   
    durationMinutes: { type: String, default: '' },
    dailyTimeSlots: [timeSlotSchema],
    selectedWeeklyDates: { type: Array, default: [] },
    weeklyTimeSlots: [timeSlotSchema],
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


  // STEP 6: Contact Person
  contactPerson: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' }
  },
  
  resubmit: { type: Boolean, default: false },
resubmitFields: { type: [String], default: [] },
resubmitHistory: [
  {
    fields: [String],
    reason: String,
    date: { type: Date, default: Date.now }
  }
],
resonNotification: [
  {
    reason: String,
    link: String,
    createdAt: { type: Date, default: Date.now }
  }
],
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
    duplicate: {
    type: Boolean,
    default: false
    },
cancelRequest: {
  type: String,
  enum: ['', 'pending', 'accept', 'reject'],
  default: '',
  index: true
},
cancelHistory: [{
  requestId: { type: String, default: '' },
  reason: { type: String, default: '' },
  description: { type: String, default: '' },
  rejectedReason: { type: String, default: '' },
  documentPaths: [{ type: String }], // Stores base64 strings or PDF data streams
  documentNames: [{ type: String }], // Stores original file names (e.g. "DH Invoice_Aug'2026.pdf")
  cancelledAt: { type: Date, default: Date.now },
  cancelRequest: { type: String, enum: ['', 'pending', 'accept', 'reject'], default: 'pending' }
}],
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
createEventSchema.index({ orgId: 1, updatedAt: -1 });
createEventSchema.index({ loginMobileNumber: 1, updatedAt: -1 });
createEventSchema.index({ 'contactPerson.mobile': 1, updatedAt: -1 });
module.exports = mongoose.model('CreateEvent', createEventSchema);
