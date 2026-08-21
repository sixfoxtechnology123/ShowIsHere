const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['LIVE EVENT', 'WORKSHOP', 'ONLINE EVENT'], required: true },
  city: { type: String, required: true, default: 'Kolkata' },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  priceType: { type: String, enum: ['Free', 'Paid'], required: true },
  price: { type: Number, default: 0 },
  totalTickets: { type: Number, required: true },
  soldTickets: { type: Number, default: 0 },
  isPromoted: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  hitCount: { type: Number, default: 0 },
  tenantKey: { type: String, required: true, default: 'default' },
  thumbnail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);