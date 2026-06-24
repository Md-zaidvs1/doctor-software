const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    tenantClinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: function () {
        return this.role !== "SUPER_ADMIN";
      },
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "CLINIC_ADMIN",
        "DOCTOR",
        "RECEPTIONIST",
        "ACCOUNTANT",
        "ASSISTANT",
      ],
      default: "DOCTOR",
    },

    status: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },

    phone: {
      type: String,
      default: "",
    },

    specialization: {
      type: String,
      default: "",
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

module.exports = mongoose.model("User", UserSchema);