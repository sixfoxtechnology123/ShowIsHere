const express = require('express');
const router = express.Router();
const { 
  loginWithMobile, 
  loginWithPassword, 
  resetPassword ,
  verifyMobileOtp
} = require('../controllers/LoginController');

// POST /api/login-page/login-mobile
router.post('/login-mobile', loginWithMobile);

// POST /api/login-page/login-password
router.post('/login-password', loginWithPassword);

// POST /api/login-page/reset-password
router.post('/reset-password', resetPassword);
router.post('/verify-mobile-otp', verifyMobileOtp);

module.exports = router;