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

router.get('/category', async (req, res) => {
  const { category } = req.query;
  console.log('Received category:', category);
  try {
    const gigs = await Gig.find({ category });
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gigs by category' });
  }
});

router.get('/category-preview', async (req, res) => {
  try {
    // First, get all unique categories
    const categories = await Gig.distinct('category');
    
    // For each category, fetch 2 gigs
    const categoryGigs = await Promise.all(
      categories.map(async (category) => {
        const gigs = await Gig.find({ category })
          .populate('freelancerId', 'name email')
          .limit(2);
        return {
          category,
          gigs
        };
      })
    );
    
    res.status(200).json(categoryGigs);
  } catch (error) {
    console.error('Error fetching category previews:', error);
    res.status(500).json({ error: 'Failed to fetch category previews' });
  }
});


// Create a new gig
router.post('/', async (req, res) => {
  const { freelancerId, title, description, price, deliveryTime, category, images } = req.body;

  try {
    if (!title || !price || !category || !freelancerId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const newGig = new Gig({ freelancerId, title, description, price, deliveryTime, category, images });
    await newGig.save();
    res.status(201).json({ message: 'Gig created successfully', gig: newGig });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create gig. Internal server error. Please try again.' });
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const gig = await Gig.findById(id).populate('freelancerId', 'name email'); // Populate freelancerId with name and email
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gig details' });
  }
});

module.exports = router;
