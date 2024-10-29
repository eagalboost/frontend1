import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Message.css";

const Message = () => {
  const { id } = useParams(); // Conversation ID
  const [conversation, setConversation] = useState({ messages: [] });
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use your base URL from the environment

  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversation = async () => {
      setLoading(true);
      try {
        const conversationRes = await axios.get(
          `${API_BASE_URL}/conversations/single/${id}`,
          { withCredentials: true }
        );

        if (conversationRes.data) {
          const messagesRes = await axios.get(
            `${API_BASE_URL}/messages/${id}`,
            { withCredentials: true }
          );
          setConversation({
            ...conversationRes.data,
            messages: messagesRes.data,
          });
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setError("Failed to load the conversation.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id]); // Re-fetch when conversation ID changes

  // Handle sending a message
  const handleSendMessage = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      setError("User not found");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        {
          conversationId: id,
          message: newMessage,
          userId: user._id,
        },
        { withCredentials: true }
      );

      // Add new message to the conversation state
      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, response.data],
      }));

      setNewMessage(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error.message);
      setError("Failed to send the message.");
    }
  };

  if (loading) return <p>Loading conversation...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="message">
      <div className="message-container">
        <span className="breadcrumbs">
          <Link to="/messages" className="back-link">MESSAGES</Link> / {conversation.adminId || conversation.buyerId}
        </span>
        <div className="messages">
          {conversation.messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-item ${msg.userId === JSON.parse(localStorage.getItem("currentUser"))._id ? "owner" : ""}`}
            >
              <div className="message-content">
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="write-message">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message"
            className="message-input"
          />
          <button onClick={handleSendMessage} className="message-send-btn">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
