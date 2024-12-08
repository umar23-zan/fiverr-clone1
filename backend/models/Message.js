const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: String,
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  attachment: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
