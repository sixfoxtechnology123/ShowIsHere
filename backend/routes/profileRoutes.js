const express = require('express');
const { getProfile, updateProfile, getStoredProfile } = require('../controllers/profileController');

const router = express.Router();
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/stored/:loginMobileNumber', getStoredProfile);

module.exports = router;
