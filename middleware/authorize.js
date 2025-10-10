// middleware/authorize.js
// Takes an array of roles that are allowed
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // req.user is populated by the authenticate middleware
    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
      next(); // Role is authorized
    } else {
      // 403 Forbidden
      res.status(403).json({ message: 'Forbidden: Insufficient role permissions.' });
    }
  };
};

export default authorize;