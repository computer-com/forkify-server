const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

dotenv.config(); // Loads MongoDB URI from .env

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB Atlas.");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const sampleRestaurants = [
  {
    name: "Graffiti Market",
    cuisine: "Pizza Bar",
    city: "Kitchener",
    image: "https://thecord.ca/wp-content/uploads/2018/11/Graffiti-Market_Yitian-Cai_RGB.jpg",
    reviews: 1471,
    reviewsList: [
      { name: "Mia", rating: 5, comment: "Loved the garlic pizza sticks!", date: "2024-08-07" },
      { name: "Lucas", rating: 5, comment: "Loved the graffiti vibes and pastas.", date: "2024-07-29" },
      { name: "Charlotte", rating: 4, comment: "Great for groups and very lively!", date: "2024-06-27" },
      { name: "Oliver", rating: 5, comment: "Top-notch pizza and chill ambience.", date: "2025-01-08" },
      { name: "Charlotte", rating: 4, comment: "Very casual but high quality food.", date: "2024-07-20" },
      { name: "Sophia", rating: 5, comment: "Buffalo chicken poutine was fire 🔥", date: "2025-02-12" },
      { name: "Ethan", rating: 5, comment: "Crispy pancetta on pizza was amazing!", date: "2024-08-05" },
      { name: "Ethan", rating: 4, comment: "Their Goudi Fries are a must-try!", date: "2024-12-18" },
      { name: "Emily", rating: 4, comment: "Enjoyed the beers and rustic decor.", date: "2024-11-08" },
      { name: "Liam", rating: 5, comment: "Such a fun atmosphere with great food.", date: "2024-12-22" },
      { name: "Emily", rating: 5, comment: "Perfect Friday night hangout spot.", date: "2024-10-30" }
    ],
    bookedTimes: 36,
    timeSlots: ["7:00 p.m.", "7:15 p.m.", "7:30 p.m."],
    isActive: true,
    description: "Rustic-industrial market for Detroit-style pizza, house-made pastas, rotisserie chicken & beers.",
    tags: ["Lively", "Child-friendly", "Good for groups"],
    ratingBreakdown: {
      food: 4.4,
      service: 4.4,
      ambience: 4.3,
      value: 4.1,
      noise: "Moderate"
    },
    hours: "Mon–Thu, Sun 11:30 am–9:00 pm, Fri, Sat 11:30 am–10:00 pm",
    priceRange: "CAN$31 to CAN$50",
    address: "137 Glasgow St, Suite 385, Kitchener, ON N2G 4X8",
    diningStyle: "Casual Elegant",
    dressCode: "Casual Dress",
    parking: "Private Lot",
    paymentOptions: "Mastercard, Visa",
    chef: "N/A",
    extraInfo: ["Bar/Lounge", "Beer", "BYO Wine", "Cocktails", "Gluten-free Options", "Indoor Dining"],
    menu: [
      { name: "Goudi Fries", description: "Fresh-cut fries, MountainOak gouda, fresh rosemary + thyme, served with spicy ketchup", price: 11, category: "Apps" },
      { name: "Detroit-Style Pizza Sticks", description: "Detroit-style pizza sticks, garlic butter, garlic parmesan dip", price: 14, category: "Apps" },
      { name: "Buffalo Chicken Poutine", description: "Buttermilk fried chicken, fresh-cut fries, cheese curds, buffalo ranch, crispy chicken skin, scallions", price: 19.5, category: "Apps" },
      { name: "Winter Greens", description: "Heritage greens, shaved brussels, chèvre, cranberries, roasted squash, microgreens", price: 15, category: "Salads + Bowls" },
      { name: "Hawaiian", description: "Smoked pork hock, smoked bacon, crispy pancetta, tomato sauce, grilled pineapple, arugula", price: 18, category: "Detroit Style Pizza" },
      { name: "The Spicy Dill-Inquent", description: "Smoked bacon, dill pickles, spicy dill pickle ranch, mozzarella, crispy onion", price: 18, category: "Detroit Style Pizza" },
      { name: "Fried Chicken Wings (1 LB)", description: "Lightly breaded. Choose one of our house-made flavours.", price: 20, category: "Wings" },
      { name: "Power Bowl", description: "Brown rice, baby kale, edamame, roasted carrots, sesame dressing", price: 22, category: "Salads + Bowls" }
    ],
    signatureDishes: [
      {
        name: "Fried Chicken Wings",
        image: "https://media.istockphoto.com/id/1369101558/photo/plate-of-barbecue-chicken-wings-top-view.jpg?s=612x612&w=0&k=20&c=cFFVf7PwTtcIgOFsIVh4gOlCr-lyzhUhH9Y91e8Sr0Q="
      },
      {
        name: "Power Bowl",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCWu-vp9ENQW40K_Uwpj2bCBx1rOZ7HEycyw&s"
      }
    ]
  },
  {
    name: "Milestones Grill + Bar",
    city: "Guelph",
    cuisine: "Global/International",
    image: "https://www.visitniagaracanada.com/wp-content/uploads/2017/06/milestones.jpg",
    description: "Casual dining chain with globally inspired dishes, great drinks, and a warm atmosphere.",
    reviews: 1225,
    reviewsList: [
      { name: "Amelia", rating: 3, comment: "Global menu was refreshing.", date: "2024-11-14" },
      { name: "Emily", rating: 4, comment: "Would definitely return.", date: "2024-10-12" },
      { name: "Ethan", rating: 4, comment: "Service could be quicker.", date: "2025-03-08" },
      { name: "Emily", rating: 3, comment: "Delicious surf & turf burger!", date: "2025-01-29" },
      { name: "Isabella", rating: 4, comment: "Great ambiance and friendly staff.", date: "2024-08-29" },
      { name: "Ethan", rating: 3, comment: "Lovely place to relax and eat.", date: "2024-06-10" },
      { name: "Lucas", rating: 3, comment: "Good vibes and lighting.", date: "2025-03-05" },
      { name: "Liam", rating: 3, comment: "Loved the Thai curry bowl.", date: "2025-01-03" },
      { name: "Ethan", rating: 4, comment: "Music was a bit loud.", date: "2025-02-02" },
      { name: "Logan", rating: 4, comment: "Perfect for date night!", date: "2024-10-31" }
    ],
    
    timeSlots: ["6:00 p.m.", "6:30 p.m.", "7:00 p.m."],
    bookedTimes: 48,
    slug: "milestones-grill-bar",
    menu: [
      { name: "Surf & Turf Burger", price: 24, description: "Grilled beef burger with crispy shrimp, tangy slaw, and spicy aioli." },
      { name: "Chicken Parmesan", price: 21, description: "Crispy chicken breast topped with marinara and mozzarella, served with pasta." },
      { name: "Thai Red Curry Bowl", price: 19, description: "Coconut curry sauce with jasmine rice, seasonal vegetables, and tofu or chicken." },
      { name: "Avocado Chicken Salad", price: 17, description: "Grilled chicken, avocado, mixed greens, balsamic vinaigrette." },
      { name: "BBQ Ribs", price: 26, description: "Slow cooked pork ribs glazed with smoky BBQ sauce." },
      { name: "Creamy Pesto Pasta", price: 20, description: "Pasta tossed in creamy basil pesto with cherry tomatoes." },
      { name: "Grilled Salmon Bowl", price: 23, description: "Salmon fillet served with wild rice, greens and lemon-dill sauce." },
      { name: "Stuffed Mushrooms", price: 14, description: "Mushroom caps stuffed with cheese and herbs." },
      { name: "Tiramisu Cheesecake", price: 10, description: "Rich coffee-flavored cheesecake with cocoa dusting." }
    ],
    signatureDishes: [
      {
        name: "Surf & Turf Burdger",
        image: "https://media.istockphoto.com/id/932440900/photo/lobster-blt-prime-rib-burger.jpg?s=612x612&w=0&k=20&c=vZDPdWHX_iqHcY7L0vo-GRUmxX9Af48o2qSc6Zx1qQU="
      },
      {
        name: "BBQ Ribs",
        image: "https://media.gettyimages.com/id/1695294771/video/spice-mix-falling-onto-the-ribs-on-the-grill.jpg?s=640x640&k=20&c=gKTxh51JLrwkilX4O0_nXrsNnceGLP3R2lNR1xlFHlI="
      }
    ]
  },
  {
    name: "Plaza Sushi Downtown",
    cuisine: "Japanese",
    city: "London",
    image: "https://resizer.otstatic.com/v2/photos/wide-huge/3/59257026.jpg",
    reviews: 1924,
    reviewsList: [
      { name: "Emily", rating: 3, comment: "Quick service, great taste.", date: "2024-11-04" },
      { name: "Noah", rating: 3, comment: "Quiet and cozy dining spot.", date: "2024-12-25" },
      { name: "Noah", rating: 3, comment: "Affordable yet high quality.", date: "2025-02-23" },
      { name: "Ava", rating: 5, comment: "Impressive flavors.", date: "2024-11-06" },
      { name: "Oliver", rating: 5, comment: "Chef Kenji is amazing!", date: "2024-09-28" },
      { name: "Mia", rating: 4, comment: "Very clean and organized place.", date: "2024-07-03" },
      { name: "Emma", rating: 3, comment: "Loved the dynamite roll.", date: "2024-06-21" },
      { name: "Noah", rating: 5, comment: "Freshest sushi in town!", date: "2024-12-24" },
      { name: "Liam", rating: 5, comment: "Nice Japanese décor.", date: "2024-08-23" },
      { name: "Logan", rating: 5, comment: "Highly recommend the sashimi platter.", date: "2024-12-17" },
      { name: "Logan", rating: 4, comment: "Tempura flakes were perfect!", date: "2025-03-08" },
      { name: "Charlotte", rating: 4, comment: "My go-to sushi place!", date: "2024-08-19" }
    ],
    
    bookedTimes: 33,
    timeSlots: ["5:30 p.m.", "6:00 p.m.", "6:30 p.m."],
    isActive: true,
    slug: "plaza-sushi-downtown",
    description: "Plaza Sushi Downtown offers authentic Japanese cuisine, fresh sushi, and a cozy dining atmosphere in the heart of London.",
    tags: ["Fresh Sushi", "Quiet", "Good for Date Night"],
    ratingBreakdown: {
      food: 4.6,
      service: 4.5,
      ambience: 4.4,
      value: 4.3,
      noise: "Quiet"
    },
    hours: "Mon–Sun 11:30 am–10:00 pm",
    priceRange: "CAN$11 to CAN$30",
    address: "431 Richmond St, London, ON N6A 3C8",
    diningStyle: "Casual Dining",
    dressCode: "Casual",
    parking: "Street Parking",
    paymentOptions: "Visa, Mastercard, Discover",
    chef: "Chef Kenji Yamamoto",
    extraInfo: ["Sushi Bar", "Takeout Available", "Vegan Options", "Beer and Sake", "Indoor Dining"],
    menu: [
      {
        name: "Salmon Sashimi",
        description: "6 pieces of fresh Atlantic salmon, sliced to perfection.",
        price: 18,
        category: "Sashimi"
      },
      {
        name: "Spicy Tuna Roll",
        description: "Tuna, cucumber, spicy mayo, and tempura flakes.",
        price: 14,
        category: "Rolls"
      },
      {
        name: "Chicken Teriyaki",
        description: "Grilled chicken served with teriyaki sauce, rice, and salad.",
        price: 20,
        category: "Entrées"
      },
      {
        name: "Avocado Maki",
        description: "Fresh avocado roll with seaweed and sushi rice.",
        price: 8,
        category: "Vegetarian"
      },
      {
        name: "Miso Soup",
        description: "Traditional Japanese soup with tofu, seaweed, and green onion.",
        price: 4,
        category: "Soups"
      },
      {
        name: "Dynamite Roll",
        description: "Shrimp tempura, cucumber, avocado, and spicy mayo.",
        price: 16,
        category: "Rolls"
      }
    ],
    signatureDishes: [
      {
        name: "Spicy Tuna Roll",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ElvR0RLmw_A7TPh4LupPvnmEb5Rg4718AA&s"
      },
      {
        name: "Avocado Maki",
        image: "https://d3gko8938onrvn.cloudfront.net/dishes/images/4Cl3NMpPyN8DSOsXxsCeHRrR1umAlraAp7HamqDt.jpg"
      }
    ]
  },
  
  {
    name: "TWH Social Bar & Bistro",
    cuisine: "Fusion/Canadian",
    city: "Kitchener",
    image: "https://resizer.otstatic.com/v3/photos/24716917-0?webp=true",
    reviews: 444,
    reviewsList: [
      { name: "Lucas", rating: 4, comment: "Upscale and cozy!", date: "2024-11-02" },
      { name: "Liam", rating: 5, comment: "Scallops were perfectly cooked.", date: "2025-02-18" },
      { name: "Emma", rating: 5, comment: "Great wine selection!", date: "2024-10-10" },
      { name: "Oliver", rating: 4, comment: "Quiet and relaxed vibe.", date: "2025-01-07" },
      { name: "Isabella", rating: 5, comment: "Loved the truffle risotto!", date: "2024-09-05" },
      { name: "Ethan", rating: 5, comment: "Perfect date night spot.", date: "2024-11-21" },
      { name: "Emily", rating: 5, comment: "Atmosphere is classy yet fun.", date: "2024-08-29" },
      { name: "James", rating: 4, comment: "Their cocktails are creative.", date: "2024-12-12" },
      { name: "Sophia", rating: 5, comment: "The salmon was so flavorful.", date: "2024-10-19" },
      { name: "Noah", rating: 4, comment: "Pancetta crisp was unreal.", date: "2025-03-03" },
      { name: "Charlotte", rating: 5, comment: "Can't wait to come back!", date: "2024-09-25" }
    ],
    
    bookedTimes: 18,
    timeSlots: ["8:30 p.m.", "9:00 p.m."],
    isActive: true,
    slug: "twh-social-bar-bistro",
    description: "TWH Social is a cozy and contemporary bistro located in downtown Kitchener offering modern Canadian cuisine in an upscale setting.",
    tags: ["Modern", "Locally Sourced", "Cozy"],
    ratingBreakdown: {
      food: 4.5,
      service: 4.3,
      ambience: 4.4,
      value: 4.2,
      noise: "Moderate"
    },
    hours: "Mon–Sun 11:00 am–10:00 pm",
    priceRange: "CAN$21 to CAN$40",
    address: "1 King St W, Kitchener, ON N2G 1A3",
    diningStyle: "Upscale Casual",
    dressCode: "Smart Casual",
    parking: "Street and Lot Parking",
    paymentOptions: "Visa, Mastercard, AMEX",
    chef: "Chef Jordan Wilkinson",
    extraInfo: ["Bar/Lounge", "Farm-to-Table", "Craft Cocktails", "Outdoor Seating", "Indoor Dining"],
    menu: [
      {
        name: "Lamb Sliders",
        description: "Mini lamb burgers with tzatziki, arugula, and pickled onions.",
        price: 17,
        category: "Appetizers"
      },
      {
        name: "Seared Scallops",
        description: "Pan-seared scallops with cauliflower purée and crispy pancetta.",
        price: 24,
        category: "Appetizers"
      },
      {
        name: "Roasted Chicken Supreme",
        description: "Herb-marinated chicken with truffle mashed potatoes and seasonal vegetables.",
        price: 28,
        category: "Entrées"
      },
      {
        name: "Truffle Risotto",
        description: "Creamy arborio rice with wild mushrooms, parmesan, and black truffle oil.",
        price: 26,
        category: "Mains"
      },
      {
        name: "Maple Glazed Salmon",
        description: "Atlantic salmon fillet with maple glaze and charred asparagus.",
        price: 30,
        category: "Mains"
      },
      {
        name: "Dark Chocolate Tart",
        description: "Rich chocolate ganache with hazelnut crust and raspberry coulis.",
        price: 12,
        category: "Desserts"
      }
    ],
    signatureDishes: [
      {
        name: "Dark Chocolate Tart",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHVEq0pfGDHIvF1eluA1YLzcqDZ4I-ILz3LQ&s"
      },
      {
        name: "Roasted Chicken Supreme",
        image: "https://spcdn.shortpixel.ai/spio/ret_img,q_orig/debsdailydish.com/wp-content/uploads/2024/09/Roast-Chicken-Supreme-FI-1.jpg"
      }
    ]
  },
  {
    name: "Isabelle Restaurant + Lounge",
    cuisine: "Mediterranean",
    city: "Burlington",
    image: "https://resizer.otstatic.com/v3/photos/50351785-0?webp=true", 
    reviews: 777,
    reviewsList: [
      { name: "Amelia", rating: 5, comment: "Best branzino I've had!", date: "2025-01-16" },
      { name: "Ava", rating: 5, comment: "Romantic vibes and lakefront!", date: "2024-12-20" },
      { name: "Ethan", rating: 5, comment: "Their lamb kofta is elite.", date: "2024-10-06" },
      { name: "Emma", rating: 5, comment: "The patio is stunning!", date: "2024-08-28" },
      { name: "Oliver", rating: 4, comment: "Perfect view, perfect cocktails.", date: "2025-02-01" },
      { name: "Sophia", rating: 5, comment: "Loved the Mediterranean touch.", date: "2024-09-14" },
      { name: "Mia", rating: 5, comment: "Excellent staff and service.", date: "2024-11-11" },
      { name: "Lucas", rating: 4, comment: "Amazing seafood pasta!", date: "2024-08-11" },
      { name: "Logan", rating: 5, comment: "Baklava cheesecake... 10/10!", date: "2024-10-31" },
      { name: "Charlotte", rating: 5, comment: "Great place for celebrations!", date: "2024-09-21" },
      { name: "Noah", rating: 4, comment: "A Burlington gem 💎", date: "2025-03-05" },
      { name: "Emily", rating: 4, comment: "Unique vibe and plating.", date: "2024-12-09" }
    ],
    
    bookedTimes: 27,
    timeSlots: ["5:00 p.m.", "6:30 p.m.", "8:00 p.m."],
    isActive: true,
    slug: "isabelle-restaurant-lounge",
    description: "Isabelle Restaurant + Lounge offers a modern Mediterranean dining experience with stunning lakefront views, handcrafted cocktails, and a seasonal menu inspired by coastal cuisine.",
    tags: ["Lakefront Views", "Romantic", "Fresh Ingredients"],
    ratingBreakdown: {
      food: 4.7,
      service: 4.6,
      ambience: 4.8,
      value: 4.3,
      noise: "Moderate"
    },
    hours: "Mon–Sun 11:30 am–10:00 pm",
    priceRange: "CAN$31 to CAN$50",
    address: "2020 Lakeshore Rd, Burlington, ON L7R 4G8",
    diningStyle: "Fine Dining",
    dressCode: "Smart Casual",
    parking: "Underground and Street Parking",
    paymentOptions: "Visa, Mastercard, AMEX, Interac",
    chef: "Chef Ben Heaton",
    extraInfo: [
      "Waterfront Dining",
      "Cocktail Lounge",
      "Vegetarian Options",
      "Outdoor Patio",
      "Private Dining Room"
    ],
    menu: [
      {
        name: "Charred Octopus",
        description: "Served with romesco, confit potatoes, and chorizo vinaigrette.",
        price: 21,
        category: "Appetizers"
      },
      {
        name: "Grilled Halloumi Salad",
        description: "Mixed greens, cherry tomatoes, cucumber, mint, and lemon vinaigrette.",
        price: 17,
        category: "Appetizers"
      },
      {
        name: "Seafood Tagliatelle",
        description: "Fresh pasta with shrimp, mussels, calamari, and white wine saffron cream.",
        price: 34,
        category: "Mains"
      },
      {
        name: "Lamb Kofta",
        description: "Spiced lamb skewers with tzatziki, tabbouleh, and grilled flatbread.",
        price: 28,
        category: "Mains"
      },
      {
        name: "Pan-Roasted Branzino",
        description: "With fennel, citrus salad, and olive oil emulsion.",
        price: 36,
        category: "Mains"
      },
      {
        name: "Baklava Cheesecake",
        description: "Phyllo crust, spiced nuts, and honey syrup.",
        price: 12,
        category: "Desserts"
      }
    ],
    signatureDishes: [
      {
        name: "Pan-Roasted Branzino",
        image: "https://somethingnutritiousblog.com/wp-content/uploads/2022/09/95CE8676-2F0A-453D-8FF5-66C473DA8362-scaled-1.jpeg"
      },
      {
        name: "Lamb Kofta",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrlL1qwyfoztFtZU5FA1L-Fj5PytRAuqRGFw&s"
      }
    ]
  },
  {
    name: "Jacobs Grill",
    cuisine: "Canadian",
    city: "St. Jacobs",
    image: "https://resizer.otstatic.com/v3/photos/50724399-0?webp=true", // Replace if needed
    reviews: 1775,
    reviewsList: [
      { name: "Lucas", rating: 5, comment: "Local and flavorful.", date: "2024-11-13" },
      { name: "Emma", rating: 5, comment: "Pork sliders were perfect.", date: "2025-01-20" },
      { name: "James", rating: 5, comment: "Rustic feel and tasty food.", date: "2024-10-07" },
      { name: "Charlotte", rating: 4, comment: "Love the farm-to-table approach.", date: "2024-08-20" },
      { name: "Sophia", rating: 5, comment: "Great for family dinners!", date: "2024-09-19" },
      { name: "Ethan", rating: 4, comment: "Service was quick and kind.", date: "2024-12-30" },
      { name: "Liam", rating: 5, comment: "Short ribs were melt-in-your-mouth.", date: "2024-07-18" },
      { name: "Mia", rating: 5, comment: "Sticky pudding is heavenly!", date: "2025-03-02" },
      { name: "Noah", rating: 5, comment: "Wild mushroom risotto—wow.", date: "2025-02-15" },
      { name: "Oliver", rating: 4, comment: "One of my favorites in St. Jacobs.", date: "2024-10-22" },
      { name: "Emily", rating: 4, comment: "Simple, honest food.", date: "2024-09-12" }
    ],
    
    bookedTimes: 29,
    timeSlots: ["6:00 p.m.", "6:30 p.m.", "7:30 p.m."],
    isActive: true,
    slug: "jacobs-grill",
    description: "Jacob's Grill offers a rustic yet modern dining experience in the heart of St. Jacobs, serving handcrafted Canadian dishes made with locally sourced ingredients.",
    tags: ["Local Ingredients", "Casual", "Farm-to-Table"],
    ratingBreakdown: {
      food: 4.5,
      service: 4.4,
      ambience: 4.3,
      value: 4.2,
      noise: "Moderate"
    },
    hours: "Tue–Sun 11:00 am–9:00 pm",
    priceRange: "CAN$21 to CAN$40",
    address: "1396 King St N, St. Jacobs, ON N0B 2N0",
    diningStyle: "Casual Dining",
    dressCode: "Casual",
    parking: "Street and Lot Parking",
    paymentOptions: "Visa, Mastercard, Interac",
    chef: "Chef Evan Woods",
    extraInfo: [
      "Locally Sourced",
      "Vegan Options",
      "Family Friendly",
      "Outdoor Patio",
      "Casual Ambience"
    ],
    menu: [
      {
        name: "Beet & Goat Cheese Salad",
        description: "Roasted beets, arugula, goat cheese, candied pecans, citrus vinaigrette.",
        price: 15,
        category: "Starters"
      },
      {
        name: "Pork Belly Sliders",
        description: "Slow-roasted pork belly with maple glaze and house slaw.",
        price: 18,
        category: "Starters"
      },
      {
        name: "Braised Short Ribs",
        description: "Served with mashed potatoes, seasonal vegetables, and red wine reduction.",
        price: 32,
        category: "Mains"
      },
      {
        name: "Maple Glazed Salmon",
        description: "Atlantic salmon fillet with wild rice pilaf and roasted asparagus.",
        price: 29,
        category: "Mains"
      },
      {
        name: "Wild Mushroom Risotto",
        description: "Creamy risotto with forest mushrooms, truffle oil, and parmesan.",
        price: 27,
        category: "Vegetarian"
      },
      {
        name: "Sticky Toffee Pudding",
        description: "Warm date cake with toffee sauce and vanilla bean ice cream.",
        price: 10,
        category: "Desserts"
      }
    ],
    signatureDishes: [
      {
        name: "Wild Mushroom Risotto",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfqNF8f5yXtl-Rkl0oMR5wO1Nu_Zt_XfxE5Q&s"
      },
      {
        name: "Pork Belly Sliders",
        image: "https://cdn11.bigcommerce.com/s-fnc0mtzrrh/images/stencil/960x640/products/3260/13381/thumbnail-fc78c2c093bc7cafe7487715a9423a58__28719.1729706292.jpg?c=1"
      }
    ]
  },
  {
    name: "The Spice Route",
    cuisine: "Indian",
    city: "Mississauga",
    image: "https://resizer.otstatic.com/v3/photos/48563605-0?webp=true", 
    reviews: 822,
    reviewsList: [
      { name: "Sophia", rating: 5, comment: "Fusion done right!", date: "2024-11-10" },
      { name: "Liam", rating: 4, comment: "Butter chicken is heavenly.", date: "2025-02-20" },
      { name: "Isabella", rating: 5, comment: "The ambiance is fire 🔥", date: "2024-10-15" },
      { name: "Mia", rating: 5, comment: "Best lamb I’ve tasted in a while.", date: "2025-01-09" },
      { name: "Lucas", rating: 4, comment: "The DJ night is a blast!", date: "2024-09-07" },
      { name: "Emma", rating: 4, comment: "Very flavorful and filling.", date: "2024-11-28" },
      { name: "Logan", rating: 5, comment: "Vibrant and energetic crowd.", date: "2024-08-16" },
      { name: "Ava", rating: 5, comment: "Every dish was rich in spices!", date: "2025-03-06" },
      { name: "Ethan", rating: 5, comment: "Paneer tikka was perfection.", date: "2025-01-01" },
      { name: "Noah", rating: 5, comment: "Loved the tandoori platter.", date: "2024-10-25" },
      { name: "Emily", rating: 4, comment: "Gulab jamun cheesecake 💯", date: "2024-12-14" }
    ],
    
    bookedTimes: 31,
    timeSlots: ["6:00 p.m.", "7:00 p.m.", "8:30 p.m."],
    isActive: true,
    slug: "spice-route",
    description: "Spice Route blends modern Indian cuisine with vibrant ambiance and a globally inspired twist. From classic curries to contemporary tandoor creations, it's a journey through bold flavours.",
    tags: ["Modern Indian", "Spicy", "Great Cocktails"],
    ratingBreakdown: {
      food: 4.6,
      service: 4.3,
      ambience: 4.7,
      value: 4.2,
      noise: "Energetic"
    },
    hours: "Tue–Sun 12:00 pm–10:00 pm",
    priceRange: "CAN$21 to CAN$50",
    address: "499 Main St, Mississauga, ON L5M 1X4",
    diningStyle: "Casual Elegant",
    dressCode: "Smart Casual",
    parking: "On-site and Street Parking",
    paymentOptions: "Visa, Mastercard, AMEX",
    chef: "Chef Anjali Kapoor",
    extraInfo: [
      "Tandoori Grill",
      "Cocktail Lounge",
      "Vegetarian Friendly",
      "Vegan Options",
      "Live DJ Nights",
      "Indoor and Outdoor Seating"
    ],
    menu: [
      {
        name: "Butter Chicken",
        description: "Creamy tomato-based chicken curry served with naan or rice.",
        price: 22,
        category: "Entrées"
      },
      {
        name: "Paneer Tikka Skewers",
        description: "Grilled marinated paneer with bell peppers and onions.",
        price: 18,
        category: "Appetizers"
      },
      {
        name: "Lamb Rogan Josh",
        description: "Tender lamb cooked in a rich Kashmiri gravy.",
        price: 26,
        category: "Entrées"
      },
      {
        name: "Masala Calamari",
        description: "Spiced, crispy calamari tossed with onions and peppers.",
        price: 17,
        category: "Appetizers"
      },
      {
        name: "Tandoori Mixed Grill",
        description: "Assorted tandoori chicken, lamb chops, shrimp, and kebabs.",
        price: 34,
        category: "Grill"
      },
      {
        name: "Gulab Jamun Cheesecake",
        description: "Fusion dessert blending gulab jamun and classic cheesecake.",
        price: 11,
        category: "Desserts"
      }
    ],
    signatureDishes: [
      {
        name: "Tandoori Mixed Grill",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoo8i2lF9N2NmV3fcdZlD0emxBcvC4y9aUw&s"
      },
      {
        name: "Lamb Rogan Josh",
        image: "https://media.istockphoto.com/id/1253934130/photo/mutton-masala-curry-in-plastic-container-for-home-delivery.jpg?s=612x612&w=0&k=20&c=KQTQTS9RK7f4wt1_ZgRuvFsUMvc2MP1GF3yQqgaVShQ="
      }
    ]
  },
];

const seedRestaurants = async () => {
  try {
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    for (const res of sampleRestaurants) {
      const { menu, ...restaurantData } = res;

      const newRestaurant = new Restaurant(restaurantData);
      const existing = await Restaurant.findOne({ name: Restaurant.name });
      if (existing) {
        console.log(`Restaurant already exists: ${Restaurant.name}`);
        continue;
      }
      await newRestaurant.save();

      if (Array.isArray(menu)) {
        const menuWithRestaurantId = menu.map(item => ({
          name: item.name,
          description: item.description || '',
          price: item.price || 0,
          category: item.category || 'Uncategorized',
          restaurantId: newRestaurant._id
        }));
        await MenuItem.insertMany(menuWithRestaurantId);
        console.log(`Seeded ${menu.length} menu items for "${newRestaurant.name}"`);
      }
    }

    console.log(" All restaurants and menus seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(" Error while seeding:", err);
    process.exit(1);
  }
};

seedRestaurants();
