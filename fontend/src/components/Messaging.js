import React, { useState, useEffect } from "react";
import axios from "axios";
// import './chatapp.css'
import attachment from "../images/attachment.png"

function Messaging({ socket, conversationId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem('userId');
  
  // const MAX_FILE_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    // Fetch existing messages for the conversation
    axios
      .get(`/api/messages/${conversationId}`)
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
      console.log(formData)
      axios
        .post("/api/messages/upload", formData, {
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
    setNewMessage("");
  setFile(null);
  };

  const sendSocketMessage = (message) => {
    // Emit the message through Socket.IO
    socket.emit("sendMessage", message);

    // Save the message to the database
    axios
      .post("/api/messages", message)
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
  console.log(message.fileUrl)
    // Add null check for originalFileName
    const fileExtension = message.originalFileName
      ? message.originalFileName.split('.').pop().toLowerCase()
      : '';
      
    const fileUrl = `http://localhost:5000${message.fileUrl}`;
    console.log('Rendering file:', { fileUrl, fileExtension });
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
      <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            justifyContent: msg.senderId === userId ? "flex-end" : "flex-start",
            margin: "10px 0",
          }}>
            {/* <strong>{console.log('msg.senderId:', msg.senderId, 'userId:', userId)}{msg.senderId === userId ? "You" : "Other"}:</strong>{" "}
            {msg.content && <span>{msg.content}</span>}
            {renderFilePreview(msg)} */}
            <div
              style={{
                backgroundColor: msg.senderId === userId ? "#DCF8C6" : "#c2c2c2",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
              }}
            >
              {/* <strong>{msg.senderId === userId ? "You" : "Other"}:</strong>{" "} */}
              {msg.content && <span>{msg.content}</span>}
              {renderFilePreview(msg)}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", height: "50px"
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: "300px", height: "30px", borderStyle: "solid", borderRadius: "25px"
          }}
        />
        {/* <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginLeft: "10px" }}
        /> */}
        <div style={{ position: "relative", display: "inline-block", backgroundColor: "#1dbf73", height: "35px", width: "35px", borderRadius: "50px", cursor: "pointer"}}>
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
            {/* <FaPaperclip size={20} color="#555" /> */}
            <img src={attachment} alt="attachment" width={"20px"} height={"20px"} style={{marginTop: "8px", cursor: "pointer"}}/>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </div>

        </div>
        
        <button onClick={sendMessage}
        style={{
          border: "none", borderRadius: "25px", width: "70px", height: "30px", backgroundColor: "#1dbf73", cursor: "pointer"
        }}
        >Send</button>
      </div>
      
    </div>
  );
}

export default Messaging;