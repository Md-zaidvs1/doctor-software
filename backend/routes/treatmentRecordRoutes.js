const express = require('express');
const router = express.Router();
const TreatmentRecord = require('../models/TreatmentRecord');
const { protect } = require('../middleware/authMiddleware');
const { enforceTenantIsolation, verifyDocumentOwnership } = require('../middleware/tenantSecurity');
const {
  createTreatmentRecord,
  getTreatmentRecords,
  getTreatmentRecordById,
  updateTreatmentRecord,
  deleteTreatmentRecord
} = require('../controllers/treatmentRecordController');

router.route('/')
  .post(protect, enforceTenantIsolation, createTreatmentRecord)
  .get(protect, enforceTenantIsolation, getTreatmentRecords);

router.route('/:id')
  .get(protect, verifyDocumentOwnership(TreatmentRecord), getTreatmentRecordById)
  .put(protect, verifyDocumentOwnership(TreatmentRecord), enforceTenantIsolation, updateTreatmentRecord)
  .delete(protect, verifyDocumentOwnership(TreatmentRecord), deleteTreatmentRecord);

module.exports = router;