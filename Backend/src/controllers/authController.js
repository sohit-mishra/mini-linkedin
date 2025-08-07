const User = require("@/models/User");
const generateToken = require("@/utils/generateToken");
const env = require("@/config/env");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  sendEmailOTP,
  sendAccountSuccessEmail,
  sendForgotPasswordEmail,
} = require("@/utils/email");
const blacklistedTokens = require("@/utils/tokenBlacklist");
const crypto = require("crypto");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existingUser.userVerified !== true) {
      return res.status(404).json({ error: "User not verified" });
    }

    const isPassword = await bcrypt.compare(password, existingUser.password);
    if (!isPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateToken(existingUser._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let userExisting = await User.findOne({ email });

    if (userExisting && userExisting.userVerified === true) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = Date.now() + 10 * 60 * 1000;

    if (userExisting && userExisting.userVerified === false) {
      userExisting.name = name;
      userExisting.password = await bcrypt.hash(password, 10);
      userExisting.otp = otp;
      userExisting.otpExpires = otpExpires;

      await userExisting.save();
      await sendEmailOTP(
        userExisting.email,
        userExisting.name,
        userExisting.otp
      );

      return res.status(200).json({
        message: "OTP re-sent. Please verify your email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userVerified: false,
      otp,
      otpExpires,
    });

    const a = await sendEmailOTP(newUser.email, newUser.name, newUser.otp);

    res.status(201).json({
      message:
        "User registered successfully. Please verify OTP sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    await sendAccountSuccessEmail(user.email, user.name);

    user.userVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Account successfully Create..." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetLink = `${env.FRONTEND_URL}/confirm-password/${hashedToken}`;

    await sendForgotPasswordEmail(email, resetLink);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const confirmPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    const user = await User.findOne({ resetToken });

    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Token is valid",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, avatar } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    blacklistedTokens.add(token);

    const expiration = decoded.exp * 1000 - Date.now();
    setTimeout(() => {
      blacklistedTokens.delete(token);
    }, expiration);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  createUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  confirmPassword,
  verifyToken,
  updateUser,
  getUserProfile 
};
