const express = require('express');
const router = express.Router();
const {
  createClinic,
  getClinics,
  getClinicById,
  updateClinic,
  deleteClinic
} = require('../controllers/clinicController');

// Main collection routes
router.route('/')
  .post(createClinic)
  .get(getClinics);

// Individual resource routes
router.route('/:id')
  .get(getClinicById)
  .put(updateClinic)
  .delete(deleteClinic);

module.exports = router;