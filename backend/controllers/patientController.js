const Patient = require('../models/Patient');

// @desc    Register a new unique patient record
// @route   POST /api/patients
// @access  Public (Clinic Scope context)
const createPatient = async (req, res) => {
  try {
    const {
      clinicId,
      name,
      gender,
      dob,
      email,
      phone,
      emergencyContact,
      medicalHistory,
      allergies,
      bloodGroup,
      address,
      isActive,
    } = req.body;

    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Tenant clinic execution ID required.' });
    }

    // Auto-generate a clinical sequence ID tag based on total records in this tenant
    const patientCount = await Patient.countDocuments({ clinicId });
    const sequenceString = String(patientCount + 1).padStart(4, '0');
    const computedPatientId = `PAT-${new Date().getFullYear()}-${sequenceString}`;

    const patient = new Patient({
      clinicId,
      patientId: computedPatientId,
      name,
      gender,
      dob,
      email,
      phone,
      emergencyContact,
      medicalHistory: medicalHistory || [],
      allergies: allergies || [],
      bloodGroup: bloodGroup || 'Unknown',
      address,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedPatient = await patient.save();
    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Critical pipeline write execution fault.', error: error.message });
  }
};

// @desc    Fetch isolated patient registries (with elastic text search capability)
// @route   GET /api/patients
// @access  Public
const getPatients = async (req, res) => {
  try {
    const { clinicId, search } = req.query;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Missing tenant filter context parameters.' });
    }

    let queryCondition = { clinicId };

    // Apply basic search queries across multiple schema variables
    if (search) {
      queryCondition.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
      ];
    }

    const patientRoster = await Patient.find(queryCondition).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patientRoster });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: System database fetch failure.', error: error.message });
  }
};

// @desc    Fetch target complete patient record profiles
// @route   GET /api/patients/:id
// @access  Public
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Individual patient data block not found.' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Read command verification failure.', error: error.message });
  }
};

// @desc    Modify complete operational profiles & medical parameters
// @route   PUT /api/patients/:id
// @access  Public
const updatePatient = async (req, res) => {
  try {
    const {
      name,
      gender,
      dob,
      email,
      phone,
      emergencyContact,
      medicalHistory,
      allergies,
      bloodGroup,
      address,
      isActive,
    } = req.body;

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Target infrastructure file target missing.' });
    }

    patient.name = name || patient.name;
    patient.gender = gender || patient.gender;
    patient.dob = dob || patient.dob;
    patient.email = email !== undefined ? email : patient.email;
    patient.phone = phone || patient.phone;
    patient.emergencyContact = emergencyContact || patient.emergencyContact;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.allergies = allergies || patient.allergies;
    patient.bloodGroup = bloodGroup || patient.bloodGroup;
    patient.address = address !== undefined ? address : patient.address;
    if (isActive !== undefined) patient.isActive = isActive;

    const updatedPatient = await patient.save();
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Refusal processing modifications.', error: error.message });
  }
};

// @desc    Eradicate/un-link specific registry blocks
// @route   DELETE /api/patients/:id
// @access  Public
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'File index missing.' });
    }

    await patient.deleteOne();
    res.status(200).json({ success: true, message: 'Demographic file tracking unlinked successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: System exception handling deletion.', error: error.message });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};