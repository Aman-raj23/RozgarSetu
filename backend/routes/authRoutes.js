const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, markNotificationsRead } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);
router.put("/notifications/read", auth, markNotificationsRead);

module.exports = router;
