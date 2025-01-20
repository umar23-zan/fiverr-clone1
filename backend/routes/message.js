const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { notifyMessage } = require('../services/notificationService');
const router = express.Router();

const isUserActiveInConversation = (io, userId, conversationId) => {
  const room = io.sockets.adapter.rooms.get(`active:${conversationId}`);
  if (!room) return false;
  
  // Check if any socket in the room belongs to the user
  for (const socketId of room) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.userId === userId) {
      return true;
    }
  }
  return false;
};

let ioInstance;
const setupSocketHandlers = (io) => {
  ioInstance = io;
};

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
      fileSize,
      read: false
    });
    const savedMessage = await message.save();

    const isReceiverActive = isUserActiveInConversation(ioInstance, receiverId, conversationId);

    if (!isReceiverActive) {
      try {
        await notifyMessage(receiverId, conversationId, content);
        console.log('Message notification sent successfully');
      } catch (error) {
        console.error('Failed to send message notification:', error);
      }
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

router.get("/unread/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId
    });
    
    const conversationIds = conversations.map(conv => conv._id);
    
    // Get unread message counts for each conversation
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },
          receiverId: new mongoose.Types.ObjectId(userId),
          read: false
        }
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(unreadCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read when user opens a conversation
router.put("/read/:conversationId/:userId", async (req, res) => {
  try {
    const { conversationId, userId } = req.params;
    
    await Message.updateMany(
      {
        conversationId,
        receiverId: userId,
        read: false
      },
      {
        $set: { read: true }
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = { router, setupSocketHandlers };