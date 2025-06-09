const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const User = require('../models/User');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name, email: user.email, school: user.school }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Route to update user's school
router.post("/", auth, async (req, res) => {
  const { school } = req.body;
  if (!school) {
    return res.status(400).json({ message: "School is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.school = school;
    await user.save();

    // Generate a new token with the updated school information
    const token = generateToken(user);
    res.json({ message: "School updated successfully", token });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 