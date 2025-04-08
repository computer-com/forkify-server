const express = require('express');
const multer = require('multer');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { auth, isAdmin, isOwner } = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcrypt');
const slugify = require('slugify');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create a new restaurant (admin only)
router.post('/', auth, isAdmin, upload.array('images'), async (req, res) => {
    try {
        const restaurantData = {
            ...req.body,
            images: req.files?.map(file => ({
                url: `/uploads/${file.filename}`,
                alt: req.body.name,
                isPrimary: false
            })) || []
        };
        
        // Set the first image as primary if exists
        if (restaurantData.images.length > 0) {
            restaurantData.images[0].isPrimary = true;
        }

        // Create URL-friendly slug from name
        restaurantData.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const restaurant = new Restaurant(restaurantData);
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});
// Create a new restaurant (owner only)
router.post('/owner', auth, isOwner, async (req, res) => {
    try {
      const {
        name, cuisine, city, image, description, timeSlots, managerName, managerEmail, managerPassword,
        hours, priceRange, address, diningStyle, dressCode, parking, paymentOptions, chef, extraInfo
      } = req.body;
  
      // Validate required fields
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!cuisine) missingFields.push("cuisine");
      if (!city) missingFields.push("city");
      if (!timeSlots) missingFields.push("timeSlots");
      if (!managerName || !managerName.trim()) missingFields.push("managerName");
      if (!managerEmail) missingFields.push("managerEmail");
      if (!managerPassword) missingFields.push("managerPassword");
  
      if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
      }
  
      // Default values
      const defaultImage = image || "https://cdn10.bostonmagazine.com/wp-content/uploads/sites/2/2023/10/beacon_restaurants-2.jpg";
      const defaultDescription = description || "A delightful dining experience awaits you at this restaurant.";
  
      // Check if manager email is unique
      const existingManager = await User.findOne({ email: managerEmail });
      if (existingManager) {
        return res.status(400).json({ message: "Manager email already in use" });
      }
  
      // Generate unique slug
      let baseSlug = slugify(name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Restaurant.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
  
      // Create restaurant
      const restaurant = new Restaurant({
        name,
        cuisine,
        city,
        image: defaultImage,
        description: defaultDescription,
        timeSlots: timeSlots.split(",").map(slot => slot.trim()),
        isActive: true,
        hours,
        priceRange,
        address,
        diningStyle,
        dressCode,
        parking,
        paymentOptions,
        chef,
        extraInfo: extraInfo ? extraInfo.split(",").map(item => item.trim()) : [],
        slug,
      });
      await restaurant.save();
  
      // Create manager
      const hashedPassword = await bcrypt.hash(managerPassword, 10);
      const manager = new User({
        name: managerName.trim(),
        email: managerEmail,
        password: hashedPassword,
        role: 'manager',
        restaurantId: restaurant._id,
      });
      await manager.save();
  
      res.status(201).json({ restaurant, manager });
    } catch (error) {
      console.error("Error adding restaurant:", error);
      res.status(400).json({ message: error.message || "Failed to add restaurant" });
    }
  });
  
  // Get owner reports (owner only)
  router.get('/owner/reports', auth, isOwner, async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      const reports = await Promise.all(restaurants.map(async (restaurant) => {
        const manager = await User.findOne({ restaurantId: restaurant._id, role: 'manager' });
        return {
          restaurantId: restaurant._id, // Added for navigation
          restaurant: restaurant.name,
          manager: manager ? manager.email : "No manager assigned",
          department: "General",
          type: "PDF",
          date: new Date().toISOString().split('T')[0],
          file: `/reports/${restaurant.slug || restaurant._id}.pdf`,
          status: "Pending",
        };
      }));
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  
// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const { cuisine, city, search } = req.query;
        const query = { isActive: true };

        if (cuisine) {
            query.cuisine = cuisine;
        }
        if (city) {
            query['address.city'] = city;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { cuisine: { $regex: search, $options: 'i' } }
            ];
        }

        const restaurants = await Restaurant.find(query).select('name slug cuisine image city reviews timeSlots');
        res.send(restaurants);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get restaurant by slug
router.get('/slug/:slug', async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        slug: req.params.slug,
        isActive: true
      });
      if (!restaurant) return res.status(404).send();
      res.send(restaurant);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  

// GET all restaurants
router.get("/", async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  });

  router.get('/id/:id', async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// New route: Download restaurant report for owner
router.get('/owner/report/:restaurantId', auth, isOwner, async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      const manager = await User.findOne({ restaurantId: restaurant._id, role: 'manager' });
  
      // Prepare report data
      const reportData = {
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        cuisine: restaurant.cuisine,
        city: restaurant.city,
        address: restaurant.address || "N/A",
        hours: restaurant.hours || "N/A",
        priceRange: restaurant.priceRange || "N/A",
        managerName: manager ? manager.name : "No manager assigned",
        managerEmail: manager ? manager.email : "N/A",
        managerId: manager ? manager._id : "N/A",
        // Business statistics (static for now, as per the provided PDF)
        itemQuantity: 10,
        price: "$700",
        totalValue: "$7000",
        totalInventoryValue: "$7000",
        totalStockAvailable: 10,
        totalRevenue: "$0",
      };
  
      res.json(reportData);
    } catch (error) {
      console.error("Error generating owner report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });
  

// Update restaurant (admin only)
router.patch('/:id', auth, isAdmin, upload.array('images'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'name', 'description', 'address', 'contactNumber', 
        'email', 'openingHours', 'cuisine', 'features', 
        'paymentMethods', 'isActive'
    ];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }

        updates.forEach(update => restaurant[update] = req.body[update]);
        
        // Handle new images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                alt: restaurant.name,
                isPrimary: false
            }));
            restaurant.images = [...restaurant.images, ...newImages];
        }

        await restaurant.save();
        res.send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Add/Update menu category (admin only)
router.post('/:id/categories', auth, isAdmin, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }

        restaurant.menuCategories.push(req.body);
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Add menu item (admin only)
router.post('/:id/menu', auth, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }

        const menuItem = {
            ...req.body,
            price: parseFloat(req.body.price),
            image: req.file ? `/uploads/${req.file.filename}` : undefined
        };

        restaurant.menuItems.push(menuItem);
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update menu item (admin only)
router.patch('/:id/menu/:itemId', auth, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }

        const menuItem = restaurant.menuItems.id(req.params.itemId);
        if (!menuItem) {
            return res.status(404).send();
        }

        Object.keys(req.body).forEach(key => {
            if (key === 'price') {
                menuItem[key] = parseFloat(req.body[key]);
            } else {
                menuItem[key] = req.body[key];
            }
        });

        if (req.file) {
            menuItem.image = `/uploads/${req.file.filename}`;
        }

        await restaurant.save();
        res.send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete menu item (admin only)
router.delete('/:id/menu/:itemId', auth, isAdmin, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }

        restaurant.menuItems.pull(req.params.itemId);
        await restaurant.save();
        res.send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Set primary image (admin only)
router.patch('/:id/images/:imageIndex/primary', auth, isAdmin, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }

        // Reset all images to non-primary
        restaurant.images.forEach(img => img.isPrimary = false);
        
        // Set the selected image as primary
        const imageIndex = parseInt(req.params.imageIndex);
        if (restaurant.images[imageIndex]) {
            restaurant.images[imageIndex].isPrimary = true;
        }

        await restaurant.save();
        res.send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete image (admin only)
router.delete('/:id/images/:imageIndex', auth, isAdmin, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).send();
        }

        const imageIndex = parseInt(req.params.imageIndex);
        if (restaurant.images[imageIndex]) {
            restaurant.images.splice(imageIndex, 1);
        }

        await restaurant.save();
        res.send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});



module.exports = router;
