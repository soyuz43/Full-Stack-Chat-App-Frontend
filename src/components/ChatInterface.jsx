// src/components/ChatInterface.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useMessages from '../hooks/useMessage';
import SessionList from './SessionList';
import './ChatInterface.css'; // Import CSS file

function ChatInterface() {
  const { 
    sessions, 
    selectedSessionId, 
    handleCreateSession, 
    handleDeleteSession, 
    setSelectedSessionId 
  } = useContext(AuthContext);

  const { 
    messages, 
    inputText, 
    setInputText, 
    handleSendMessage 
  } = useMessages(selectedSessionId, true); // isLoggedIn is true in ChatInterface

  return (
    <div className="chat-container">
      <SessionList
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        handleSessionSelect={setSelectedSessionId}
        className="session-list"
      />
      <div className="chat-main">
        <h1 className="chat-title">Chat with AI</h1>
        <button className="create-session-btn" onClick={handleCreateSession}>Create New Session</button>
        {selectedSessionId && (
          <div className="session-details">
            <h2 className="session-id">Session ID: {selectedSessionId}</h2>
            <button className="delete-session-btn" onClick={() => handleDeleteSession(selectedSessionId)}>
              Delete This Session
            </button>
            <div className="message-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.from_user ? 'message-right' : 'message-left'}
                >
                  <strong>{msg.from_user ? 'You' : 'Assistant'}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="input-field"
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={handleSendMessage} disabled={!selectedSessionId}>
              Send
            </button>
          </div>
        )}
        {!selectedSessionId && (
          <p className="no-session-text">Select a session or create a new one to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;