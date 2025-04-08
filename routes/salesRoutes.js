const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");

// Get All Sales Data (Fix)
router.get("/", async (req, res) => {
  try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
});

module.exports = router;
