import React, { useState, useEffect } from "react";
import axios from "axios";
import Messaging from "./Messaging";
import { io } from "socket.io-client";
import account from '../images/account-icon.svg';
import { Menu, X } from 'lucide-react'; // Adding icons for mobile menu
// require('dotenv').config();


const socket = io(process.env.REACT_APP_SOCKET_URL);



function ChatApp() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userId, setUserId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});


  

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userId");
    if (loggedInUser) {
      setUserId(loggedInUser);

      axios
        .get(`/api/conversations/${loggedInUser}`)
        .then((res) => {
          setConversations(res.data);
          const participantIds = res.data
            .map(conversation => conversation.participants)
            .flat()
            .filter(participant => participant.toString() !== loggedInUser);
          
          console.log("Participant IDs:", participantIds);
          
          axios
            .get(`/api/users`, { params: { userIds: participantIds } })
            .then((userRes) => {
              setUsers(userRes.data);
            })
            .catch((err) => console.error("Error fetching users:", err));
        })
        .catch((err) => console.error("Error fetching conversations:", err));
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Emit that user is active in this conversation
      socket.emit("userActive", {
        userId,
        conversationId: selectedConversation._id
      });

      // Cleanup: emit inactive status when leaving conversation
      return () => {
        socket.emit("userInactive", {
          userId,
          conversationId: selectedConversation._id
        });
      };
    }
  }, [selectedConversation, userId]);

  


  const handleUserSelect = (receiverId) => {
    const userName = users.find((user) => user._id === receiverId)?.name || "Unknown User";
    setSelectedUser(userName);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection

    axios
      .get(`/api/conversations/${userId}/${receiverId}`)
      .then((res) => {
        if (res.data) {
          setSelectedConversation(res.data);
          socket.emit("joinConversation", res.data._id);
        }
      })
      .catch(() => {
        axios
          .post('/api/conversations', {
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
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {selectedUser && (
          <div className="selected-user mobile-user">
            <img src={account} alt="Profile" className="selected-user-avatar" />
            <span className="selected-user-name">{selectedUser}</span>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Contacts</h3>
        </div>
        <div className="contacts-list">
          {users.map((user) => (
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

      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-header desktop-header">
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
          position: relative;
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background-color: white;
          border-bottom: 1px solid #e0e0e0;
          padding: 0 16px;
          align-items: center;
          z-index: 1000;
        }

        .menu-button {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #1a1a1a;
        }

        .mobile-user {
          margin-left: 16px;
        }

        .sidebar {
          width: 300px;
          background-color: white;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          height: 100%;
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

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .sidebar {
            width: 250px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .chat-container {
            flex-direction: column;
          }

          .mobile-header {
            display: flex;
          }

          .desktop-header {
            display: none;
          }

          .sidebar {
            position: fixed;
            left: -100%;
            top: 60px;
            bottom: 0;
            width: 80%;
            max-width: 300px;
            z-index: 1000;
            transition: left 0.3s ease;
          }

          .sidebar-open {
            left: 0;
          }

          .chat-area {
            margin-top: 60px;
            height: calc(100vh - 60px);
          }

          .contact-item {
            padding: 16px;
          }

          .contact-avatar {
            width: 32px;
            height: 32px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .sidebar {
            width: 100%;
            max-width: none;
          }

          .selected-user-name {
            font-size: 14px;
          }

          .contact-name {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatApp;