// routes/notification.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notifications as read
router.put('/allread', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await Notification.updateMany({ _id: { $in: notificationIds } }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/read', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    // Validate input
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ error: 'Invalid notification IDs' });
    }

    const result = await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ 
        message: 'Notifications marked as read',
        modifiedCount: result.modifiedCount 
      });
    } else {
      res.status(404).json({ message: 'No notifications found to update' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:notificationId', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(req.params.notificationId);
    res.status(200).json({ 
      message: 'Notification deleted successfully',
      deletedNotification: notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
