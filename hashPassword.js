const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Forkify')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const addOwner = async () => {
  try {
    // Check if the owner already exists
    const existingOwner = await User.findOne({ email: 'examplexyz@example.com' });
    if (existingOwner) {
      console.log('Owner already exists:', existingOwner.email);
      mongoose.connection.close();
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('123', 10);

    // Create new owner with required fields
    const owner = new User({
      name: 'Example Owner', // Required field
      email: 'examplexyz@example.com', // Required field
      password: hashedPassword, // Optional but needed for login
      role: 'owner' // Matches enum
      // phone and restaurantId are optional, so we can omit them
    });

    await owner.save();
    console.log('Owner added successfully:', owner.email);
  } catch (err) {
    console.error('Error adding owner:', err);
  } finally {
    mongoose.connection.close();
  }
};

addOwner();