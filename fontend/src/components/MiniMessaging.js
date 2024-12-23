import React, { useState, useEffect } from "react";
import axios from "axios";
import Messaging from "./Messaging";
import { io } from "socket.io-client";
import account from '../images/account-icon.svg';

const socket = io("http://localhost:5000");

function MiniMessaging({ isMiniChat = false, receiverId, senderId }) {
  const [selectedConversation, setSelectedConversation] = useState(null);


  useEffect(() => {
    if (receiverId && senderId) {
      axios
        .get(`/api/conversations/${senderId}/${receiverId}`)
        .then((res) => {
          if (res.data) {
            setSelectedConversation(res.data);
            socket.emit("joinConversation", res.data._id);
          }
        })
        .catch((err) => {
          axios
            .post("/api/conversations", {
              participants: [senderId, receiverId],
              messages: [],
            })
            .then((newConversation) => {
              setSelectedConversation(newConversation.data);
              socket.emit("joinConversation", newConversation.data._id);
            })
            .catch((err) => console.error("Error creating conversation:", err));
        });
    }
  }, [receiverId, senderId]);

  

  return (
    <div className="chat-container">
<div
      className={`chat-app ${isMiniChat ? "mini-chat-mode" : ""}`}
      style={{
        height: isMiniChat ? "700px" : "100%",
        width: isMiniChat ? "500px" : "100%",
        border: isMiniChat ? "1px solid #ccc" : "none",
        borderRadius: isMiniChat ? "10px" : "0",
        overflow: "hidden",
      }}
    >
      {selectedConversation ? (
        <Messaging
          conversationId={selectedConversation._id}
          receiverId={receiverId}
          socket={socket}
        />
      ) : (
        <div className="no-chat-selected">
          <p>Loading chat...</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default MiniMessaging;