const User = require("@/models/User");
const jwt = require("jsonwebtoken");
const env = require("@/config/env");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
       
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = authMiddleware;
