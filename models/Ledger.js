const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  type: { type: String, enum: ["credit", "debit"], required: true }, // credit = income, debit = expense
  item: { type: String, required: true }, // Name of item being recorded
  amount: { type: Number, required: true }, // Transaction amount
  date: { type: Date, default: Date.now } // Timestamp of transaction
});

module.exports = mongoose.model("Ledger", ledgerSchema);
