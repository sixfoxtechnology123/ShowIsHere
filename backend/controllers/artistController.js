const Artist = require('../models/Artist');

// Get all artists
exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new artist storing Base64 image directly in DB
exports.createArtist = async (req, res) => {
  try {
    const { artistName, artistType, description, photoBase64 } = req.body;
    
    // Generate sequential artist ID (ART-1, ART-2...)
    const lastArtist = await Artist.findOne().sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastArtist && lastArtist.artistId) {
      const parsedNum = parseInt(lastArtist.artistId.replace('ART-', ''), 10);
      if (!isNaN(parsedNum)) {
        nextNum = parsedNum + 1;
      }
    }
    const artistId = `ART-${nextNum}`;

    const newArtist = new Artist({
      artistId,
      artistName: artistName || '',
      artistType: artistType || 'Singer',
      description: description || '',
      photoUrl: photoBase64 || ''
    });

    const savedArtist = await newArtist.save();
    res.status(201).json(savedArtist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an artist
exports.updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { artistName, artistType, description, photoBase64 } = req.body;

    const updateData = {
      artistName: artistName || '',
      artistType: artistType || 'Singer',
      description: description || ''
    };

    if (photoBase64) {
      updateData.photoUrl = photoBase64;
    }

    const updatedArtist = await Artist.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedArtist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.status(200).json(updatedArtist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an artist
exports.deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArtist = await Artist.findByIdAndDelete(id);
    if (!deletedArtist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};