const express = require('express');
const router = express.Router();
const {
  loginUser,
  createUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  confirmPassword,
  verifyToken,
  updateUser,getUserProfile 
} = require('@/controllers/authController');
const authMiddleware = require("@/middleware/authMiddleware");

router.post('/login', loginUser);
router.post('/register', createUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/confirm-password', confirmPassword);
router.get('/verify-token', authMiddleware, verifyToken);
router.get('/me', authMiddleware, getUserProfile );
router.put('/update', authMiddleware, updateUser);

module.exports = router;
