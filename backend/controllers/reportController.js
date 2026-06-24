const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');

// @desc    Compile system-wide operational analytics
// @route   GET /api/reports/analytics
// @access  Public (Will be protected by role governance in Phase 9)
const getClinicAnalytics = async (req, res) => {
  try {
    const { clinicId } = req.query;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Tenant partition boundary parameter context is required.' });
    }

    // 1. Structural aggregate counts matrix parsing
    const totalPatients = await Patient.countDocuments({ clinicId });
    const totalAppointments = await Appointment.countDocuments({ clinicId });

    // 2. Financial calculation summary aggregation arrays
    const financialRoster = await Billing.find({ clinicId });
    let totalRevenueGenerated = 0;
    let totalOutstandingDues = 0;

    financialRoster.forEach((invoice) => {
      totalRevenueGenerated += invoice.amountPaid;
      totalOutstandingDues += invoice.balanceDue;
    });

    // 3. Appointment Distribution categorization pipeline metrics
    const scheduledCount = await Appointment.countDocuments({ clinicId, status: 'Scheduled' });
    const completedCount = await Appointment.countDocuments({ clinicId, status: 'Completed' });
    const cancelledCount = await Appointment.countDocuments({ clinicId, status: 'Cancelled' });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalPatients,
          totalAppointments,
          totalRevenueGenerated,
          totalOutstandingDues,
        },
        appointmentsBreakdown: {
          scheduled: scheduledCount,
          completed: completedCount,
          cancelled: cancelledCount,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Analytical engine compiler extraction failure.', error: error.message });
  }
};

module.exports = {
  getClinicAnalytics,
};