const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { notifyMessage } = require('../services/notificationService');
const router = express.Router();

// Send a message (updated to include file details)
router.post('/', async (req, res) => {
  console.log("Incoming request body:", req.body); 
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

    console.log(receiverId)
    // Create and save the message
    const message = new Message({
      conversationId: new mongoose.Types.ObjectId(conversationId),
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      content,
      fileUrl,
      originalFileName,
      fileSize
    });
    const savedMessage = await message.save();

    try {
      await notifyMessage(receiverId, conversationId, content);
      console.log('Message notification sent successfully')
    } catch (error) {
      console.error('Failed to send message notification:', error);
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error details:", error);
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