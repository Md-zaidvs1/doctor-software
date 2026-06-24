const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');

// @desc    Create a new staff member account
// @route   POST /api/staff
// @access  Public (Will be contextually protected by Clinic Admin role in Phase 9)
const createStaff = async (req, res) => {
  try {
    const { clinicId, name, email, password, phone, role, specialization, isActive } = req.body;

    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Clinic identity assignment is required' });
    }

    const emailExists = await Staff.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
    }

    // Salt and hash the password for secure management storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Staff@123', salt); // fallback default temporary credentials

    const staff = new Staff({
      clinicId,
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      specialization: role === 'Doctor' ? specialization : '',
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedStaff = await staff.save();
    
    // Omit sensitive data fields before payload projection
    const responseData = savedStaff.toObject();
    delete responseData.password;

    res.status(201).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to onboard profile', error: error.message });
  }
};

// @desc    Get all staff (Filtered by active clinic tenant context)
// @route   GET /api/staff
// @access  Public
const getStaff = async (req, res) => {
  try {
    const { clinicId } = req.query;
    const filter = clinicId ? { clinicId } : {};

    const staffList = await Staff.find(filter).populate('clinicId', 'name').select('-password');
    res.status(200).json({ success: true, data: staffList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to fetch staff rosters', error: error.message });
  }
};

// @desc    Get individual staff asset profile by ID
// @route   GET /api/staff/:id
// @access  Public
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('clinicId', 'name').select('-password');
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff identity profile record could not be found' });
    }
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Retrieval operations fault', error: error.message });
  }
};

// @desc    Update a staff profile entry record
// @route   PUT /api/staff/:id
// @access  Public
const updateStaff = async (req, res) => {
  try {
    const { name, email, phone, role, specialization, isActive, password } = req.body;

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff structural record entry target not found' });
    }

    staff.name = name || staff.name;
    staff.email = email || staff.email;
    staff.phone = phone || staff.phone;
    staff.role = role || staff.role;
    staff.specialization = role === 'Doctor' ? (specialization || staff.specialization) : '';
    if (isActive !== undefined) staff.isActive = isActive;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(password, salt);
    }

    const updatedStaff = await staff.save();
    const responseData = updatedStaff.toObject();
    delete responseData.password;

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed compilation update patch', error: error.message });
  }
};

// @desc    Purge a staff access record completely
// @route   DELETE /api/staff/:id
// @access  Public
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile entry not found' });
    }

    await staff.deleteOne();
    res.status(200).json({ success: true, message: 'Staff account access credential architecture removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Eradication profile error execution', error: error.message });
  }
};

module.exports = {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
};