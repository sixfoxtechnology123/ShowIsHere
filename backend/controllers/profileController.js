const Profile = require('../models/profileModel');
const OrgKyc = require('../models/orgKycModel');

const nodemailer = require('nodemailer');
const { getOtpEmailTemplate } = require('../utils/EmailTemplates');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Temporary memory store for profile email OTPs
const emailOtpStore = {};


const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    const template = getOtpEmailTemplate(otp);

    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully to your email!' 
    });

    transporter.sendMail({
      from: `"ShowIsHere" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    }).catch(err => {
      console.error('Background Email Sending Error:', err);
    });

  } catch (error) {
    console.error('Send Email OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email OTP.' });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = emailOtpStore[email];

    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    delete emailOtpStore[email];
    
    // Update verification status in Profile database model
    await Profile.findOneAndUpdate(
      { contactEmail: email },
      { verifiedEmail: true }
    );

    return res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error while verifying OTP' });
  }
};


const generateNextProfileId = async () => {
  const records = await Profile.find({ profileId: /^PR\d+$/ }, { profileId: 1 }).lean();
  const highest = records.reduce((max, record) => Math.max(max, Number(record.profileId.slice(2)) || 0), 0);
  return `PR${highest + 1}`;
};

const findProfile = (query = {}) => {
  if (query.profileId) return Profile.findOne({ profileId: query.profileId });
  if (query.id) return Profile.findById(query.id);
  if (query.loginMobileNumber) return Profile.findOne({ loginMobileNumber: query.loginMobileNumber });
  return null;
};

const getProfile = async (req, res) => {
  try {
    const mobile = req.query.loginMobileNumber;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }

    // 1. Fetch master data from the OrgKyc model
    const kycData = await OrgKyc.findOne({ loginMobileNumber: mobile });

    // 2. Fetch or create record in the Profile model for custom profile fields
    let profile = await Profile.findOne({ loginMobileNumber: mobile });
    if (!profile) {
      profile = await Profile.create({
        profileId: await generateNextProfileId(),
        loginMobileNumber: mobile
      });
    }

    // 3. Combine them: Profile database fields + Live OrgKyc master fields
    const profileData = profile.toObject();
    
    if (kycData) {
      profileData.orgName = kycData.orgName || '';
      profileData.contactEmail = kycData.contactEmail || '';
      profileData.loginMobileNumber = kycData.loginMobileNumber || mobile;
      profileData.state = kycData.state || '';
      profileData.mobileVerified = kycData.mobileVerified || false; // <-- Add this
      profileData.verifiedEmail = kycData.verifiedEmail || false;     // <-- Add this
    }

    return res.json({ success: true, data: profileData });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, profileId, loginMobileNumber, ...profileData } = req.body;
    
    // 3. Prevent overwriting master KYC fields via profile updates
    delete profileData.orgName;
    delete profileData.state;
    delete profileData.contactEmail;

    let profile = await findProfile({ id, profileId, loginMobileNumber });
    if (!profile) {
      if (!loginMobileNumber) return res.status(400).json({ success: false, message: 'Mobile number is required.' });
      profile = new Profile({ profileId: await generateNextProfileId(), loginMobileNumber, ...profileData });
    } else {
      Object.assign(profile, profileData);
    }
    await profile.save();
    return res.json({ success: true, message: 'Profile updated successfully.', data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to update profile.' });
  }
};

const getStoredProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ loginMobileNumber: req.params.loginMobileNumber });
    if (!profile) return res.status(404).json({ success: false, message: 'Stored profile not found.' });
    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to fetch stored profile.' });
  }
};

module.exports = { 
  getProfile, 
  updateProfile, 
  getStoredProfile ,
  sendEmailOtp, 
  verifyEmailOtp,
   
};