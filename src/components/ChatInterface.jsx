// src/components/ChatInterface.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useMessages from '../hooks/useMessage';
import SessionList from './SessionList';

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
    <div style={{ display: 'flex' }}>
      <SessionList
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        handleSessionSelect={setSelectedSessionId}
      />
      <div style={{ width: '80%' }}>
        <h1>Chat with AI</h1>
        <button onClick={handleCreateSession}>Create New Session</button>
        {selectedSessionId && (
          <div>
             <h2>Session ID: {selectedSessionId}</h2> {/* Display selected session ID */}
            <button onClick={() => handleDeleteSession(selectedSessionId)}>
              Delete This Session
            </button>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{ textAlign: msg.from_user ? 'right' : 'left' }}
              >
                <strong>{msg.from_user ? 'You' : 'Assistant'}:</strong> {msg.text}
              </div>
            ))}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} disabled={!selectedSessionId}>
              Send
            </button>
          </div>
        )}
        {!selectedSessionId && (
          <p>Select a session or create a new one to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;
