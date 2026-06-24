const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['Trial', 'Basic', 'Standard', 'Premium'],
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ['Monthly', 'Yearly'],
      default: 'Monthly',
    },
    limits: {
      staffLimit: {
        type: Number,
        required: true, // e.g., 3 for Basic, -1 for unlimited
      },
      patientLimit: {
        type: Number,
        required: true, // e.g., 100 for Basic, -1 for unlimited
      },
      storageLimitGb: {
        type: Number,
        required: true, // e.g., 5GB, 20GB, 100GB
      },
    },
    features: [
      {
        type: String, // e.g., 'Billing', 'Appointments', 'Advanced Reports'
      }
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);