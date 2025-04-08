const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth, isAdmin } = require('../middleware/auth');

// Update Profile Information
router.put('/profile', auth, async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, //use req.user._id
      { name, email, phone, address },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change Password
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Business Information Settings
router.put('/business', auth, async (req, res) => {
  const { businessName, businessHours, businessContact } = req.body;
  try {
    const updatedBusiness = await User.findByIdAndUpdate(
      req.user._id,
      { businessName, businessHours, businessContact },
      { new: true }
    );
    res.json(updatedBusiness);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Management (Only Admins can manage users)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
