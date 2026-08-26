const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  artistId: {
    type: String,
    required: true,
    unique: true
  },
  artistName: {
    type: String,
    default: ''
  },
  artistType: {
    type: String,
    default: 'Artist'
  },
  description: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);