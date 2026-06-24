const Prescription = require("../models/Prescription");

exports.createPrescription = async (req, res, next) => {
  try {
    console.log("📥 Incoming Rx Payload Body:", req.body);

    const { patientId, medicines, labOrders } = req.body;
    
    if (!patientId) {
      return res.status(400).json({ status: "fail", message: "Patient ID is missing in request." });
    }

    const targetClinic = req.user?.clinicId || "clinic-alpha-77";

    const newRx = await Prescription.create({
      patientId,
      clinicId: targetClinic,
      medicines: medicines || [],
      labOrders: labOrders || []
    });

    console.log("🎉 Rx Saved inside Cluster:", newRx._id);
    return res.status(201).json({ status: "success", data: newRx });
  } catch (err) {
    console.error("💥 Prescription Controller Crash Exception:", err.message);
    return res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getPatientPrescriptions = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const history = await Prescription.find({ patientId }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (err) {
    console.error("💥 Prescription Fetch Crash Exception:", err.message);
    return res.status(500).json({ status: "error", message: err.message });
  }
};