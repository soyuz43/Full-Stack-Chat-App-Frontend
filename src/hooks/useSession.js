// src/hooks/useSessions.js
import { useState, useEffect, useCallback } from 'react';
import { getSessions, createSession, deleteSession } from '../api';

const useSessions = (isLoggedIn) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const fetchSessions = useCallback(async () => {
    console.log("Fetching sessions...");
    try {
      const data = await getSessions();
      console.log("Fetched sessions:", data.sessions);
      console.log("Session example:", data.sessions[0]);
      setSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSessions();
    } else {
      setSessions([]);
      setSelectedSessionId(null);
    }
  }, [isLoggedIn, fetchSessions]);

  const handleCreateSession = useCallback(async () => {
    try {
      const data = await createSession();
      console.log("Created session:", data);
      setSessions(prevSessions => [...prevSessions, data]);
      setSelectedSessionId(data.session_id);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  }, []);

  const handleDeleteSession = useCallback(async (sessionId) => {
    try {
      await deleteSession(sessionId);
      setSessions(prevSessions => prevSessions.filter(session => session.session_id !== sessionId));
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }, [selectedSessionId]);

  // Add this function in useSessions hook
const handleSessionSelect = useCallback((sessionId) => {
  console.log("Handling session select:", sessionId);
  setSelectedSessionId(sessionId);
}, [setSelectedSessionId]);

  return { 
    sessions, 
    selectedSessionId, 
    handleCreateSession, 
    handleDeleteSession, 
    setSelectedSessionId: handleSessionSelect, 
    fetchSessions 
  };
};

export default useSessions;
