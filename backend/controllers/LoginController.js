const EventOrgAccount = require('../models/eventOrgAccountModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto'); 

const verifySaltedPassword = (password, salt, hash) => {
  if (!password || !salt || !hash) return false;
  try {
    const candidate = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
  } catch (error) {
    return false;
  }
};

const generateToken = (id, orgId) => {
  return jwt.sign({ id, orgId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d'
  });
};

const loginWithMobile = async (req, res) => {
  try {
    const { loginMobileNumber } = req.body;
    if (!loginMobileNumber) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }

    const trimmedMobile = loginMobileNumber.trim();
    const existingOrg = await EventOrgAccount.findOne({
      $or: [
        { loginMobileNumber: trimmedMobile },
        { contactMobile: trimmedMobile }
      ]
    });

    if (existingOrg) {
      const token = generateToken(existingOrg._id, existingOrg.orgId);
      return res.status(200).json({
        success: true,
        exists: true,
        message: 'Account found successfully!',
        token,
        data: existingOrg
      });
    } else {
      return res.status(200).json({
        success: true,
        exists: false,
        message: 'No account found for this mobile number. Please register.'
      });
    }
  } catch (error) {
    console.error('❌ Login Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during login check.' });
  }
};


const loginWithPassword = async (req, res) => {
  try {
    const { loginMobileNumber, mobileNumber, password } = req.body;
    const finalMobile = loginMobileNumber || mobileNumber;

    if (!finalMobile || !password) {
      return res.status(400).json({ success: false, message: 'Mobile number and password are required.' });
    }

    const trimmedMobile = String(finalMobile).trim();

    const existingOrg = await EventOrgAccount.findOne({
      $or: [
        { loginMobileNumber: trimmedMobile },
        { contactMobile: trimmedMobile }
      ]
    });

    if (!existingOrg) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    // Passwords may exist from older plain/bcrypt flows or from settings (salted PBKDF2).
    let isMatch = false;
    if (existingOrg.passwordSalt) {
      isMatch = verifySaltedPassword(password, existingOrg.passwordSalt, existingOrg.passwordHash);
    } else if (existingOrg.passwordHash === password) {
      isMatch = true;
    } else if (existingOrg.passwordHash && (existingOrg.passwordHash.startsWith('$2b$') || existingOrg.passwordHash.startsWith('$2a$'))) {
      isMatch = await bcrypt.compare(password, existingOrg.passwordHash);
    }

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password.' });
    }

    const token = generateToken(existingOrg._id, existingOrg.orgId);
    return res.status(200).json({
      success: true,
      message: 'Successfully Signed In!',
      token,
      data: existingOrg
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { mobileNumber, newPassword } = req.body;
    if (!mobileNumber || !newPassword) {
      return res.status(400).json({ success: false, message: 'Mobile number and new password are required.' });
    }

    const trimmedMobile = mobileNumber.trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedAccount = await EventOrgAccount.findOneAndUpdate(
      { $or: [{ loginMobileNumber: trimmedMobile }, { contactMobile: trimmedMobile }] },
      { 
        $set: { 
          passwordHash: hashedPassword,
          passwordSalt: '',
          passwordUpdatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ success: false, message: 'Organizer account not found for this mobile number.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully in database!'
    });
  } catch (error) {
    console.error('❌ Reset Password Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginWithMobile,
  loginWithPassword,
  resetPassword,
};
