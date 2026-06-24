const express = require('express');
const router = express.Router();
const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} = require('../controllers/subscriptionPlanController');

router.route('/')
  .post(createPlan)
  .get(getPlans);

router.route('/:id')
  .get(getPlanById)
  .put(updatePlan)
  .delete(deletePlan);

module.exports = router;