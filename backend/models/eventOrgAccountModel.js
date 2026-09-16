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
  country: { type: String },
  city: { type: String },
  address1: { type: String },
  address2: { type: String },
  websiteUrl: { type: String },
  about: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  profilePhoto: { type: String, default: null },
  contactFullName: { type: String }, 
  contactEmail: { type: String, required: true },
  loginMobileNumber: { type: String, trim: true },
  verifiedEmail: { type: Boolean, default: false },
  contactMobile: { type: String },
  accountHolderName: { type: String }, 
  accountType: { type: String, enum: ['Savings', 'Current', ''], default: '' },
  accountNumber: { type: String },
  bankIfsc: { type: String, uppercase: true },
  bankName: { type: String },
  branch: { type: String },
  panCardDocument: { type: Object, default: null },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String, default: '' },
  approvalHistory: [{
    status: { type: String, enum: ['pending', 'approved', 'rejected'] },
    reason: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now }
  }],
  passwordHash: { type: String, default: '' },
  passwordSalt: { type: String, default: '' },
  passwordUpdatedAt: { type: Date, default: null },
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
