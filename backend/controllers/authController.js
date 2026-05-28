const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        message: "All fields are required: name, email, password, role, phone",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address (e.g. name@example.com)",
      });
    }

    // Validate phone number (10-digit Indian mobile number)
    const cleanPhone = phone.replace(/[\s\-\+]/g, "");
    const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit Indian phone number (e.g. 9876543210)",
      });
    }

    // Validate role
    if (!["worker", "employer"].includes(role)) {
      return res.status(400).json({
        message: 'Role must be either "worker" or "employer"',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      location: location || { lat: 0, lng: 0 },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        experience: user.experience,
        pastCompany: user.pastCompany,
        skills: user.skills,
        bio: user.bio,
        avatarColor: user.avatarColor,
        rating: user.rating,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        experience: user.experience,
        pastCompany: user.pastCompany,
        skills: user.skills,
        bio: user.bio,
        avatarColor: user.avatarColor,
        rating: user.rating,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile (name, phone)
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, experience, pastCompany, skills, bio, avatarColor } = req.body;

    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (phone && phone.trim()) updates.phone = phone.trim();
    
    // Worker specific updates
    if (experience !== undefined) updates.experience = Number(experience);
    if (pastCompany !== undefined) updates.pastCompany = pastCompany.trim();
    if (skills && Array.isArray(skills)) updates.skills = skills;
    if (bio !== undefined) updates.bio = bio.trim();
    if (avatarColor) updates.avatarColor = avatarColor;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        experience: user.experience,
        pastCompany: user.pastCompany,
        skills: user.skills,
        bio: user.bio,
        avatarColor: user.avatarColor,
        rating: user.rating,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/auth/notifications/read
const markNotificationsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.notifications.forEach(n => n.read = true);
    await user.save();

    res.json({ message: "Notifications marked as read", notifications: user.notifications });
  } catch (error) {
    console.error("Mark notifications read error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getMe, updateProfile, markNotificationsRead };
