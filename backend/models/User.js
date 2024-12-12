const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  contactNumber: { type: String },
  country: { type: String },
  language: {type: String},
  about: {type: String},
  profession: {type: String},
  role: { type: String, enum: ['Buyer', 'Seller', 'Both'], default: 'Buyer' },
});

module.exports = mongoose.model('User', userSchema);
