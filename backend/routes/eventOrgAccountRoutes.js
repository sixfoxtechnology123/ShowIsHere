const express = require('express');
const { registerOrgAccount, getOrgAccount, saveOrgStep, verifyPanDocument } = require('../controllers/eventOrgAccountController.js');

const router = express.Router();

router.post('/register', registerOrgAccount);
router.post('/verify-pan', verifyPanDocument);
router.get('/:identifier', getOrgAccount);
router.post('/save-step', saveOrgStep);

module.exports = router;