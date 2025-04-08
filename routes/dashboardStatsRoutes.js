const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");
const Ledger = require("../models/Ledger");
const Reservation = require("../models/Reservation");

// Fetch aggregated dashboard statistics
router.get("/", async (req, res) => {
  try {
    // Fetch Total Orders (Count from Sales)
    const totalOrders = await Sales.countDocuments();

    // Fetch Total Revenue (Sum from Sales)
    const totalRevenue = await Sales.aggregate([{ $group: { _id: null, revenue: { $sum: "$totalAmount" } } }]);
    
    // Fetch Active Customers (Example: Unique Customers from Sales)
    const activeCustomers = await Sales.distinct("customerId").then(customers => customers.length);

    // Fetch Today's Reservations Count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservations = await Reservation.countDocuments({ reservationDate: { $gte: today } });

    res.json({
      totalOrders,
      revenue: totalRevenue.length > 0 ? totalRevenue[0].revenue : 0,
      customers: activeCustomers,
      reservations
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = router;
