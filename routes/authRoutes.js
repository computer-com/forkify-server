const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/manager', async (req, res) => {
  try {
    const { email, password } = req.body;

    const manager = await User.findOne({ email, role: 'manager' });
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }


    const isMatch = await require('bcrypt').compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = require('jsonwebtoken').sign(
      { userId: manager._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );


    res.status(200).json({
      token,
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        restaurantId: manager.restaurantId,
      },
    });

  } catch (err) {
    console.error("Server error in /manager route:", err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
// Owner Registration Route
router.post('/owner/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new User({
      name,
      email,
      password: hashedPassword,
      role: 'owner',
    });
    await owner.save();
    console.log("Owner registered:", owner.email);

    const token = jwt.sign(
      { userId: owner._id, role: owner.role }, // Include role in token for consistency
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Match expiration with other routes
    );

    res.status(201).json({
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      }
    });
  } catch (error) {
    console.error(" Error in owner registration:", error);
    res.status(500).json({ error: error.message });
  }
});

// Existing owner sign-in route
router.post('/owner', async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await User.findOne({ email, role: 'owner' });
    if (!owner) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: owner._id, role: owner.role }, // Include role in token
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("JWT token generated for owner");

    res.json({
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      }
    });
  } catch (error) {
    console.error("Error in owner login:", error);
    res.status(500).json({ error: error.message });
  }
});
// Manual Sign In for Customers
router.post('/signin', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, countryCode } = req.body;

    if (!email || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        countryCode,
        isGoogleSigned: false,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error(" Manual sign-in error:", err.message);
    res.status(500).json({ message: 'Sign in failed', error: err.message });
  }
});

// User Signin Route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'user' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in user signin:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
