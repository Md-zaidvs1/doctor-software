const Appointment = require('../models/Appointment');

// @desc    Book a new clinical consultation slot
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
  try {
    const { clinicId, patientId, doctorId, appointmentDate, startTime, reasonForVisit, notes } = req.body;

    if (!clinicId || !patientId || !doctorId || !appointmentDate || !startTime) {
      return res.status(400).json({ success: false, message: 'Missing structural parameters for scheduling allocation.' });
    }

    // Verify schedule availability matrices to block duplicate reservations
    const overlapCheck = await Appointment.findOne({
      clinicId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      status: 'Scheduled'
    });

    if (overlapCheck) {
      return res.status(400).json({ success: false, message: 'The selected timing matrix conflicts with an active reservation for this clinician.' });
    }

    const appointment = new Appointment({
      clinicId,
      patientId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      reasonForVisit,
      notes: notes || '',
    });

    const savedAppointment = await appointment.save();
    res.status(201).json({ success: true, data: savedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed allocation routing transaction.', error: error.message });
  }
};

// @desc    Retrieve scheduled rosters (Filtered by tenant space context)
// @route   GET /api/appointments
// @access  Public
const getAppointments = async (req, res) => {
  try {
    const { clinicId, doctorId, date } = req.query;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Missing core tenant validation filters.' });
    }

    let filterCondition = { clinicId };

    if (doctorId) filterCondition.doctorId = doctorId;
    if (date) filterCondition.appointmentDate = new Date(date);

    const appointments = await Appointment.find(filterCondition)
      .populate('patientId', 'name patientId phone')
      .populate('doctorId', 'name specialization')
      .sort({ appointmentDate: 1, startTime: 1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed schema tracking compilation.', error: error.message });
  }
};

// @desc    Fetch individual slot parameters by ID
// @route   GET /api/appointments/:id
// @access  Public
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name patientId phone')
      .populate('doctorId', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'The target scheduling block cannot be resolved.' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Tracking retrieval matrix failure.', error: error.message });
  }
};

// @desc    Modify reservation allocations or transition state status codes
// @route   PUT /api/appointments/:id
// @access  Public
const updateAppointment = async (req, res) => {
  try {
    const { appointmentDate, startTime, reasonForVisit, status, notes, doctorId } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Target reservation vector not found.' });
    }

    // Check for overlaps if shifting scheduling parameters
    const targetDoc = doctorId || appointment.doctorId;
    const targetDate = appointmentDate ? new Date(appointmentDate) : appointment.appointmentDate;
    const targetTime = startTime || appointment.startTime;

    if (appointmentDate || startTime || doctorId) {
      const overlapCheck = await Appointment.findOne({
        _id: { $ne: appointment._id },
        clinicId: appointment.clinicId,
        doctorId: targetDoc,
        appointmentDate: targetDate,
        startTime: targetTime,
        status: 'Scheduled'
      });

      if (overlapCheck) {
        return res.status(400).json({ success: false, message: 'Rescheduling conflict: target slot has been assigned elsewhere.' });
      }
    }

    appointment.appointmentDate = appointmentDate ? new Date(appointmentDate) : appointment.appointmentDate;
    appointment.startTime = startTime || appointment.startTime;
    appointment.reasonForVisit = reasonForVisit || appointment.reasonForVisit;
    appointment.status = status || appointment.status;
    appointment.notes = notes !== undefined ? notes : appointment.notes;
    appointment.doctorId = targetDoc;

    const updatedAppointment = await appointment.save();
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Processing transformation fault.', error: error.message });
  }
};

// @desc    Purge reservation slot allocation index
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Allocation reference target missing.' });
    }

    await appointment.deleteOne();
    res.status(200).json({ success: true, message: 'Slot structural configuration removed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Dropping index execution exception.', error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};