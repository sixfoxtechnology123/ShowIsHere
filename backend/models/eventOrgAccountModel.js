const mongoose = require('mongoose');

const eventOrgAccountSchema = new mongoose.Schema({
  orgId: { type: String, required: true, unique: true },
  tenantKey: { type: String, required: true, unique: true },
  orgName: { type: String, required: true },
  orgAddress: { type: String },
  panLinkedAadhaar: { type: String },
  panNumber: { type: String, required: true, uppercase: true, unique: true },
  gstinNumber: { type: String, uppercase: true, default: null },
  gstDeclaration: { type: Boolean, default: false },
  state: { type: String },
  contactFullName: { type: String },
  contactEmail: { type: String, required: true },
  contactMobile: { type: String },
  accountNumber: { type: String },
  bankIfsc: { type: String, uppercase: true },
  bankName: { type: String },
  panCardDocument: { type: Object, default: null },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  signatureImage: { type: String, default: null },
  signinAgreement: { type: Boolean, default: false },
  panVerified: {
  type: Boolean,
  default: false
},
  signingAt: { type: Date, default: null },
  signingIp: { type: String, default: null }
}, { timestamps: true });

// Ensure this export is correct so Mongoose methods like .findOne() are available
module.exports = mongoose.model('EventOrgAccount', eventOrgAccountSchema);