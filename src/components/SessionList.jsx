// src/components/SessionList.jsx
import React from 'react';

function SessionList({ sessions, selectedSessionId, handleSessionSelect }) {
    return (
        <div className="session-list">
            <h2>Sessions</h2>
            <ul>
                {sessions.map((session) => (
                    <li
                        key={session.id} // Use id as the key
                        className={selectedSessionId === session.id ? 'active' : ''}
                        onClick={() => handleSessionSelect(session.id)} // Use id when handling click
                    >
                        Session {session.id}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SessionList;
