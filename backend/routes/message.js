const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Send Message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Messages for Conversation
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
