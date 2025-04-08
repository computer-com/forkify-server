const mongoose = require('mongoose');
const slugify = require('slugify');

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String, 
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  city: { type: String, required: true },
  image: { type: String, required: true },
  reviews: { type: Number, default: 0 },
  bookedTimes: { type: Number, default: 0 },
  timeSlots: [String],
  description: String,
  slug: { type: String, unique: true },
  isActive: { type: Boolean, default: true },
  reviewsList: [
    {
      name: String,
      rating: Number,
      comment: String,
      date: Date,
    },
  ], 
  signatureDishes: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true }
    }
  ],
  menu: [menuItemSchema],
  tags: [String], 
  ratingBreakdown: {
    food: Number,
    service: Number,
    ambience: Number,
    value: Number,
    noise: String,
  },
  hours: String,
  priceRange: String,
  address: String,
  diningStyle: String,
  dressCode: String,
  parking: String,
  paymentOptions: String,
  chef: String,
  extraInfo: [String], 
});

restaurantSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
