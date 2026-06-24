const Billing = require('../models/Billing');

// @desc    Generate a new patient transactional invoice
// @route   POST /api/billing
// @access  Public
const createInvoice = async (req, res) => {
  try {
    const {
      clinicId,
      patientId,
      treatmentRecordId,
      items,
      taxAmount,
      discountAmount,
      amountPaid,
      paymentMode,
    } = req.body;

    if (!clinicId || !patientId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing structural criteria components for generating ledger invoices.' });
    }

    // Auto-compute invoice series index matching historical counts inside the tenant block
    const invoiceCount = await Billing.countDocuments({ clinicId });
    const numericSegment = String(invoiceCount + 1).padStart(4, '0');
    const computedInvoiceNo = `INV-${new Date().getFullYear()}-${numericSegment}`;

    // Process row validation array sums
    let computedSubTotal = 0;
    const validatedItems = items.map((item) => {
      const rowTotal = item.quantity * item.unitPrice;
      computedSubTotal += rowTotal;
      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: rowTotal,
      };
    });

    const tax = taxAmount || 0;
    const discount = discountAmount || 0;
    const computedGrandTotal = computedSubTotal + tax - discount;
    const paid = amountPaid || 0;
    const computedBalance = computedGrandTotal - paid;

    let computedStatus = 'Unpaid';
    if (paid > 0 && computedBalance === 0) {
      computedStatus = 'Paid';
    } else if (paid > 0 && computedBalance > 0) {
      computedStatus = 'Partially Paid';
    }

    const invoice = new Billing({
      clinicId,
      invoiceNumber: computedInvoiceNo,
      patientId,
      treatmentRecordId: treatmentRecordId || null,
      items: validatedItems,
      subTotal: computedSubTotal,
      taxAmount: tax,
      discountAmount: discount,
      grandTotal: computedGrandTotal,
      amountPaid: paid,
      balanceDue: computedBalance,
      paymentStatus: computedStatus,
      paymentMode: paid > 0 ? paymentMode : 'Pending',
    });

    const savedInvoice = await invoice.save();
    res.status(201).json({ success: true, data: savedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Transaction write pipeline fault.', error: error.message });
  }
};

// @desc    Retrieve multi-tenant invoices cache listing
// @route   GET /api/billing
// @access  Public
const getInvoices = async (req, res) => {
  try {
    const { clinicId, paymentStatus } = req.query;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Tenant segment isolation boundary criteria missing.' });
    }

    let filterCondition = { clinicId };
    if (paymentStatus) filterCondition.paymentStatus = paymentStatus;

    const invoices = await Billing.find(filterCondition)
      .populate('patientId', 'name patientId phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Query fetch operation ledger failure.', error: error.message });
  }
};

// @desc    Get individual billing ledger document record details
// @route   GET /api/billing/:id
// @access  Public
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Billing.findById(req.params.id)
      .populate('patientId', 'name patientId phone email address')
      .populate('clinicId', 'name email phone address gstNumber logo');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'The specified financial summary transaction profile cannot be found.' });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Read file compilation execution exception.', error: error.message });
  }
};

// @desc    Apply localized payment installments / modify collections status parameters
// @route   PUT /api/billing/:id
// @access  Public
const collectPayment = async (req, res) => {
  try {
    const { amountCollected, paymentMode } = req.body;

    if (!amountCollected || amountCollected <= 0) {
      return res.status(400).json({ success: false, message: 'Enter a valid payment accumulation installment factor.' });
    }

    const invoice = await Billing.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Billing tracking sheet ledger element missing.' });
    }

    const newAmountPaid = invoice.amountPaid + Number(amountCollected);
    const newBalanceDue = invoice.grandTotal - newAmountPaid;

    if (newBalanceDue < 0) {
      return res.status(400).json({ success: false, message: 'Overflow Error: Submission transaction exceeds absolute balance ledger values.' });
    }

    invoice.amountPaid = newAmountPaid;
    invoice.balanceDue = newBalanceDue;
    invoice.paymentStatus = newBalanceDue === 0 ? 'Paid' : 'Partially Paid';
    invoice.paymentMode = paymentMode || invoice.paymentMode;

    const updatedInvoice = await invoice.save();
    res.status(200).json({ success: true, data: updatedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Installment application failure handling updates.', error: error.message });
  }
};

// @desc    Purge financial statement record tracking profile block
// @route   DELETE /api/billing/:id
// @access  Public
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Billing.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Financial blueprint target tracking row missing.' });
    }

    await invoice.deleteOne();
    res.status(200).json({ success: true, message: 'Invoice log unlinked completely.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Dropping file record segment conflict.', error: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  collectPayment,
  deleteInvoice,
};