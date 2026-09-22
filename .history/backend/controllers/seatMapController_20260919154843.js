const SeatMap = require('../models/SeatMap');

exports.saveSeatMap = async (req, res) => {
  try {
    const { seatMapMongoId, name, previewImage, pages, zones, customCategories, sections, shapes } = req.body;

    // Calculate live seat tallies
    let totalSeats = 0;
    let availableSeats = 0;
    (sections || []).forEach(sec => {
      const seats = sec.seats || {};
      const seatValues = Object.values(seats);
      totalSeats += seatValues.length;
      availableSeats += seatValues.filter(st => st.status === 'available').length;
    });

    let savedMap;

    if (seatMapMongoId) {
      // 1. UPDATE EXISTING RECORD (Keep its existing SM ID)
      savedMap = await SeatMap.findByIdAndUpdate(
        seatMapMongoId,
        {
          name: name || 'Auditorium Layout',
          previewImage,
          pages,
          zones,
          customCategories,
          sections,
          shapes,
          totalSeats,
          availableSeats
        },
        { new: true }
      );
    } else {
      // 2. CREATE NEW: Find the last created seat map directly from the SeatMap collection
      const lastMap = await SeatMap.findOne({ seatMapId: /^SM\d+$/ })
        .sort({ createdAt: -1 })
        .lean();

      let nextNumber = 1;
      if (lastMap && lastMap.seatMapId) {
        const lastNum = parseInt(lastMap.seatMapId.replace('SM', ''), 10);
        if (!isNaN(lastNum)) {
          nextNumber = lastNum + 1;
        }
      }

      const generatedId = `SM${nextNumber}`; // "SM1", "SM2", "SM3"...

      savedMap = new SeatMap({
        seatMapId: generatedId,
        name: name || 'Auditorium Layout',
        previewImage,
        pages,
        zones,
        customCategories,
        sections,
        shapes,
        totalSeats,
        availableSeats
      });

      await savedMap.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Seat map saved successfully!',
      seatMapId: savedMap.seatMapId, // SM1, SM2, etc.
      seatMapMongoId: savedMap._id,
      previewImage: savedMap.previewImage,
      totalSeats: savedMap.totalSeats,
      availableSeats: savedMap.availableSeats
    });
  } catch (error) {
    console.error('Error saving seat map:', error);
    return res.status(500).json({ success: false, message: 'Server error saving seat map', error: error.message });
  }
};

exports.getSeatMapById = async (req, res) => {
  try {
    const { id } = req.params;
    // Look up directly by either 'SM1' or MongoDB _id
    const query = id.startsWith('SM') ? { seatMapId: id } : { _id: id };
    const seatMap = await SeatMap.findOne(query);

    if (!seatMap) {
      return res.status(404).json({ success: false, message: 'Seat map not found' });
    }
    return res.status(200).json({ success: true, data: seatMap });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving seat map', error: error.message });
  }
};