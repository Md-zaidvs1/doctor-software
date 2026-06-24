const TreatmentRecord = require('../models/TreatmentRecord');
const Appointment = require('../models/Appointment');

// @desc    Record clinical encounter and procedure details
// @route   POST /api/treatment-records
// @access  Public (Contextually doctor restricted later)
const createTreatmentRecord = async (req, res) => {
  try {
    const { clinicId, patientId, doctorId, appointmentId, clinicalNotes, diagnosis, procedures, prescriptions } = req.body;

    if (!clinicId || !patientId || !doctorId || !clinicalNotes || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Missing analytical criteria variables for clinical tracking.' });
    }

    const record = new TreatmentRecord({
      clinicId,
      patientId,
      doctorId,
      appointmentId: appointmentId || null, // Fixed: explicitly defined key assignment
      clinicalNotes,
      diagnosis,
      procedures: procedures || [],
      prescriptions: prescriptions || []
    });

    const savedRecord = await record.save();

    // Contextually update appointment workflow state automatically if reference is passed
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: 'Completed' });
    }

    res.status(201).json({ success: true, data: savedRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Encounter update routing pipeline collapse.', error: error.message });
  }
};

// @desc    Get historical treatment charts (Filtered strictly by tenant and patient context)
// @route   GET /api/treatment-records
// @access  Public
const getTreatmentRecords = async (req, res) => {
  try {
    const { clinicId, patientId } = req.query;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Core multi-tenant segment tracking index is required.' });
    }

    let filterCondition = { clinicId };
    if (patientId) filterCondition.patientId = patientId;

    const records = await TreatmentRecord.find(filterCondition)
      .populate('patientId', 'name patientId phone')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: System exception compiling clinical histories.', error: error.message });
  }
};

// @desc    Fetch individual diagnostic history sheet block
// @route   GET /api/treatment-records/:id
// @access  Public
const getTreatmentRecordById = async (req, res) => {
  try {
    const record = await TreatmentRecord.findById(req.params.id)
      .populate('patientId', 'name patientId phone bloodGroup allergies')
      .populate('doctorId', 'name specialization');

    if (!record) {
      return res.status(404).json({ success: false, message: 'The specified clinical case tracking sheet does not exist.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: System read execution failure.', error: error.message });
  }
};

// @desc    Patch treatment chart specifications
// @route   PUT /api/treatment-records/:id
// @access  Public
const updateTreatmentRecord = async (req, res) => {
  try {
    const { clinicalNotes, diagnosis, procedures, prescriptions } = req.body;

    const record = await TreatmentRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Clinical tracking target entry could not be resolved.' });
    }

    record.clinicalNotes = clinicalNotes || record.clinicalNotes;
    record.diagnosis = diagnosis || record.diagnosis;
    if (procedures) record.procedures = procedures;
    if (prescriptions) record.prescriptions = prescriptions;

    const updatedRecord = await record.save();
    res.status(200).json({ success: true, data: updatedRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Encountered chart patch compilation conflict.', error: error.message });
  }
};

// @desc    Purge clinical entry record data block
// @route   DELETE /api/treatment-records/:id
// @access  Public
const deleteTreatmentRecord = async (req, res) => {
  try {
    const record = await TreatmentRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'File target path missing.' });
    }

    await record.deleteOne();
    res.status(200).json({ success: true, message: 'Encounter tracking file completely removed from partition array.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Processing database drop block exception.', error: error.message });
  }
};

module.exports = {
  createTreatmentRecord,
  getTreatmentRecords,
  getTreatmentRecordById,
  updateTreatmentRecord,
  deleteTreatmentRecord
};