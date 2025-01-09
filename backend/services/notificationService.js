const Notification = require('../models/Notification');
const mongoose = require('mongoose');

class NotificationService {
  constructor(webSocketService) {
    this.wss = webSocketService;
  }

  async createNotification(data) {
    try {
      const notification = new Notification({
        recipientId: mongoose.Types.ObjectId(data.recipientId),
        senderId: mongoose.Types.ObjectId(data.senderId),
        type: data.type,
        content: data.content,
        orderId: data.orderId ? mongoose.Types.ObjectId(data.orderId) : undefined,
        read: false
      });

      const savedNotification = await notification.save();
      
      // Send real-time notification
      this.wss.sendNotification(data.recipientId, {
        type: 'new_notification',
        notification: savedNotification
      });
      
      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        recipientId: mongoose.Types.ObjectId(userId),
        read: false
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      return await Notification.updateMany(
        { 
          recipientId: mongoose.Types.ObjectId(userId),
          read: false
        },
        { read: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;