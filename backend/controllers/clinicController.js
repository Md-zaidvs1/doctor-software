const Clinic = require('../models/Clinic');

// @desc    Create a new clinic
// @route   POST /api/clinics
// @access  Public (Will be protected by Super Admin auth in Phase 9)
const createClinic = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      ownerName,
      email,
      phone,
      gstNumber,
      address,
      logo,
      subscription,
      enabledModules,
      isActive
    } = req.body;

    // Check if slug already exists
    const slugExists = await Clinic.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ success: false, message: 'Clinic slug/identifier must be unique' });
    }

    // Check if email already exists
    const emailExists = await Clinic.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Clinic with this email already exists' });
    }

    const clinic = new Clinic({
      name,
      slug,
      category,
      ownerName,
      email,
      phone,
      gstNumber,
      address,
      logo,
      subscription: subscription || { plan: null, status: 'Trial', expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }, // Default 14-day trial
      enabledModules: enabledModules || [],
      isActive: isActive !== undefined ? isActive : true
    });

    const savedClinic = await clinic.save();
    res.status(201).json({ success: true, data: savedClinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to create clinic', error: error.message });
  }
};

// @desc    Get all clinics
// @route   GET /api/clinics
// @access  Public
const getClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({}).populate('category', 'name');
    res.status(200).json({ success: true, data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to fetch clinics', error: error.message });
  }
};

// @desc    Get a single clinic by ID
// @route   GET /api/clinics/:id
// @access  Public
const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate('category', 'name');
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to fetch clinic details', error: error.message });
  }
};

// @desc    Update a clinic
// @route   PUT /api/clinics/:id
// @access  Public
const updateClinic = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      ownerName,
      email,
      phone,
      gstNumber,
      address,
      logo,
      subscription,
      enabledModules,
      isActive
    } = req.body;

    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    // Check slug uniqueness if it is changing
    if (slug && slug !== clinic.slug) {
      const slugExists = await Clinic.findOne({ slug });
      if (slugExists) {
        return res.status(400).json({ success: false, message: 'Clinic slug/identifier must be unique' });
      }
      clinic.slug = slug;
    }

    clinic.name = name || clinic.name;
    clinic.category = category || clinic.category;
    clinic.ownerName = ownerName || clinic.ownerName;
    clinic.email = email || clinic.email;
    clinic.phone = phone || clinic.phone;
    clinic.gstNumber = gstNumber || clinic.gstNumber;
    clinic.address = address || clinic.address;
    clinic.logo = logo || clinic.logo;
    clinic.subscription = subscription || clinic.subscription;
    clinic.enabledModules = enabledModules || clinic.enabledModules;
    if (isActive !== undefined) clinic.isActive = isActive;

    const updatedClinic = await clinic.save();
    res.status(200).json({ success: true, data: updatedClinic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to update clinic', error: error.message });
  }
};

// @desc    Delete a clinic
// @route   DELETE /api/clinics/:id
// @access  Public
const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    await clinic.deleteOne();
    res.status(200).json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to delete clinic', error: error.message });
  }
};

module.exports = {
  createClinic,
  getClinics,
  getClinicById,
  updateClinic,
  deleteClinic
};