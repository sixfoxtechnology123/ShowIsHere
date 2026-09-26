const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  profileId: { type: String, required: true, unique: true },
  loginMobileNumber: { type: String, required: true, unique: true, index: true },
  orgName: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  address1: { type: String, default: '' },
  address2: { type: String, default: '' },
  country: { type: String, default: 'India' },
  state: { type: String, default: '' },
  city: { type: String, default: '' },
  contactMobile: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  verifiedEmail: { type: Boolean, default: false },
  about: { type: String, default: '' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  profilePhoto: { type: String, default: null },
  approvalStatus: { type: String, default: 'pending' },
  notifications: [{
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
