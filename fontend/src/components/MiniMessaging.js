import React, { useState, useEffect } from "react";
import axios from "axios";
import Messaging from "./Messaging";
import { io } from "socket.io-client";
import account from '../images/account-icon.svg';
import { Loader } from 'lucide-react';

const socket = io("http://localhost:5000");

function MiniMessaging({ isMiniChat = false, receiverId, senderId }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (receiverId && senderId) {
      setLoading(true);
      setError(null);
      
      axios
        .get(`/api/conversations/${senderId}/${receiverId}`)
        .then((res) => {
          if (res.data) {
            setSelectedConversation(res.data);
            socket.emit("joinConversation", res.data._id);
          }
          setLoading(false);
        })
        .catch(() => {
          axios
            .post("/api/conversations", {
              participants: [senderId, receiverId],
              messages: [],
            })
            .then((newConversation) => {
              setSelectedConversation(newConversation.data);
              socket.emit("joinConversation", newConversation.data._id);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error creating conversation:", err);
              setError("Unable to start conversation");
              setLoading(false);
            });
        });
    }
  }, [receiverId, senderId]);

  return (
    <div className="mini-messaging-wrapper">
      <div
        className={`mini-messaging ${isMiniChat ? "mini-chat-mode" : ""}`}
      >
        {loading ? (
          <div className="loading-state">
            <Loader className="animate-spin" size={24} />
            <p>Connecting to chat...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : selectedConversation ? (
          <Messaging
            conversationId={selectedConversation._id}
            receiverId={receiverId}
            socket={socket}
          />
        ) : (
          <div className="no-chat-state">
            <p>Unable to load chat</p>
          </div>
        )}
      </div>

      <style>{`
        .mini-messaging-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          
        }

        .mini-messaging {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .mini-chat-mode {
          max-width: 500px;
          max-height: 700px;
        }

        .loading-state,
        .error-state,
        .no-chat-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 24px;
          text-align: center;
          gap: 12px;
          color: #6b7280;
        }

        .loading-state p,
        .error-state p,
        .no-chat-state p {
          margin: 0;
          font-size: 14px;
        }

        .error-state {
          color: #ef4444;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {

          .mini-chat-mode {
            max-width: 450px;
            max-height: 600px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {


          .mini-chat-mode {
            max-width: 100%;
            max-height: 100%;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {


          .mini-chat-mode {
            height: 100%;
          }

          .loading-state p,
          .error-state p,
          .no-chat-state p {
            font-size: 13px;
          }
        }

        /* Handle very small screens */
        @media (max-width: 320px) {
          .mini-messaging-wrapper {
            padding: 2px;
          }

          .mini-chat-mode {
            height: 350px;
          }
        }

        /* Handle height-constrained views */
        @media (max-height: 600px) {
          .mini-chat-mode {
            max-height: 90vh;
          }
        }

        /* Custom scrollbar */
        .mini-messaging ::-webkit-scrollbar {
          width: 6px;
        }

        .mini-messaging ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .mini-messaging ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .mini-messaging ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Animation for loading spinner */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default MiniMessaging;