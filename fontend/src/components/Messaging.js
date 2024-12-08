import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Messaging() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId] = useState("12345"); // Example conversation

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const handleSendMessage = () => {
    const message = { conversationId, senderId: "user123", content: newMessage };
    socket.emit("sendMessage", message);
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div>
      <h3>Messaging</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.content}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Messaging;
