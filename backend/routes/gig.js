const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const multer = require('multer');
const path = require('path');

// Get all gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find().populate('freelancerId', 'name email'); // Assuming User model has name and email
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

// Get gigs by freelancerId
router.get('/user/:freelancerId', async (req, res) => {
  const { freelancerId } = req.params;
  try {
    const gigs = await Gig.find({ freelancerId });
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user gigs' });
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
// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'uploads/'); // Ensure 'uploads' folder exists
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    // if (!fs.existsSync(uploadDir)) {
    //   fs.mkdirSync(uploadDir);
    // }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });



// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ filePath });
});

module.exports = router;
