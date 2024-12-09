import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Messaging({ conversationId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userId");
    if (loggedInUser) {
      setUserId(loggedInUser);
      socket.emit("joinRoom", conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/messages/${conversationId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched messages:", data); // Debug log
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setMessages([]); // Ensure fallback to empty array
      });
  }, [conversationId]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleSendMessage = () => {
    const message = {
      conversationId,
      senderId: userId,
      receiverId,
      content: newMessage,
    };

    socket.emit("sendMessage", message);
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div>
      <h3>Messaging</h3>
      <ul>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.senderId === userId ? "You: " : "Friend: "}</strong>
              {msg.content}
            </li>
          ))
        ) : (
          <p>No messages yet</p>
        )}
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
