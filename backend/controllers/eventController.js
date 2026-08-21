const Event = require('../models/Event');

// Get all events with filters (City, Category, Tab type)
const getEvents = async (req, res) => {
  try {
    const { city = 'Kolkata', category, filter } = req.query;
    const query = { city, tenantKey: req.tenantKey };

    if (category) query.category = category;

    // Handle Tab filters (Recommended, Today, This Weekend)
    const currentDate = new Date();
    if (filter === 'Today') {
      const startOfDay = new Date(currentDate.setHours(0,0,0,0));
      const endOfDay = new Date(currentDate.setHours(23,59,59,999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (filter === 'This Weekend') {
      const startOfWeekend = new Date();
      const endOfWeekend = new Date();
      endOfWeekend.setDate(startOfWeekend.getDate() + 7);
      query.date = { $gte: startOfWeekend, $lte: endOfWeekend };
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular cities based on event entries
const getPopularCities = async (req, res) => {
  try {
    const cities = await Event.aggregate([
      { $match: { tenantKey: req.tenantKey } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    res.json(cities.map(c => ({ city: c._id, count: c.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create({ ...req.body, tenantKey: req.tenantKey });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getEvents, getPopularCities, createEvent };