import React, { useState, useEffect } from "react";
import axios from "axios";

function Messaging({ socket, conversationId, receiverId, userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);

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
    if (!newMessage.trim() && !file) return;

    const message = {
      conversationId,
      senderId: userId,
      receiverId,
      content: newMessage,
      fileUrl: null,
      timestamp: new Date(),
    };

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", conversationId);
      formData.append("senderId", userId);
      formData.append("receiverId", receiverId);

      axios
        .post("http://localhost:5000/api/messages/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          message.fileUrl = res.data.fileUrl; // Set file URL from server response
          sendSocketMessage(message);
        })
        .catch((err) => console.error("Error uploading file:", err));
    } else {
      sendSocketMessage(message);
    }
  };

  const sendSocketMessage = (message) => {
    // Emit the message through Socket.IO
    socket.emit("sendMessage", message);

    // Save the message to the database
    axios
      .post("http://localhost:5000/api/messages", message)
      .then(() => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage(""); // Clear input field
        setFile(null); // Clear file input
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  return (
    <div>
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "10px 0" }}>
            <strong>{msg.senderId === userId ? "You" : "Other"}:</strong>{" "}
            {msg.content && <span>{msg.content}</span>}
            {msg.fileUrl && (
              <a
                href={msg.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", color: "blue", marginTop: "5px" }}
              >
                Download File
              </a>
            )}
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
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginLeft: "10px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Messaging;
