const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');
const { enforceTenantIsolation, verifyDocumentOwnership } = require('../middleware/tenantSecurity');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.route('/')
  .post(protect, enforceTenantIsolation, createAppointment)
  .get(protect, enforceTenantIsolation, getAppointments);

router.route('/:id')
  .get(protect, verifyDocumentOwnership(Appointment), getAppointmentById)
  .put(protect, verifyDocumentOwnership(Appointment), enforceTenantIsolation, updateAppointment)
  .delete(protect, verifyDocumentOwnership(Appointment), deleteAppointment);

module.exports = router;