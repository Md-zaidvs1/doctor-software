const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

// TEMPORARY: Authentication Disabled

router.route('/')
  .post(createPatient)
  .get(getPatients);

router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

module.exports = router;