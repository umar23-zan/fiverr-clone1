import React, { useState, useEffect } from "react";
import axios from "axios";
// import './chatapp.css'

function Messaging({ socket, conversationId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem('userId');


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
      originalFileName: null,
      fileSize: null,
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
          message.fileUrl = res.data.fileUrl;
          message.originalFileName = res.data.originalName;
          message.fileSize = res.data.size;
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

  // Function to render file preview or download link
  const renderFilePreview = (message) => {
    if (!message.fileUrl) return null;
  
    // Add null check for originalFileName
    const fileExtension = message.originalFileName
      ? message.originalFileName.split('.').pop().toLowerCase()
      : '';
    
    const fileUrl = `http://localhost:5000${message.fileUrl}`;
  
    // Image preview for common image types
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    if (imageExtensions.includes(fileExtension)) {
      return (
        <div>
          <img 
            src={fileUrl} 
            alt={message.originalFileName || 'File'}
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              objectFit: 'contain' 
            }} 
          />
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'block', fontSize: '0.8em' }}
          >
            Download {message.originalFileName || 'File'} ({formatFileSize(message.fileSize)})
          </a>
        </div>
      );
    }
  
    // PDF preview
    if (fileExtension === 'pdf') {
      return (
        <div>
          <embed 
            src={fileUrl} 
            type="application/pdf" 
            width="200" 
            height="200"
          />
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'block', fontSize: '0.8em' }}
          >
            Download PDF {message.originalFileName || 'File'} ({formatFileSize(message.fileSize)})
          </a>
        </div>
      );
    }
  
    // Generic file download for other types
    return (
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          display: 'block', 
          color: 'blue', 
          marginTop: '5px' 
        }}
      >
        Download {message.originalFileName || 'File'} ({formatFileSize(message.fileSize)})
      </a>
    );
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "10px 0" }}>
            <strong>{console.log('msg.senderId:', msg.senderId, 'userId:', userId)}{msg.senderId === userId ? "You" : "Other"}:</strong>{" "}
            {msg.content && <span>{msg.content}</span>}
            {renderFilePreview(msg)}
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