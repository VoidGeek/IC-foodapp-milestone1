const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 // Ensures price is a positive number
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["veg", "non-veg", "dessert"]
  }
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
