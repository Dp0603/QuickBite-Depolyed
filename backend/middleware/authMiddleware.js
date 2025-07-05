// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header contains Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await UserModel.findById(decoded.id).select("-password");

      next(); // move to the route
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
