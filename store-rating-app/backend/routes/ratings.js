const express = require("express");
const router = express.Router();
const { Rating } = require("../models");

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

// GET all ratings (optional, for admin)
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.findAll();
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

module.exports = router;
