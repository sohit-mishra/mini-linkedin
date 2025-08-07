const jwt = require("jsonwebtoken");
const env = require('@/config/env');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
