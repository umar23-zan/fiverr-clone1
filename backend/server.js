const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gig');
const orderRoutes = require('./routes/order');
const messageRoutes = require('./routes/message');

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

const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (data) => {
    io.to(data.receiverId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
