const express = require('express');
const router = express.Router();
const { getEvents, getPopularCities, createEvent } = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/cities', getPopularCities);
router.post('/', createEvent);

module.exports = router;