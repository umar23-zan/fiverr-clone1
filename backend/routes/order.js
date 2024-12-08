const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Orders for Buyer
router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Orders for Freelancer
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const orders = await Order.find({ freelancerId: req.params.freelancerId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
