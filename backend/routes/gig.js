const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');

// Get all gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find().populate('freelancerId', 'name email'); // Assuming User model has name and email
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

// Create a new gig
router.post('/', async (req, res) => {
  const { freelancerId, title, description, price, deliveryTime, category, images } = req.body;

  try {
    const newGig = new Gig({ freelancerId, title, description, price, deliveryTime, category, images });
    await newGig.save();
    res.status(201).json(newGig);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create gig' });
  }
});

module.exports = router;
