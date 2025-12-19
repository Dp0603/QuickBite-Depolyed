const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// 🔐 Protect middleware: verifies JWT and attaches user to req
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user by ID from token payload, excluding password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 🚫 BLOCKED USER CHECK (THIS IS THE IMPORTANT PART)
    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};

module.exports = { protect, authorize };
