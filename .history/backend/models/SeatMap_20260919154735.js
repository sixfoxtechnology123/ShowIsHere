const mongoose = require('mongoose');

const seatMapSchema = new mongoose.Schema({
  seatMapCustomId: {
    type: String, // Stores 'SM1', 'SM2', 'SM3', etc.
    unique: true
  },
  name: {
    type: String,
    default: 'Main Auditorium Plan'
  },
  previewImage: {
    type: String, // Base64 image
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
  }
}, { timestamps: true });

module.exports = mongoose.model('SeatMap', seatMapSchema);