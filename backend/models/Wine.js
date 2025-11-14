const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: String,
  image: String,
});

module.exports = mongoose.model('Wine', wineSchema);
