const mongoose = require('mongoose');

const orgEventCreatedbsSchema = new mongoose.Schema({
  organizerAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'EventOrgAccount', default: null },
  orgId: { type: String, default: '' },
  tenantKey: { type: String, required: true, index: true },
  loginMobile: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  emailVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'submitted'], default: 'draft' },
  activeStep: { type: Number, default: 1 },
  eventDetails: { type: Object, default: {} },
  artistContent: { type: Object, default: {} },
  scheduleVenue: { type: Object, default: {} },
  seatMapTicketing: { type: Object, default: {} },
  eventGuide: { type: Object, default: {} },
  contact: { type: Object, default: {} },
  rawFormData: { type: Object, default: {} },
  submittedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('OrgEventCreatedbs', orgEventCreatedbsSchema);
