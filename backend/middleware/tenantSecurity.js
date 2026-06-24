const mongoose = require('mongoose');

const enforceTenantIsolation = (req, res, next) => {
  // Developer bypasses all tenant filters
  if (req.user && req.user.role === 'Developer') {
    return next();
  }

  // Extract clinicId whether populated or raw ObjectId
  const clinicId = req.user?.clinicId?._id
    ? req.user.clinicId._id.toString()
    : req.user?.clinicId?.toString();

  if (!clinicId) {
    return res.status(403).json({
      success: false,
      message: 'Missing tenant filter context parameters.'
    });
  }

  if (req.method === 'GET') {
    req.query.clinicId = clinicId;
  } else if (req.method === 'POST' || req.method === 'PUT') {
    req.body.clinicId = clinicId;
  }

  next();
};

const verifyDocumentOwnership = (modelRef) => {
  return async (req, res, next) => {
    if (req.user && req.user.role === 'Developer') {
      return next();
    }

    try {
      const resourceId = req.params.id;
      if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
        return next();
      }

      const targetDocument = await modelRef.findById(resourceId);
      if (!targetDocument) {
        return res.status(404).json({ success: false, message: 'Resource not found.' });
      }

      const clinicId = req.user?.clinicId?._id
        ? req.user.clinicId._id.toString()
        : req.user?.clinicId?.toString();

      if (targetDocument.clinicId && targetDocument.clinicId.toString() !== clinicId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Cross-tenant access violation.'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ownership check failed.', error: error.message });
    }
  };
};

module.exports = { enforceTenantIsolation, verifyDocumentOwnership };