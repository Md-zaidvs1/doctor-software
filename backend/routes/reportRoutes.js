const express = require('express');
const router = express.Router();
const { getClinicAnalytics } = require('../controllers/reportController');

router.get('/analytics', getClinicAnalytics);

module.exports = router;