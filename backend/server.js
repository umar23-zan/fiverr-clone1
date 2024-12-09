const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gig');
const orderRoutes = require('./routes/order');
const messageRoutes = require('./routes/message');
const Message = require('./models/Message');
const conversationRoutes = require('./routes/conversation');
const usersRoutes = require('./routes/user'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect('mongodb+srv://umar:umar444@authentication-app.ted5m.mongodb.net/authdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use('/api/auth', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/users', usersRoutes);


const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins a room
  // Handle message sending
  socket.on("sendMessage", async(messages) => {
    try{
      io.to(messages.conversationId).emit("receiveMessage", messages);
      const message = new Message(messages);
      await message.save();
      console.log('Message saved:', messages);
    }catch (error) {
      console.error('Error saving message:', error.message);
    }
   
  });

  // Join a conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation room: ${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
