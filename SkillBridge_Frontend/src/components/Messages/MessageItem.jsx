import React from 'react';

const MessageItem = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-item ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-bubble">
        <p className="message-text">{message.content}</p>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default MessageItem;