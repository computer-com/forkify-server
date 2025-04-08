const express = require("express");
const router = express.Router();
const ReservationAdmin = require("../models/reservationAdmin");

// Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await ReservationAdmin.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a reservation
router.post("/", async (req, res) => {
  try {
    const newReservation = new ReservationAdmin(req.body);
    const savedReservation = await newReservation.save();
    res.json(savedReservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a reservation
router.put("/:id", async (req, res) => {
  try {
    const updatedReservation = await ReservationAdmin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a reservation
router.delete("/:id", async (req, res) => {
  try {
    await ReservationAdmin.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
