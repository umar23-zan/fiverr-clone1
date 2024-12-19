import React, { useState, useEffect } from "react";
import axios from "axios";
import Messaging from "./Messaging";
import { io } from "socket.io-client";
import account from '../images/account-icon.svg';

const socket = io("http://localhost:5000");

function ChatApp() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userId");
    if (loggedInUser) {
      setUserId(loggedInUser);
      axios
        .get("/api/users")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));

      axios
        .get(`/api/conversations/${loggedInUser}`)
        .then((res) => setConversations(res.data))
        .catch((err) => console.error("Error fetching conversations:", err));
    }
  }, []);

  const handleUserSelect = (receiverId) => {
    const userName = users.find((user) => user._id === receiverId)?.name || "Unknown User";
    setSelectedUser(userName);

    axios
      .get(`/api/conversations/${userId}/${receiverId}`)
      .then((res) => {
        if (res.data) {
          setSelectedConversation(res.data);
          socket.emit("joinConversation", res.data._id);
        }
      })
      .catch((err) => {
        axios.post('/api/conversations', {
          participants: [userId, receiverId],
          messages: []
        })
        .then((newConversation) => {
          setSelectedConversation(newConversation.data);
          socket.emit("joinConversation", newConversation.data._id);
        })
        .catch((err) => console.error("Error creating new conversation:", err));
      });
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Contacts</h3>
        </div>
        <div className="contacts-list">
          {users
            .filter((user) => user._id !== userId)
            .map((user) => (
              <div
                key={user._id}
                className={`contact-item ${selectedUser === user.name ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user._id)}
              >
                <img
                  src={account}
                  alt={`${user.name}'s profile`}
                  className="contact-avatar"
                />
                <div className="contact-info">
                  <span className="contact-name">{user.name}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          {selectedUser && (
            <div className="selected-user">
              <img src={account} alt="Profile" className="selected-user-avatar" />
              <span className="selected-user-name">{selectedUser}</span>
            </div>
          )}
        </div>
        <div className="chat-messages">
          {selectedConversation ? (
            <Messaging
              conversationId={selectedConversation._id}
              receiverId={selectedConversation.participants.find(
                (id) => id !== userId
              )}
              socket={socket}
            />
          ) : (
            <div className="no-chat-selected">
              <p>Select a contact to start a conversation</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .chat-container {
          display: flex;
          height: 100vh;
          background-color: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .sidebar {
          width: 300px;
          background-color: white;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .sidebar-header h3 {
          margin: 0;
          color: #1a1a1a;
        }

        .contacts-list {
          overflow-y: auto;
          flex: 1;
        }

        .contact-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .contact-item:hover {
          background-color: #f5f5f5;
        }

        .contact-item.selected {
          background-color: #e8e8e8;
        }

        .contact-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 15px;
          object-fit: cover;
        }

        .contact-info {
          flex: 1;
        }

        .contact-name {
          font-size: 15px;
          color: #1a1a1a;
        }

        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: white;
        }

        .chat-header {
          height: 60px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          padding: 0 20px;
          background-color: white;
        }

        .selected-user {
          display: flex;
          align-items: center;
        }

        .selected-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 12px;
        }

        .selected-user-name {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .chat-messages {
          flex: 1;
          background-color: #f5f5f5;
          overflow-y: auto;
        }

        .no-chat-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
          font-size: 16px;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}

export default ChatApp;