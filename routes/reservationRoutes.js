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
router.post('/', async (req, res) => {
  try {
    const { restaurantId, date, time, numberOfGuests, specialRequests, name, email } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).send({ error: 'Restaurant not found' });
  
    const reservation = new Reservation({
      restaurantId,
      restaurantName: restaurant.name,
      date,
      time,
      numberOfGuests,
      specialRequests,
      name,
      email,
      status: 'pending',
    });

    await reservation.save();
    console.log("Reservation saved in DB:", reservation); 

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reservation Confirmation - ForkiFy',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #ff6f00;">🍽️ ForkiFy Reservation Confirmed!</h2>
          <p>Dear ${name},</p>
          <p>Your reservation has been confirmed at ${restaurant.name}.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #ff6f00;">Reservation Details:</h3>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Number of Guests:</strong> ${numberOfGuests}</p>
            ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
          </div>
          <p>Thank you for choosing ForkiFy!</p>
          <p>Best regards,<br>The ForkiFy Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to:", email);

    res.status(201).send(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).send({ error: error.message });
  }
});

// GET / — Get all reservations (admin only)
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('restaurantId', 'name')
      .sort({ date: -1 });
    res.send(reservations);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT /:id — Update reservation status (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).send({ error: 'Reservation not found' });
    }

    reservation.status = status;
    await reservation.save();

    // Send status update email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.email,
      subject: `Reservation Update - ForkiFy`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #ff6f00;">🍽️ Reservation Status Update</h2>
          <p>Dear ${reservation.name},</p>
          <p>Your reservation status has been updated to: <strong>${status}</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #ff6f00;">Reservation Details:</h3>
            <p><strong>Restaurant:</strong> ${reservation.restaurantName}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Number of Guests:</strong> ${reservation.numberOfGuests}</p>
          </div>
          <p>Thank you for choosing ForkiFy!</p>
          <p>Best regards,<br>The ForkiFy Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Status update email sent to:", reservation.email);

    res.send(reservation);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE /:id — Cancel reservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    
    if (!reservation) {
      return res.status(404).send({ error: 'Reservation not found' });
    }

    // Send cancellation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reservation.email,
      subject: 'Reservation Cancelled - ForkiFy',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #ff6f00;">🍽️ Reservation Cancelled</h2>
          <p>Dear ${reservation.name},</p>
          <p>Your reservation has been cancelled.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #ff6f00;">Reservation Details:</h3>
            <p><strong>Restaurant:</strong> ${reservation.restaurantName}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
          </div>
          <p>We hope to serve you again in the future!</p>
          <p>Best regards,<br>The ForkiFy Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Cancellation email sent to:", reservation.email);

    res.send(reservation);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
