const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// File upload endpoint
router.post("upload", upload.single("file"), (req, res) => {
  console.log("Upload endpoint hit");
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
