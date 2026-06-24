const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true, // Guarantees isolation across tenant lines
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true, // Tied to Staff validation model where role === 'Doctor'
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // Format: "HH:MM" e.g., "10:30"
    },
    reasonForVisit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent overlapping reservations for the same doctor at the exact same hour block within a clinic partition
appointmentSchema.index({ clinicId: 1, doctorId: 1, appointmentDate: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);