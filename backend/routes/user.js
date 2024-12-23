const express = require('express');
const User = require('../models/User');  // Assuming you have a User model
const router = express.Router();

// // Get All Users
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find(); // Fetch all users
//     res.json(users); // Return users list
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// routes/users.js
router.get("/", async (req, res) => {
  try {
    const { userIds } = req.query; // Expecting userIds as a query parameter
    if (!userIds) {
      return res.status(400).json({ message: "No userIds provided" });
    }
    
    const users = await User.find({
      _id: { $in: userIds }
    });
    
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
