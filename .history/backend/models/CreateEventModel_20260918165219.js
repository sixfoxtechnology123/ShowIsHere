import mongoose from 'mongoose';

// Sub-schemas for Step 1
const SubCategorySchema = new mongoose.Schema({
  subCategoryId: { type: String, trim: true },
  subCategoryName: { type: String, trim: true, required: true }
}, { _id: false });

const EventTypeSchema = new mongoose.Schema({
  eventTypeId: { type: String, trim: true },
  typeName: { type: String, trim: true, required: true },
  subCategoryId: { type: String, trim: true },
  subCategoryName: { type: String, trim: true }
}, { _id: false });

// Sub-schemas for Step 2: Date, Time, Venue
const EventScheduleSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type: Date },
  startTime: { type: String, trim: true },
  endTime: { type: String, trim: true },
  timezone: { type: String, default: 'Asia/Kolkata', trim: true }
}, { _id: false });

const VenueSchema = new mongoose.Schema({
  venueType: { type: String, enum: ['PHYSICAL', 'ONLINE', 'HYBRID'], default: 'PHYSICAL' },
  name: { type: String, trim: true },
  addressLine1: { type: String, trim: true },
  addressLine2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  country: { type: String, default: 'India', trim: true },
  googlePlaceId: { type: String, trim: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  onlineMeetingUrl: { type: String, trim: true }
}, { _id: false });

// Sub-schemas for Step 3: Artists, Performers & Media
const ArtistSchema = new mongoose.Schema({
  artistId: { type: String, trim: true },
  artistName: { type: String, trim: true, required: true },
  role: { type: String, trim: true },
  image: { type: String, trim: true }
}, { _id: false });

const MediaSchema = new mongoose.Schema({
  bannerImage: { type: String, trim: true },
  thumbnailImage: { type: String, trim: true },
  galleryImages: [{ type: String, trim: true }],
  promoVideoUrl: { type: String, trim: true }
}, { _id: false });

// Sub-schemas for Step 4: Ticketing & Seating
const TicketTierSchema = new mongoose.Schema({
  ticketName: { type: String, trim: true, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  bookedQuantity: { type: Number, default: 0 },
  maxPerUser: { type: Number, default: 10 },
  description: { type: String, trim: true },
  seatMapCategoryRef: { type: String, trim: true },
  status: { type: String, enum: ['ACTIVE', 'SOLD_OUT', 'INACTIVE'], default: 'ACTIVE' }
}, { _id: false });

// Sub-schemas for Step 5: Event Guide Question Responses
const GuideResponseSchema = new mongoose.Schema({
  questionId: { type: String, required: true, trim: true },
  question: { type: String, required: true, trim: true },
  selectedOptions: [{ type: String, trim: true }],
  customTextValues: [{ type: String, trim: true }],
  answerText: { type: String, trim: true }
}, { _id: false });

// Primary Event Schema
const createEventSchema = new mongoose.Schema({
  // STEP 1: Basic Information & Categorization
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    index: true
  },
  eventDescription: { type: String, trim: true },
  eventCategoryId: {
    type: String,
    required: [true, 'Event category ID is required'],
    trim: true,
    index: true
  },
  eventCategoryName: {
    type: String,
    required: [true, 'Event category name is required'],
    trim: true
  },
  subCategories: [SubCategorySchema],
  eventTypes: [EventTypeSchema],

  // STEP 2: Date, Time & Venue
  schedule: EventScheduleSchema,
  venue: VenueSchema,

  // STEP 3: Artists & Media
  artists: [ArtistSchema],
  media: MediaSchema,

  // STEP 4: Ticketing & Capacity
  ticketTiers: [TicketTierSchema],
  totalCapacity: { type: Number, default: 0 },

  // STEP 5: Event Guide Config & Question Answers
  guideResponses: [GuideResponseSchema],
  eventGuideNotes: { type: String, trim: true },

  // Multi-step form tracking & publication status
  currentActiveStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'ARCHIVED'],
    default: 'DRAFT',
    index: true
  }
}, {
  timestamps: true,
  collection: 'events'
});

export default mongoose.model('CreateEvent', createEventSchema);