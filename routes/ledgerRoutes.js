const express = require("express");
const router = express.Router();
const Ledger = require("../models/Ledger");

// Get All Ledger Transactions
router.get("/", async (req, res) => {
  try {
    const ledger = await Ledger.find().sort({ date: -1 }); // Sort by newest first
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ledger transactions" });
  }
});

module.exports = router;
