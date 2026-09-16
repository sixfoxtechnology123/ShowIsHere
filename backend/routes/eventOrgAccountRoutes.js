const express = require('express');
const {
  registerOrgAccount,
  getOrgAccount,
  saveOrgStep,
  verifyPanDocument,
  sendEmailOtp,
  verifyEmailOtp,
  submitAgreement,
  getProfile,
  updateProfile,
  updateKycDetails,
  getPasswordStatus,
  updatePassword,
  sendPasswordResetOtp,
  resetPasswordWithOtp,
  listOrgAccounts,
  adminUpdateOrgAccount,
  updateApprovalStatus
} = require('../controllers/eventOrgAccountController.js');

const router = express.Router();

router.post('/register', registerOrgAccount);
router.post('/verify-pan', verifyPanDocument);
router.post('/save-step', saveOrgStep);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/submit-agreement', submitAgreement);
router.get('/get-profile', getProfile);
router.put('/update-profile', updateProfile);
router.put('/update-kyc', updateKycDetails);
router.get('/password-status', getPasswordStatus);
router.put('/password', updatePassword);
router.post('/password/send-reset-otp', sendPasswordResetOtp);
router.post('/password/reset', resetPasswordWithOtp);
router.get('/admin/accounts', listOrgAccounts);
router.put('/admin/accounts/:id', adminUpdateOrgAccount);
router.put('/admin/accounts/:id/approval', updateApprovalStatus);
router.get('/:identifier', getOrgAccount);

module.exports = router;
