const express = require("express");
const router = express.Router();
const { sendOtp, register, login, getMe, updateProfile, markNotificationsRead } = require("../controllers/authController");
const auth = require("../middleware/auth");

// OTP & Registration
router.post("/send-otp", sendOtp);
router.post("/register", register);

// Login
router.post("/login", login);

// Protected routes
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);
router.put("/notifications/read", auth, markNotificationsRead);

module.exports = router;
