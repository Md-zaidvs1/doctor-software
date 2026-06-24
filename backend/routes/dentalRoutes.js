const express = require("express");
const router = express.Router();

// Import your controller functions
const dentalController = require("../controllers/dentalController");

// Import your authentication middleware functions
const { protect, restrictTo } = require("../middleware/authMiddleware");

// POST Route: Create a new dental record
// 🔒 Note: Using .addDentalRecord to match your controller name!
router.post(
  "/records", 
  protect, 
  restrictTo("Doctor"), 
  dentalController.addDentalRecord
);

// GET Route: Fetch records for a patient
router.get(
  "/records/patient/:patientId", 
  protect, 
  restrictTo("ClinicAdmin", "Doctor", "Receptionist"), 
  dentalController.getPatientDentalRecords
);

module.exports = router;