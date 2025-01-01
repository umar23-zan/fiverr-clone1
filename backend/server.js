const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const cloudinary = require('./config/cloudinaryConfig');

const userRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gig');
const orderRoutes = require('./routes/order');
const messageRoutes = require('./routes/message');
const Message = require('./models/Message');
const conversationRoutes = require('./routes/conversation');
const usersRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files statically

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 50MB file size limit
});

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://umar:umar444@authentication-app.ted5m.mongodb.net/authdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/users', usersRoutes);

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle message sending
  // socket.on('sendMessage', async (message) => {
  //   try {
  //     io.to(message.conversationId).emit('receiveMessage', message);
  //     const newMessage = new Message(message);
  //     await newMessage.save();
  //     console.log('Message saved:', message);
  //   } catch (error) {
  //     console.error('Error saving message:', error.message);
  //   }
  // });

  // Handle message sending
socket.on("sendMessage", async (message) => {
  try {
    // Ensure sender and receiver IDs are correctly assigned
    const { conversationId, senderId, receiverId, content } = message;

    // Create and save the message
    const newMessage = new Message({
      conversationId,
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      content,
      fileUrl: message.fileUrl, // Include file URL
      originalFileName: message.originalFileName, // Include original file name
      fileSize: message.fileSize, // Include file size
      timestamp: message.timestamp,
    });

    const savedMessage = await newMessage.save();

    // Emit message to the conversation room
    io.to(conversationId).emit("receiveMessage", savedMessage);
    console.log("Message sent:", savedMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
});


  // Join a conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation room: ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// File upload route
app.post('/api/messages/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      fileUrl: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});


app.use(express.static(path.join(__dirname, '../fontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fontend/build', 'index.html'));
});
// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));