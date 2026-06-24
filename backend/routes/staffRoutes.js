const express = require('express');
const router = express.Router();
const {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');

router.route('/')
  .post(createStaff)
  .get(getStaff);

router.route('/:id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;