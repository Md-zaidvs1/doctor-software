const Staff = require('../models/Staff');
const Clinic = require('../models/Clinic');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper structural generator compiling JSON Web Tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_salt_string_2026', {
    expiresIn: '8h', // Standard shifting authorization block limit length
  });
};

// @desc    Authenticate User credentials & sign authorization tokens
// @route   POST /api/auth/login
// @access  Public
const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide valid email and password credentials.' });
    }

    // Identify target account mapping parameters matching email string indices
    const staffMember = await Staff.findOne({ email }).populate('clinicId');
    if (!staffMember) {
      return res.status(401).json({ success: false, message: 'Invalid authentication credentials provided.' });
    }

    if (!staffMember.isActive) {
      return res.status(403).json({ success: false, message: 'Access suspended: Your staff profile account state is locked.' });
    }

    // Verify operational crypt string hashing values match password input matches
    const isMatch = await bcrypt.compare(password, staffMember.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid authentication credentials provided.' });
    }

    // Verify parent clinic profile context is not disabled/flagged off inside tenancy
    if (staffMember.clinicId && !staffMember.clinicId.isActive) {
      return res.status(403).json({ success: false, message: 'Access suspended: The parent clinic tenancy space is inactive.' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(staffMember._id),
      user: {
        id: staffMember._id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        clinicId: staffMember.clinicId?._id || null,
        clinicName: staffMember.clinicId?.name || 'Developer Hub',
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Core authentication pipeline failure.', error: error.message });
  }
};

// @desc    Retrieve verified current token user details
// @route   GET /api/auth/me
// @access  Private (Protected by token verify middleware layers)
const getMe = async (req, res) => {
  try {
    const userProfile = await Staff.findById(req.user.id).select('-password').populate('clinicId', 'name isActive');
    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'Identity context profile could not be resolved.' });
    }
    res.status(200).json({ success: true, data: userProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Profile verify execution pipeline exception.', error: error.message });
  }
};

module.exports = {
  loginStaff,
  getMe,
};