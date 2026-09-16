const EventOrgAccount = require('../models/eventOrgAccountModel.js');
const jwt = require('jsonwebtoken');

const generateToken = (id, orgId) => {
  return jwt.sign({ id, orgId }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '7d'
  });
};

const loginWithMobile = async (req, res) => {
  try {
    const { loginMobileNumber } = req.body;
    // console.log("🔍 Incoming Login Mobile Number:", loginMobileNumber); // <--- CHECK TERMINAL
    
    if (!loginMobileNumber) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }

    const trimmedMobile = loginMobileNumber.trim();

    // Search database
    const existingOrg = await EventOrgAccount.findOne({
      $or: [
        { loginMobileNumber: trimmedMobile },
        { contactMobile: trimmedMobile }
      ]
    });

    //console.log("📦 Database Search Result:", existingOrg ? "Found Account" : "Not Found"); // <--- CHECK TERMINAL

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

module.exports = {
  loginWithMobile,
};