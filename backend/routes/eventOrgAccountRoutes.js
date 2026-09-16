const express = require('express');
const { registerOrgAccount, getOrgAccount, saveOrgStep, verifyPanDocument,sendEmailOtp, verifyEmailOtp} = require('../controllers/eventOrgAccountController.js');

const router = express.Router();

router.post('/register', registerOrgAccount);
router.post('/verify-pan', verifyPanDocument);
router.get('/:identifier', getOrgAccount);
router.post('/save-step', saveOrgStep);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);

module.exports = router;