const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const router = express.Router();

// Send a message (updated to include file details)
router.post('/', async (req, res) => {
  try {
    const { 
      conversationId, 
      senderId, 
      receiverId, 
      content, 
      fileUrl, 
      originalFileName,
      fileSize 
    } = req.body;

    // Create and save the message
    const message = new Message({
      conversationId,
      senderId: mongoose.Types.ObjectId(senderId),
      receiverId: mongoose.Types.ObjectId(receiverId),
      content,
      fileUrl,
      originalFileName,
      fileSize
    });
    const savedMessage = await message.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages for a conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;