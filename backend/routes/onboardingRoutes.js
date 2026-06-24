const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Dynamic model resolution to avoid schema instantiation dependency blocks
const Clinic = mongoose.models.Clinic || mongoose.model('Clinic', new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }));

const Staff = mongoose.models.Staff || require('../models/Staff');

/**
 * @route   POST /api/onboarding/create-clinic
 * @desc    Initialize a brand new distinct clinical tenant workspace boundary
 * @access  Private Installation Environment
 */
router.post('/create-clinic', async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Data entry validation anomaly: Missing baseline clinic descriptor properties.' });
    }

    const newClinic = new Clinic({
      name,
      category,
      isActive: true
    });

    await newClinic.save();

    return res.status(201).json({
      success: true,
      message: 'Workspace allocation boundary instantiated successfully.',
      data: newClinic
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal seeder exception initializing structural clinic entities.', error: error.message });
  }
});

/**
 * @route   POST /api/onboarding/create-admin
 * @desc    Generate master clinic admin credential profile bound to new clinic node
 * @access  Private Installation Environment
 */
router.post('/create-admin', async (req, res) => {
  try {
    const { clinicId, name, email, password, role } = req.body;

    if (!clinicId || !email || !password) {
      return res.status(400).json({ success: false, message: 'Validation anomaly: Missing relational links or target login credentials.' });
    }

    // Intercept duplicating email usernames to prevent directory collisions
    const existingUser = await Staff.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Deployment conflict: This system username is already mapped within the database index.' });
    }

    // Encrypt the plain text installer input passphrase safely using bcrypt algorithms
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Staff({
      clinicId,
      name: name || 'Master Administrator',
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'Admin',
      phone: '0000000000',
      isActive: true
    });

    await newAdmin.save();

    return res.status(201).json({
      success: true,
      message: 'Master administrative security account seeded completely without model errors.',
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal controller anomaly committing structural master staff profiles.', error: error.message });
  }
});

module.exports = router;