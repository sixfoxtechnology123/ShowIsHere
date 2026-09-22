const express = require('express');
const router = express.Router();
const seatMapController = require('../controllers/seatMapController');

router.post('/save', seatMapController.saveSeatMap);
router.get('/:id', seatMapController.getSeatMapById);

module.exports = router;