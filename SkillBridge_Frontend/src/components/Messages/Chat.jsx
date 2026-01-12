import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMessages, sendMessage } from '../../services/api';

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Set up real-time updates (polling for hackathon)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(chatId);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      chatId,
      content: newMessage,
      sender: user._id
    };

    try {
      await sendMessage(messageData);
      setNewMessage('');
      // Optimistically add message
      setMessages(prev => [...prev, {
        ...messageData,
        _id: Date.now().toString(), // Temp ID
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      alert('Failed to send message: ' + error.message);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading-chat">Loading messages...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <div className="chat-partner">
          <span className="partner-name">John Doe</span>
          <span className="partner-status">Online</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message._id}
              className={`message ${message.sender === user._id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;