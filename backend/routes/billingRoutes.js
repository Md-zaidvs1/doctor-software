const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const { protect } = require('../middleware/authMiddleware');
const { enforceTenantIsolation, verifyDocumentOwnership } = require('../middleware/tenantSecurity');
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  collectPayment,
  deleteInvoice,
} = require('../controllers/billingController');

router.route('/')
  .post(protect, enforceTenantIsolation, createInvoice)
  .get(protect, enforceTenantIsolation, getInvoices);

router.route('/:id')
  .get(protect, verifyDocumentOwnership(Billing), getInvoiceById)
  .put(protect, verifyDocumentOwnership(Billing), enforceTenantIsolation, collectPayment)
  .delete(protect, verifyDocumentOwnership(Billing), deleteInvoice);

module.exports = router;