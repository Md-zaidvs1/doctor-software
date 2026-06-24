// Verification framework for multi-tenant and multi-role operations routing
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Checks if the security context has attached user metrics
    // In production, this data is extracted from the JWT authentication decode stack
    const userRole = req.headers['x-user-role']; 
    const tenantId = req.headers['x-clinic-tenant-id'];

    if (!userRole) {
      return res.status(401).json({ status: "error", message: "🔒 Authentication Intercept: Missing Security Context Role Header!" });
    }

    // 2. LEVEL 1 BYPASS: If target is Global Super Admin, bypass tenant-checks and evaluate rights
    if (userRole === 'SUPER_ADMIN') {
      if (allowedRoles.includes('SUPER_ADMIN')) {
        return next();
      } else {
        return res.status(403).json({ message: "🚫 Access Blocked: Super Admins cannot execute local branch staff ops." });
      }
    }

    // 3. LEVEL 2 & 3 CROSS VERIFICATION: Validate tenant scope boundary alignment
    if (!tenantId) {
      return res.status(400).json({ message: "❌ Tenant Space Context Isolation Verification Failed." });
    }

    // Check if the current user profile role has privilege alignment to clear the route gate
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        status: "access_denied", 
        message: `🚫 Security Violation: Your Role Context [${userRole}] does not hold privilege to clear this execution axis.` 
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };