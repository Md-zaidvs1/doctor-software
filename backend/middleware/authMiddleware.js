const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_salt_string_2026');

      req.user = await Staff.findById(decoded.id)
        .select('-password')
        .populate('clinicId', '_id name isActive');  // ← populate clinicId fully

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found.' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
  }

  return res.status(401).json({ success: false, message: 'No token provided.' });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access Forbidden: Role ${req.user?.role || 'Guest'} is not authorized.`
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };