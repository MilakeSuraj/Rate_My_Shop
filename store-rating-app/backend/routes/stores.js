const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const { Op } = require("sequelize");

// GET all stores with average rating and image
router.get("/", async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    const stores = await Store.findAll({
      where,
      include: [
        { model: Rating, as: "ratings", attributes: ["rating", "userId"] },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });
    const result = stores.map((store) => {
      const ratings = store.ratings.map((r) => r.rating);
      const avgRating = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : null;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        averageRating: avgRating,
        ratingsCount: ratings.length,
        image: store.image || null, // <-- include image field
        ratings: store.ratings, // for detail page
      };
    });
    res.json({
      success: true,
      message: "Stores fetched successfully",
      count: result.length,
      stores: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new store
router.post("/", async (req, res) => {
  try {
    const { name, email, address, userId, image } = req.body; // <-- include image
    if (!name || !email || !address || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const store = await Store.create({ name, email, address, userId, image }); // <-- pass image
    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE a store (admin can delete any, owner can delete own)
router.delete("/:id", async (req, res) => {
  try {
    const storeId = req.params.id;
    // Optionally, get user info from token/session for real auth
    const { userId, role } = req.body; // expects { userId, role } in body

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    }
    if (
      role !== "Admin" &&
      !(role === "Store Owner" && store.userId === userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this store",
      });
    }
    await store.destroy();
    res.json({ success: true, message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
