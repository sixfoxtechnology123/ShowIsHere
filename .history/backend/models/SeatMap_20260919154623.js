const mongoose = require('mongoose');

const seatMapSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Main Auditorium Plan'
  },
  previewImage: {
    type: String, // Base64 PNG/JPEG screenshot of the canvas
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
    type: Array, // Holds section coordinates, dimensions, row/seat numbering, and seat maps
    default: []
  },
  shapes: {
    type: Array, // Holds facilities, stage, text, entrance/exit shapes
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