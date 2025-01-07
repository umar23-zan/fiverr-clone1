const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const multer = require('multer');
const path = require('path');
const { uploadGigImageToS3 } = require('../config/s3config');

// Get all gigs
router.get('/', async (req, res) => {
  try {
    const { tags } = req.query;
    let query = {};
    
    // If tags are provided in the query, filter by them
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const gigs = await Gig.find(query).populate('freelancerId', 'name email'); // Assuming User model has name and email
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

// Get all unique tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Gig.distinct('tags');
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Get tags by category
router.get('/category/:category/tags', async (req, res) => {
  try {
    const { category } = req.params;
    const tags = await Gig.distinct('tags', { category });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category tags' });
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

// Search gigs by tags
router.get('/search/tags', async (req, res) => {
  try {
    const { tags } = req.query;
    if (!tags) {
      return res.status(400).json({ error: 'Tags parameter is required' });
    }

    const tagArray = tags.split(',').map(tag => tag.trim());
    const gigs = await Gig.find({
      tags: { $in: tagArray }
    }).populate('freelancerId', 'name email');

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search gigs by tags' });
  }
});



// Create a new gig
router.post('/', async (req, res) => {
  const { freelancerId, title, description, price, deliveryTime, category, tags, images } = req.body;

  try {
    if (!title || !price || !category || !freelancerId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Validate tags
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array.' });
    }

    if (tags.length > 5) {
      return res.status(400).json({ message: 'Maximum 5 tags allowed.' });
    }

    // Create gig without image URL first
    const newGig = new Gig({ freelancerId, title, description, price, deliveryTime, category, tags: tags.map(tag => tag.trim()), images });
    await newGig.save();

    // Now that the gig is saved, upload the gig image(s)
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const imageUrl = await uploadGigImageToS3(file, newGig._id); // Upload image with gigId
        imageUrls.push(imageUrl);
      }

      // Update the gig document with the uploaded image URLs
      newGig.images = imageUrls;
      await newGig.save(); // Save the gig again with the images

      return res.status(201).json({ message: 'Gig created successfully with images', gig: newGig });
    }

    res.status(201).json({ message: 'Gig created successfully without images', gig: newGig });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create gig. Internal server error. Please try again.' });
  }
});
// Configure Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb(null, 'uploads/'); // Ensure 'uploads' folder exists
//     const uploadDir = path.join(__dirname, '../uploads');
//     // Create uploads directory if it doesn't exist
//     // if (!fs.existsSync(uploadDir)) {
//     //   fs.mkdirSync(uploadDir);
//     // }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });



// Image upload route
// router.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   const filePath = `/uploads/${req.file.filename}`;
//   res.status(200).json({ filePath });
// });

router.post('/upload', multer().array('images', 5), async (req, res) => {  // Allow up to 5 images
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    // Temporary upload gig images without gigId
    const imageUrls = [];
    for (const file of req.files) {
      const imageUrl = await uploadGigImageToS3(file, 'temporary'); // Use a placeholder 'temporary'
      imageUrls.push(imageUrl);
    }

    res.status(200).json({ filePaths: imageUrls }); // Return uploaded image URLs temporarily
  } catch (error) {
    console.error('Error uploading gig images to S3:', error);
    res.status(500).json({ error: 'Failed to upload gig images to S3' });
  }
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
