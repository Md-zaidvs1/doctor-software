const express = require('express');
const router = express.Router();
const DentalRecord = require('../models/DentalRecord');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/dental/chart
// @desc    Save/Update a tooth status
router.post('/chart', protect, async (req, res) => {
  const { patientId, toothNumber, condition, treatment } = req.body;

  try {
    // Find if a record exists for this tooth, otherwise create a new one
    let record = await DentalRecord.findOneAndUpdate(
      { clinicId: req.user.clinicId, patientId, toothNumber },
      { condition, treatment, date: Date.now() },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error saving tooth chart data' });
  }
});

// @route   GET /api/dental/chart/:patientId
// @desc    Fetch all tooth records for a patient
router.get('/chart/:patientId', protect, async (req, res) => {
  try {
    const records = await DentalRecord.find({ 
      clinicId: req.user.clinicId, 
      patientId: req.params.patientId 
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chart data' });
  }
});

module.exports = router;