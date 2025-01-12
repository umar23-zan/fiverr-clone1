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
router.put('/read', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await Notification.updateMany({ _id: { $in: notificationIds } }, { isRead: true });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
