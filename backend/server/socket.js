const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });
  });

  return io;
};

const notifyUser = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};

module.exports = { initializeSocket, notifyUser };