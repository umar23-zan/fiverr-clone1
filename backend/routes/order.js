const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/:orderId/requirements', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const newRequirement = {
      description: req.body.description,
      createdAt: new Date(),
    };

    order.requirements.push(newRequirement);
    await order.save();

    res.status(201).json(newRequirement);
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

router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('buyerId', 'name email') // Populate buyer details if needed
      .populate('freelancerId', 'name email') // Populate freelancer details if needed
      .populate('gigId', 'title description deliveryTime images '); // Populate gig details if needed

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
