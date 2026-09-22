const SeatMap = require('../models/SeatMap');

exports.saveSeatMap = async (req, res) => {
  try {
    const { seatMapMongoId, name, previewImage, pages, zones, customCategories, sections, shapes } = req.body;

    let totalSeats = 0;
    let availableSeats = 0;
    let reservedSeats = 0;
    const categoryCounts = {};

    // Initialize counts for all created custom categories to 0
    (customCategories || []).forEach(cat => {
      if (cat.name) categoryCounts[cat.name] = 0;
    });

    (sections || []).forEach(sec => {
      const defaultCat = sec.category || 'Default';
      const seats = sec.seats || {};

      Object.values(seats).forEach(st => {
        totalSeats++;

        // Reserved seats (blocked, sold, wheelchair)
        if (st.status === 'blocked' || st.status === 'sold' || st.status === 'wheelchair') {
          reservedSeats++;
        } else if (st.status === 'available') {
          availableSeats++;

          // Determine category of this specific seat
          const seatCategory = (st.category !== undefined && st.category !== '') ? st.category : defaultCat;
          categoryCounts[seatCategory] = (categoryCounts[seatCategory] || 0) + 1;
        }
      });
    });

    let savedMap;

    if (seatMapMongoId) {
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
          availableSeats,
          reservedSeats,
          categoryCounts
        },
        { new: true }
      );
    } else {
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

      const generatedId = `SM${nextNumber}`;

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
        availableSeats,
        reservedSeats,
        categoryCounts
      });

      await savedMap.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Seat map saved successfully!',
      seatMapId: savedMap.seatMapId,
      seatMapMongoId: savedMap._id,
      previewImage: savedMap.previewImage,
      totalSeats: savedMap.totalSeats,
      availableSeats: savedMap.availableSeats,
      reservedSeats: savedMap.reservedSeats,
      categoryCounts: savedMap.categoryCounts
    });
  } catch (error) {
    console.error('Error saving seat map:', error);
    return res.status(500).json({ success: false, message: error.message });
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