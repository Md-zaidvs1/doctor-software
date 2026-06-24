const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true, // Guarantees isolation within multi-tenant database clusters
    },
    patientId: {
      type: String,
      required: true, // Unique custom string index per clinic, e.g., "PAT-2026-001"
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    dob: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' },
    },
    medicalHistory: [
      {
        condition: { type: String }, // e.g., "Hypertension", "Diabetes"
        diagnosedAt: { type: Date },
        notes: { type: String },
      }
    ],
    allergies: [
      {
        type: String, // e.g., "Penicillin", "Peanuts"
      }
    ],
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    address: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Formulate indexation matrix constraints to ensure patientId is unique per clinic
patientSchema.index({ clinicId: 1, patientId: 1 }, { unique: true });

module.exports = mongoose.model('Patient', patientSchema);