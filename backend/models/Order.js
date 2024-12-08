const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
