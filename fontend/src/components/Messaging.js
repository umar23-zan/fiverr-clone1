import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Messaging() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(""); // Current logged-in user
  const receiverId = "67567496dfe79e5b1bafe911"; // Replace with the receiver's user ID
  const conversationId = "12345"; // Example conversation

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userId");
    if (loggedInUser) {
      setUserId(loggedInUser);
      socket.emit("joinRoom", loggedInUser);
    }
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);


  useEffect(() => {
    fetch(`http://localhost:5000/api/messages/${conversationId}`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, [conversationId]);

  const handleSendMessage = () => {
    const message = {
      conversationId,
      senderId: userId,
      receiverId,
      content: newMessage,
    };

    socket.emit("sendMessage", message); // Send message in real-time
    setMessages([...messages, message]); // Optimistically update UI
    setNewMessage("");
  };

  return (
    <div>
      <h3>Messaging</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.senderId === userId ? "You: " : "Friend: "}</strong>
            {msg.content}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Messaging;
