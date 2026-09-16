const express = require('express');
const { registerOrgAccount, getOrgAccount, saveOrgStep, verifyPanDocument,sendEmailOtp, verifyEmailOtp,submitAgreement,getProfile,updateProfile} = require('../controllers/eventOrgAccountController.js');

const router = express.Router();

router.post('/register', registerOrgAccount);
router.post('/verify-pan', verifyPanDocument);
router.get('/:identifier', getOrgAccount);
router.post('/save-step', saveOrgStep);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/submit-agreement', submitAgreement);
router.get('/get-profile', getProfile);
router.put('/update-profile', updateProfile);

module.exports = router;