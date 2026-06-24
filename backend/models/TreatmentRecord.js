const mongoose = require('mongoose');

const treatmentRecordSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    teethMatrix: [
      {
        toothNumber: { type: Number, required: true },
        condition: { type: String, required: true }, // e.g., "Caries", "Missing", "Filled"
        treatmentPlan: { type: String, default: '' },
      }
    ],
    procedures: [
      {
        name: { type: String, required: true }, // e.g., "Root Canal", "Scaling"
        cost: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ['Planned', 'In-Progress', 'Completed'], default: 'Completed' },
      }
    ],
    prescriptions: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g., "500mg"
        frequency: { type: String, required: true }, // e.g., "1-0-1"
        duration: { type: String, required: true }, // e.g., "5 Days"
      }
    ],
    xrayUrl: {
      type: String,
      default: '', // Stores the relative or absolute file path to the uploaded X-ray image
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TreatmentRecord', treatmentRecordSchema);