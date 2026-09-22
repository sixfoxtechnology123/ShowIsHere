const mongoose = require('mongoose');

const seatMapSchema = new mongoose.Schema({
  seatMapId: {
    type: String, // e.g. 'SM1', 'SM2'
    unique: true
  },
  name: {
    type: String,
    default: 'Main Auditorium Plan'
  },
  previewImage: {
    type: String,
    default: null
  },
  pages: [{
    id: String,
    name: String,
    width: Number,
    height: Number
  }],
  zones: [{
    id: String,
    name: String
  }],
  customCategories: [{
    name: String,
    color: String,
    price: Number
  }],
  sections: {
    type: Array,
    default: []
  },
  shapes: {
    type: Array,
    default: []
  },
  totalSeats: {
    type: Number,
    default: 0
  },
  availableSeats: {
    type: Number,
    default: 0
  },
  reservedSeats: {
    type: Number,
    default: 0
  },
  // Stores { "VIP": 10, "Regular": 50, "Premium": 20, ... }
  categoryCounts: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('SeatMap', seatMapSchema);