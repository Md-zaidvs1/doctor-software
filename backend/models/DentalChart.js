const mongoose = require('mongoose');

const DentalChartSchema = new mongoose.Schema({
  patientId: {
    type: String, // 💡 Changed from ObjectId to String to easily support flexible test/real IDs seamlessly
    required: true
  },
  toothNumber: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['Healthy', 'Cavity', 'Missing', 'Filled', 'Root Canal', 'Crown Needed'],
    default: 'Healthy'
  },
  notes: {
    type: String,
    default: ''
  },
  dateUpdated: {
    type: String,
    default: () => new Date().toLocaleDateString('en-IN')
  }
}, { timestamps: true });

module.exports = mongoose.model('DentalChart', DentalChartSchema);