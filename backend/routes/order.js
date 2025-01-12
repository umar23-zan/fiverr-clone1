const express = require('express');
const Order = require('../models/Order');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const { notifyUser } = require('../services/notificationService');
const Notification = require('../models/notification');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


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

router.post('/:orderId/revision', async (req, res) => {
  const { orderId } = req.params;
  const { remarks } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.revisionRequests.push({ remarks });
    order.status = 'review Requested';

    await order.save();

    try{
      await notifyUser(
        order.freelancerId,
        'REVISION_REQUESTED',
        `Buyer requested a revision for the order "${order.gigTitle}".`,
        orderId
      );
    }catch (error){
      console.error('Failed to send notification:', error);
    }
    

    res.status(200).json({ message: 'Revision requested successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:orderId/review', async (req, res) => {
  const { orderId } = req.params;
  const { ratings, reviewText } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.review = {
      ratings: {
        communication: ratings.communication,
        service: ratings.service,
        recommend: ratings.recommend,
      },
      reviewText,
    };
    order.status = 'Completed';

    await order.save();

    res.status(200).json({ message: 'Review submitted successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:orderId/deliver', upload.array('files'), async (req, res) => {
  const { orderId } = req.params;
  const { deliveryMessage } = req.body;
  const files = req.files;

  try {
    const uploadedFiles = await Promise.all(
      files.map((file) => {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `deliveries/${orderId}/${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        return s3.upload(params).promise();
      })
    );

    const fileUrls = uploadedFiles.map((file) => file.Location);

    await Order.findByIdAndUpdate(orderId, {
      $push: { deliveries: { files: fileUrls, description: deliveryMessage, createdAt: new Date() } },
      status: 'Delivered'
    });

    await notifyUser(
      order.buyerId,
      'ORDER_DELIVERED',
      `Your order "${order.gigTitle}" has been delivered.`,
      orderId
    );

    res.status(200).json({ message: 'Order delivered successfully!', files: fileUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error delivering order' });
  }
});

module.exports = router;
