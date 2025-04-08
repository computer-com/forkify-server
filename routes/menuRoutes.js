const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// GET: Menu items by restaurantId (passed via query param)
router.get("/", async (req, res) => {
  const restaurantId = req.query.restaurantId;

  try {
    if (!restaurantId) {
      return res.status(400).json({ message: "restaurantId is required" });
    }

    const menu = await MenuItem.find({ restaurantId });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add menu item for a restaurant
router.post("/", async (req, res) => {
  const { name, price, category, description, restaurantId } = req.body;

  if (!restaurantId) {
    return res.status(400).json({ message: "restaurantId is required" });
  }

  const newItem = new MenuItem({ name, price, category, description, restaurantId });

  try {
    const savedItem = await newItem.save();
    console.log("Saved menu item:", savedItem);
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update item
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove item
router.delete("/:id", async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
