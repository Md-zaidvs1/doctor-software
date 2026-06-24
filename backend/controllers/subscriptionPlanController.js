const SubscriptionPlan = require('../models/SubscriptionPlan');

// @desc    Create or initialize a subscription plan
// @route   POST /api/subscription-plans
// @access  Public (Super Admin protected in Phase 9)
const createPlan = async (req, res) => {
  try {
    const { name, price, billingCycle, limits, features, isActive } = req.body;

    const planExists = await SubscriptionPlan.findOne({ name });
    if (planExists) {
      return res.status(400).json({ success: false, message: `Plan tier ${name} already exists.` });
    }

    const plan = new SubscriptionPlan({
      name,
      price,
      billingCycle,
      limits,
      features,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedPlan = await plan.save();
    res.status(201).json({ success: true, data: savedPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to create plan', error: error.message });
  }
};

// @desc    Get all available subscription plans
// @route   GET /api/subscription-plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({});
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to fetch plans', error: error.message });
  }
};

// @desc    Get subscription plan by ID
// @route   GET /api/subscription-plans/:id
// @access  Public
const getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan tier not found' });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to fetch plan detail', error: error.message });
  }
};

// @desc    Update a subscription plan metrics
// @route   PUT /api/subscription-plans/:id
// @access  Public
const updatePlan = async (req, res) => {
  try {
    const { price, billingCycle, limits, features, isActive } = req.body;

    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan configuration tier not found' });
    }

    plan.price = price !== undefined ? price : plan.price;
    plan.billingCycle = billingCycle || plan.billingCycle;
    plan.limits = limits || plan.limits;
    plan.features = features || plan.features;
    if (isActive !== undefined) plan.isActive = isActive;

    const updatedPlan = await plan.save();
    res.status(200).json({ success: true, data: updatedPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed to patch plan', error: error.message });
  }
};

// @desc    Delete a configuration blueprint
// @route   DELETE /api/subscription-plans/:id
// @access  Public
const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan structure target not found' });
    }

    await plan.deleteOne();
    res.status(200).json({ success: true, message: 'Subscription architecture tier isolated and deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Failed deletion execution blueprint', error: error.message });
  }
};

module.exports = {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};