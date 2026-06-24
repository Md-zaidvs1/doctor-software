const express = require('express');
const router = express.Router();
const { loginStaff, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginStaff);
router.get('/me', protect, getMe);

module.exports = router;