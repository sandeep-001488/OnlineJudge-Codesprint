export const requireRole = (...roles) => {
  return (req, res, next) => {
   
    const userRoles = Array.isArray(req.user?.role)
      ? req.user.role
      : [req.user?.role];


    const hasPermission = roles.some((r) => userRoles.includes(r));
    console.log("Has permission:", hasPermission);

    if (!hasPermission) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
};
