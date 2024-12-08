const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  price: Number,
  deliveryTime: Number,
  category: String,
  images: [String],
});

module.exports = mongoose.model('Gig', gigSchema);
