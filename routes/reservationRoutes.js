const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const { auth, isAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST / — User makes a reservation
router.post('/', auth, async (req, res) => {
  try {
    const { restaurantId, date, time, numberOfGuests, specialRequests, name } = req.body;
    const email = req.user.email;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).send({ error: 'Restaurant not found' });
  
    const reservation = new Reservation({
      restaurantId,
      restaurantName: restaurant.name,
      date,
      time,
      numberOfGuests,
      specialRequests,
      userId: req.user._id,
      name,
      email,
      status: 'pending',
    });

    await reservation.save();
    console.log(" Reservation saved in DB:", reservation); 


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reservation Confirmation - ForkiFy',
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #ff6f00;">🍽️ ForkiFy Reservation Confirmed!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your table at has been successfully booked.</p>
        <div style="margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #ff6f00;">
          <p><strong>🍴 Restaurant Name:</strong>${restaurant.name}</p>
          <p><strong>📅 Date:</strong> ${new Date(date).toDateString()}</p>
          <p><strong>⏰ Time:</strong> ${time}</p>
          <p><strong>👥 Guests:</strong> ${numberOfGuests}</p>
        </div>
        <p>Feel free to dress casual and bring your appetite!</p>
        <p>See you soon,<br/>The ForkiFy Team 🍴</p>
      </div>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).send({ message: 'Reservation created and email sent.', reservation });
  } catch (error) {
    res.status(400).send({ error: 'Failed to create reservation', details: error.message });
  }
});

// Manager/Admin GET all reservations for restaurant
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Access denied' });
    }

    const reservations = await Reservation.find({
      restaurantId: new mongoose.Types.ObjectId(req.params.restaurantId),
    })
      .populate('userId', 'name email')
      .sort({ date: 1, time: 1 });

    res.send(reservations);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch reservations', details: error.message });
  }
});

// Manager/Admin manually add reservation (no email)
router.post('/manual', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only manager/admin can add reservations manually.' });
    }

    const { restaurantId, date, time, numberOfGuests, name, email } = req.body;
    if (!restaurantId || !date || !time || !numberOfGuests || !name || !email) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).send({ error: 'Restaurant not found' });

    const reservation = new Reservation({
      restaurantId,
      restaurantName: restaurant.name,
      date,
      time,
      numberOfGuests,
      name,
      email,
      status: 'pending',
    });

    await reservation.save();
    res.status(201).send(reservation);
  } catch (err) {
    res.status(500).send({ error: "Manual reservation failed", details: err.message });
  }
});

// User gets their reservations
router.get('/user', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id })
      .populate('restaurantId', 'name')
      .sort({ date: -1 });
    res.send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update reservation status (admin only)
router.patch('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).send();

    reservation.status = req.body.status;
    if (req.body.tableNumber) reservation.tableNumber = req.body.tableNumber;

    await reservation.save();
    res.send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Cancel reservation (user only)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reservation) return res.status(404).send();
    if (reservation.status === 'cancelled')
      return res.status(400).send({ error: 'Reservation already cancelled' });

    reservation.status = 'cancelled';
    await reservation.save();
    res.send(reservation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get available time slots
router.get('/available-slots/:restaurantId', auth, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).send({ error: 'Date is required' });

    const existing = await Reservation.find({
      restaurantId: req.params.restaurantId,
      date: new Date(date),
      status: { $ne: 'cancelled' },
    });

    const timeSlots = [
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00',
    ];

    const available = timeSlots.filter(slot => {
      const count = existing.filter(r => r.time === slot).length;
      return count < 10;
    });

    res.send(available);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Edit reservation
router.put('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).send({ error: "Reservation not found" });

    const allowed = ['name', 'email', 'time', 'date', 'numberOfGuests'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        reservation[field] = req.body[field];
      }
    });

    await reservation.save();
    res.send(reservation);
  } catch (err) {
    res.status(400).send({ error: "Failed to update reservation", details: err.message });
  }
});

// Delete reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ error: "Reservation not found" });
    res.send({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).send({ error: "Failed to delete reservation", details: err.message });
  }
});

module.exports = router;
