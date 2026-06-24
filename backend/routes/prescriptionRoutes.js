const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");

// 💡 Match path strings strictly as absolute relative roots
router.post("/", prescriptionController.createPrescription);
router.get("/patient/:patientId", prescriptionController.getPatientPrescriptions);

module.exports = router;