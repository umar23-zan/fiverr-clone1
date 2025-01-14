const Notification = require('../models/notification');

let io;  // Initialize io variable

// Function to initialize io
const initSocket = (socketIO) => {
  io = socketIO;
};

const notifyUser = async (userId, type, message, orderId) => {
  try {
    const notification = new Notification({
      userId,
      type,
      message,
      orderId,
      isRead: false,
      createdAt: new Date(),
    });
    await notification.save();

    if (io) {
      io.to(userId.toString()).emit('notification', notification);
      console.log(`Notification sent to user ${userId}: ${message}`);
    } else {
      console.error('Socket.io is not initialized');
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

const notifyMessage = async (receiverId, conversationId, content) => {
  try {
    const notification = new Notification({
      userId: receiverId,
      type: 'NEW_MESSAGE',
      message: content ? `New message: "${content}"` : 'You received a new file.',
      conversationId: conversationId,
      isRead: false,
      createdAt: new Date(),
    });

    await notification.save();

    if (io) {
      io.to(receiverId.toString()).emit('notification', notification);
      console.log(`Message notification sent to user ${receiverId}`);
    } else {
      console.error('Socket.io is not initialized');
    }
  } catch (error) {
    console.error('Error sending message notification:', error.message);
  }
};

module.exports = { notifyUser,notifyMessage, initSocket };
