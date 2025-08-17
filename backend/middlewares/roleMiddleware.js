const roleMiddleware = (allowedRoles) => {
  // if user passes single string → wrap in array
  if (typeof allowedRoles === "string") {
    allowedRoles = [allowedRoles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access Denied: Insufficient role" });
    }

    next();
  };
};

module.exports = roleMiddleware;
