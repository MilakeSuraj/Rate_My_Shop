const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Register (only for Normal User, directly creates account)
// Also allow Admin to create Store Owner/Admin directly with status: "approved"
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, role, fromAdmin } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    // If request is from admin dashboard, allow any role and approve directly
    if (fromAdmin === true || fromAdmin === "true") {
      const existing = await User.findOne({ where: { email } });
      if (existing)
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hash,
        address,
        role,
        status: "approved",
      });
      return res.status(201).json({
        success: true,
        message: "User added successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }
    // Normal user self-registration
    if (role !== "Normal User") {
      return res.status(400).json({
        success: false,
        message:
          "Only Normal User can self-register. Admin/Store Owner must be approved by admin.",
      });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      address,
      role,
      status: "approved",
    });
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    if (user.status !== "approved")
      return res
        .status(403)
        .json({ success: false, message: "Account not approved yet" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Register request (for Admin/Store Owner, only creates pending request, not account)
router.post("/register-request", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    if (role === "Normal User") {
      return res.status(400).json({
        success: false,
        message: "Normal User should register directly.",
      });
    }
    // Only create a pending user if not already present (pending or approved)
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      // If the user is pending, do not allow duplicate requests
      if (existing.status === "pending") {
        return res.status(409).json({
          success: false,
          message: "A request for this email is already pending approval.",
        });
      }
      // If the user is approved, do not allow duplicate accounts
      if (existing.status === "approved") {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }
      // If the user is rejected, allow to re-request (delete old rejected record first)
      if (existing.status === "rejected") {
        await existing.destroy();
      }
    }
    // Save as pending request only, not as an approved account
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hash,
      address,
      role,
      status: "pending",
    });
    res.status(201).json({
      success: true,
      message: "Registration request submitted. Awaiting admin approval.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all pending requests (admin only)
router.get("/pending-requests", async (req, res) => {
  try {
    const requests = await User.findAll({
      where: { status: "pending" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Approve request (admin only, sets status to approved)
router.post("/approve-request/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.status !== "pending")
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    user.status = "approved";
    await user.save();
    res.json({ success: true, message: "User approved" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reject request (admin only, deletes the pending user)
router.post("/reject-request/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.status !== "pending")
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    // Delete the user from the database so they cannot login
    await user.destroy();
    res.json({ success: true, message: "User rejected and request deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
