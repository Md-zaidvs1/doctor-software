const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true, // Tied directly to the multi-clinic tenancy model
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true, // Will be encrypted using bcryptjs during registration/auth phase
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Admin', 'Doctor', 'Receptionist'],
    },
    specialization: {
      type: String, // relevant primarily for Doctor role (e.g., Orthodontist, Pediatrician)
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
