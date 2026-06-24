const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Dental",
        "Orthopedic",
        "ENT",
        "Eye",
        "Physiotherapy",
        "General Clinic",
      ],
      default: "Dental",
    },

    ownerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gstNumber: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    subscription: {
      plan: {
        type: String,
        enum: ["Trial", "Basic", "Standard", "Premium"],
        default: "Trial",
      },

      status: {
        type: String,
        enum: ["Active", "Suspended", "Expired"],
        default: "Active",
      },

      expiresAt: {
        type: Date,
        default: () =>
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    },

    enabledModules: {
      type: [String],
      default: [
        "Patients",
        "Appointments",
        "Billing",
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clinic", clinicSchema);