const express = require('express');
const { 
    getProfile,
     updateProfile,
      getStoredProfile ,
      sendEmailOtp,
      verifyEmailOtp} = require('../controllers/profileController');

const router = express.Router();
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/stored/:loginMobileNumber', getStoredProfile);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);

module.exports = router;
