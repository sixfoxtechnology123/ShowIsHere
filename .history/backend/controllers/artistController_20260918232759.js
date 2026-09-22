const Artist = require('../models/Artist');


// Helper: Finds the highest existing ART number and gives the next one
const getNextArtistIds = async (count = 1) => {
  const existingArtists = await Artist.find(
    { artistId: { $regex: /^ART\d+$/ } },
    { artistId: 1 }
  ).lean();

  let maxNumber = 0;
  if (existingArtists && existingArtists.length > 0) {
    const numbers = existingArtists
      .map((a) => parseInt((a.artistId || '').replace(/\D/g, ''), 10))
      .filter((num) => !isNaN(num));

    if (numbers.length > 0) {
      maxNumber = Math.max(...numbers);
    }
  }

  const generatedIds = [];
  for (let i = 1; i <= count; i++) {
    generatedIds.push(`ART${maxNumber + i}`);
  }

  return count === 1 ? generatedIds[0] : generatedIds;
};


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
    // Array / Bulk upload handling
    if (Array.isArray(req.body)) {
      if (req.body.length === 0) {
        return res.status(400).json({ error: 'No artist data provided' });
      }

      const autoIds = await getNextArtistIds(req.body.length);

      const formattedData = req.body.map((item, index) => ({
        artistId: item.artistId || item['Artist ID'] || item.ID || autoIds[index],
        artistName: item['Artist Name'] || item.artistName || item.Name || item.NAME || 'Unnamed',
        artistType: item['Category'] || item.artistType || item.Type || item.TYPE || 'Artist',
        description: item['Description'] || item.description || item.DESCRIPTION || '',
        photoUrl: item.photoUrl || item.photoBase64 || ''
      }));
      const savedArtists = await Artist.insertMany(formattedData);
      return res.status(201).json(savedArtists);
    }

    // Single Artist Creation
    const { artistName, artistType, description, photoBase64, photoUrl } = req.body;

    if (!artistName || !artistName.trim()) {
      return res.status(400).json({ error: 'Artist Name is required' });
    }

    // Generates ART1, ART2, etc., from actual database records right before saving
    const nextArtistId = await getNextArtistIds(1);

    const newArtist = new Artist({
      artistId: nextArtistId,
      artistName: artistName.trim(),
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