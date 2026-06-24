const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    clinicId: {
      type: String,
      required: true,
      default: "clinic-alpha-77",
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
      }
    ],
    labOrders: [
      {
        testOrItem: { type: String, required: true },
        labName: { type: String, default: "Apex Central Lab" },
        status: { type: String, enum: ["Ordered", "In Progress", "Received"], default: "Ordered" },
        notes: { type: String, default: "" }
      }
    ],
    dateGenerated: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", PrescriptionSchema);