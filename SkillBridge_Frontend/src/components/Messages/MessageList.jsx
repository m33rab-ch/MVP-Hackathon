import React from 'react';
import { Link } from 'react-router-dom';

const MessageList = () => {
  // Mock data
  const conversations = [
    {
      id: '1',
      userId: 'user123',
      userName: 'Ali Ahmed',
      userDepartment: 'Computer Science',
      lastMessage: 'Can you help with Python project?',
      timestamp: '10:30 AM',
      unread: true
    },
    {
      id: '2',
      userId: 'user456',
      userName: 'Sara Khan',
      userDepartment: 'Fine Arts',
      lastMessage: 'Thanks for the logo design!',
      timestamp: 'Yesterday',
      unread: false
    }
  ];

  return (
    <div className="message-list">
      <div className="message-list-header">
        <h3>Messages</h3>
        <input
          type="text"
          placeholder="Search conversations..."
          className="search-input"
        />
      </div>
      
      <div className="conversations">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          conversations.map(conv => (
            <Link 
              to={`/messages/${conv.id}`} 
              key={conv.id}
              className={`conversation-item ${conv.unread ? 'unread' : ''}`}
            >
              <div className="conversation-avatar">
                {conv.userName.charAt(0)}
              </div>
              
              <div className="conversation-content">
                <div className="conversation-header">
                  <h4>{conv.userName}</h4>
                  <span className="conversation-time">{conv.timestamp}</span>
                </div>
                
                <p className="conversation-preview">{conv.lastMessage}</p>
                <span className="conversation-department">{conv.userDepartment}</span>
                
                {conv.unread && (
                  <span className="unread-badge">New</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageList;