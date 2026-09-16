const express = require('express');
const router = express.Router();
const { loginWithMobile } = require('../controllers/LoginController');

// POST /api/auth/login-mobile
router.post('/login-mobile', loginWithMobile);

module.exports = router;