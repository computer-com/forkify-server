const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Inventory = require("../models/Inventory");
const Staff = require("../models/Staff");
const Restaurant = require("../models/Restaurant");

dotenv.config();
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const defaultInventoryItems = [
  { name: "Cheese", quantity: 20, price: 10, category: "Dairy" },
  { name: "Tomatoes", quantity: 50, price: 5, category: "Vegetables" },
  { name: "Chicken Breast", quantity: 30, price: 15, category: "Meat" },
  { name: "Olive Oil", quantity: 10, price: 20, category: "Condiments" },
  { name: "Spaghetti", quantity: 40, price: 12, category: "Grains" },
  { name: "Salt", quantity: 100, price: 2, category: "Seasoning" },
];

const baseStaffMembers = [
  { name: "John", role: "Chef" },
  { name: "Samantha", role: "Waitress" },
  { name: "Mark", role: "Bartender" },
  { name: "Olivia", role: "Manager" },
  { name: "David", role: "Cleaner" },
  { name: "Linda", role: "Receptionist" },
];

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas.");

    await Staff.deleteMany({});
    await Inventory.deleteMany({});
    const restaurants = await Restaurant.find();

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      console.log(`\n🔸 Seeding for: ${restaurant.name}`);

      // Seed Inventory Items
      for (const item of defaultInventoryItems) {
        await Inventory.create({ ...item, restaurantId: restaurant._id });
      }

      // Seed Staff Members
      for (let j = 0; j < baseStaffMembers.length; j++) {
        const base = baseStaffMembers[j];
        const contact = `999-000-${i}${j}1`; // Guaranteed unique

        await Staff.create({
          ...base,
          contact,
          restaurantId: restaurant._id,
        });
      }

      console.log(`✅ Seeded cards for: ${restaurant.name}`);
    }

    console.log("\n🎉 All restaurants seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error while seeding default data:", err.message);
    process.exit(1);
  }
};

// Run the function
seedData();
