var express = require("express");
var router = express.Router();
const { User, Store, Rating } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// GET /users - list users with optional filters (admin)
router.get("/", async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };

    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;
    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      order: [["name", "ASC"]],
    });
    res.json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /users/:id - get user details (admin)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Store,
          as: "stores",
          attributes: ["id", "name", "email", "address"],
          include: [
            {
              model: Rating,
              as: "ratings",
              attributes: ["rating"],
            },
          ],
        },
      ],
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // If user is store owner, add average rating for their stores
    let ownerRatings = null;
    if (user.role === "Store Owner" && user.stores && user.stores.length > 0) {
      ownerRatings = user.stores.map((store) => {
        const ratings = store.ratings.map((r) => r.rating);
        const avg =
          ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
            : null;
        return { storeId: store.id, storeName: store.name, averageRating: avg };
      });
    }
    res.json({
      success: true,
      message: "User details fetched successfully",
      user: user.toJSON(),
      ownerRatings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /users/password - update password (user id from body)
router.patch("/password", async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID required" });
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password required" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.findByPk(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    user.password = hash;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /users/:id - delete user (admin only)
router.delete("/:id", async (req, res) => {
  try {
    // Optionally, check admin role from token/session
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    await user.destroy();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
