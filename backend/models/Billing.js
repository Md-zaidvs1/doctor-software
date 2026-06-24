const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true, // Structural isolation multi-tenant tracking
    },
    invoiceNumber: {
      type: String,
      required: true, // Unique invoice tracking number per clinic, e.g., "INV-2026-0001"
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    treatmentRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TreatmentRecord', // Contextually linked back to diagnostic procedure logs
      default: null,
    },
    items: [
      {
        description: { type: String, required: true }, // e.g., "Consultation Fee", "Dental Crown"
        quantity: { type: Number, default: 1, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
      }
    ],
    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceDue: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid'],
      default: 'Unpaid',
    },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Mixed', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Guarantee unique invoice tags only within specific clinical domains
billingSchema.index({ clinicId: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Billing', billingSchema);