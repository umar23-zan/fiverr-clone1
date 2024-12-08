const express = require('express');
const Gig = require('../models/Gig');
const router = express.Router();

// Add Gig
router.post('/', async (req, res) => {
  try {
    const gig = new Gig(req.body);
    const savedGig = await gig.save();
    res.status(201).json(savedGig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Gigs for a Freelancer
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const gigs = await Gig.find({ freelancerId: req.params.freelancerId });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Gig
router.delete('/:id', async (req, res) => {
  try {
    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gig deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
