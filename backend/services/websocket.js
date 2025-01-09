const WebSocket = require('ws');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();

    this.wss.on('connection', (ws) => {
      console.log('New WebSocket connection established');
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'auth') {
            this.clients.set(data.userId, ws);
            console.log('Client authenticated:', data.userId);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        for (const [userId, client] of this.clients.entries()) {
          if (client === ws) {
            this.clients.delete(userId);
            console.log('Client disconnected:', userId);
            break;
          }
        }
      });
    });
  }

  sendNotification(userId, notification) {
    const client = this.clients.get(userId?.toString());
    if (client && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(notification));
        console.log('Notification sent to user:', userId);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  }
}

module.exports = WebSocketService;