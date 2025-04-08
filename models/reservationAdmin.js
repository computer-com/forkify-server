const mongoose = require("mongoose");

const ReservationAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  people: { type: Number, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("ReservationAdmin", ReservationAdminSchema);
