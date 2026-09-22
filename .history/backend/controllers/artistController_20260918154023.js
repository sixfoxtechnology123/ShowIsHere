const Artist = require('../models/Artist');

const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createArtist = async (req, res) => {
  try {
    const generateId = () => 'ART-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

    if (Array.isArray(req.body)) {
      const formattedData = req.body.map(item => ({
        artistId: item.artistId || item['Artist ID'] || item.ID || generateId(),
        artistName: item['Artist Name'] || item.artistName || item.Name || item.NAME || 'Unnamed',
        artistType: item['Category'] || item.artistType || item.Type || item.TYPE || 'Artist',
        description: item['Description'] || item.description || item.DESCRIPTION || '',
        photoUrl: item.photoUrl || item.photoBase64 || ''
      }));
      const savedArtists = await Artist.insertMany(formattedData);
      return res.status(201).json(savedArtists);
    }

    const { artistId, artistName, artistType, description, photoBase64, photoUrl } = req.body;
    
    const newArtist = new Artist({
      artistId: artistId || generateId(),
      artistName: artistName || 'Unnamed',
      artistType: artistType || 'Artist',
      description: description || '',
      photoUrl: photoUrl || photoBase64 || ''
    });

    const savedArtist = await newArtist.save();
    res.status(201).json(savedArtist);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { artistName, artistType, description, photoBase64, photoUrl } = req.body;

    const updatedData = {
      artistName,
      artistType,
      description,
    };

    if (photoBase64 || photoUrl) {
      updatedData.photoUrl = photoBase64 || photoUrl;
    }

    // Updated from { new: true } to { returnDocument: 'after' }
    const updatedArtist = await Artist.findByIdAndUpdate(id, updatedData, { returnDocument: 'after' });
    
    if (!updatedArtist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.status(200).json(updatedArtist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteArtist = async (req, res) => {
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

module.exports = {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist
};