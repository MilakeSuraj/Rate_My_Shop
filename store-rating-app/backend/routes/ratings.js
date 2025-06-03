const express = require("express");
const router = express.Router();
const { Rating, User, Store } = require("../models");

// POST submit a rating
router.post("/", async (req, res) => {
  try {
    const { rating, userId, storeId } = req.body;
    if (!rating || !userId || !storeId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    // Check if user already rated this store
    const existing = await Rating.findOne({ where: { userId, storeId } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({
        success: true,
        message: "Rating updated successfully",
        rating: existing,
      });
    }
    const newRating = await Rating.create({ rating, userId, storeId });
    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      rating: newRating,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET all ratings with user and store info
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "email", "address"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({
      success: true,
      message: "Ratings fetched successfully",
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all ratings by userId (with user and store info)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "email", "address", "userId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({
      success: true,
      message: "User ratings fetched successfully",
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET ratings grouped by store (each store with its ratings and user info)
router.get("/by-store", async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: ["id", "name", "email", "address"],
      include: [
        {
          model: Rating,
          as: "ratings",
          attributes: ["id", "rating", "userId", "createdAt", "updatedAt"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      message: "Ratings grouped by store",
      count: stores.length,
      stores,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
