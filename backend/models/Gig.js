const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  category: { type: String, required: true },
  images: [String],
  
});

module.exports = mongoose.model('Gig', gigSchema);
