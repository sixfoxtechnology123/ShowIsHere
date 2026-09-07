const express = require('express');
const { registerOrgAccount, getOrgAccount, saveOrgStep } = require('../controllers/eventOrgAccountController.js');

const router = express.Router();

router.post('/register', registerOrgAccount);
router.get('/:identifier', getOrgAccount);
router.post('/save-step', saveOrgStep);

module.exports = router;