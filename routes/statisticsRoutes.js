const express = require("express");
const router = express.Router();
const Ledger = require("../models/Ledger");

// Add a Credit (Income) Transaction
router.post("/ledger/credit", async (req, res) => {
  try {
    const { item, amount } = req.body;
    const newCredit = new Ledger({ type: "credit", item, amount });
    await newCredit.save();
    res.status(201).json(newCredit);
  } catch (error) {
    res.status(500).json({ error: "Failed to add credit transaction" });
  }
});

// Add a Debit (Expense) Transaction 
router.post("/ledger/debit", async (req, res) => {
  try {
    const { item, amount } = req.body;
    const newDebit = new Ledger({ type: "debit", item, amount });
    await newDebit.save();
    res.status(201).json(newDebit);
  } catch (error) {
    res.status(500).json({ error: "Failed to add debit transaction" });
  }
});

module.exports = router;
