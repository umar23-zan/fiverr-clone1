import React, { useState, useEffect } from "react";
import axios from "axios";

function Messaging({ socket, conversationId, receiverId, userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch existing messages for the conversation
    axios
      .get(`http://localhost:5000/api/messages/${conversationId}`)
      .then((res) => {
        setMessages(res.data); // Load previous messages
      })
      .catch((err) => console.error("Error fetching messages:", err));

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId, socket]);

  const sendMessage = () => {
    const message = {
      conversationId,
      senderId: userId,
      receiverId,
      content: newMessage,
      timestamp: new Date(),
    };

    // Emit the message through Socket.IO
    socket.emit("sendMessage", message);

    // Save the message to the database
    axios
      .post("http://localhost:5000/api/messages", message)
      .then(() => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage(""); // Clear input field
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  return (
    <div>
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "10px 0" }}>
            <strong>{msg.senderId === userId ? "You" : "Other"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Messaging;
