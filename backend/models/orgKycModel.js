const mongoose = require('mongoose');

const reKycHistorySchema = new mongoose.Schema({
  fields: [{
    type: String,
    enum: ['organizationName', 'panDetails', 'accountDetails', 'organizationAddress', 'uploadPanDocuments', 'contactDetails']
  }],
  reason: { type: String, trim: true, default: '' },
  requestedAt: { type: Date, default: Date.now },
  requestedBy: { type: String, default: 'admin' }
}, { _id: false });


const reasonNotificationSchema = new mongoose.Schema({
  reason: { type: String, required: true, trim: true },
  link: { type: String, default: '' }, // Navigation link
  createdAt: { type: Date, default: Date.now } // Automatic date and time
}, { _id: false });


const orgKycSchema = new mongoose.Schema({
  orgkycId: { type: String, required: true, unique: true },
  // orgId: { type: String, required: true, unique: true },
  orgName: { type: String, required: true },
  orgAddress: { type: String },
  panLinkedAadhaar: { type: String },
  panNumber: { type: String, required: true, uppercase: true, unique: true },
  gstinNumber: { type: String, uppercase: true, default: null },
  gstDeclaration: { type: Boolean, default: false },
  state: { type: String },
   contactFullName: { type: String }, 
  contactEmail: { type: String, required: true },
  loginMobileNumber: { type: String, trim: true },
  mobileVerified: { type: Boolean, default: false },
  verifiedEmail: { type: Boolean, default: false },
  //contactMobile: { type: String },
  accountHolderName: { type: String }, 
  accountType: { type: String, enum: ['Savings', 'Current', ''], default: '' },
  accountNumber: { type: String },
  bankIfsc: { type: String, uppercase: true },
  bankName: { type: String },
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
  signingIp: { type: String, default: null },
  rekyc: { type: Boolean, default: false },
  reKycFields: [{
    type: String,
    enum: ['organizationName', 'panDetails', 'accountDetails', 'organizationAddress', 'uploadPanDocuments', 'contactDetails']
  }],
  reKycHistory: { type: [reKycHistorySchema], default: [] },
  reasonNotifications: { type: [reasonNotificationSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('OrgKyc', orgKycSchema);
