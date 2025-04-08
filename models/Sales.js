const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantitySold: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sales", salesSchema);
