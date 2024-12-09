const express = require("express");
const Conversation = require("../models/Conversation");
const router = express.Router();

// Get all conversations for a user
router.get("/:userId/:receiverId", async (req, res) => {
  try {
    const { userId, receiverId } = req.params;
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (conversation) {
      return res.json(conversation);
    } else {
      return res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// routes/conversation.js
router.post("/", async (req, res) => {
  try {
    const { participants, messages } = req.body;
    const newConversation = new Conversation({
      participants,
      messages,
    });

    await newConversation.save();
    return res.json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
