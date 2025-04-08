const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Reservation = require('../models/Reservation');

dotenv.config();

const seedManagers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });    
    console.log("Connected to MongoDB for seeding managers and reservations.\n");

    const restaurants = await Restaurant.find();
    if (restaurants.length !== 7) {
      console.warn(" Expected 7 restaurants, found:", restaurants.length);
    }

    const managers = [
      {
        name: 'Manager One',
        email: 'manager1@graffiti.com',
        password: 'graffiti123',
        restaurantName: 'Graffiti Market',
      },
      {
        name: 'Manager Two',
        email: 'manager2@milestones.com',
        password: 'milestone456',
        restaurantName: 'Milestones Grill + Bar',
      },
      {
        name: 'Manager Three',
        email: 'manager3@plazasushi.com',
        password: 'plaza789',
        restaurantName: 'Plaza Sushi Downtown',
      },
      {
        name: 'Manager Four',
        email: 'manager4@twhbar.com',
        password: 'twh101',
        restaurantName: 'TWH Social Bar & Bistro',
      },
      {
        name: 'Manager Five',
        email: 'manager5@isabelle.com',
        password: 'isa202',
        restaurantName: 'Isabelle Restaurant + Lounge',
      },
      {
        name: 'Manager Six',
        email: 'manager6@jacobsgrill.com',
        password: 'jacob303',
        restaurantName: 'Jacobs Grill',
      },
      {
        name: 'Manager Seven',
        email: 'manager7@spiceroute.com',
        password: 'spice404',
        restaurantName: 'The Spice Route',
      },
    ];

    for (const manager of managers) {
      const restaurant = restaurants.find(r => r.name === manager.restaurantName);

      if (!restaurant) {
        console.warn(`Restaurant "${manager.restaurantName}" not found for manager: ${manager.email}`);
        continue;
      }

      const existing = await User.findOne({ email: manager.email });

      if (existing) {
        console.log(` Manager exists: ${manager.email} -> restaurantId: ${restaurant._id}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(manager.password, 10);
      const createdManager = await User.create({
        name: manager.name,
        email: manager.email,
        password: hashedPassword,
        role: 'manager',
        restaurantId: restaurant._id,
      });

      console.log(`Manager created: ${manager.email} -> ${restaurant.name} (${restaurant._id})`);

      console.log(`Test reservation added for "${restaurant.name}"`);
    }

    console.log("\n Done: Managers + test reservations seeded correctly!\n");
    process.exit();
  } catch (error) {
    console.error(" Seeding error:", error);
    process.exit(1);
  }
};

seedManagers();
