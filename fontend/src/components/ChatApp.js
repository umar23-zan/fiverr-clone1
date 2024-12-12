import React, { useState, useEffect } from "react";
import axios from "axios";
import Messaging from "./Messaging";
import { io } from "socket.io-client";
// import './chatapp.css'

const socket = io("http://localhost:5000");

function ChatApp() {
  const [users, setUsers] = useState([]); // To store the list of users
  const [selectedUser, setSelectedUser] = useState(null); // To store the selected user
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userId, setUserId] = useState("");

  // Fetch logged-in user's ID and list of all users
  useEffect(() => {
    const loggedInUser = localStorage.getItem("userId");
    if (loggedInUser) {
      setUserId(loggedInUser);

      // Fetch all users
      axios
        .get("http://localhost:5000/api/users")
        .then((res) => {setUsers(res.data)
        }
        )
        
        .catch((err) => console.error("Error fetching users:", err));

      // Fetch conversations for the logged-in user
      axios
        .get(`http://localhost:5000/api/conversations/${loggedInUser}`)
        .then((res) => setConversations(res.data))
        .catch((err) => console.error("Error fetching conversations:", err));
    }
  }, []);

  // Handle user selection to start a conversation
  const handleUserSelect = (receiverId) => {
    console.log(`Making GET request to: http://localhost:5000/api/conversations/${userId}/${receiverId}`);
    const userName = users.find((user) => user._id === receiverId)?.name || "Unknown User";
    setSelectedUser(userName); // Set the selected user's name
    console.log(userName)
  
    axios
      .get(`http://localhost:5000/api/conversations/${userId}/${receiverId}`)
      .then((res) => {
        if (res.data) {
          setSelectedConversation(res.data);
          socket.emit("joinConversation", res.data._id);
        }
      })
      .catch((err) => {
        console.error("Error checking conversation:", err.response ? err.response.data : err.message);
        
        // Create new conversation if not found
        axios.post('http://localhost:5000/api/conversations', {
          participants: [userId, receiverId],
          messages: []
        })
        .then((newConversation) => {
          console.log("New conversation created:", newConversation.data);
          setSelectedConversation(newConversation.data);
          socket.emit("joinConversation", newConversation.data._id);
        })
        .catch((err) => {
          console.error("Error creating new conversation:", err);
        });
      });
  };
  
  return (
    <div style={{ display: "flex" }}>
      {/* User List */}
      <div style={{ flex: 1, borderRight: "1px solid #ddd", padding: "10px" }}>
        <h3>Users</h3>
        <ul>
          {users
            .filter((user) => user._id !== userId) // Exclude the logged-in user
            .map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserSelect(user._id)} // Start a conversation with selected user
                style={{ cursor: "pointer", padding: "5px" }}
              >
                {user.name}
              </li>
            ))}
        </ul>
      </div>

      {/* Messaging Area */}
      <div style={{ flex: 3, padding: "10px", height: "90vh" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          fontWeight: "bold",
          fontSize: "20px",
          borderBottom: "1px solid",
          height: "70px"
        }}
        >{selectedUser}</div>
        {selectedConversation ? (
          <Messaging
            conversationId={selectedConversation._id}
            receiverId={selectedConversation.participants.find(
              (id) => id !== userId
            )}
            socket={socket}
          />
        ) : (
          <p>Select a user to start a conversation</p>
        )}
      </div>
    </div>
  );
}

export default ChatApp;
