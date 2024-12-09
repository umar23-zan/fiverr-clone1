// Inside Messaging component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messaging = ({ conversationId, receiverId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch messages for the selected conversation
    axios
      .get(`http://localhost:5000/api/messages/${conversationId}`)
      .then((response) => {
        setMessages(response.data.messages);
      })
      .catch((err) => {
        console.error('Error fetching messages:', err);
      });
  }, [conversationId]);

  const sendMessage = () => {
    const messageData = {
      senderId: userId,
      receiverId: receiverId,
      content: newMessage,
    };

    axios
      .post(`http://localhost:5000/api/messages/${conversationId}`, messageData)
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage('');
      })
      .catch((err) => {
        console.error('Error sending message:', err);
      });
  };

  return (
    <div>
      <div>
        {/* Display messages */}
        {messages.map((msg, index) => (
          <div key={index}>
            <p><strong>{msg.senderId === userId ? 'You' : 'User'}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Messaging;
