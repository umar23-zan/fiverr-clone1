const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  gigTitle: String,
  status: { type: String, enum: ['Pending', 'Completed', 'Active', 'inProgress', 'Revision Requested'], default: 'Active' },
  amount: Number,
  deliveryTime: Number,
  requirements: [{
    description: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  deliveries: [{
    description: String,
    files: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  review: {
    ratings: {
      communication: { type: Number, min: 1, max: 5 },
      service: { type: Number, min: 1, max: 5 },
      recommend: { type: Number, min: 1, max: 5 },
    },
    reviewText: String,
  },
  revisionRequests: [
    {
      remarks: String,
      requestedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
