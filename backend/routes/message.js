const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const router = express.Router();

// Send a message
router.post('/', async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, content } = req.body;

    // Create and save the message
    const message = new Message({
      conversationId,
      senderId: mongoose.Types.ObjectId(senderId),
      receiverId: mongoose.Types.ObjectId(receiverId),
      content,
    });
    const savedMessage = await message.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages for a conversation
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: mongoose.Types.ObjectId(req.params.conversationId),
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { senderId, receiverId, content } = req.body;

    const message = { senderId, receiverId, content, timestamp: new Date() };

    // Add the new message to the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.messages.push(message);
    await conversation.save();

    // Return the new message
    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
