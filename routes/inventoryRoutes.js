const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const mongoose = require("mongoose"); 

// Add a New Inventory Item (POST)
router.post("/", async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Inventory Items (GET)
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ensure ObjectId conversion for PUT request
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid MongoDB ObjectId" });
    }

    const updatedItem = await Inventory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found in database" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an Inventory Item (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
