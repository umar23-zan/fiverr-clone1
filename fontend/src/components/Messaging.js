import React, { useState, useEffect } from "react";
import axios from "axios";
import attachment from "../images/attachment.png";

function Messaging({ socket, conversationId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios
      .get(`/api/messages/${conversationId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));

    socket.on("receiveMessage", (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => socket.off("receiveMessage");
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
    socket.emit("sendMessage", message);
    axios
      .post("/api/messages", message)
      .then(() => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
        setFile(null);
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  const renderFilePreview = (message) => {
    if (!message.fileUrl) return null;
    
    const fileExtension = message.originalFileName
      ? message.originalFileName.split('.').pop().toLowerCase()
      : '';
      
    const fileUrl = `http://localhost:5000${message.fileUrl}`;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    if (imageExtensions.includes(fileExtension)) {
      return (
        <div className="file-preview">
          <img 
            src={fileUrl} 
            alt={message.originalFileName || 'File'}
            className="image-preview"
          />
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="file-download-link"
          >
            Download {message.originalFileName || 'File'} ({formatFileSize(message.fileSize)})
          </a>
        </div>
      );
    }
  
    if (fileExtension === 'pdf') {
      return (
        <div className="file-preview">
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
            className="file-download-link"
          >
            Download PDF {message.originalFileName || 'File'} ({formatFileSize(message.fileSize)})
          </a>
        </div>
      );
    }
  
    return (
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="file-download-link generic-file"
      >
        Download {message.originalFileName || 'File'} ({formatFileSize(message.fileSize)})
      </a>
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="messaging-container">
      <div className="messages-list">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.senderId === userId ? 'sent' : 'received'}`}>
            <div className="message-bubble">
              {msg.content && <span className="message-content">{msg.content}</span>}
              {renderFilePreview(msg)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="message-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          
          <div className="attachment-wrapper">
            <label htmlFor="file-upload" className="attachment-button">
              <img src={attachment} alt="attachment" className="attachment-icon" />
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />
          </div>
          
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
        
        <div className={`file-status ${file ? 'selected' : ''}`}>
          {file ? `Selected file: ${file.name}` : "No file selected"}
        </div>
      </div>

      <style>{`
        .messaging-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          background-color: #e5ddd5;
          position: relative;
        }

        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .message-wrapper {
          display: flex;
          margin-bottom: 10px;
          animation: fadeIn 0.3s ease-in-out;
        }

        .message-wrapper.sent {
          justify-content: flex-end;
        }

        .message-wrapper.received {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 65%;
          padding: 12px 16px;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .sent .message-bubble {
          background-color: #dcf8c6;
          border-bottom-right-radius: 4px;
        }

        .received .message-bubble {
          background-color: #ffffff;
          border-bottom-left-radius: 4px;
        }

        .message-content {
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message-input-container {
          padding: 20px;
          background-color: #f0f0f0;
          border-top: 1px solid #ddd;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: white;
          border-radius: 24px;
          padding: 8px 16px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .message-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          padding: 8px 0;
          min-width: 0;
        }

        .attachment-wrapper {
          position: relative;
        }

        .attachment-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: #1dbf73;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .attachment-button:hover {
          background-color: #19a463;
        }

        .attachment-icon {
          width: 20px;
          height: 20px;
          opacity: 0.8;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .send-button {
          background-color: #1dbf73;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 20px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .send-button:hover {
          background-color: #19a463;
        }

        .file-status {
          margin-top: 8px;
          font-size: 12px;
          color: #666;
        }

        .file-status.selected {
          color: #1dbf73;
        }

        .file-preview {
          margin-top: 8px;
        }

        .image-preview {
          max-width: 200px;
          max-height: 200px;
          object-fit: contain;
          border-radius: 8px;
        }

        .file-download-link {
          display: block;
          font-size: 12px;
          color: #2b5cd9;
          text-decoration: none;
          margin-top: 4px;
        }

        .file-download-link:hover {
          text-decoration: underline;
        }

        .generic-file {
          color: #2b5cd9;
          font-weight: 500;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar Styling */
        .messages-list::-webkit-scrollbar {
          width: 6px;
        }

        .messages-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-list::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .messages-list::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

export default Messaging;