const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// const ContactUs = require('../models/contactusdetails');
// const sendEmail = require('./emailservice');

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash the password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        res.status(200).json({ msg: 'Login successful', email: user.email, useId: user._id, });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Forgot Password Route
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'umar.zangroups@gmail.com',
      pass: 'fbpo tnrk yaqr uvgz',
  },
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Hash the token and set expiration (1 hour)
      const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpire = resetPasswordExpire;
      await user.save();

      // Send the reset link via email
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) requested a password reset. Click the link to reset your password: \n\n ${resetUrl}`;
      
      await transporter.sendMail({
          to: email,
          subject: 'Password Reset Request',
          text: message,
      });

      res.status(200).json({ msg: 'Password reset email sent' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;

  try {
      // Hash the incoming token and find the user with the matching reset token and check if it's not expired
      const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() }, // Make sure the token is not expired
      });

      if (!user) {
          return res.status(400).json({ msg: 'Invalid or expired token' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Reset the token and expiration fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});
router.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // Return user data without password
        const { password, ...userData } = user._doc; // Exclude password from response
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Update User Data Route
// Update User Route
// Example of the updateUserData function
router.put('/user/:email', async (req, res) => {
    const email = req.params.email;
    const { name, contactNumber,  country, language, about, profession } = req.body;

    try {
        // Update the user data
        const user = await User.findOneAndUpdate(
            { email },
            { name, contactNumber,  country, language, about, profession },
            { new: true } // Return the updated document
        );

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({
            msg: 'User updated successfully',
            user: {
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber,
                country: user.country,
                language: user.language,
                about: user.about,
                profession: user.profession,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Configure multer storage
const storage = multer.diskStorage({
    destination: './uploads/profilePictures',  // Specify the upload directory
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });
// Route to upload profile picture
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        const email = req.body.email;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.profilePicture = req.file.path;  // Save the file path to profilePicture
        await user.save();

        res.json({ msg: 'Profile picture uploaded successfully', profilePicture: user.profilePicture });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


module.exports = router;